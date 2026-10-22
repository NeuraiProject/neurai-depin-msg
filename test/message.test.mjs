import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,
  parseDepinMessage,
  verifyDepinReceivedMessage,
  hexToBytes,
  bytesToHex,
  doubleSha256,
  concatBytes,
  MAX_DEPIN_RECIPIENTS,
} from '../src/index.js';
import { isPreAuthenticatedSentinel } from '../src/message.js';
import { serializeString, serializeVector, serializeInt64 } from '../src/serialize.js';
import { keypair, addressFor, baseParams, secp256k1 } from './helpers.mjs';

const sender = keypair('11'.repeat(32));
const B = keypair('22'.repeat(32));
const C = keypair('33'.repeat(32));

function rpcShape(parsed) {
  return {
    hash: parsed.hash,
    token: parsed.token,
    sender: parsed.senderAddress,
    timestamp: parsed.timestamp,
    message_type: parsed.messageType,
    encrypted_payload_hex: parsed.encryptedPayloadHex,
    signature_hex: parsed.signatureHex,
  };
}

test('build -> parse -> recovery-verify round trip', async () => {
  const built = await buildDepinMessage(await baseParams());
  const parsed = await parseDepinMessage(built.hex);
  assert.equal(parsed.hash, built.messageHash);
  assert.equal(parsed.messageType, 'group');

  const ver = await verifyDepinReceivedMessage(rpcShape(parsed), { network: 'test' });
  assert.equal(ver.signatureValid, true);
  assert.equal(ver.authentication, 'signature');
  assert.equal(ver.senderPubKey, sender.pub);
});

test('different Legacy serializations retain distinct destination identities', async () => {
  const built = await buildDepinMessage(
    await baseParams({
      recipientPubKeys: [B.pubCompressed, B.pubUncompressed],
    }),
  );
  // Two Legacy addresses plus the sender.
  assert.equal(built.recipientCount, 3);
});

test('private messages count destination identities, including key serialization', async () => {
  await assert.rejects(
    buildDepinMessage(await baseParams({ messageType: 'private', recipientPubKeys: [B.pubCompressed, B.pubUncompressed] })),
    /allows only one recipient/,
  );
  const ok = await buildDepinMessage(await baseParams({ messageType: 'private', recipientPubKeys: [B.pubCompressed, B.pubCompressed] }));
  assert.equal(ok.recipientCount, 2);
});

test('final map limit counts the auto-included sender', async () => {
  const many = [];
  for (let i = 1; i <= MAX_DEPIN_RECIPIENTS; i++) {
    // 'a' prefix keeps these distinct from the fixed test keys (11.., 22..)
    many.push(keypair(('a' + i.toString(16).padStart(3, '0')).repeat(16)).pubCompressed);
  }
  // 50 holders where one IS the sender -> exactly 50 entries: accepted
  const withSender = [sender.pub, ...many.slice(0, MAX_DEPIN_RECIPIENTS - 1)];
  const ok = await buildDepinMessage(await baseParams({ recipientPubKeys: withSender }));
  assert.equal(ok.recipientCount, MAX_DEPIN_RECIPIENTS);

  // 50 holders, sender NOT among them -> 51 entries: rejected
  await assert.rejects(buildDepinMessage(await baseParams({ recipientPubKeys: many })), /Final recipient map/);
});

test('key coherence: privateKey<->senderPubKey<->senderAddress', async () => {
  await assert.rejects(buildDepinMessage(await baseParams({ privateKey: B.privHex })), /privateKey does not correspond/);
  await assert.rejects(buildDepinMessage(await baseParams({ senderPubKey: B.pub })), /senderPubKey does not correspond to senderAddress/);
  // address form binding: sender's address derived from the UNCOMPRESSED key
  // does not match the compressed senderPubKey
  await assert.rejects(
    buildDepinMessage(
      await baseParams({
        senderAddress: await addressFor(sender.pubUncompressed),
      }),
    ),
    /senderPubKey does not correspond to senderAddress/,
  );
});

