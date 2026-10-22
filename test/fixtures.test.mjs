/**
 * Tests against fixtures produced by a real neuraid regtest node
 * (scripts/generate-fixtures.mjs). Core accepted the library-built messages,
 * so these fixtures pin serialization, hash, signature, ECIES and the RPC
 * response shapes to Core's actual behavior. Skipped when the fixture file
 * has not been generated.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lib from '../src/index.js';

const file = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'core-regtest.json');
const HAVE = existsSync(file);
const F = HAVE ? JSON.parse(readFileSync(file, 'utf8')) : null;
const opts = { skip: !HAVE && 'fixtures not generated (npm run gen-fixtures)' };

test('library hash matches the hash Core stored on submit', opts, async () => {
  for (const kind of ['group', 'private']) {
    const { built, submitResult } = F.messages[kind];
    const parsed = await lib.parseDepinMessage(built.hex);
    assert.equal(parsed.hash, built.messageHash);
    const coreHash =
      typeof submitResult === 'string' ? submitResult : (submitResult.hash ?? submitResult.messageHash ?? submitResult.result);
    if (typeof coreHash === 'string' && /^[0-9a-f]{64}$/i.test(coreHash)) {
      assert.equal(parsed.hash, coreHash.toLowerCase(), kind + ': Core stored a different hash');
    }
  }
});

test('recovery-verify accepts Core-accepted messages and recovers the sender key', opts, async () => {
  for (const kind of ['group', 'private']) {
    const parsed = await lib.parseDepinMessage(F.messages[kind].built.hex);
    const ver = await lib.verifyDepinReceivedMessage(parsed, { network: 'regtest' });
    assert.equal(ver.signatureValid, true, kind);
    assert.equal(ver.senderPubKey, F.material.sender.pubkey.toLowerCase(), kind);
  }
});

test('Core rejected what the library also rejects', opts, async () => {
  assert.equal(F.negative.tampered.rejected, true, 'Core accepted a tampered message');
  assert.equal(F.negative.legacyPreimage.rejected, true, 'Core accepted a legacy signature');

  const legacyParsed = await lib.parseDepinMessage(F.negative.legacyPreimage.hex);
  const ver = await lib.verifyDepinReceivedMessage(legacyParsed, { network: 'regtest' });
  assert.equal(ver.signatureValid, false);
});

test('depingetancestorrecipients fixture resolves through resolveDepinRecipients', opts, async () => {
  const fixture = F.ancestorRecipients;
  assert.equal(fixture.truncated, false);
  // the uncompressed holder (r2, root holder) is part of the ancestor union
  const pubkeys = fixture.recipients.map((r) => r.pubkey.toLowerCase());
  assert.ok(pubkeys.includes(F.material.r2.pubkey.toLowerCase()), 'r2 (uncompressed) missing');

  // Protocol 2: the RPC reply is a signed envelope; the pure decoder keeps
  // this fixture's coverage of the body contract.
  const res = await lib.decodeDepinRecipients(fixture, {
    token: F.tokens.section,
    poolRoot: F.tokens.root,
    maxRecipients: 20,
    senderPubKey: F.material.sender.pubkey,
    senderAddress: F.material.sender.address,
    network: 'regtest',
  });
  assert.equal(res.senderIncludedInHolders, true);
  assert.equal(res.recipientCount, fixture.recipients.length);
});

test('wrapped depinreceivemsg responses decode end to end', opts, async () => {
  const out = await lib.decodeDepinReceiveResponse(F.receive.r1.raw, {
    network: 'regtest',
    privateKey: F.material.r1.privHex,
    requestedToken: F.tokens.section,
  });
  assert.ok(
    out.messages.some((m) => !m.ok && /unsorted/.test(m.reason)),
    'old SDK group ordering is rejected',
  );
});

test('paginated wrapped response preserves has_more', opts, async () => {
  const out = await lib.decodeDepinReceiveResponse(F.receive.r1Paginated.raw, {
    network: 'regtest',
    privateKey: F.material.r1.privHex,
  });
  assert.notEqual(out.hasMore, null);
  assert.ok(out.messages.length <= 1);
});

test('plain response shapes decode identically', opts, async () => {
  const out = await lib.decodeDepinReceiveResponse(F.receive.r1.plain, {
    network: 'regtest',
    privateKey: F.material.r1.privHex,
    requestedToken: F.tokens.section,
  });
  assert.equal(out.wasEncrypted, false);
  assert.ok(out.messages.some((m) => !m.ok && /unsorted/.test(m.reason)));
});

test('uncompressed recipient decrypts private message via root scope', opts, async () => {
  const out = await lib.decodeDepinReceiveResponse(F.receive.r2Root.raw, {
    network: 'regtest',
    privateKey: F.material.r2.privHex,
    requestedToken: F.tokens.root,
  });
  const priv = out.messages.find((m) => m.ok && m.plaintext && m.plaintext.startsWith('private fixture'));
  assert.ok(priv, 'r2 could not read its private message');
  assert.equal(priv.message.messageType, 'private');
});

test('protocol-1 gateway surface is gone from the public API', opts, () => {
  assert.equal(lib.parseDepinPoolInfo, undefined);
  assert.equal(lib.getRemoteDepinPoolInfo, undefined);
  assert.equal(lib.buildDepinMessageForRemotePool, undefined);
  assert.equal(lib.isPreAuthenticatedSentinel, undefined);
});

test('historical SDK group frames with noncanonical map order are rejected', opts, async () => {
  const parsed = await lib.parseDepinMessage(F.messages.group.built.hex);
  await assert.rejects(lib.decryptDepinReceiveEncryptedPayload(parsed.encryptedPayloadHex, F.material.r1.wif), /unsorted/);
});

test('Core-produced ECIES wrapper re-serializes byte-identically', opts, () => {
  // The {encrypted} blob was serialized by Core's C++; parse it and check our
  // serializer reproduces the exact bytes.
  const raw = F.receive.r1.raw;
  if (!raw || typeof raw !== 'object' || typeof raw.encrypted !== 'string') return;
  const bytes = lib.hexToBytes(raw.encrypted);
  const parsed = lib.deserializeEciesMessage(bytes);
  assert.equal(lib.bytesToHex(lib.serializeEciesMessage(parsed)), raw.encrypted.toLowerCase());
});

test('WIF material from Core round-trips', opts, async () => {
  for (const who of ['sender', 'r1', 'r2']) {
    const m = F.material[who];
    assert.equal(lib.isWIF(m.wif), true, who + ' WIF not detected');
    assert.equal(await lib.wifToHex(m.wif), m.privHex, who + ' WIF mismatch');
  }
});
