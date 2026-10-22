import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../src/index.js';
import { context, holder, reply, mockRpc, CH, directory } from './rpc5-helpers.mjs';
test('external signer can reconstruct RPC 5 bytes; nested signing context is immutable', async () => {
  const base = await holder(),
    seen = [];
  const identity = {
    ...base,
    signMessage: (preimage, description) => {
      assert.equal(description.kind, 'rpc');
      assert.equal(lib.buildDepinRpcRequestPreimage(description), preimage);
      assert.equal(lib.depinRequestHash(description.method, description.request), description.requestHash);
      assert.throws(() => {
        description.request.args.cursor.after_seq = 999;
      });
      seen.push(description);
      return base.signMessage(preimage);
    },
  };
  const cursor = {
    version: 1,
    stream_id: '55'.repeat(32),
    after_seq: 9007199254740993n,
    scope: '&POOL',
    address: identity.address,
    from_timestamp: 0,
  };
  const rpc = mockRpc((m, r) => reply(m, r, { messages: [], has_more: false, cursor: r.args.cursor }, { identity }));
  await lib.receiveDepinMessages({ rpc, context, identity, token: '&POOL', challenge: CH, network: 'test', cursor });
  assert.equal(seen.length, 1);
  assert.equal(rpc.calls[0].params[0].args.cursor.after_seq, cursor.after_seq);
});
test('external message signer gets the exact digest; one-argument auth signers still work', async () => {
  const base = await holder();
  let seen = 0;
  const identity = {
    ...base,
    signMessage: (preimage) => base.signMessage(preimage),
    signDigest: async (digest, c) => {
      seen++;
      const parsed = await lib.assembleDepinMessage({ ...c, messageType: c.messageType }, base.signDigest(digest));
      assert.equal(lib.bytesToHex(digest), parsed.messageHashBytes);
      digest.fill(0);
      return base.signDigest(lib.hexToBytes(parsed.messageHashBytes));
    },
  };
  const rpc = mockRpc((m, r) => reply(m, r, directory([base])));
  await lib.buildDepinMessageForPool({
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
  assert.equal(seen, 1);
});
test('wrong-domain external auth signatures fail before the RPC', async () => {
  const base = await holder('ecdsa');
  const identity = { ...base, signMessage: (preimage) => lib.signRecoverableMessage(preimage, '77'.repeat(32)) };
  const rpc = mockRpc(() => assert.fail('network called'));
  await assert.rejects(lib.requestDepinChallenge({ rpc, context, identity, token: '&POOL' }), /another address\/domain/);
});
