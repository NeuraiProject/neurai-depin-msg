/**
 * Signing contexts handed to external signers (3.1.0, additive).
 *
 * Every high-level flow passes the structured context alongside the
 * preimage/digest, so a hardware wallet can REBUILD what it is about to sign
 * instead of trusting an opaque string. The contract these tests pin down:
 *
 *   - rebuilding from the context reproduces the preimage/digest EXACTLY;
 *   - one-argument signers keep working (the parameter is additive);
 *   - the context never replaces the preimage: mutating it must not change
 *     what the flow actually sent.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  requestDepinChallenge, receiveDepinMessages, listDepinSectionsPrivate,
  clearDepinMessages, buildDepinMessageForPool,
  buildDepinRequestPreimage, buildDepinGetPreimage, buildDepinClearPreimage,
  buildDepinReplyPreimage,
  signRecoverableMessage, createSoftwareIdentity,
  eciesEncrypt, serializeEciesMessage,
  bytesToHex, hexToBytes
} from '../src/index.js';
import { keypair, addressFor } from './helpers.mjs';

const POOL = keypair('66'.repeat(32));
const HOLDER = keypair('77'.repeat(32));
const B = keypair('22'.repeat(32));
const CH = 'ab'.repeat(32);

function signReply(method, token, address, challenge, replyHex) {
  return signRecoverableMessage(
    buildDepinReplyPreimage({ method, token, address, challenge, replyHex }),
    POOL.privHex
  );
}
function plainReply(method, token, bodyObj) {
  const body = bytesToHex(new TextEncoder().encode(JSON.stringify(bodyObj)));
  return { body, poolsig: signReply(method, token, '', '', body) };
}
async function boundReply(method, token, address, challenge, resultObj, recipientPub) {
  const ecies = await eciesEncrypt(
    new TextEncoder().encode(JSON.stringify(resultObj)), [hexToBytes(recipientPub)]
  );
  const encrypted = bytesToHex(serializeEciesMessage(ecies));
  return { encrypted, poolsig: signReply(method, token, address, challenge, encrypted) };
}
function mockRpc(responder) {
  const calls = [];
  return { calls, rpc: { call: async (m, p) => { calls.push({ method: m, params: p }); return responder(m, p); } } };
}

/** Identity that records (preimage, context) pairs and still signs for real. */
async function recordingIdentity() {
  const base = await createSoftwareIdentity({ privateKey: HOLDER.privHex, network: 'test' });
  const seen = { messages: [], digests: [] };
  return {
    identity: {
      ...base,
      signMessage: (preimage, context) => {
        seen.messages.push({ preimage, context });
        return base.signMessage(preimage);
      },
      signDigest: (digest, context) => {
        seen.digests.push({ digest: bytesToHex(digest), context });
        return base.signDigest(digest);
      }
    },
    seen,
    base
  };
}

test('requestDepinChallenge passes a request context that rebuilds the preimage', async () => {
  const { identity, seen, base } = await recordingIdentity();
  const { rpc } = mockRpc((m, p) =>
    boundReply('depinchallenge', p[0], p[1], '',
      { challenge: CH, expires_in: 30, type: 'receive' }, base.publicKey)
  );
  await requestDepinChallenge({
    rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
  });

  assert.equal(seen.messages.length, 1);
  const { preimage, context } = seen.messages[0];
  assert.equal(context.kind, 'request');
  assert.equal(context.type, 'receive');
  assert.equal(context.token, '&POOL/NEWS');
  assert.equal(context.address, base.address);
  assert.equal(typeof context.timestampMs, 'number');
  // The whole point: the context alone reproduces the signed bytes.
  assert.equal(buildDepinRequestPreimage(context), preimage);
});

test('receiveDepinMessages passes a get context that rebuilds the preimage', async () => {
  const { identity, seen, base } = await recordingIdentity();
  const { rpc } = mockRpc((m, p) =>
    boundReply('depinreceivemsg', p[0], p[1], p[2],
      { messages: [], has_more: false }, base.publicKey)
  );
  await receiveDepinMessages({
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test'
  });

  const { preimage, context } = seen.messages[0];
  assert.equal(context.kind, 'get');
  assert.deepEqual(
    { token: context.token, address: context.address, challenge: context.challenge },
    { token: '&POOL/NEWS', address: base.address, challenge: CH }
  );
  assert.equal(buildDepinGetPreimage(context), preimage);
});

test('listDepinSectionsPrivate passes a get context bound to the scope', async () => {
  const { identity, seen, base } = await recordingIdentity();
  const { rpc } = mockRpc((m, p) =>
    boundReply('depinlistsections', p[1], p[0], p[2], { sections: [] }, base.publicKey)
  );
  await listDepinSectionsPrivate({
    rpc, identity, scope: '&POOL/NEWS', challenge: CH, poolPublicKey: POOL.pubCompressed
  });

  const { preimage, context } = seen.messages[0];
  assert.equal(context.kind, 'get');
  assert.equal(context.token, '&POOL/NEWS');
  assert.equal(buildDepinGetPreimage(context), preimage);
});

