import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../src/index.js';
import { context, pool, holder, reply, mockRpc, CH } from './rpc5-helpers.mjs';
function request(method = 'depinpoolstats') {
  return lib.createDepinRpcRequest({ method, context });
}
test('verifies before decoding; verified brand cannot be copied', async () => {
  const method = 'depinpoolstats',
    r = request(),
    response = await reply(method, r, { total_messages: 2 });
  const verified = lib.verifyDepinReply({ method, request: r, reply: response, poolPublicKey: pool.publicKey });
  assert.equal(lib.decodePlainReply(verified).total_messages, 2);
  assert.throws(() => lib.decodePlainReply({ ...verified }));
  assert.throws(() => lib.decodePlainReply(response));
  const tampered = { ...response, body: lib.bytesToHex(new TextEncoder().encode('{"total_messages": 2}')) };
  assert.throws(
    () => lib.verifyDepinReply({ method, request: r, reply: tampered, poolPublicKey: pool.publicKey }),
    lib.DepinReplyAuthenticationError,
  );
});
test('every service/request/membership/body field is covered by the reply signature', async () => {
  const method = 'depinpoolstats',
    r = request(),
    response = await reply(method, r, { ok: true });
  for (const [key, value] of Object.entries({
    protocol: 4,
    network: '99'.repeat(32),
    pool_pubkey: (await holder()).publicKey,
    pool_root: '&OTHER',
    instance_id: '99'.repeat(32),
    membership_revision: '99'.repeat(32),
    membership_height: 124,
    membership_blockhash: '99'.repeat(32),
    request_hash: '99'.repeat(32),
    body_kind: 1,
    body: '7b7d',
    poolsig: 'A'.repeat(87) + '=',
  })) {
    assert.throws(
      () => lib.verifyDepinReply({ method, request: r, reply: { ...response, [key]: value }, poolPublicKey: pool.publicKey }),
      undefined,
      key,
    );
  }
  assert.throws(() =>
    lib.verifyDepinReply({ method, request: { ...r, request_id: '99'.repeat(32) }, reply: response, poolPublicKey: pool.publicKey }),
  );
  assert.throws(() => lib.verifyDepinReply({ method: 'depinmcpstatus', request: r, reply: response, poolPublicKey: pool.publicKey }));
  for (const extra of [{ extra: 1 }, { encrypted: '7b7d' }])
    assert.throws(() => lib.verifyDepinReply({ method, request: r, reply: { ...response, ...extra }, poolPublicKey: pool.publicKey }));
});
test('invalid signature or confidentiality never reaches the opener', async () => {
  const identity = await holder(),
    base = identity.openReply;
  let opens = 0;
  identity.openReply = (hex) => {
    opens++;
    return base(hex);
  };
  const rpc = mockRpc(async (m, r) => {
    const result = await reply(m, r, { challenge: CH, expires_in: 30, type: 'receive' }, { identity });
    result.encrypted = result.encrypted.slice(0, -2) + '00';
    return result;
  });
  await assert.rejects(lib.requestDepinChallenge({ rpc, context, identity, token: '&POOL' }));
  assert.equal(opens, 0);
});
test('private replies require exactly the addressed family, even with the same curve key', async () => {
  const identity = await holder('ecdsa'),
    legacy = await holder();
  const method = 'depinchallenge',
    r = lib.createDepinRpcRequest({ method, context, token: '&POOL', address: identity.address });
  const wrong = await reply(method, r, { challenge: CH }, { identity: legacy });
  const verified = lib.verifyDepinReply({ method, request: r, reply: wrong, poolPublicKey: pool.publicKey });
  await assert.rejects(lib.openBoundReply(verified, identity.openReply), lib.DepinReplyDecryptionError);
});
test('GCM payload, key package and unrelated key fail closed', async () => {
  const identity = await holder(),
    key = lib.hexToBytes('77'.repeat(32));
  const encrypted = await lib.eciesEncrypt(new Uint8Array([1, 2, 3]), [identity.publicKey]);
  assert.equal(await lib.eciesDecrypt(encrypted, lib.hexToBytes('88'.repeat(32))), null);
  const payload = { ...encrypted, encryptedPayload: encrypted.encryptedPayload.slice() };
  payload.encryptedPayload[payload.encryptedPayload.length - 1] ^= 1;
  assert.equal(await lib.eciesDecrypt(payload, key), null);
  const packages = new Map([...encrypted.recipientKeys].map(([id, bytes]) => [id, bytes.slice()]));
  const pkg = [...packages.values()][0];
  pkg[pkg.length - 1] ^= 1;
  assert.equal(await lib.eciesDecrypt({ ...encrypted, recipientKeys: packages }, key), null);
});

test('a valid pool signature does not make duplicate JSON fields acceptable', async () => {
  const method = 'depinpoolstats',
    r = request(),
    response = await reply(method, r, {});
  response.body = lib.bytesToHex(new TextEncoder().encode('{"same":1,"same":1}'));
  response.poolsig = lib.signRecoverableMessage(
    lib.buildDepinRpcResponsePreimage({ method, reply: response, requestHash: response.request_hash }),
    '66'.repeat(32),
  );
  const verified = lib.verifyDepinReply({ method, request: r, reply: response, poolPublicKey: pool.publicKey });
  assert.throws(() => lib.decodePlainReply(verified), lib.DepinProtocolError);
});
