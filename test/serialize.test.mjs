import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  writeCompactSize, readCompactSize, serializeInt64, readInt64,
  serializeVector, readVector, serializeString, readString
} from '../src/serialize.js';

test('CompactSize round-trips', () => {
  for (const v of [0, 1, 252, 253, 254, 0xffff, 0x10000, 0xffffffff, 0x100000000, Number.MAX_SAFE_INTEGER]) {
    const buf = writeCompactSize(v);
    const { value, offset } = readCompactSize(buf, 0);
    assert.equal(value, v);
    assert.equal(offset, buf.length);
  }
});

test('CompactSize rejects non-canonical encodings', () => {
  // 252 encoded with the 253 prefix
  assert.throws(() => readCompactSize(new Uint8Array([253, 252, 0]), 0), /non-canonical/);
  // 0xffff encoded with the 254 prefix
  assert.throws(() => readCompactSize(new Uint8Array([254, 0xff, 0xff, 0, 0]), 0), /non-canonical/);
  // small value with the 255 prefix
  assert.throws(
    () => readCompactSize(new Uint8Array([255, 1, 0, 0, 0, 0, 0, 0, 0]), 0),
    /non-canonical/
  );
});

test('CompactSize rejects truncated input', () => {
  assert.throws(() => readCompactSize(new Uint8Array([]), 0), /out of bounds/);
  assert.throws(() => readCompactSize(new Uint8Array([253, 1]), 0), /truncated/);
  assert.throws(() => readCompactSize(new Uint8Array([254, 1, 2]), 0), /truncated/);
  assert.throws(() => readCompactSize(new Uint8Array([255, 1, 2, 3]), 0), /truncated/);
});

test('CompactSize rejects values above MAX_SAFE_INTEGER', () => {
  const buf = new Uint8Array([255, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  assert.throws(() => readCompactSize(buf, 0), /too large/);
});

test('int64 round-trips', () => {
  for (const v of [1, 1753900000, Number.MAX_SAFE_INTEGER]) {
    const buf = serializeInt64(v);
    assert.equal(buf.length, 8);
    const { value } = readInt64(buf, 0);
    assert.equal(value, v);
  }
});

test('vector and string round-trips with limits', () => {
  const data = new Uint8Array([1, 2, 3, 4, 5]);
  const v = serializeVector(data);
  assert.deepEqual(readVector(v, 0).data, data);
  assert.throws(() => readVector(v, 0, 4), /exceeds limit/);

  const s = serializeString('&TEST/APPLE');
  assert.equal(readString(s, 0).value, '&TEST/APPLE');
});

test('vector rejects truncation', () => {
  const v = serializeVector(new Uint8Array(10));
  assert.throws(() => readVector(v.slice(0, 5), 0), /truncated/i);
});
