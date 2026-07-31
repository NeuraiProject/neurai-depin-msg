/**
 * Byte / hex primitives shared by every module.
 */

function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function hexToBytes(hex) {
  if (typeof hex !== 'string') throw new Error('Hex must be a string');
  if (hex.length % 2 !== 0) throw new Error('Hex must have even length');
  if (!/^[0-9a-fA-F]*$/.test(hex)) throw new Error('Invalid hex characters');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;
  const trimmed = hex.trim().toLowerCase();
  const noPrefix = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
  if (noPrefix.length === 0) return null;
  if (!/^[0-9a-f]+$/.test(noPrefix)) return null;
  if (noPrefix.length % 2 !== 0) return null;
  return noPrefix;
}

function timingSafeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export { concatBytes, hexToBytes, bytesToHex, normalizeHex, timingSafeEqual };
