/**
 * Neurai Core-compatible hybrid ECIES with AES-256-GCM (see src/depinecies.cpp)
 * - Ephemeral keypair per message
 * - AES key derived from ephemeral privkey via KDF_SHA256
 * - Payload: [Nonce(12) || ciphertext || Tag(16)]
 * - Per-recipient package: [Nonce(12) || AES256_GCM(encKey, aesKey) || Tag(16)]
 * - encKey derived from ECDH secret (secp256k1_ecdh default: SHA256 of the
 *   compressed shared point), then KDF_SHA256
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { gcm } from '@noble/ciphers/aes';
import { sha256, hash160, kdfSha256 } from './hash.js';
import { concatBytes, hexToBytes, bytesToHex } from './bytes.js';
import { readCompactSize, readVector, writeCompactSize, serializeVector } from './serialize.js';
import { parsePublicKey, derivePublicKeyForms } from './keys.js';
import { decodeDepinAddress, pubKeyMatchesAddress, strictEcdsaCommitment } from './address.js';

// Injectable RNG, for deterministic tests ONLY. Production always uses
// crypto.getRandomValues; never call _setDepinTestRng outside a test harness.
let _rng = null;

function _setDepinTestRng(fn) {
  _rng = typeof fn === 'function' ? fn : null;
}

function randomBytes(length) {
  if (_rng) {
    const out = _rng(length);
    if (!(out instanceof Uint8Array) || out.length !== length) {
      throw new Error('Test RNG returned invalid bytes');
    }
    return out;
  }
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * AES-256-GCM encryption (noble; runs under Hermes/React Native).
 * noble returns ciphertext||tag with a 16-byte tag at the end, same as WebCrypto.
 */
async function aes256GcmEncrypt(plaintext, key, nonce) {
  if (key.length !== 32) throw new Error('Key must be 32 bytes');
  if (nonce.length !== 12) throw new Error('Nonce must be 12 bytes');

  const out = gcm(key, nonce).encrypt(plaintext);
  return { ciphertext: out.slice(0, -16), tag: out.slice(-16) };
}

/**
 * AES-256-GCM decryption. noble throws on authentication failure.
 */
async function aes256GcmDecrypt(ciphertext, key, nonce, tag) {
  if (key.length !== 32) throw new Error('Key must be 32 bytes');
  if (nonce.length !== 12) throw new Error('Nonce must be 12 bytes');
  if (tag.length !== 16) throw new Error('Tag must be 16 bytes');

  return gcm(key, nonce).decrypt(concatBytes(ciphertext, tag));
}

/**
 * Encrypts plaintext for a set of recipient public keys (33 or 65 bytes each,
 * kept in their given serialization: the ECIES map key is hash160 of those
 * exact bytes, matching Core's CKeyID). Duplicate hash160 entries are
 * rejected; deduplicate exact destination identities before calling.
 */
async function eciesEncrypt(plaintext, recipientPubKeys) {
  let ephemeralPrivKey;
  for (let attempt = 0; attempt < 128; attempt++) {
    ephemeralPrivKey = randomBytes(32);
    if (secp256k1.utils.isValidPrivateKey(ephemeralPrivKey)) break;
    if (attempt === 127) throw new Error('Random source did not produce a valid ephemeral key');
  }
  if (!(plaintext instanceof Uint8Array) || plaintext.length === 0 || plaintext.length > 4 * 1024 * 1024)
    throw new Error('Invalid ECIES plaintext budget');
  if (!Array.isArray(recipientPubKeys) || recipientPubKeys.length < 1 || recipientPubKeys.length > 50)
    throw new Error('Invalid ECIES recipient count');
  const ephemeralPubKey = secp256k1.getPublicKey(ephemeralPrivKey, true);

  // AES key derived from ephemeral private key (matches KDF_SHA256 in C++)
  const aesKey = await kdfSha256(ephemeralPrivKey, 32);

  const nonce = randomBytes(12);
  const { ciphertext, tag } = await aes256GcmEncrypt(plaintext, aesKey, nonce);
  const payload = concatBytes(nonce, ciphertext, tag);

  const recipientKeys = new Map();

  for (const recipientPubKey of recipientPubKeys) {
    const descriptor =
      recipientPubKey && typeof recipientPubKey === 'object' && !(recipientPubKey instanceof Uint8Array) ? recipientPubKey : null;
    const { bytes: keyBytes } = parsePublicKey(descriptor ? descriptor.publicKey : recipientPubKey);
    let recipientId = bytesToHex(await hash160(keyBytes));
    if (descriptor) {
      if (!(await pubKeyMatchesAddress(keyBytes, descriptor.address, descriptor.network)))
        throw new Error('Recipient public key does not match address');
      recipientId = (await decodeDepinAddress(descriptor.address, descriptor.network)).recipientId;
    }

    // ECDH secret must match libsecp256k1's default: SHA256(compressed(shared_point))
    const sharedPointCompressed = secp256k1.getSharedSecret(ephemeralPrivKey, keyBytes, true);
    const sharedSecret = await sha256(sharedPointCompressed);
    const encKey = await kdfSha256(sharedSecret, 32);

    const recipientNonce = randomBytes(12);
    const { ciphertext: encryptedAESKey, tag: recipientTag } = await aes256GcmEncrypt(aesKey, encKey, recipientNonce);
    const recipientPackage = concatBytes(recipientNonce, encryptedAESKey, recipientTag);

    // Map key is CKeyID: Hash160 of the pubkey bytes as serialized
    const keyHashHex = recipientId;
    if (recipientKeys.has(keyHashHex)) {
      throw new Error('Duplicate recipient key (same hash160): ' + keyHashHex);
    }
    recipientKeys.set(keyHashHex, recipientPackage);
  }

  return { ephemeralPubKey, encryptedPayload: payload, recipientKeys };
}

