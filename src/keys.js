/**
 * Private/public key handling: WIF, validation, and point identity.
 *
 * Public keys are accepted in both secp256k1 serializations (33-byte
 * compressed and 65-byte uncompressed), matching Core, which parses either
 * for ECDH and derives CKeyID from the bytes as revealed on chain. Key
 * *identity* (deduplication, sender checks) is by curve point; hash160 and
 * ECIES map entries always use the original serialization.
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { base58Decode } from './base58.js';
import { doubleSha256 } from './hash.js';
import { hexToBytes, bytesToHex, normalizeHex } from './bytes.js';

function isWIF(str) {
  return typeof str === 'string' && /^[59KLcT][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(str);
}

async function wifToHex(wif) {
  const decoded = base58Decode(wif);

  if (decoded.length < 37) {
    throw new Error('Invalid WIF: too short');
  }

  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = await doubleSha256(payload);

  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new Error('Invalid WIF: checksum mismatch');
    }
  }

  let privateKeyBytes;
  if (payload.length === 34) {
    // version + 32-byte key + 0x01 compressed marker
    privateKeyBytes = payload.slice(1, 33);
  } else if (payload.length === 33) {
    // version + 32-byte key (uncompressed wallet key)
    privateKeyBytes = payload.slice(1, 33);
  } else {
    throw new Error('Invalid WIF: unexpected length ' + payload.length);
  }

  return bytesToHex(privateKeyBytes);
}

async function normalizePrivateKeyTo32Bytes(wifOrHex) {
  if (typeof wifOrHex !== 'string' || wifOrHex.length === 0) {
    throw new Error('Private key is required');
  }

  if (isWIF(wifOrHex)) {
    return hexToBytes(await wifToHex(wifOrHex));
  }

  const norm = normalizeHex(wifOrHex);
  if (!norm) throw new Error('Private key must be WIF or 64-hex');
  if (norm.length !== 64) throw new Error('Private key must be 32 bytes (64 hex chars)');
  return hexToBytes(norm);
}

/**
 * Parses a public key given as hex string or bytes. Accepts 33-byte
 * compressed or 65-byte uncompressed serializations and validates the point
 * is on the curve. Returns { bytes, pointId } where `bytes` is the original
 * serialization and `pointId` is the canonical (compressed-hex) identity of
 * the curve point, suitable for point-based comparison and deduplication.
 */
function parsePublicKey(pubKeyHexOrBytes) {
  let bytes;
  if (pubKeyHexOrBytes instanceof Uint8Array) {
    bytes = pubKeyHexOrBytes;
  } else {
    const norm = normalizeHex(pubKeyHexOrBytes);
    if (!norm) throw new Error('Public key must be hex or bytes');
    bytes = hexToBytes(norm);
  }

  if (bytes.length !== 33 && bytes.length !== 65) {
    throw new Error('Public key must be 33 or 65 bytes; got ' + bytes.length);
  }

  let point;
  try {
    point = secp256k1.ProjectivePoint.fromHex(bytes);
  } catch (e) {
    throw new Error('Invalid secp256k1 public key: ' + (e && e.message ? e.message : e));
  }

  return {
    bytes,
    pointId: bytesToHex(point.toRawBytes(true))
  };
}

/**
 * Derives both serializations of the public key for a 32-byte private key.
 * Returns { compressed, uncompressed } (Uint8Array each).
 */
function derivePublicKeyForms(privKeyBytes) {
  return {
    compressed: secp256k1.getPublicKey(privKeyBytes, true),
    uncompressed: secp256k1.getPublicKey(privKeyBytes, false)
  };
}

/**
 * True when the private key controls the given public key (point equality,
 * independent of serialization form).
 */
function privateKeyMatchesPublicKey(privKeyBytes, pubKeyHexOrBytes) {
  const parsed = parsePublicKey(pubKeyHexOrBytes);
  const derived = bytesToHex(secp256k1.getPublicKey(privKeyBytes, true));
  return parsed.pointId === derived;
}

export {
  isWIF,
  wifToHex,
  normalizePrivateKeyTo32Bytes,
  parsePublicKey,
  derivePublicKeyForms,
  privateKeyMatchesPublicKey
};