test('uncompressed sender end-to-end', async () => {
  const addr = await addressFor(sender.pubUncompressed);
  const built = await buildDepinMessage(
    await baseParams({
      senderAddress: addr,
      senderPubKey: sender.pubUncompressed,
    }),
  );
  const parsed = await parseDepinMessage(built.hex);
  const ver = await verifyDepinReceivedMessage(rpcShape(parsed), { network: 'test' });
  assert.equal(ver.signatureValid, true);
  assert.equal(ver.senderPubKey, sender.pubUncompressed);
});

test('invalid tokens and inputs rejected at build', async () => {
  await assert.rejects(buildDepinMessage(await baseParams({ token: 'NOAMP' })), /Invalid DePIN token/);
  await assert.rejects(buildDepinMessage(await baseParams({ token: '&no' })), /Invalid DePIN token/);
  await assert.rejects(buildDepinMessage(await baseParams({ timestamp: 0 })), /Timestamp/);
  await assert.rejects(buildDepinMessage(await baseParams({ timestamp: 1.5 })), /Timestamp/);
  await assert.rejects(buildDepinMessage(await baseParams({ messageType: 'broadcast' })), /messageType/);
  await assert.rejects(buildDepinMessage(await baseParams({ recipientPubKeys: ['02deadbeef'] })), /Public key|Invalid secp256k1/);
});

test('preimage + assemble equals direct build', async () => {
  const params = await baseParams();
  const pre = await buildDepinPreimage(params);
  assert.equal(pre.messageTypeByte, 0x02);

  // external signer: sign the canonical preimage hash
  const preimage = concatBytes(
    serializeString(params.token),
    serializeString(params.senderAddress),
    serializeInt64(params.timestamp),
    new Uint8Array([pre.messageTypeByte]),
    serializeVector(hexToBytes(pre.encryptedPayloadHex)),
  );
  const hash = await doubleSha256(preimage);
  assert.deepEqual(pre.messageDigest, hash);
  assert.equal(pre.messageDigestHex, bytesToHex(hash));
  const der = secp256k1.sign(hash, sender.priv).toDERRawBytes();

  const assembled = await assembleDepinMessage(
    {
      token: params.token,
      senderAddress: params.senderAddress,
      encryptedPayloadHex: pre.encryptedPayloadHex,
      messageType: params.messageType,
      timestamp: params.timestamp,
    },
    bytesToHex(der),
  );

  const parsed = await parseDepinMessage(assembled.hex);
  const ver = await verifyDepinReceivedMessage(rpcShape(parsed), { network: 'test' });
  assert.equal(ver.signatureValid, true);

  // compact 64-byte signatures are DER-normalized
  const compactSig = secp256k1.sign(hash, sender.priv).toCompactRawBytes();
  const assembled2 = await assembleDepinMessage(
    {
      token: params.token,
      senderAddress: params.senderAddress,
      encryptedPayloadHex: pre.encryptedPayloadHex,
      messageType: params.messageType,
      timestamp: params.timestamp,
    },
    compactSig,
  );
  assert.equal(assembled2.hex, assembled.hex);

  // garbage signatures are rejected
  await assert.rejects(
    assembleDepinMessage(
      {
        token: params.token,
        senderAddress: params.senderAddress,
        encryptedPayloadHex: pre.encryptedPayloadHex,
        messageType: params.messageType,
        timestamp: params.timestamp,
      },
      'deadbeef',
    ),
    /not valid DER/,
  );
});

test('legacy preimage signature (no messageType) is rejected', async () => {
  const params = await baseParams();
  const pre = await buildDepinPreimage(params);

  const legacyPreimage = concatBytes(
    serializeString(params.token),
    serializeString(params.senderAddress),
    serializeInt64(params.timestamp),
    serializeVector(hexToBytes(pre.encryptedPayloadHex)), // NO messageType byte
  );
  const legacyHash = await doubleSha256(legacyPreimage);
  const der = secp256k1.sign(legacyHash, sender.priv).toDERRawBytes();

  const assembled = await assembleDepinMessage(
    {
      token: params.token,
      senderAddress: params.senderAddress,
      encryptedPayloadHex: pre.encryptedPayloadHex,
      messageType: params.messageType,
      timestamp: params.timestamp,
    },
    bytesToHex(der),
  );

  const parsed = await parseDepinMessage(assembled.hex);
  const ver = await verifyDepinReceivedMessage(rpcShape(parsed), { network: 'test' });
  assert.equal(ver.signatureValid, false);
  assert.equal(ver.authentication, 'invalid');
});