/** Core base_blob compares raw bytes lexicographically, not numeric endian order. */
function compareUint160(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}

function recipientWireId(id, version) {
  if (/^[0-9a-f]{40}$/.test(id)) return hexToBytes((version === 2 ? '00' : '') + id);
  if (version === 2 && /^03[0-9a-f]{64}$/.test(id)) return hexToBytes(id);
  throw new Error('Invalid typed recipient id');
}

function serializeEciesMessage(msg) {
  const version = [...msg.recipientKeys.keys()].some((id) => id.length === 66) ? 2 : 1;
  const entries = [...msg.recipientKeys].map(([id, pkg]) => ({ id: recipientWireId(id, version), pkg }));
  entries.sort((a, b) => compareUint160(a.id, b.id));
  const parts = version === 2 ? [new Uint8Array([0, 2])] : [];
  parts.push(serializeVector(msg.ephemeralPubKey), serializeVector(msg.encryptedPayload), writeCompactSize(entries.length));
  for (const { id, pkg } of entries) {
    parts.push(id, serializeVector(pkg));
  }
  const result = concatBytes(...parts);
  // Use the same strict parser for locally constructed and received frames.
  deserializeEciesMessage(result);
  return result;
}

function deserializeEciesMessage(serialized, options = {}) {
  const maxPlaintext = options.maxPlaintext ?? 4 * 1024 * 1024;
  const maxRecipients = options.maxRecipients ?? 50;
  const maxBytes = options.maxBytes ?? 82 + maxPlaintext + 94 * maxRecipients;
  if (
    !Number.isInteger(maxPlaintext) ||
    maxPlaintext < 1 ||
    maxPlaintext > 4 * 1024 * 1024 ||
    !Number.isInteger(maxRecipients) ||
    maxRecipients < 1 ||
    maxRecipients > 50 ||
    !Number.isSafeInteger(maxBytes) ||
    maxBytes < 1 ||
    maxBytes > 82 + 4 * 1024 * 1024 + 94 * 50
  )
    throw new Error('Invalid ECIES parser limits');
  if (!(serialized instanceof Uint8Array) || serialized.length > maxBytes) throw new Error('Invalid ECIES wire budget');
  if (options.allowTrailing) throw new Error('Trailing ECIES bytes are not permitted');
  let offset = 0,
    version = 1;
  if (serialized[0] === 0) {
    if (serialized[1] !== 2) throw new Error('Unsupported ECIES version');
    version = 2;
    offset = 2;
  }
  const ephem = readVector(serialized, offset, 33);
  offset = ephem.offset;
  if (ephem.data.length !== 33) throw new Error('ECIES ephemeral key must be compressed');
  parsePublicKey(ephem.data);
  const payload = readVector(serialized, offset, maxPlaintext + 28);
  offset = payload.offset;
  if (payload.data.length < 29) throw new Error('ECIES payload is empty or truncated');
  const count = readCompactSize(serialized, offset);
  offset = count.offset;
  if (count.value < 1 || count.value > maxRecipients) throw new Error('Invalid ECIES recipient count');
  const recipientKeys = new Map();
  let previous = null,
    hasStrict = false;
  for (let i = 0; i < count.value; i++) {
    const start = offset;
    const type = version === 2 ? serialized[offset++] : 0;
    if (type !== 0 && type !== 3) throw new Error('Unknown ECIES recipient type');
    const length = type === 3 ? 32 : 20;
    if (offset + length > serialized.length) throw new Error('Truncated ECIES recipient id');
    const payloadId = serialized.slice(offset, offset + length);
    offset += length;
    const wireId = serialized.slice(start, offset);
    if (previous && compareUint160(previous, wireId) >= 0) throw new Error('Duplicate or unsorted ECIES recipient ids');
    previous = wireId;
    const pkg = readVector(serialized, offset, 60);
    offset = pkg.offset;
    if (pkg.data.length !== 60) throw new Error('ECIES wrapped key must be 60 bytes');
    hasStrict ||= type === 3;
    recipientKeys.set((type === 3 ? '03' : '') + bytesToHex(payloadId), pkg.data);
  }
  if (version === 2 && !hasStrict) throw new Error('Noncanonical Legacy-only ECIES v2');
  if (offset !== serialized.length) throw new Error('ECIES trailing bytes');
  return { version, ephemeralPubKey: ephem.data, encryptedPayload: payload.data, recipientKeys };
}

