/**
 * Base58 / Base58Check encoding and decoding (Neurai addresses and WIF keys).
 */

import { doubleSha256 } from './hash.js';
import { concatBytes } from './bytes.js';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new Error('base58Encode expects Uint8Array');
  if (bytes.length === 0) return '';

  let leadingZeroes = 0;
  while (leadingZeroes < bytes.length && bytes[leadingZeroes] === 0) leadingZeroes++;
  if (leadingZeroes === bytes.length) return '1'.repeat(leadingZeroes);

  const digits = [0];
  for (let i = leadingZeroes; i < bytes.length; i++) {
    const byte = bytes[i];
    let carry = byte;
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let out = '1'.repeat(leadingZeroes);
  for (let i = digits.length - 1; i >= 0; i--) out += BASE58_ALPHABET[digits[i]];
  return out;
}

/** Encodes version byte + payload with the 4-byte double-SHA256 checksum. */
async function base58CheckEncode(version, payload) {
  const data = concatBytes(new Uint8Array([version]), payload);
  const checksum = (await doubleSha256(data)).slice(0, 4);
  return base58Encode(concatBytes(data, checksum));
}

function base58Decode(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const charIndex = BASE58_ALPHABET.indexOf(str[i]);
    if (charIndex === -1) throw new Error('Invalid Base58 character: ' + str[i]);

    let carry = charIndex;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}

/**
 * Decodes a Base58Check string and verifies its 4-byte checksum.
 * Returns { version, payload } where version is the first byte.
 */
async function base58CheckDecode(str) {
  const decoded = base58Decode(str);
  if (decoded.length < 5) throw new Error('Base58Check: too short');

  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = await doubleSha256(payload);
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) throw new Error('Base58Check: checksum mismatch');
  }

  return { version: payload[0], payload: payload.slice(1) };
}

export { base58Encode, base58CheckEncode, base58Decode, base58CheckDecode };
