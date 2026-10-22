import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../src/index.js';
import { context, pool, holder, reply, mockRpc, CH, bootstrapBody, directory } from './rpc5-helpers.mjs';
for (const family of ['legacy', 'ecdsa']) {
  test(`${family}: challenge, sequence pages, exact cursor, fresh ids and private sections`, async () => {
    const identity = await holder(family);
    const requests = [];
    const rpc = mockRpc(async (method, r) => {
      requests.push(r);
      assert.equal(r.protocol, 5);
      assert.equal(
        await lib.pubKeyMatchesAddress(
          lib.hexToBytes(
            lib.recoverPublicKeyFromMessage(lib.buildDepinRpcRequestPreimage({ method, request: r }), r.signature, identity.address),
          ),
          identity.address,
        ),
        true,
      );
      const body =
        method === 'depinchallenge'
          ? { challenge: CH, expires_in: 30, type: 'receive' }
          : method === 'depinlistsections'
            ? { sections: [{ name: '&POOL/NEWS' }], next_challenge: CH, next_expires_in: 300 }
            : {
                messages: [],
                has_more: false,
                next_challenge: CH,
                next_expires_in: 300,
                cursor: {
                  version: 1,
                  stream_id: '55'.repeat(32),
                  after_seq: 9007199254740993n,
                  scope: r.token,
                  address: r.address,
                  from_timestamp: r.args.from_timestamp,
                },
              };
      return reply(method, r, body, { identity });
    });
    const challenge = await lib.requestDepinChallenge({ rpc, context, identity, token: '&POOL/NEWS' });
    assert.equal(challenge.challenge, CH);
    const page = await lib.receiveDepinMessages({ rpc, context, identity, token: '&POOL/NEWS', challenge: CH, network: 'test' });
    assert.equal(page.cursor.after_seq, 9007199254740993n);
    assert.equal(page.hasMore, false);
    await lib.receiveDepinMessages({ rpc, context, identity, token: '&POOL/NEWS', challenge: CH, network: 'test', cursor: page.cursor });
    assert.equal(requests[2].args.cursor.after_seq, 9007199254740993n);
    assert.equal(new Set(requests.map((r) => r.request_id)).size, 3);
    const sections = await lib.listDepinSectionsPrivate({ rpc, context, identity, scope: '&POOL/NEWS', challenge: CH });
    assert.equal(sections.sections.length, 1);
  });
  test(`${family}: recipient directory -> local encryption/signing -> authenticated submission`, async () => {
    const identity = await holder(family),
      recipient = await holder(family, '88'.repeat(32));
    const rpc = mockRpc(async (method, r) => {
      if (method === 'depingetancestorrecipients') return reply(method, r, directory([identity, recipient]));
      assert.equal(method, 'depinsubmitmsg');
      assert.equal(r.token, '');
      assert.equal(r.address, identity.address);
      const outer = lib.deserializeEciesMessage(lib.hexToBytes(r.args.encrypted));
      const inner = await lib.eciesDecrypt(outer, lib.hexToBytes('66'.repeat(32)), pool.address);
      const parsed = await lib.parseDepinMessage(new TextDecoder().decode(inner));
      assert.equal((await lib.verifyDepinReceivedMessage(parsed, { network: 'test' })).signatureValid, true);
      assert.equal(await lib.decryptDepinReceiveEncryptedPayload(parsed.encryptedPayloadHex, '88'.repeat(32)), 'hello');
      return reply(method, r, { result: 'success', hash: parsed.hash }, { identity });
    });
    const built = await lib.buildDepinMessageForPool({
      rpc,
      context,
      identity,
      token: '&POOL/NEWS',
      poolRoot: '&POOL',
      maxRecipients: 20,
      network: 'test',
      message: 'hello',
      timestamp: 1700000000,
      messageType: 'group',
    });
    assert.equal(built.recipientCount, 2);
    const receipt = await lib.submitDepinMessage({ rpc, context: built.context, identity, messageHex: built.hex });
    assert.equal(receipt.hash, built.messageHash);
  });
}
test('bootstrap pins genesis, key and root; TOFU is explicit and RPC2 has no fallback', async () => {
  const rpc = mockRpc((m, r) => reply(m, r, bootstrapBody()));
  const result = await lib.getDepinPoolInfo({ rpc, serviceId: 'service', trust: { mode: 'tofu' }, network: 'test' });
  assert.equal(result.context.pool_pubkey, pool.publicKey);
  assert.equal(result.pin.network, context.network);
  await lib.getDepinPoolInfo({ rpc, serviceId: 'service', trust: { mode: 'pinned', pin: result.pin }, network: 'test' });
  await assert.rejects(lib.getDepinPoolInfo({ rpc, serviceId: 'service', trust: { mode: 'tofu' }, network: 'mainnet' }), /network|genesis/);
  await assert.rejects(
    lib.getDepinPoolInfo({ rpc, serviceId: 'other', trust: { mode: 'pinned', pin: result.pin }, network: 'test' }),
    /service/,
  );
  const old = mockRpc(() => ({ body: '7b7d', poolsig: 'x' }));
  await assert.rejects(lib.getDepinPoolInfo({ rpc: old, serviceId: 'service', trust: { mode: 'tofu' }, network: 'test' }));
  assert.equal(old.calls.length, 1);
});
test('signed membership change yields actionable error and never retries a write', async () => {
  const identity = await holder();
  const served = { ...context, membership_revision: '99'.repeat(32) };
  const rpc = mockRpc((m, r) =>
    reply(
      m,
      r,
      {
        error: {
          code: -32600,
          message: 'Membership changed',
          data: { depin_error: 'membership_stale', refresh_recipients: true, renew_challenge: true },
        },
      },
      { identity, served },
    ),
  );
  await assert.rejects(
    lib.clearDepinMessages({ rpc, context, identity, scope: '', challenge: CH, mode: 'all' }),
    (e) =>
      e instanceof lib.DepinRpcError && e.depinError === 'membership_stale' && e.context.membership_revision === served.membership_revision,
  );
  assert.equal(rpc.calls.length, 1);
});
test('directory cannot merge Legacy and strict identities of the same key', async () => {
  const legacy = await holder(),
    strict = await holder('ecdsa');
  const result = await lib.decodeDepinRecipients(directory([legacy, strict]), {
    token: '&POOL/NEWS',
    poolRoot: '&POOL',
    maxRecipients: 2,
    senderPubKey: legacy.publicKey,
    senderAddress: legacy.address,
    network: 'test',
  });
  assert.equal(result.recipientCount, 2);
  assert.equal(result.recipientPubKeys.length, 2);
  for (const bad of [
    { ...directory([legacy]), truncated: true },
    { ...directory([legacy]), stop_at: '&OTHER' },
    directory([{ ...legacy, address: strict.address, publicKey: (await holder('legacy', '88'.repeat(32))).publicKey }]),
  ])
    await assert.rejects(
      lib.decodeDepinRecipients(bad, {
        token: '&POOL/NEWS',
        poolRoot: '&POOL',
        maxRecipients: 20,
        senderPubKey: legacy.publicKey,
        senderAddress: legacy.address,
        network: 'test',
      }),
    );
});
test('malformed input and missing capabilities fail before network access', async () => {
  const identity = await holder(),
    rpc = mockRpc(() => assert.fail('RPC was called'));
  await assert.rejects(
    lib.requestDepinChallenge({ rpc, context, identity: { address: identity.address }, token: '&POOL' }),
    lib.DepinCapabilityError,
  );
  await assert.rejects(lib.receiveDepinMessages({ rpc, context, identity, token: '&POOL', challenge: CH, network: 'test', limit: 1001 }));
  await assert.rejects(
    lib.receiveDepinMessages({
      rpc,
      context,
      identity,
      token: '&POOL',
      challenge: CH,
      network: 'test',
      cursor: {
        version: 1,
        stream_id: '55'.repeat(32),
        after_seq: 9007199254740992,
        scope: '&POOL',
        address: identity.address,
        from_timestamp: 0,
      },
    }),
  );
  await assert.rejects(lib.clearDepinMessages({ rpc, context, identity, scope: '&POOL', challenge: CH, mode: -1 }));
});
test('explicit private selection works in a directory larger than the message recipient limit', async () => {
  const identity = await holder(),
    target = await holder('ecdsa', '88'.repeat(32)),
    third = await holder('legacy', '99'.repeat(32));
  const rpc = mockRpc((m, r) => reply(m, r, directory([identity, target, third])));
  const params = {
    rpc,
    context,
    identity,
    token: '&POOL/NEWS',
    poolRoot: '&POOL',
    maxRecipients: 2,
    network: 'test',
    message: 'private',
    timestamp: 1700000000,
    messageType: 'private',
  };
  const built = await lib.buildDepinMessageForPool({ ...params, selectedAddresses: [target.address] });
  assert.equal(built.recipientCount, 2);
  assert.equal(rpc.calls[0].params[0].args.max_results, 10000);
  const encrypted = lib.deserializeEciesMessage(lib.hexToBytes((await lib.parseDepinMessage(built.hex)).encryptedPayloadHex));
  assert.equal(encrypted.recipientKeys.size, 2);
  assert.equal(await lib.eciesDecrypt(encrypted, lib.hexToBytes('99'.repeat(32))), null);
  await assert.rejects(lib.buildDepinMessageForPool(params), /recipient map/);
  await assert.rejects(lib.buildDepinMessageForPool({ ...params, selectedAddresses: ['not-listed'] }), /not an eligible/);
});
