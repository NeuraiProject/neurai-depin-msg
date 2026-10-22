/**
 * Neurai `signmessage`-compatible recoverable signatures (protocol spec §3.3)
 * and the DePIN authentication preimages built on them (§7, §11).
 *
 *   hash      = SHA256d( ser_string(magic) ‖ ser_string(message) )
 *   signature = base64( header(1) ‖ r(32) ‖ s(32) )   header = 27 + recid (+4 compressed)
 *
 * Signatures are deterministic (RFC 6979, low-s), so an implementation with
 * the same key MUST reproduce the official §13.2 vectors byte for byte —
 * and two identical requests are the same request for the node's replay
 * guard (see the monotonic timestamp handling in depin-client.js).
 *
 * Portable: pure @noble crypto plus a local Base64 codec — no `Buffer`, no
 * `atob`, so the module runs in Node, browsers and React Native alike.
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { concatBytes, bytesToHex, normalizeHex, hexToBytes } from './bytes.js';
import { serializeString } from './serialize.js';
import { base58Decode } from './base58.js';
import { parsePublicKey } from './keys.js';
import { decodeStrictEcdsaAddress } from './address.js';
import { DepinProtocolError } from './errors.js';

const NEURAI_MESSAGE_MAGIC = 'Neurai Signed Message:\n';

// chainparams.cpp SECRET_KEY prefixes.
const WIF_PREFIX = { mainnet: 128, test: 239 };

// ---------------------------------------------------------------------------
// Portable Base64 (canonical: strict alphabet, required padding, no reencoding
// ambiguity — decode(encode(x)) === x and encode(decode(s)) === s).
// ---------------------------------------------------------------------------

const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_LOOKUP = (() => {
  const table = new Int16Array(128).fill(-1);
  for (let i = 0; i < B64_ALPHABET.length; i++) table[B64_ALPHABET.charCodeAt(i)] = i;
  return table;
})();

function base64Encode(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new DepinProtocolError('base64Encode expects Uint8Array');
  }
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64_ALPHABET[b0 >> 2];
    out += B64_ALPHABET[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < bytes.length ? B64_ALPHABET[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    out += i + 2 < bytes.length ? B64_ALPHABET[b2 & 63] : '=';
  }
  return out;
}

function base64Decode(str) {
  if (typeof str !== 'string' || str.length === 0 || str.length % 4 !== 0) {
    throw new DepinProtocolError('Invalid Base64: length must be a positive multiple of 4');
  }
  let padding = 0;
  if (str.endsWith('==')) padding = 2;
  else if (str.endsWith('=')) padding = 1;
  const body = str.slice(0, str.length - padding);
  if (body.includes('=')) {
    throw new DepinProtocolError('Invalid Base64: padding inside the data');
  }
  const out = new Uint8Array((str.length / 4) * 3 - padding);
  let outPos = 0;
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < body.length; i++) {
    const code = body.charCodeAt(i);
    const value = code < 128 ? B64_LOOKUP[code] : -1;
    if (value < 0) {
      throw new DepinProtocolError('Invalid Base64 character at position ' + i);
    }
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[outPos++] = (buffer >> bits) & 0xff;
    }
  }
  // Canonical: bits left over from the last quantum must be zero.
  if (padding > 0 && (buffer & ((1 << bits) - 1)) !== 0) {
    throw new DepinProtocolError('Invalid Base64: non-canonical trailing bits');
  }
  return out;
}

// ---------------------------------------------------------------------------
// WIF network and compression flag are preserved. Strict ECDSA uses compressed
// keys; Legacy identities may use either exact SEC1 serialization.
// ---------------------------------------------------------------------------

/**
 * Decodes a WIF keeping the network version byte and the compression flag.
 * Returns { privateKey: Uint8Array(32), compressed: boolean,
 *           network: 'mainnet' | 'test' }.
 */
function decodeWIF(wif) {
  if (typeof wif !== 'string' || wif.length < 50) {
    throw new DepinProtocolError('Invalid WIF: not a WIF string');
  }
  const decoded = base58Decode(wif);
  if (decoded.length < 37) throw new DepinProtocolError('Invalid WIF: too short');

  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = nobleSha256(nobleSha256(payload));
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new DepinProtocolError('Invalid WIF: checksum mismatch');
    }
  }

  const version = payload[0];
  let network = null;
  if (version === WIF_PREFIX.mainnet) network = 'mainnet';
  else if (version === WIF_PREFIX.test) network = 'test';
  else throw new DepinProtocolError('Invalid WIF: unknown version byte ' + version);

  let compressed;
  if (payload.length === 34 && payload[33] === 0x01) compressed = true;
  else if (payload.length === 33) compressed = false;
  else throw new DepinProtocolError('Invalid WIF: unexpected payload length ' + payload.length);

  return { privateKey: payload.slice(1, 33), compressed, network };
}

