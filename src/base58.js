/**
 * Base58 / Base58Check decoding (Neurai addresses and WIF keys).
 */

import { doubleSha256 } from './hash.js';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

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

export { base58Decode, base58CheckDecode };
