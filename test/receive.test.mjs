import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDepinMessage, parseDepinMessage,
  decodeDepinReceiveResponse, validateAndDecryptDepinMessage,
  decryptDepinReceivedMessage, decryptDepinReceiveEncryptedPayload,
  wrapMessageForServer, unwrapMessageFromServer,
  eciesEncrypt, serializeEciesMessage, bytesToHex, hexToBytes
} from '../src/index.js';
import { keypair, baseParams } from './helpers.mjs';

const sender = keypair('11'.repeat(32));
const B = keypair('22'.repeat(32));
const C = keypair('33'.repeat(32));

async function fixtureMessage(overrides = {}) {
  const built = await buildDepinMessage(await baseParams(overrides));
  const parsed = await parseDepinMessage(built.hex);
  return {
    hash: parsed.hash,
    token: parsed.token,
    sender: parsed.senderAddress,
    timestamp: parsed.timestamp,
    message_type: parsed.messageType,
    encrypted_payload_hex: parsed.encryptedPayloadHex,
    signature_hex: parsed.signatureHex
  };
}

test('plain array response decodes, validates, and decrypts', async () => {
  const msg = await fixtureMessage();
  const out = await decodeDepinReceiveResponse([msg], {
    network: 'test', privateKey: B.privHex, requestedToken: '&TEST'
  });
  assert.equal(out.wasEncrypted, false);
  assert.equal(out.hasMore, null);
  assert.equal(out.messages.length, 1);
  assert.equal(out.messages[0].ok, true);
  assert.equal(out.messages[0].plaintext, 'test message');
  assert.equal(out.messages[0].signatureValid, true);
});

test('paginated response preserves has_more', async () => {
  const msg = await fixtureMessage();
  const out = await decodeDepinReceiveResponse({ messages: [msg], has_more: true }, {
    network: 'test', privateKey: B.privHex
  });
  assert.equal(out.hasMore, true);
  assert.equal(out.messages[0].ok, true);

  await assert.rejects(
    decodeDepinReceiveResponse({ messages: [msg] }, { network: 'test' }),
    /missing has_more/
  );
});

test('{encrypted} wrapper is unwrapped and preserves shape', async () => {
  const msg = await fixtureMessage();
  const inner = JSON.stringify({ messages: [msg], has_more: false });
  const ecies = await eciesEncrypt(new TextEncoder().encode(inner), [hexToBytes(B.pubCompressed)]);
  const wrapped = { encrypted: bytesToHex(serializeEciesMessage(ecies)) };

  const out = await decodeDepinReceiveResponse(wrapped, { network: 'test', privateKey: B.privHex });
  assert.equal(out.wasEncrypted, true);
  assert.equal(out.hasMore, false);
  assert.equal(out.messages[0].plaintext, 'test message');

  await assert.rejects(
    decodeDepinReceiveResponse(wrapped, { network: 'test' }),
    /privateKey is required/
  );
  await assert.rejects(
    decodeDepinReceiveResponse(wrapped, { network: 'test', privateKey: C.privHex }),
    /Could not decrypt/
  );
});

test('non-recipient still validates; plaintext stays null', async () => {
  const msg = await fixtureMessage();
  const entry = await validateAndDecryptDepinMessage(msg, {
    network: 'test', privateKey: C.privHex
  });
  assert.equal(entry.ok, true);
  assert.equal(entry.signatureValid, true);
  assert.equal(entry.plaintext, null);
});

test('scope, duplicates, and limits are enforced', async () => {
  const msg = await fixtureMessage();

  const outOfScope = await validateAndDecryptDepinMessage(msg, {
    network: 'test', requestedToken: '&OTHER'
  });
  assert.equal(outOfScope.ok, false);
  assert.match(outOfScope.reason, /outside requested scope/);

  const dup = await decodeDepinReceiveResponse([msg, msg], { network: 'test', privateKey: B.privHex });
  assert.equal(dup.messages[0].ok, true);
  assert.equal(dup.messages[1].ok, false);
  assert.match(dup.messages[1].reason, /duplicate/);

  await assert.rejects(
    decodeDepinReceiveResponse([msg, msg], { network: 'test', limits: { maxMessages: 1 } }),
    /above the limit/
  );

  const tooBig = await validateAndDecryptDepinMessage(msg, {
    network: 'test', limits: { maxPayloadBytes: 10 }
  });
  assert.equal(tooBig.ok, false);
  assert.match(tooBig.reason, /exceeds limit/);
});

