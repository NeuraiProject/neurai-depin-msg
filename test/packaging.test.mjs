/**
 * Packaging contract: the exports map must keep 2.2.1 consumers working.
 * Uses Node's package self-reference to resolve exactly what npm consumers
 * would get.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('root require resolves to the CJS bundle', () => {
  const m = require('@neuraiproject/neurai-depin-msg');
  assert.equal(typeof m.buildDepinMessage, 'function');
  assert.equal(typeof m.decodeDepinReceiveResponse, 'function');
});

test('root import resolves to the ESM bundle', async () => {
  const m = await import('@neuraiproject/neurai-depin-msg');
  assert.equal(typeof m.buildDepinMessage, 'function');
  assert.equal(typeof m.resolveDepinRecipients, 'function');
});

test('legacy dist subpaths stay importable (2.2.1 compat)', () => {
  // 2.2.1 docs pointed at the dist files directly; the exports map must not
  // break those deep imports (ERR_PACKAGE_PATH_NOT_EXPORTED).
  const saved = globalThis.neuraiDepinMsg;
  delete globalThis.neuraiDepinMsg;
  try {
    require('@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.min.js');
    assert.ok(globalThis.neuraiDepinMsg, 'IIFE global not set by min bundle');
    delete globalThis.neuraiDepinMsg;
    require('@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.js');
    assert.ok(globalThis.neuraiDepinMsg, 'IIFE global not set by dev bundle');
    require.resolve('@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.cjs');
    require.resolve('@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.mjs');
    require.resolve('@neuraiproject/neurai-depin-msg/package.json');
  } finally {
    globalThis.neuraiDepinMsg = saved;
  }
});