/** Normalize WIF or raw hex without discarding network/compression metadata. */
function normalizeSigningKey(privateKeyOrWif) {
  if (typeof privateKeyOrWif !== 'string' || privateKeyOrWif.length === 0) {
    throw new DepinProtocolError('Private key is required (compressed WIF or 64-hex)');
  }
  const asHex = normalizeHex(privateKeyOrWif);
  if (asHex && asHex.length === 64) {
    return { privateKey: hexToBytes(asHex), network: null, compressed: true };
  }
  const decoded = decodeWIF(privateKeyOrWif);
  return { privateKey: decoded.privateKey, network: decoded.network, compressed: decoded.compressed };
}

// ---------------------------------------------------------------------------
// Message hash and recoverable signatures
// ---------------------------------------------------------------------------

/**
 * SHA256d over the Bitcoin-style signed-message envelope:
 * ser_string("Neurai Signed Message:\n") ‖ ser_string(message).
 */
function neuraiSignedMessageHash(message, address) {
  if (typeof message !== 'string') {
    throw new DepinProtocolError('Message to hash must be a string');
  }
  const data = concatBytes(serializeString(NEURAI_MESSAGE_MAGIC), serializeString(message));
  const original = nobleSha256(nobleSha256(data));
  if (address && /^(nq|tnq)1/.test(address)) {
    const { payload } = decodeStrictEcdsaAddress(address);
    return nobleSha256(
      nobleSha256(concatBytes(serializeString('Neurai Strict AuthScript Message'), new Uint8Array([3]), payload, original)),
    );
  }
  return original;
}

/**
 * Signs `message` with a compressed-key identity, `signmessage`-compatible.
 * Deterministic (RFC 6979, low-s). Returns the Base64 compact signature.
 */
function signRecoverableMessage(message, privateKeyOrCompressedWif, options = {}) {
  const { privateKey, compressed } = normalizeSigningKey(privateKeyOrCompressedWif);
  const hash = neuraiSignedMessageHash(message, options.address);

  const signature = secp256k1.sign(hash, privateKey); // lowS by default
  if (typeof signature.recovery !== 'number') {
    throw new DepinProtocolError('Signature recovery id unavailable');
  }
  const compact = signature.toCompactRawBytes();
  const header = 27 + signature.recovery + ((options.compressed ?? compressed) ? 4 : 0); // +4: compressed key
  const out = new Uint8Array(65);
  out[0] = header;
  out.set(compact, 1);
  return base64Encode(out);
}

function decodeRecoverableSignature(signatureBase64) {
  const bytes = base64Decode(signatureBase64);
  if (bytes.length !== 65) {
    throw new DepinProtocolError('Recoverable signature must be 65 bytes; got ' + bytes.length);
  }
  const header = bytes[0];
  if (header < 27 || header > 34) {
    throw new DepinProtocolError('Invalid recoverable signature header: ' + header);
  }
  return {
    recovery: (header - 27) & 3,
    compressed: header >= 31,
    compact: bytes.slice(1),
  };
}

/**
 * Recovers the signer's public key from a Base64 compact signature over
 * `message`. Returns hex in the serialization the header declares
 * (compressed for headers 31–34, uncompressed for 27–30 — protocol 2 always
 * produces compressed). Throws DepinProtocolError for malformed input;
 * throws if recovery is mathematically impossible.
 */
function recoverPublicKeyFromMessage(message, signatureBase64, address) {
  const { recovery, compressed, compact } = decodeRecoverableSignature(signatureBase64);
  if (address && /^(nq|tnq)1/.test(address) && !compressed)
    throw new DepinProtocolError('Strict ECDSA signatures require a compressed key');
  const hash = neuraiSignedMessageHash(message, address);

  let point;
  try {
    const sig = secp256k1.Signature.fromCompact(compact).addRecoveryBit(recovery);
    point = sig.recoverPublicKey(hash);
  } catch (e) {
    throw new DepinProtocolError('Public key recovery failed: ' + (e && e.message ? e.message : e), e);
  }
  return bytesToHex(point.toRawBytes(compressed));
}

/**
 * True when `signatureBase64` is a valid signature of `message` by
 * `expectedPublicKey` (hex or bytes, either serialization — compared by
 * curve point). Throws DepinProtocolError for malformed signature/key input;
 * returns false for a well-formed signature that does not match.
 */
function verifyRecoverableMessage(message, signatureBase64, expectedPublicKey, address) {
  const expected = parsePublicKey(expectedPublicKey);
  let recoveredHex;
  try {
    recoveredHex = recoverPublicKeyFromMessage(message, signatureBase64, address);
  } catch (e) {
    if (e instanceof DepinProtocolError && /recovery failed/i.test(e.message)) {
      // Well-formed encoding whose point cannot be recovered: not a match.
      return false;
    }
    throw e;
  }
  return parsePublicKey(recoveredHex).pointId === expected.pointId;
}

export {
  NEURAI_MESSAGE_MAGIC,
  WIF_PREFIX,
  base64Encode,
  base64Decode,
  decodeWIF,
  normalizeSigningKey,
  neuraiSignedMessageHash,
  signRecoverableMessage,
  recoverPublicKeyFromMessage,
  verifyRecoverableMessage,
};