test("clearDepinMessages passes the RESOLVED scope in the context, not ''", async () => {
  const { identity, seen, base } = await recordingIdentity();
  const { rpc } = mockRpc((m, p) =>
    boundReply('depinclearmsg', '&POOL', p[1], p[2], { removed: 0, remaining: 0 }, base.publicKey)
  );
  await clearDepinMessages({
    rpc, identity, scope: '', poolRoot: '&POOL', challenge: CH,
    poolPublicKey: POOL.pubCompressed, mode: 'all'
  });

  const { preimage, context } = seen.messages[0];
  assert.equal(context.kind, 'clear');
  // The RPC still receives '', but the signature (and the context) carry the
  // resolved pool root — a device must see what it is really authorising.
  assert.equal(context.scope, '&POOL');
  assert.equal(buildDepinClearPreimage(context), preimage);
});

test('buildDepinMessageForPool passes a message context that rebuilds the digest', async () => {
  const { identity, seen, base } = await recordingIdentity();
  const body = {
    token: '&POOL/NEWS', stop_at: '&POOL', ancestors: ['&POOL/NEWS', '&POOL'],
    recipients: [{ address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed }],
    returned: 1, truncated: false
  };
  const { rpc } = mockRpc(() => plainReply('depingetancestorrecipients', '&POOL/NEWS', body));

  await buildDepinMessageForPool({
    rpc, token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    poolPublicKey: POOL.pubCompressed, network: 'test',
    identity,
    message: 'contexto', messageType: 'group', timestamp: 1753900000
  });

  assert.equal(seen.digests.length, 1, 'signDigest must be invoked exactly once');
  const { digest, context } = seen.digests[0];
  assert.equal(context.kind, 'message');
  assert.equal(context.token, '&POOL/NEWS');
  assert.equal(context.senderAddress, base.address);
  assert.equal(context.timestamp, 1753900000);
  assert.equal(context.messageType, 0x02);
  assert.match(context.encryptedPayloadHex, /^[0-9a-f]+$/);

  // Rebuilding the digest from the context reproduces the signed bytes. This
  // is the device-side check: hash the context's own fields and compare.
  const rebuilt = await computeDigestFromContext(context);
  assert.equal(rebuilt, digest);
});

/**
 * Mirrors what firmware must do with a `message` context: rebuild the
 * canonical CDepinMessage preimage and hash it, without trusting the digest
 * the host sent. Same serialization as src/message.js.
 */
async function computeDigestFromContext(context) {
  const { serializeString, serializeVector, serializeInt64 } =
    await import('../src/serialize.js');
  const { concatBytes, hexToBytes: toBytes, bytesToHex: toHex } =
    await import('../src/bytes.js');
  const { doubleSha256 } = await import('../src/hash.js');
  const payload = toBytes(context.encryptedPayloadHex);
  const preimage = concatBytes(
    serializeString(context.token),
    serializeString(context.senderAddress),
    serializeInt64(context.timestamp),
    new Uint8Array([context.messageType]),
    serializeVector(payload)
  );
  return toHex(await doubleSha256(preimage));
}

test('one-argument signers keep working (the context is additive)', async () => {
  const base = await createSoftwareIdentity({ privateKey: HOLDER.privHex, network: 'test' });
  let calls = 0;
  // Legacy signer: declares a single parameter and ignores anything extra.
  const legacy = {
    ...base,
    signMessage: (preimage) => { calls += 1; return base.signMessage(preimage); }
  };
  const { rpc } = mockRpc((m, p) =>
    boundReply('depinchallenge', p[0], p[1], '',
      { challenge: CH, expires_in: 30, type: 'receive' }, base.publicKey)
  );
  const res = await requestDepinChallenge({
    rpc, identity: legacy, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
  });
  assert.equal(res.challenge, CH);
  assert.equal(calls, 1);
});

test('the context never replaces the preimage: mutating it changes nothing sent', async () => {
  const base = await createSoftwareIdentity({ privateKey: HOLDER.privHex, network: 'test' });
  let sentSignature = null;
  const tamperer = {
    ...base,
    signMessage: (preimage, context) => {
      // A hostile/buggy signer mutates the context after receiving it.
      if (context) context.token = '&OTRO';
      return base.signMessage(preimage);   // still signs the real preimage
    }
  };
  const { rpc, calls } = mockRpc((m, p) => {
    sentSignature = p[3];
    return boundReply('depinchallenge', p[0], p[1], '',
      { challenge: CH, expires_in: 30, type: 'receive' }, base.publicKey);
  });
  await requestDepinChallenge({
    rpc, identity: tamperer, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
  });
  // The RPC still names the real token, and the signature covers the real
  // preimage: the context is advisory input for the signer, never the source.
  assert.equal(calls[0].params[0], '&POOL/NEWS');
  const expected = signRecoverableMessage(
    buildDepinRequestPreimage({
      kind: 'request', type: 'receive', token: '&POOL/NEWS',
      address: base.address, timestampMs: calls[0].params[2]
    }),
    HOLDER.privHex
  );
  assert.equal(sentSignature, expected);
});
