/**
 * Bitcoin-style serialization primitives matching Neurai Core.
 *
 * Readers enforce canonical (minimal) CompactSize encodings, exactly like
 * Bitcoin's ReadCompactSize(): a value encoded with a wider prefix than
 * necessary is rejected.
 */

import { concatBytes } from './bytes.js';

function writeCompactSize(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('CompactSize must be a non-negative integer');
  }

  if (value < 253) {
    return new Uint8Array([value]);
  } else if (value <= 0xffff) {
    const buf = new Uint8Array(3);
    buf[0] = 253;
    buf[1] = value & 0xff;
    buf[2] = (value >> 8) & 0xff;
    return buf;
  } else if (value <= 0xffffffff) {
    const buf = new Uint8Array(5);
    buf[0] = 254;
    buf[1] = value & 0xff;
    buf[2] = (value >> 8) & 0xff;
    buf[3] = (value >> 16) & 0xff;
    buf[4] = (value >> 24) & 0xff;
    return buf;
  } else {
    const buf = new Uint8Array(9);
    buf[0] = 255;
    const low = value >>> 0;
    const high = Math.floor(value / 0x100000000) >>> 0;
    buf[1] = low & 0xff;
    buf[2] = (low >> 8) & 0xff;
    buf[3] = (low >> 16) & 0xff;
    buf[4] = (low >> 24) & 0xff;
    buf[5] = high & 0xff;
    buf[6] = (high >> 8) & 0xff;
    buf[7] = (high >> 16) & 0xff;
    buf[8] = (high >> 24) & 0xff;
    return buf;
  }
}

function readCompactSize(buf, offset) {
  if (offset >= buf.length) throw new Error('CompactSize: out of bounds');
  const first = buf[offset];
  if (first < 253) return { value: first, offset: offset + 1 };
  if (first === 253) {
    if (offset + 3 > buf.length) throw new Error('CompactSize: truncated uint16');
    const value = buf[offset + 1] | (buf[offset + 2] << 8);
    if (value < 253) throw new Error('CompactSize: non-canonical encoding');
    return { value, offset: offset + 3 };
  }
  if (first === 254) {
    if (offset + 5 > buf.length) throw new Error('CompactSize: truncated uint32');
    const value =
      ((buf[offset + 1]) |
        (buf[offset + 2] << 8) |
        (buf[offset + 3] << 16) |
        (buf[offset + 4] << 24)) >>> 0;
    if (value < 0x10000) throw new Error('CompactSize: non-canonical encoding');
    return { value, offset: offset + 5 };
  }
  if (offset + 9 > buf.length) throw new Error('CompactSize: truncated uint64');
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value |= BigInt(buf[offset + 1 + i]) << (8n * BigInt(i));
  }
  if (value < 0x100000000n) throw new Error('CompactSize: non-canonical encoding');
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('CompactSize: value too large');
  }
  return { value: Number(value), offset: offset + 9 };
}

function serializeString(str) {
  const strBytes = new TextEncoder().encode(str);
  return concatBytes(writeCompactSize(strBytes.length), strBytes);
}

function serializeVector(data) {
  return concatBytes(writeCompactSize(data.length), data);
}

function serializeInt64(value) {
  if (!Number.isSafeInteger(value)) throw new Error('int64 must be a safe integer');
  const buf = new Uint8Array(8);
  const low = value >>> 0;
  const high = Math.floor(value / 0x100000000) >>> 0;
  buf[0] = low & 0xff;
  buf[1] = (low >> 8) & 0xff;
  buf[2] = (low >> 16) & 0xff;
  buf[3] = (low >> 24) & 0xff;
  buf[4] = high & 0xff;
  buf[5] = (high >> 8) & 0xff;
  buf[6] = (high >> 16) & 0xff;
  buf[7] = (high >> 24) & 0xff;
  return buf;
}

function readVector(buf, offset, maxLength = Infinity) {
  const { value: len, offset: afterLen } = readCompactSize(buf, offset);
  if (len > maxLength) throw new Error('Vector: length exceeds limit');
  if (afterLen + len > buf.length) throw new Error('Vector: truncated');
  const data = buf.slice(afterLen, afterLen + len);
  return { data, offset: afterLen + len };
}

function readString(buf, offset, maxLength = Infinity) {
  const { data, offset: after } = readVector(buf, offset, maxLength);
  return { value: new TextDecoder().decode(data), offset: after };
}

function readInt64(buf, offset) {
  if (offset + 8 > buf.length) throw new Error('int64: truncated');
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value |= BigInt(buf[offset + i]) << (8n * BigInt(i));
  }
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('int64: value too large');
  }
  return { value: Number(value), offset: offset + 8 };
}

export {
  writeCompactSize,
  readCompactSize,
  serializeString,
  serializeVector,
  serializeInt64,
  readVector,
  readString,
  readInt64
};
