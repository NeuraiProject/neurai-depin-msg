/**
 * Reply-envelope verification against the official vectors (§13.3–13.6) and
 * the complete §13.7 negative table (N1–N8).
 *
 * N3–N5 run at TWO levels (plan v2 §6.1): in the public flow, mutating
 * `encrypted` invalidates `poolsig` first — that asserts the production
 * order; and directly against the ECIES primitives
 * (deserializeEciesMessage/eciesDecrypt), which is where the GCM tags and
 * the missing-recipient path are actually exercised. Tests never fabricate
 * a VerifiedReply by hand: a tampered reply cannot legitimately obtain that
 * brand.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  verifyDepinReply,
  decodePlainReply,
  openBoundReply,
  decodeDepinPoolInfo,
  buildDepinReplyPreimage,
  poolKeyFingerprint,
  isVerifiedDepinReply
} from '../src/depin-reply.js';
import {
  DepinProtocolError,
  DepinReplyAuthenticationError,
  DepinReplyDecryptionError,
  PoolPinMismatchError
} from '../src/errors.js';
import { base64Decode, base64Encode } from '../src/signmessage.js';
import { deserializeEciesMessage, eciesDecrypt } from '../src/ecies.js';
import { hexToBytes, bytesToHex } from '../src/bytes.js';
import { wifToHex } from '../src/keys.js';
import { decodeDepinReceiveResponse } from '../src/receive.js';
import { verifyDepinReceivedMessage } from '../src/message.js';

const raw = readFileSync(
  fileURLToPath(new URL('./fixtures/protocol2-vectors.txt', import.meta.url)),
  'utf8'
);
const V = Object.fromEntries(
  raw.split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);

const SERVICE = 'https://pool.example/rpc';
const infoReply = () => ({ body: V.info_body, poolsig: V.info_poolsig });
const challengeReply = () => ({ encrypted: V.challenge_encrypted, poolsig: V.challenge_poolsig });
const receiveReply = () => ({ encrypted: V.receive_encrypted, poolsig: V.receive_poolsig });
const receive2Reply = () => ({ encrypted: V.receive2_encrypted, poolsig: V.receive2_poolsig });

function xorByteInBase64(b64, index) {
  const bytes = base64Decode(b64);
  bytes[index] ^= 0x01;
  return base64Encode(bytes);
}
function xorByteInHex(hex, byteIndex) {
  const bytes = hexToBytes(hex);
  bytes[byteIndex] ^= 0x01;
  return bytesToHex(bytes);
}

// --- §13.3 -------------------------------------------------------------------

test('§13.3: depingetmsginfo poolsig verifies and the body decodes', () => {
  const verified = verifyDepinReply({
    reply: infoReply(), method: 'depingetmsginfo', token: '&TEST',
    poolPublicKey: V.pool_pubkey
  });
  assert.equal(isVerifiedDepinReply(verified), true);
  const info = decodePlainReply(verified);
  assert.equal(info.protocol, 2);
  assert.equal(info.token, '&TEST');
  assert.equal(info.depinpoolpkey, V.pool_pubkey);
  assert.equal(info.depinpoolkeyaddress, V.pool_address);
});

test('decodeDepinPoolInfo: pinned, key-only and TOFU modes agree on the pin', async () => {
  const pinned = await decodeDepinPoolInfo({
    reply: infoReply(), serviceId: SERVICE, network: 'test',
    trust: { mode: 'pinned', pin: { serviceId: SERVICE, poolRoot: '&TEST', poolPublicKey: V.pool_pubkey } }
  });
  const keyOnly = await decodeDepinPoolInfo({
    reply: infoReply(), serviceId: SERVICE, network: 'test',
    trust: { mode: 'key', poolPublicKey: V.pool_pubkey }
  });
  const tofu = await decodeDepinPoolInfo({
    reply: infoReply(), serviceId: SERVICE, network: 'test',
    trust: { mode: 'tofu' }
  });
  for (const r of [pinned, keyOnly, tofu]) {
    assert.deepEqual(r.pin, { serviceId: SERVICE, poolRoot: '&TEST', poolPublicKey: V.pool_pubkey });
    assert.equal(r.info.maxrecipients, 20);
  }
  assert.equal(pinned.trust, 'pinned');
  assert.equal(keyOnly.trust, 'key');
  assert.equal(tofu.trust, 'tofu');
  assert.equal(tofu.fingerprint, poolKeyFingerprint(V.pool_pubkey));
});

test('decodeDepinPoolInfo: a different serviceId than the pin fails before trusting', async () => {
  await assert.rejects(
    decodeDepinPoolInfo({
      reply: infoReply(), serviceId: 'https://otro.example/rpc', network: 'test',
      trust: { mode: 'pinned', pin: { serviceId: SERVICE, poolRoot: '&TEST', poolPublicKey: V.pool_pubkey } }
    }),
    PoolPinMismatchError
  );
});

test('decodeDepinPoolInfo: a pinned root that does not match fails poolsig (binding)', async () => {
  await assert.rejects(
    decodeDepinPoolInfo({
      reply: infoReply(), serviceId: SERVICE, network: 'test',
      trust: { mode: 'pinned', pin: { serviceId: SERVICE, poolRoot: '&OTRA', poolPublicKey: V.pool_pubkey } }
    }),
    DepinReplyAuthenticationError
  );
});

// --- §13.4 / §13.5 -----------------------------------------------------------

test('§13.4: challenge bound reply verifies, opens with the holder WIF', async () => {
  const verified = verifyDepinReply({
    reply: challengeReply(), method: 'depinchallenge',
    token: '&TEST/SEC', address: V.holder_address, challenge: '',
    poolPublicKey: V.pool_pubkey
  });
  const opened = await openBoundReply(verified, V.holder_wif);
  assert.deepEqual(opened, JSON.parse(V.challenge_plain));
  assert.equal(opened.challenge, V.receive_nonce);
});

test('§13.4: openBoundReply works with an external OpenReply callback', async () => {
  const verified = verifyDepinReply({
    reply: challengeReply(), method: 'depinchallenge',
    token: '&TEST/SEC', address: V.holder_address, challenge: '',
    poolPublicKey: V.pool_pubkey
  });
  const privHex = await wifToHex(V.holder_wif);
  const opener = async (encryptedHex) => {
    const msg = deserializeEciesMessage(hexToBytes(encryptedHex));
    const out = await eciesDecrypt(msg, hexToBytes(privHex));
    assert.notEqual(out, null);
    return out;
  };
  const opened = await openBoundReply(verified, opener);
  assert.deepEqual(opened, JSON.parse(V.challenge_plain));
});

test('§13.5: receive bound reply (empty pool) opens and exposes next_challenge', async () => {
  const verified = verifyDepinReply({
    reply: receiveReply(), method: 'depinreceivemsg',
    token: '&TEST/SEC', address: V.holder_address, challenge: V.receive_nonce,
    poolPublicKey: V.pool_pubkey
  });
  const opened = await openBoundReply(verified, V.holder_wif);
  assert.deepEqual(opened, JSON.parse(V.receive_plain));
  assert.equal(opened.messages.length, 0);
  assert.equal(opened.has_more, false);
  assert.match(opened.next_challenge, /^[0-9a-f]{64}$/);
  assert.equal(opened.next_expires_in, 300);
});

// --- §13.6 -------------------------------------------------------------------

test('§13.6: the vector message validates, verifies and decrypts end to end', async () => {
  const verified = verifyDepinReply({
    reply: receive2Reply(), method: 'depinreceivemsg',
    token: '&TEST/SEC', address: V.holder_address, challenge: V.receive2_nonce,
    poolPublicKey: V.pool_pubkey
  });
  const opened = await openBoundReply(verified, V.holder_wif);
  assert.equal(opened.messages.length, 1);

  const { messages } = await decodeDepinReceiveResponse(opened, {
    network: 'test',
    privateKey: V.holder_wif,
    requestedToken: '&TEST/SEC',
    resolveSenderPubKey: async () => V.sender_pubkey
  });
  assert.equal(messages.length, 1);
  const m = messages[0];
  assert.equal(m.ok, true);
  assert.equal(m.hash, opened.messages[0].hash);
  assert.equal(m.plaintext, 'Hello from the spec');
});

// --- §13.7 negatives ---------------------------------------------------------

test('N1: poolsig with one bit flipped inside s → authentication error', () => {
  const reply = infoReply();
  reply.poolsig = xorByteInBase64(reply.poolsig, 40);
  assert.throws(
    () => verifyDepinReply({
      reply, method: 'depingetmsginfo', token: '&TEST', poolPublicKey: V.pool_pubkey
    }),
    DepinReplyAuthenticationError
  );
});

test('N2: re-serialized JSON (sorted keys) breaks the signature — never re-serialize', () => {
  const original = JSON.parse(
    new TextDecoder().decode(hexToBytes(V.info_body))
  );
  const sorted = {};
  for (const k of Object.keys(original).sort()) sorted[k] = original[k];
  const reBody = bytesToHex(new TextEncoder().encode(JSON.stringify(sorted)));
  assert.notEqual(reBody, V.info_body);
  assert.throws(
    () => verifyDepinReply({
      reply: { body: reBody, poolsig: V.info_poolsig },
      method: 'depingetmsginfo', token: '&TEST', poolPublicKey: V.pool_pubkey
    }),
    DepinReplyAuthenticationError
  );
});

test('N3 (flow): tampered encrypted invalidates poolsig before AES-GCM runs', () => {
  const reply = challengeReply();
  reply.encrypted = xorByteInHex(reply.encrypted, reply.encrypted.length / 2 - 1);
  assert.throws(
    () => verifyDepinReply({
      reply, method: 'depinchallenge', token: '&TEST/SEC',
      address: V.holder_address, challenge: '', poolPublicKey: V.pool_pubkey
    }),
    DepinReplyAuthenticationError
  );
});

test('N3 (primitive): outer GCM tag flipped → eciesDecrypt yields no plaintext', async () => {
  const mutated = xorByteInHex(V.challenge_encrypted, V.challenge_encrypted.length / 2 - 1);
  const msg = deserializeEciesMessage(hexToBytes(mutated));
  const privHex = await wifToHex(V.holder_wif);
  assert.equal(await eciesDecrypt(msg, hexToBytes(privHex)), null);
});

test('N4 (primitive): recipient package tag flipped → reject before touching payload', async () => {
  const msg = deserializeEciesMessage(hexToBytes(V.challenge_encrypted));
  const [keyId, pkg] = msg.recipientKeys.entries().next().value;
  const mutatedPkg = pkg.slice();
  mutatedPkg[mutatedPkg.length - 1] ^= 0x01;
  msg.recipientKeys.set(keyId, mutatedPkg);
  const privHex = await wifToHex(V.holder_wif);
  assert.equal(await eciesDecrypt(msg, hexToBytes(privHex)), null);
});

test('N5 (primitive): a key without a recipientKeys entry cannot decrypt', async () => {
  // The §13.5 vector's sender WIF is not published; any other valid key
  // exercises the same path: no entry for its hash160 → null.
  const otherKey = new Uint8Array(32).fill(7);
  const msg = deserializeEciesMessage(hexToBytes(V.challenge_encrypted));
  assert.equal(await eciesDecrypt(msg, otherKey), null);
});

test('N5 (flow): openBoundReply with the wrong key → DepinReplyDecryptionError', async () => {
  const verified = verifyDepinReply({
    reply: challengeReply(), method: 'depinchallenge',
    token: '&TEST/SEC', address: V.holder_address, challenge: '',
    poolPublicKey: V.pool_pubkey
  });
  await assert.rejects(
    openBoundReply(verified, bytesToHex(new Uint8Array(32).fill(7))),
    DepinReplyDecryptionError
  );
});

test('N6: message signature_hex flipped → dropped by validation', async () => {
  const message = JSON.parse(V.receive2_plain).messages[0];
  message.signature_hex = xorByteInHex(
    message.signature_hex, message.signature_hex.length / 2 - 1
  );
  const result = await verifyDepinReceivedMessage(message, {
    network: 'test', senderPubKey: V.sender_pubkey
  });
  assert.equal(result.signatureValid, false);
});

test('N7: field changed with original hash and signature → hash mismatch', async () => {
  const message = JSON.parse(V.receive2_plain).messages[0];
  message.timestamp = message.timestamp + 1;
  const result = await verifyDepinReceivedMessage(message, {
    network: 'test', senderPubKey: V.sender_pubkey
  });
  assert.equal(result.signatureValid, false);
  assert.match(result.reason, /hash/i);
});

test('N8: §13.5 poolsig checked against the §13.4 preimage (empty challenge) → reject', () => {
  assert.throws(
    () => verifyDepinReply({
      reply: receiveReply(), method: 'depinchallenge',
      token: '&TEST/SEC', address: V.holder_address, challenge: '',
      poolPublicKey: V.pool_pubkey
    }),
    DepinReplyAuthenticationError
  );
});

// --- structural and brand guarantees ----------------------------------------

test('reply shape: both/neither body-encrypted, missing poolsig, bad hex → protocol error', () => {
  const cases = [
    { body: V.info_body, encrypted: V.challenge_encrypted, poolsig: V.info_poolsig },
    { poolsig: V.info_poolsig },
    { body: V.info_body },
    { body: V.info_body.toUpperCase(), poolsig: V.info_poolsig },
    { body: V.info_body.slice(0, -1), poolsig: V.info_poolsig },
    null,
    []
  ];
  for (const reply of cases) {
    assert.throws(
      () => verifyDepinReply({
        reply, method: 'depingetmsginfo', token: '&TEST', poolPublicKey: V.pool_pubkey
      }),
      DepinProtocolError
    );
  }
});

test('decoders refuse unbranded objects — the brand cannot be faked from outside', async () => {
  const fake = {
    kind: 'plain', replyHex: V.info_body, method: 'depingetmsginfo',
    token: '&TEST', address: '', challenge: ''
  };
  assert.throws(() => decodePlainReply(fake), DepinProtocolError);
  await assert.rejects(
    openBoundReply({ ...fake, kind: 'bound', replyHex: V.challenge_encrypted }, V.holder_wif),
    DepinProtocolError
  );

  const genuine = verifyDepinReply({
    reply: infoReply(), method: 'depingetmsginfo', token: '&TEST',
    poolPublicKey: V.pool_pubkey
  });
  assert.equal(Object.getOwnPropertySymbols(genuine).length, 0);
  const clone = {
    ...genuine,
    replyHex: bytesToHex(new TextEncoder().encode('{"attacker":true}'))
  };
  assert.equal(isVerifiedDepinReply(clone), false);
  assert.throws(() => decodePlainReply(clone), DepinProtocolError);
});

test('Protocol 2 rejects uncompressed signature headers and oversized poolsig before recovery', () => {
  const uncompressedHeader = base64Decode(V.info_poolsig);
  uncompressedHeader[0] -= 4; // 31..34 -> 27..30, same r/s and recovery id
  assert.throws(() => verifyDepinReply({
    reply: { body: V.info_body, poolsig: base64Encode(uncompressedHeader) },
    method: 'depingetmsginfo', token: '&TEST', poolPublicKey: V.pool_pubkey
  }), /compressed key/);

  assert.throws(() => verifyDepinReply({
    reply: { body: V.info_body, poolsig: 'A'.repeat(1024 * 1024) },
    method: 'depingetmsginfo', token: '&TEST', poolPublicKey: V.pool_pubkey
  }), /exactly 88/);
});

test('preimage builder rejects ambiguous components', () => {
  assert.throws(
    () => buildDepinReplyPreimage({ method: 'depinreceivemsg', token: 'a|b', replyHex: 'aa' }),
    DepinProtocolError
  );
  assert.throws(
    () => buildDepinReplyPreimage({ method: 'DEPINX', token: '&TEST', replyHex: 'aa' }),
    DepinProtocolError
  );
});
