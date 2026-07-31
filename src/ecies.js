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
 * rejected; dedupe recipients by curve point before calling.
 */
async function eciesEncrypt(plaintext, recipientPubKeys) {
  const ephemeralPrivKey = randomBytes(32);
  const ephemeralPubKey = secp256k1.getPublicKey(ephemeralPrivKey, true);

  // AES key derived from ephemeral private key (matches KDF_SHA256 in C++)
  const aesKey = await kdfSha256(ephemeralPrivKey, 32);

  const nonce = randomBytes(12);
  const { ciphertext, tag } = await aes256GcmEncrypt(plaintext, aesKey, nonce);
  const payload = concatBytes(nonce, ciphertext, tag);

  const recipientKeys = new Map();

  for (const recipientPubKey of recipientPubKeys) {
    const { bytes: keyBytes } = parsePublicKey(recipientPubKey);

    // ECDH secret must match libsecp256k1's default: SHA256(compressed(shared_point))
    const sharedPointCompressed = secp256k1.getSharedSecret(ephemeralPrivKey, keyBytes, true);
    const sharedSecret = await sha256(sharedPointCompressed);
    const encKey = await kdfSha256(sharedSecret, 32);

    const recipientNonce = randomBytes(12);
    const { ciphertext: encryptedAESKey, tag: recipientTag } =
      await aes256GcmEncrypt(aesKey, encKey, recipientNonce);
    const recipientPackage = concatBytes(recipientNonce, encryptedAESKey, recipientTag);

    // Map key is CKeyID: Hash160 of the pubkey bytes as serialized
    const keyHashHex = bytesToHex(await hash160(keyBytes));
    if (recipientKeys.has(keyHashHex)) {
      throw new Error('Duplicate recipient key (same hash160): ' + keyHashHex);
    }
    recipientKeys.set(keyHashHex, recipientPackage);
  }

  return { ephemeralPubKey, encryptedPayload: payload, recipientKeys };
}

/**
 * Compares two 20-byte uint160 keys the way C++ base_uint does: numerically,
 * i.e. from the most significant byte (index 19) down. std::map iterates in
 * this order, so matching it makes our serialization byte-identical to Core's.
 */
function compareUint160(a, b) {
  for (let i = 19; i >= 0; i--) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function serializeEciesMessage(msg) {
  const parts = [];
  parts.push(serializeVector(msg.ephemeralPubKey));
  parts.push(serializeVector(msg.encryptedPayload));

  // recipientKeys is a std::map<uint160, vector<unsigned char>>:
  // CompactSize(count) + repeated (raw 20-byte key + vector value)
  const entries = Array.from(msg.recipientKeys.entries()).map(([hash160Hex, recipientPackage]) => {
    const keyBytes = hexToBytes(hash160Hex);
    if (keyBytes.length !== 20) throw new Error('recipient key hash160 must be 20 bytes');
    return { keyBytes, recipientPackage };
  });

  entries.sort((a, b) => compareUint160(a.keyBytes, b.keyBytes));

  parts.push(writeCompactSize(entries.length));
  for (const { keyBytes, recipientPackage } of entries) {
    parts.push(keyBytes);
    parts.push(serializeVector(recipientPackage));
  }

  return concatBytes(...parts);
}

/**
 * Parses a serialized CECIESEncryptedMessage. Strict by default: canonical
 * CompactSize, no duplicate recipient key ids, no trailing bytes.
 */
function deserializeEciesMessage(serialized, options = {}) {
  const { allowTrailing = false } = options;
  if (!(serialized instanceof Uint8Array)) {
    throw new Error('deserializeEciesMessage: invalid input');
  }
  let offset = 0;

  const ephem = readVector(serialized, offset);
  const ephemeralPubKey = ephem.data;
  offset = ephem.offset;
  if (ephemeralPubKey.length !== 33 && ephemeralPubKey.length !== 65) {
    throw new Error('Invalid ephemeral pubkey length: ' + ephemeralPubKey.length);
  }

  const payloadVec = readVector(serialized, offset);
  const encryptedPayload = payloadVec.data;
  offset = payloadVec.offset;

  const countRes = readCompactSize(serialized, offset);
  const count = countRes.value;
  offset = countRes.offset;

  const recipientKeys = new Map();
  for (let i = 0; i < count; i++) {
    if (offset + 20 > serialized.length) throw new Error('recipientKeys: truncated keyid');
    const keyId = serialized.slice(offset, offset + 20);
    offset += 20;
    const v = readVector(serialized, offset);
    offset = v.offset;
    const keyIdHex = bytesToHex(keyId);
    if (recipientKeys.has(keyIdHex)) {
      throw new Error('recipientKeys: duplicate key id ' + keyIdHex);
    }
    recipientKeys.set(keyIdHex, v.data);
  }

  if (!allowTrailing && offset !== serialized.length) {
    throw new Error('deserializeEciesMessage: trailing bytes after message');
  }

  return { ephemeralPubKey, encryptedPayload, recipientKeys };
}

/**
 * Decrypts a parsed ECIES message with a 32-byte private key. Both public key
 * serializations of the private key are derived and both hash160 ids are
 * looked up, so recipients revealed with an uncompressed key still find their
 * package. Returns plaintext bytes, or null when no package matches or
 * authentication fails.
 */
async function eciesDecrypt(msg, privKeyBytes) {
  const forms = derivePublicKeyForms(privKeyBytes);
  const candidateIds = [
    bytesToHex(await hash160(forms.compressed)),
    bytesToHex(await hash160(forms.uncompressed))
  ];

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
  compareUint160
};
