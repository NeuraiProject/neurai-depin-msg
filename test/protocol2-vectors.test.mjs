/**
 * Official protocol-2 vectors (spec §13, contrib/depin/vectors.txt).
 *
 * Fixture provenance: Neurai repo commit
 * 3d694b0a8499bb8cd61443052d21ba9f05de0717, byte-identical copy at
 * test/fixtures/protocol2-vectors.txt — the first test pins its SHA-256 so
 * the copy cannot drift silently.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sha256 } from '@noble/hashes/sha256';

import {
  neuraiSignedMessageHash,
  signRecoverableMessage,
  recoverPublicKeyFromMessage,
  verifyRecoverableMessage,
  base64Decode,
  base64Encode,
  decodeWIF
} from '../src/signmessage.js';
import { bytesToHex, hexToBytes } from '../src/bytes.js';

const FIXTURE_PATH = fileURLToPath(
  new URL('./fixtures/protocol2-vectors.txt', import.meta.url)
);
const FIXTURE_SHA256 =
  '8d8958ebb9281444153b7bf75d6bada8d91b68e357d08e340612efa15464b3d8';

const raw = readFileSync(FIXTURE_PATH);
const vectors = Object.fromEntries(
  raw
    .toString('utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

test('fixture provenance: SHA-256 matches the frozen upstream copy', () => {
  assert.equal(bytesToHex(sha256(raw)), FIXTURE_SHA256);
});

import { secp256k1 } from '@noble/curves/secp256k1';

test('§13.1: holder WIF decodes (testnet, compressed) to the vector pubkey', () => {
  const decoded = decodeWIF(vectors.holder_wif);
  assert.equal(decoded.network, 'test');
  assert.equal(decoded.compressed, true);
  const derived = bytesToHex(secp256k1.getPublicKey(decoded.privateKey, true));
  assert.equal(derived, vectors.holder_pubkey);
});

test('§13.2: DEPIN-REQ signature reproduces byte for byte', () => {
  const sig = signRecoverableMessage(vectors.req_preimage, vectors.holder_wif);
  assert.equal(sig, vectors.req_signature);
});

test('§13.2: DEPIN-GET signature reproduces byte for byte (incl. via-RPC copy)', () => {
  const sig = signRecoverableMessage(vectors.get_preimage, vectors.holder_wif);
  assert.equal(sig, vectors.get_signature);
  assert.equal(sig, vectors.get_signature_via_rpc);
});

test('§13.2: recovery over both preimages yields the holder pubkey', () => {
  assert.equal(
    recoverPublicKeyFromMessage(vectors.req_preimage, vectors.req_signature),
    vectors.holder_pubkey
  );
  assert.equal(
    recoverPublicKeyFromMessage(vectors.get_preimage, vectors.get_signature),
    vectors.holder_pubkey
  );
  assert.equal(
    verifyRecoverableMessage(vectors.req_preimage, vectors.req_signature, vectors.holder_pubkey),
    true
  );
  // Wrong key: well-formed signature, no match.
  assert.equal(
    verifyRecoverableMessage(vectors.req_preimage, vectors.req_signature, vectors.pool_pubkey),
    false
  );
});

test('§13.5: receive_signature is the DEPIN-GET over the real challenge, byte for byte', () => {
  const preimage =
    'DEPIN-GET|&TEST/SEC|' + vectors.holder_address + '|' + vectors.receive_nonce;
  const sig = signRecoverableMessage(preimage, vectors.holder_wif);
  assert.equal(sig, vectors.receive_signature);
});

test('base64 codec is canonical (roundtrip + strictness)', () => {
  const bytes = base64Decode(vectors.req_signature);
  assert.equal(bytes.length, 65);
  assert.equal(base64Encode(bytes), vectors.req_signature);
  assert.throws(() => base64Decode('abc'), /multiple of 4/);
  assert.throws(() => base64Decode('a=bc'), /padding inside/);
  assert.throws(() => base64Decode('ab!c'), /character/);
});

test('signed-message hash covers magic and message as ser_strings', () => {
  // Sanity: different messages produce different hashes; empty message works.
  const a = neuraiSignedMessageHash('');
  const b = neuraiSignedMessageHash('x');
  assert.equal(a.length, 32);
  assert.notEqual(bytesToHex(a), bytesToHex(b));
});