test('tampering is detected', async () => {
  const built = await buildDepinMessage(await baseParams());
  const parsed = await parseDepinMessage(built.hex);
  const shape = rpcShape(parsed);

  // flip the declared hash -> mismatch with computed hash
  const badHash = { ...shape, hash: shape.hash.replace(/^./, shape.hash[0] === '0' ? '1' : '0') };
  const v1 = await verifyDepinReceivedMessage(badHash, { network: 'test' });
  assert.equal(v1.signatureValid, false);
  assert.match(v1.reason, /hash field/);

  // mutate the payload -> signature no longer binds
  const badPayload = {
    ...shape,
    hash: undefined,
    encrypted_payload_hex: shape.encrypted_payload_hex.slice(0, -2) + 'ff',
  };
  const v2 = await verifyDepinReceivedMessage(badPayload, { network: 'test' });
  assert.equal(v2.signatureValid, false);
});

test('pre-authenticated sentinel is detected exactly', async () => {
  assert.equal(isPreAuthenticatedSentinel(new Uint8Array(65)), true);
  assert.equal(isPreAuthenticatedSentinel(new Uint8Array(64)), false);
  const nearly = new Uint8Array(65);
  nearly[64] = 1;
  assert.equal(isPreAuthenticatedSentinel(nearly), false);

  const built = await buildDepinMessage(await baseParams());
  const parsed = await parseDepinMessage(built.hex);
  const shape = { ...rpcShape(parsed), signature_hex: '00'.repeat(65) };
  delete shape.hash;
  const ver = await verifyDepinReceivedMessage(shape, { network: 'test' });
  assert.equal(ver.authentication, 'gateway-preauthenticated');
  assert.equal(ver.signatureValid, false);
});

test('supplied sender key is bound to the address before use', async () => {
  const built = await buildDepinMessage(await baseParams());
  const parsed = await parseDepinMessage(built.hex);
  const shape = rpcShape(parsed);

  const ok = await verifyDepinReceivedMessage(shape, { network: 'test', senderPubKey: sender.pub });
  assert.equal(ok.signatureValid, true);

  const wrong = await verifyDepinReceivedMessage(shape, { network: 'test', senderPubKey: B.pub });
  assert.equal(wrong.signatureValid, false);
  assert.match(wrong.reason, /does not match sender address/);

  const resolved = await verifyDepinReceivedMessage(shape, {
    network: 'test',
    resolveSenderPubKey: async () => sender.pub,
  });
  assert.equal(resolved.signatureValid, true);
});

test('network is required and enforced', async () => {
  const built = await buildDepinMessage(await baseParams());
  const parsed = await parseDepinMessage(built.hex);
  await assert.rejects(verifyDepinReceivedMessage(rpcShape(parsed), {}), /network is required/);

  // 't' address is not valid under mainnet
  const ver = await verifyDepinReceivedMessage(rpcShape(parsed), { network: 'mainnet' });
  assert.equal(ver.signatureValid, false);
  assert.match(ver.reason, /address/);

  for (const n of ['test', 'testnet', 'regtest']) {
    const v = await verifyDepinReceivedMessage(rpcShape(parsed), { network: n });
    assert.equal(v.signatureValid, true, n);
  }
});

test('parse rejects malformed messages', async () => {
  const built = await buildDepinMessage(await baseParams());
  await assert.rejects(parseDepinMessage(built.hex + '00'), /trailing/);
  await assert.rejects(parseDepinMessage(built.hex.slice(0, 40)), /truncated|out of bounds/i);

  // corrupt the messageType byte (position: after token+sender+timestamp)
  const parsed = await parseDepinMessage(built.hex);
  const bytes = hexToBytes(built.hex);
  const tokenLen = 1 + parsed.token.length;
  const senderLen = 1 + parsed.senderAddress.length;
  const typeOffset = tokenLen + senderLen + 8;
  bytes[typeOffset] = 0x03;
  await assert.rejects(parseDepinMessage(bytesToHex(bytes)), /Invalid messageType/);
});