test('protocol-1 sentinel is ALWAYS rejected — no trust-gateway escape hatch', async () => {
  const msg = await fixtureMessage();
  const sentinel = { ...msg, signature_hex: '00'.repeat(65) };
  delete sentinel.hash;

  const rejected = await validateAndDecryptDepinMessage(sentinel, {
    network: 'test', privateKey: B.privHex
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.authentication, 'invalid');
  assert.equal(rejected.reason, 'protocol-1-preauthenticated');
  assert.equal(rejected.plaintext, null);

  // The removed policy option is inert: passing it changes nothing.
  const stillRejected = await validateAndDecryptDepinMessage(sentinel, {
    network: 'test', privateKey: B.privHex, preAuthenticatedPolicy: 'trust-gateway'
  });
  assert.equal(stillRejected.ok, false);
  assert.equal(stillRejected.reason, 'protocol-1-preauthenticated');
});

test('malformed messages are reported, not thrown', async () => {
  const bad = await validateAndDecryptDepinMessage({ token: '&TEST' }, { network: 'test' });
  assert.equal(bad.ok, false);
  assert.ok(bad.reason);

  const msg = await fixtureMessage();
  const badPayload = { ...msg, encrypted_payload_hex: 'zz' };
  delete badPayload.hash;
  const r = await validateAndDecryptDepinMessage(badPayload, { network: 'test' });
  assert.equal(r.ok, false);
});

test('unrecognized response shapes are rejected', async () => {
  await assert.rejects(decodeDepinReceiveResponse('nope', { network: 'test' }), /Unrecognized/);
  await assert.rejects(decodeDepinReceiveResponse({ foo: 1 }, { network: 'test' }), /Unrecognized/);
});

test('decryptDepinReceivedMessage is decryption-only', async () => {
  const msg = await fixtureMessage();
  const { plaintext } = await decryptDepinReceivedMessage(msg, B.privHex);
  assert.equal(plaintext, 'test message');
  const { plaintext: none } = await decryptDepinReceivedMessage(msg, C.privHex);
  assert.equal(none, null);
});

test('server wrapper round-trip, string and parsed', async () => {
  const inner = JSON.stringify([{ hello: 'world' }]);
  const serverKey = keypair('44'.repeat(32));
  const wrapped = await wrapMessageForServer(
    bytesToHex(new TextEncoder().encode('00ff')), serverKey.pubCompressed, 'tSenderAddr'
  );
  assert.equal(wrapped.sender, 'tSenderAddr');

  // Core ECIES accepts both serializations: an uncompressed server key must
  // work and be decryptable with the same private key
  const wrappedU = await wrapMessageForServer('00ff', serverKey.pubUncompressed, 'tSenderAddr');
  assert.equal(await unwrapMessageFromServer(wrappedU.encrypted, serverKey.privHex), '00ff');
  await assert.rejects(
    wrapMessageForServer('00ff', 'deadbeef', 'tSenderAddr'),
    /Invalid serverPubKeyHex/
  );

  // response direction: encrypt a JSON string to B, unwrap both ways
  const ecies = await eciesEncrypt(new TextEncoder().encode(inner), [hexToBytes(B.pubCompressed)]);
  const hex = bytesToHex(serializeEciesMessage(ecies));
  assert.equal(await unwrapMessageFromServer(hex, B.privHex), inner);
  assert.deepEqual(
    await unwrapMessageFromServer(hex, B.privHex, { parseJson: true }),
    [{ hello: 'world' }]
  );
  assert.equal(await unwrapMessageFromServer(hex, C.privHex), null);
});

test('2.2.1 compat: decryptDepinReceiveEncryptedPayload behavior', async () => {
  const msg = await fixtureMessage();
  assert.equal(await decryptDepinReceiveEncryptedPayload(msg.encrypted_payload_hex, B.privHex), 'test message');
  assert.equal(await decryptDepinReceiveEncryptedPayload(msg.encrypted_payload_hex, C.privHex), null);
  await assert.rejects(decryptDepinReceiveEncryptedPayload('not-hex', B.privHex), /Invalid/);
});