/**
 * Decrypts a parsed ECIES message with a 32-byte private key. Both public key
 * serializations of the private key are derived and both hash160 ids are
 * looked up, so recipients revealed with an uncompressed key still find their
 * package. Returns plaintext bytes, or null when no package matches or
 * authentication fails.
 */
async function eciesDecrypt(msg, privKeyBytes, address) {
  const forms = derivePublicKeyForms(privKeyBytes);
  let candidateIds = [
    bytesToHex(await hash160(forms.compressed)),
    bytesToHex(await hash160(forms.uncompressed)),
    '03' + bytesToHex(strictEcdsaCommitment(forms.compressed)),
  ];

  if (address !== undefined) {
    const decoded = await decodeDepinAddress(address);
    const form = (await pubKeyMatchesAddress(forms.compressed, address)) ? forms.compressed : forms.uncompressed;
    if (!(await pubKeyMatchesAddress(form, address))) throw new Error('Decryption key does not match identity address');
    candidateIds = [decoded.recipientId];
  }
  const packages = [];
  for (const id of candidateIds) {
    const pkg = msg.recipientKeys.get(id);
    if (pkg) packages.push(pkg);
  }
  if (packages.length === 0) return null;

  const payload = msg.encryptedPayload;
  // GCM payload: Nonce(12) + ciphertext(>=1) + Tag(16)
  if (payload.length < 12 + 1 + 16) return null;
  const payloadNonce = payload.slice(0, 12);
  const ciphertext = payload.slice(12, payload.length - 16);
  const payloadTag = payload.slice(payload.length - 16);

  // ECDH secret must match Core's ecdh module: SHA256(compressed(shared_point)).
  // getSharedSecret(priv, pub) == pointMultiply(pub, priv): raw compressed ECDH point.
  const sharedPointCompressed = secp256k1.getSharedSecret(privKeyBytes, msg.ephemeralPubKey, true);
  const sharedSecret = await sha256(sharedPointCompressed);
  const encKey = await kdfSha256(sharedSecret, 32);

  for (const recipientPackage of packages) {
    // GCM package: Nonce(12) + encrypted_key(32) + Tag(16) = 60 bytes
    if (recipientPackage.length < 12 + 32 + 16) continue;
    const recipientNonce = recipientPackage.slice(0, 12);
    const encryptedAESKey = recipientPackage.slice(12, recipientPackage.length - 16);
    const recipientTag = recipientPackage.slice(recipientPackage.length - 16);

    let aesKey;
    try {
      aesKey = await aes256GcmDecrypt(encryptedAESKey, encKey, recipientNonce, recipientTag);
    } catch {
      continue; // Authentication failed for this package
    }
    if (aesKey.length !== 32) continue;

    try {
      return await aes256GcmDecrypt(ciphertext, aesKey, payloadNonce, payloadTag);
    } catch {
      continue;
    }
  }

  return null;
}

export {
  _setDepinTestRng,
  randomBytes,
  aes256GcmEncrypt,
  aes256GcmDecrypt,
  eciesEncrypt,
  serializeEciesMessage,
  deserializeEciesMessage,
  eciesDecrypt,
  compareUint160,
};
