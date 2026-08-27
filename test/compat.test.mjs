import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../src/index.js';

test('2.2.1 API surface is still exported', () => {
  for (const name of [
    'buildDepinMessage', 'wrapMessageForServer', 'unwrapMessageFromServer',
    'decryptDepinReceiveEncryptedPayload', 'wifToHex', 'isWIF',
    'hexToBytes', 'bytesToHex', 'sha256', 'doubleSha256', 'hash160', 'base58Decode'
  ]) {
    assert.equal(typeof lib[name], 'function', name + ' missing');
  }
  // previously global-only, now also proper ESM exports
  assert.equal(typeof lib.buildDepinPreimage, 'function');
  assert.equal(typeof lib.assembleDepinMessage, 'function');
});

test('globalThis.neuraiDepinMsg exposes the IIFE surface', () => {
  const g = globalThis.neuraiDepinMsg;
  assert.ok(g, 'global missing');
  for (const name of [
    'buildDepinMessage', 'buildDepinPreimage', 'assembleDepinMessage',
    'wrapMessageForServer', 'unwrapMessageFromServer',
    'decryptDepinReceiveEncryptedPayload', 'wifToHex', 'isWIF',
    'decodeDepinReceiveResponse', 'resolveDepinRecipients'
  ]) {
    assert.equal(typeof g[name], 'function', name + ' missing from global');
  }
  assert.ok(g.utils && typeof g.utils.hexToBytes === 'function');
});

test('hex utilities behave as before (plus stricter validation)', () => {
  assert.equal(lib.bytesToHex(new Uint8Array([0, 255, 16])), '00ff10');
  assert.deepEqual(lib.hexToBytes('00ff10'), new Uint8Array([0, 255, 16]));
  assert.equal(lib.normalizeHex('0xAB'), 'ab');
  assert.equal(lib.normalizeHex('xyz'), null);
  // 2.3.0: invalid hex now throws instead of yielding NaN bytes
  assert.throws(() => lib.hexToBytes('zz'));
});

test('base58Encode handles empty and all-zero byte strings canonically', () => {
  assert.equal(lib.base58Encode(new Uint8Array()), '');
  assert.equal(lib.base58Encode(new Uint8Array([0])), '1');
  assert.equal(lib.base58Encode(new Uint8Array([0, 0])), '11');
  assert.equal(lib.base58Encode(new Uint8Array([0, 1])), '12');
});

test('WIF detection covers all Neurai prefixes', () => {
  // mainnet compressed (K/L), mainnet uncompressed (5),
  // testnet compressed (c), testnet uncompressed (9)
  assert.equal(lib.isWIF('cVpF924EspNh8KjYsfhgY96mmxvT6DgdWiTYMtMjuM74hJaU5psW'), true);
  assert.equal(lib.isWIF('92Pg46rUhgTT7romnV82iLK4tbdcdV4huFzhxjbrbbpZKQF787n'), true);
  assert.equal(lib.isWIF('not-a-wif'), false);
  assert.equal(lib.isWIF(''), false);
});
