import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  eciesEncrypt,
  serializeEciesMessage,
  deserializeEciesMessage,
  eciesDecrypt,
  hexToBytes,
  bytesToHex,
  hash160,
} from '../src/index.js';
import { compareUint160 } from '../src/ecies.js';
import { keypair, useDeterministicRng } from './helpers.mjs';

const A = keypair('11'.repeat(32));
const B = keypair('22'.repeat(32));
const C = keypair('33'.repeat(32));

test('ECIES round-trip: compressed, uncompressed, and non-recipient', async () => {
  const plaintext = new TextEncoder().encode('round trip');
  const msg = await eciesEncrypt(plaintext, [
    hexToBytes(A.pubCompressed),
    hexToBytes(B.pubUncompressed), // 65-byte recipient
  ]);
  const wire = serializeEciesMessage(msg);
  const parsed = deserializeEciesMessage(wire);

  assert.deepEqual(await eciesDecrypt(parsed, A.priv), plaintext);
  // B was addressed via its uncompressed serialization; the decryptor derives
  // both forms and must still find its package.
  assert.deepEqual(await eciesDecrypt(parsed, B.priv), plaintext);
  assert.equal(await eciesDecrypt(parsed, C.priv), null);
});

test('map entries are sorted in uint160 numeric order (Core std::map)', async () => {
  const restore = useDeterministicRng();
  try {
    const msg = await eciesEncrypt(new Uint8Array([1]), [
      hexToBytes(A.pubCompressed),
      hexToBytes(B.pubCompressed),
      hexToBytes(C.pubCompressed),
    ]);
    const wire = serializeEciesMessage(msg);
    const parsed = deserializeEciesMessage(wire);
    const ids = Array.from(parsed.recipientKeys.keys()).map(hexToBytes);
    for (let i = 1; i < ids.length; i++) {
      // numeric order compares from byte 19 (most significant) down
      assert.ok(compareUint160(ids[i - 1], ids[i]) < 0, 'entries not in uint160 order');
    }
  } finally {
    restore();
  }
});

test('deterministic RNG makes encryption reproducible', async () => {
  const enc = async () => {
    const restore = useDeterministicRng(42);
    try {
      const msg = await eciesEncrypt(new TextEncoder().encode('rng'), [hexToBytes(A.pubCompressed)]);
      return bytesToHex(serializeEciesMessage(msg));
    } finally {
      restore();
    }
  };
  assert.equal(await enc(), await enc());
});

test('duplicate recipient hash160 rejected at encryption', async () => {
  await assert.rejects(
    eciesEncrypt(new Uint8Array([1]), [hexToBytes(A.pubCompressed), hexToBytes(A.pubCompressed)]),
    /Duplicate recipient/,
  );
});

test('strict parsing: trailing bytes and duplicate ids rejected', async () => {
  const msg = await eciesEncrypt(new Uint8Array([1, 2, 3]), [hexToBytes(A.pubCompressed)]);
  const wire = serializeEciesMessage(msg);

  const withTrailing = new Uint8Array([...wire, 0]);
  assert.throws(() => deserializeEciesMessage(withTrailing), /trailing/);
  assert.throws(() => deserializeEciesMessage(withTrailing, { allowTrailing: true }), /not permitted/);

  // craft duplicate key-id entries
  const dup = await eciesEncrypt(new Uint8Array([1]), [hexToBytes(A.pubCompressed)]);
  const idHex = Array.from(dup.recipientKeys.keys())[0];
  const pkg = dup.recipientKeys.get(idHex);
  const two = new Map([[idHex, pkg]]);
  const wire1 = serializeEciesMessage({ ...dup, recipientKeys: two });
  // duplicate the single entry by rewriting count=2 and repeating the tail
  const single = serializeEciesMessage({ ...dup, recipientKeys: two });
  const entryLen = 20 + 1 + pkg.length; // keyid + compactsize(pkg) + pkg
  const entry = single.slice(single.length - entryLen);
  const head = single.slice(0, single.length - entryLen - 1); // drop count byte
  const crafted = new Uint8Array([...head, 2, ...entry, ...entry]);
  assert.throws(() => deserializeEciesMessage(crafted), /Duplicate or unsorted/);
  assert.ok(wire1.length > 0);
});

test('oversized and malformed packages fail closed to null', async () => {
  const msg = await eciesEncrypt(new TextEncoder().encode('x'), [hexToBytes(A.pubCompressed)]);
  const id = bytesToHex(await hash160(hexToBytes(A.pubCompressed)));
  // truncate A's package below the GCM minimum
  msg.recipientKeys.set(id, msg.recipientKeys.get(id).slice(0, 10));
  assert.equal(await eciesDecrypt(msg, A.priv), null);
});

test('parser limits can narrow but cannot relax the protocol hard limits', () => {
  for (const options of [
    { maxRecipients: 51 },
    { maxRecipients: NaN },
    { maxPlaintext: Infinity },
    { maxPlaintext: 4194305 },
    { maxBytes: Infinity },
  ]) {
    assert.throws(() => deserializeEciesMessage(new Uint8Array(), options), /parser limits/);
  }
});
