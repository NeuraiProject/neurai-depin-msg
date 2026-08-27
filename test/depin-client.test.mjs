/**
 * Protocol-2 client flows against a FAKE POOL and a scripted DepinRpc
 * (plan v2 §6.2): deterministic signed fixtures — we own the fake pool's
 * key, so its envelopes are legitimately signed — plus assertions on exact
 * methods/params, verification-before-decryption, capability failures,
 * timestamp monotonicity and the absence of implicit retries.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveDepinRecipients, decodeDepinRecipients, buildDepinMessageForPool,
  requestDepinChallenge, receiveDepinMessages, submitDepinMessage,
  clearDepinMessages, listDepinSectionsPublic, listDepinSectionsPrivate,
  getDepinPoolInfo,
  buildDepinRequestPreimage, buildDepinGetPreimage, buildDepinClearPreimage,
  buildDepinReplyPreimage, signRecoverableMessage, verifyRecoverableMessage,
  createSoftwareIdentity,
  buildDepinMessage, parseDepinMessage,
  eciesEncrypt, serializeEciesMessage, deserializeEciesMessage, eciesDecrypt,
  bytesToHex, hexToBytes,
  decryptDepinReceiveEncryptedPayload,
  DepinProtocolError, DepinReplyAuthenticationError, DepinCapabilityError
} from '../src/index.js';
import { keypair, addressFor } from './helpers.mjs';

const POOL = keypair('66'.repeat(32));
const sender = keypair('11'.repeat(32));
const B = keypair('22'.repeat(32));
const C = keypair('33'.repeat(32));
const D = keypair('44'.repeat(32));
const HOLDER = keypair('77'.repeat(32));

const CH = 'ab'.repeat(32);
const CH2 = 'cd'.repeat(32);

function signReply(method, token, address, challenge, replyHex) {
  const preimage = buildDepinReplyPreimage({ method, token, address, challenge, replyHex });
  return signRecoverableMessage(preimage, POOL.privHex);
}

function plainReply(method, token, bodyObj) {
  const body = bytesToHex(new TextEncoder().encode(JSON.stringify(bodyObj)));
  return { body, poolsig: signReply(method, token, '', '', body) };
}

async function boundReply(method, token, address, challenge, resultObj, recipientPub) {
  const plaintext = new TextEncoder().encode(JSON.stringify(resultObj));
  const ecies = await eciesEncrypt(plaintext, [hexToBytes(recipientPub)]);
  const encrypted = bytesToHex(serializeEciesMessage(ecies));
  return { encrypted, poolsig: signReply(method, token, address, challenge, encrypted) };
}

function mockRpc(responder) {
  const calls = [];
  return {
    calls,
    rpc: {
      call: async (method, params) => {
        calls.push({ method, params });
        return responder(method, params, calls.length);
      }
    }
  };
}

async function holderIdentity() {
  return createSoftwareIdentity({ privateKey: HOLDER.privHex, network: 'test' });
}

async function holdersResponse(overrides = {}) {
  return {
    token: '&POOL/NEWS',
    stop_at: '&POOL',
    ancestors: ['&POOL/NEWS', '&POOL'],
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(C.pubUncompressed), pubkey: C.pubUncompressed }
    ],
    returned: 2,
    max_results: 4,
    truncated: false,
    skipped_no_pubkey: 0,
    skipped_no_pubkey_complete: true,
    skipped_restricted: 0,
    skipped_restricted_complete: true,
    ...overrides
  };
}

const baseArgs = () => ({
  token: '&POOL/NEWS',
  poolRoot: '&POOL',
  maxRecipients: 3,
  senderPubKey: sender.pub,
  poolPublicKey: POOL.pubCompressed,
  network: 'test'
});

// ---------------------------------------------------------------------------
// Recipients: signed envelope (§8.1/§8.3)
// ---------------------------------------------------------------------------

test('resolveDepinRecipients verifies the signed envelope, then decodes', async () => {
  const body = await holdersResponse();
  const { rpc, calls } = mockRpc(() =>
    plainReply('depingetancestorrecipients', '&POOL/NEWS', body)
  );
  const res = await resolveDepinRecipients({ ...baseArgs(), rpc });
  assert.deepEqual(calls[0], {
    method: 'depingetancestorrecipients',
    params: ['&POOL/NEWS', 4, '&POOL'] // maxRecipients + 1
  });
  assert.equal(res.recipientCount, 3); // B + C + sender
  assert.equal(res.senderIncludedInHolders, false);
  assert.deepEqual(res.recipientPubKeys, [B.pubCompressed, C.pubUncompressed]);
});

test('a raw (unsigned) recipients result is refused as a protocol error', async () => {
  const { rpc } = mockRpc(async () => holdersResponse());
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc }), DepinProtocolError);
});

test('a tampered recipients poolsig is refused before interpreting the body', async () => {
  const body = await holdersResponse();
  const { rpc } = mockRpc(() => {
    const reply = plainReply('depingetancestorrecipients', '&POOL/NEWS', body);
    reply.poolsig = plainReply('depingetancestorrecipients', '&OTRO', body).poolsig;
    return reply;
  });
  await assert.rejects(
    resolveDepinRecipients({ ...baseArgs(), rpc }),
    DepinReplyAuthenticationError
  );
});

test('decodeDepinRecipients: contract violations fail closed', async () => {
  const args = {
    token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    senderPubKey: sender.pub, network: 'test'
  };
  for (const [patch, re] of [
    [{ truncated: true }, /truncated/],
    [{ token: '&POOL/OTHER' }, /does not match requested/],
    [{ stop_at: '&POOL/NEWS' }, /does not match pool root/],
    [{ returned: 5 }, /returned count/],
    [{ ancestors: ['&POOL'] }, /ancestors is inconsistent/],
    [{ recipients: 'nope' }, /not an array/]
  ]) {
    await assert.rejects(
      decodeDepinRecipients(await holdersResponse(patch), args), re
    );
  }
  // key must hash to its own address
  await assert.rejects(
    decodeDepinRecipients(await holdersResponse({
      recipients: [{ address: await addressFor(B.pubCompressed), pubkey: C.pubCompressed }],
      returned: 1
    }), args),
    /does not match its address/
  );
  // same holder in both forms collapses to one point
  const dedup = await decodeDepinRecipients(await holdersResponse({
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(B.pubUncompressed), pubkey: B.pubUncompressed }
    ],
    returned: 2
  }), args);
  assert.equal(dedup.recipientCount, 2); // B (one point) + sender
  // limit is on the final map, sender included
  const exactFit = await decodeDepinRecipients(await holdersResponse({
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(C.pubUncompressed), pubkey: C.pubUncompressed },
      { address: await addressFor(sender.pub), pubkey: sender.pub }
    ],
    returned: 3
  }), args);
  assert.equal(exactFit.recipientCount, 3);
  assert.equal(exactFit.senderIncludedInHolders, true);
  await assert.rejects(
    decodeDepinRecipients(await holdersResponse({
      recipients: [
        { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
        { address: await addressFor(C.pubUncompressed), pubkey: C.pubUncompressed },
        { address: await addressFor(D.pubCompressed), pubkey: D.pubCompressed }
      ],
      returned: 3
    }), args),
    /sender included.*above the pool limit/s
  );
});

test('resolveDepinRecipients parameter validation happens before any RPC', async () => {
  const { rpc, calls } = mockRpc(() => { throw new Error('must not be called'); });
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, token: '&OTHER/XYZ' }), /not under pool root/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, maxRecipients: 0 }), /between 1 and 50/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, maxRecipients: 51 }), /between 1 and 50/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, senderPubKey: undefined }), /senderPubKey is required/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, poolPublicKey: undefined }), /poolPublicKey/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs() }), /rpc with a call/);
  assert.equal(calls.length, 0);
});

test('buildDepinMessageForPool resolves through the envelope and builds a decryptable message', async () => {
  const body = await holdersResponse();
  const { rpc } = mockRpc(() => plainReply('depingetancestorrecipients', '&POOL/NEWS', body));
  const out = await buildDepinMessageForPool({
    ...baseArgs(),
    rpc,
    senderAddress: await addressFor(sender.pub),
    privateKey: sender.privHex,
    message: 'pool build',
    messageType: 'group',
    timestamp: 1753900000
  });
  assert.equal(out.resolution.recipientCount, 3);
  const parsed = await parseDepinMessage(out.hex);
  assert.equal(parsed.token, '&POOL/NEWS');
  assert.equal(
    await decryptDepinReceiveEncryptedPayload(parsed.encryptedPayloadHex, C.privHex),
    'pool build'
  );
});

test('buildDepinMessageForPool uses an external signDigest exactly once', async () => {
  const body = await holdersResponse();
  const { rpc, calls } = mockRpc(() =>
    plainReply('depingetancestorrecipients', '&POOL/NEWS', body)
  );
  const software = await createSoftwareIdentity({
    privateKey: sender.privHex, network: 'test'
  });
  const digests = [];
  const identity = {
    ...software,
    signDigest: (digest) => {
      digests.push(digest.slice());
      return software.signDigest(digest);
    }
  };
  const out = await buildDepinMessageForPool({
    rpc,
    token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    poolPublicKey: POOL.pubCompressed, network: 'test', identity,
    message: 'hardware build', messageType: 'group', timestamp: 1753900001
  });
  assert.equal(calls.length, 1);
  assert.equal(digests.length, 1);
  assert.equal(digests[0].length, 32);
  const parsed = await parseDepinMessage(out.hex);
  assert.equal(parsed.hashBytes, bytesToHex(digests[0]));
  assert.equal(
    await decryptDepinReceiveEncryptedPayload(parsed.encryptedPayloadHex, C.privHex),
    'hardware build'
  );
});

test('identity publishing rejects missing capability or a wrong signature', async () => {
  const body = await holdersResponse();
  const noRpc = mockRpc(() => { throw new Error('must not be called'); });
  await assert.rejects(buildDepinMessageForPool({
    rpc: noRpc.rpc,
    token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    poolPublicKey: POOL.pubCompressed, network: 'test',
    identity: { address: await addressFor(sender.pub), publicKey: sender.pub },
    message: 'x', messageType: 'group', timestamp: 1753900001
  }), DepinCapabilityError);
  assert.equal(noRpc.calls.length, 0);

  const wrongSigner = await createSoftwareIdentity({
    privateKey: B.privHex, network: 'test'
  });
  const senderIdentity = await createSoftwareIdentity({
    privateKey: sender.privHex, network: 'test'
  });
  await assert.rejects(buildDepinMessageForPool({
    rpc: noRpc.rpc,
    token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    poolPublicKey: POOL.pubCompressed, network: 'test',
    identity: { ...senderIdentity, address: await addressFor(B.pubCompressed) },
    message: 'x', messageType: 'group', timestamp: 1753900001
  }), /does not correspond/);
  assert.equal(noRpc.calls.length, 0);

  const withRpc = mockRpc(() =>
    plainReply('depingetancestorrecipients', '&POOL/NEWS', body)
  );
  await assert.rejects(buildDepinMessageForPool({
    rpc: withRpc.rpc,
    token: '&POOL/NEWS', poolRoot: '&POOL', maxRecipients: 3,
    poolPublicKey: POOL.pubCompressed, network: 'test',
    identity: { ...senderIdentity, signDigest: wrongSigner.signDigest },
    message: 'x', messageType: 'group', timestamp: 1753900001
  }), /does not verify/);
});

// ---------------------------------------------------------------------------
// Pool info (§6.4)
// ---------------------------------------------------------------------------

function poolInfoBody() {
  return {
    enabled: true, token: '&POOL', cipher: 'AES-256-GCM', maxrecipients: 20,
    maxmessagesize: 1024, messageexpiryhours: 168, maxpoolsizemb: 100,
    messages: 0, memoryusage: 0, protocol: 2,
    depinpoolpkey: POOL.pubCompressed
  };
}

test('getDepinPoolInfo: TOFU yields the observed pin; pinned enforces it', async () => {
  const { rpc } = mockRpc(() => plainReply('depingetmsginfo', '&POOL', poolInfoBody()));
  const serviceId = 'https://pool.example/rpc';
  const tofu = await getDepinPoolInfo({
    rpc, serviceId, trust: { mode: 'tofu' }, network: 'test'
  });
  assert.deepEqual(tofu.pin, { serviceId, poolRoot: '&POOL', poolPublicKey: POOL.pubCompressed });
  assert.equal(tofu.trust, 'tofu');

  const pinned = await getDepinPoolInfo({
    rpc, serviceId, network: 'test',
    trust: { mode: 'pinned', pin: tofu.pin }
  });
  assert.equal(pinned.info.maxrecipients, 20);

  // A different pool key under a pinned trust: authentication error.
  const otherKey = keypair('99'.repeat(32));
  await assert.rejects(
    getDepinPoolInfo({
      rpc, serviceId, network: 'test',
      trust: { mode: 'pinned', pin: { ...tofu.pin, poolPublicKey: otherKey.pubCompressed } }
    }),
    DepinReplyAuthenticationError
  );
});

test('getDepinPoolInfo: protocol !== 2 is refused after authentication', async () => {
  const { rpc } = mockRpc(() =>
    plainReply('depingetmsginfo', '&POOL', { ...poolInfoBody(), protocol: 1 })
  );
  await assert.rejects(
    getDepinPoolInfo({
      rpc, serviceId: 'svc', trust: { mode: 'tofu' }, network: 'test'
    }),
    /requires protocol 2/
  );
});

// ---------------------------------------------------------------------------
// Challenge (§7.1) + timestamps (§3.6)
// ---------------------------------------------------------------------------

test('requestDepinChallenge signs DEPIN-REQ, verifies and decrypts the reply', async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc(async (method, params) => {
    assert.equal(method, 'depinchallenge');
    const [token, address, t, sig, type] = params;
    assert.equal(token, '&POOL/NEWS');
    assert.equal(address, identity.address);
    assert.equal(type, 'receive');
    // Server-side check: the signed request recovers the holder key.
    const preimage = buildDepinRequestPreimage({ type, token, address, timestampMs: t });
    assert.equal(verifyRecoverableMessage(preimage, sig, identity.publicKey), true);
    return boundReply('depinchallenge', token, address, '',
      { challenge: CH, expires_in: 30, type: 'receive' }, identity.publicKey);
  });

  const res = await requestDepinChallenge({
    rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
  });
  assert.equal(res.challenge, CH);
  assert.equal(res.expiresIn, 30);
  assert.equal(calls.length, 1);
});

test('timestamps are strictly monotonic per address, even on the same tick', async () => {
  const identity = await holderIdentity();
  const seen = [];
  const { rpc } = mockRpc(async (method, params) => {
    seen.push(params[2]);
    return boundReply('depinchallenge', '&POOL/NEWS', identity.address, '',
      { challenge: CH, expires_in: 30, type: 'receive' }, identity.publicKey);
  });
  const frozenClock = () => 1730000000000; // same tick every call
  await Promise.all([
    requestDepinChallenge({ rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed, clock: frozenClock }),
    requestDepinChallenge({ rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed, clock: frozenClock }),
    requestDepinChallenge({ rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed, clock: frozenClock })
  ]);
  assert.equal(new Set(seen).size, 3, 'concurrent requests reused a timestamp');
  assert.deepEqual([...seen].sort((a, b) => a - b), seen);
});

test('a tampered challenge reply never reaches openReply', async () => {
  const identity = await holderIdentity();
  let opened = 0;
  const spied = {
    ...identity,
    openReply: async (hex) => { opened += 1; return identity.openReply(hex); }
  };
  const { rpc } = mockRpc(async (method, params) => {
    const reply = await boundReply('depinchallenge', params[0], params[1], '',
      { challenge: CH, expires_in: 30, type: 'receive' }, identity.publicKey);
    const bytes = hexToBytes(reply.encrypted);
    bytes[bytes.length - 1] ^= 0x01;
    reply.encrypted = bytesToHex(bytes); // poolsig no longer covers it
    return reply;
  });
  await assert.rejects(
    requestDepinChallenge({
      rpc, identity: spied, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
    }),
    DepinReplyAuthenticationError
  );
  assert.equal(opened, 0, 'openReply ran before authentication');
});

test('capability failures happen before any RPC', async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc(() => { throw new Error('must not be called'); });
  const noSign = { ...identity };
  delete noSign.signMessage;
  await assert.rejects(
    requestDepinChallenge({ rpc, identity: noSign, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed }),
    DepinCapabilityError
  );
  const noOpen = { ...identity };
  delete noOpen.openReply;
  await assert.rejects(
    receiveDepinMessages({
      rpc, identity: noOpen, token: '&POOL/NEWS', challenge: CH,
      poolPublicKey: POOL.pubCompressed, network: 'test'
    }),
    DepinCapabilityError
  );
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// Receive (§7.2, §7.3) + parameter normalization (§3.4)
// ---------------------------------------------------------------------------

test('receiveDepinMessages: empty page, chaining, exact params with null filling', async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc(async (method, params) => {
    assert.equal(method, 'depinreceivemsg');
    const [token, address, challenge, sig] = params;
    const preimage = buildDepinGetPreimage({ token, address, challenge });
    assert.equal(verifyRecoverableMessage(preimage, sig, identity.publicKey), true);
    return boundReply('depinreceivemsg', token, address, challenge,
      { messages: [], has_more: false, next_challenge: CH2, next_expires_in: 300 },
      identity.publicKey);
  });

  // limit only → timestamp and afterHash filled with null
  const res = await receiveDepinMessages({
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test', limit: 5
  });
  assert.deepEqual(calls[0].params.slice(4), [null, null, 5]);
  assert.equal(res.messages.length, 0);
  assert.equal(res.hasMore, false);
  assert.equal(res.nextChallenge, CH2);
  assert.equal(res.nextExpiresIn, 300);

  // afterHash only → single null before it, no trailing slot
  await receiveDepinMessages({
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test', afterHash: 'ee'.repeat(32)
  });
  assert.deepEqual(calls[1].params.slice(4), [null, 'ee'.repeat(32)]);

  // no optionals → no tail at all
  await receiveDepinMessages({
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test'
  });
  assert.equal(calls[2].params.length, 4);
});

test('receiveDepinMessages: a real message decrypts through the identity opener', async () => {
  const identity = await holderIdentity();
  // The sender publishes to the holder: build a real CDepinMessage.
  const built = await buildDepinMessage({
    token: '&POOL/NEWS',
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'hola holder',
    messageType: 'group',
    recipientPubKeys: [identity.publicKey, sender.pub],
    timestamp: 1753900000,
    network: 'test'
  });
  const parsed = await parseDepinMessage(built.hex);
  const entry = {
    hash: parsed.hash,
    token: parsed.token,
    sender: parsed.senderAddress,
    timestamp: parsed.timestamp,
    message_type: parsed.messageType,
    encrypted_payload_hex: parsed.encryptedPayloadHex,
    signature_hex: parsed.signatureHex
  };
  const { rpc } = mockRpc((method, params) =>
    boundReply('depinreceivemsg', params[0], params[1], params[2],
      { messages: [entry], has_more: false, next_challenge: CH2, next_expires_in: 300 },
      identity.publicKey)
  );
  const res = await receiveDepinMessages({
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test',
    resolveSenderPubKey: async () => sender.pub
  });
  assert.equal(res.messages.length, 1);
  assert.equal(res.messages[0].ok, true);
  assert.equal(res.messages[0].plaintext, 'hola holder');
});

test('receiveDepinMessages: input validation rejects before the RPC', async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc(() => { throw new Error('must not be called'); });
  const base = {
    rpc, identity, token: '&POOL/NEWS', challenge: CH,
    poolPublicKey: POOL.pubCompressed, network: 'test'
  };
  await assert.rejects(receiveDepinMessages({ ...base, challenge: 'nope' }), /challenge must be/);
  await assert.rejects(receiveDepinMessages({ ...base, limit: 1001 }), /between 0 and 1000/);
  await assert.rejects(receiveDepinMessages({ ...base, limit: -1 }), /between 0 and 1000/);
  await assert.rejects(receiveDepinMessages({ ...base, afterHash: 'zz' }), /afterHash/);
  await assert.rejects(receiveDepinMessages({ ...base, timestamp: -5 }), /timestamp/);
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// Sections (§8.1/§8.2)
// ---------------------------------------------------------------------------

test('listDepinSectionsPublic verifies the root-bound plain reply', async () => {
  const sections = [{ name: '&POOL', label: '', depth: 0 }, { name: '&POOL/NEWS', label: 'News', depth: 1 }];
  const { rpc, calls } = mockRpc(() => plainReply('depinlistsections', '&POOL', { sections }));
  const res = await listDepinSectionsPublic({
    rpc, poolRoot: '&POOL', poolPublicKey: POOL.pubCompressed
  });
  assert.deepEqual(calls[0], { method: 'depinlistsections', params: [] });
  assert.deepEqual(res.sections, sections);
});

test('listDepinSectionsPrivate signs DEPIN-GET over the scope and chains', async () => {
  const identity = await holderIdentity();
  const sections = [{ name: '&POOL/NEWS', label: 'News', depth: 1, access: 'holder' }];
  const { rpc, calls } = mockRpc(async (method, params) => {
    assert.equal(method, 'depinlistsections');
    const [address, scope, challenge, sig] = params;
    const preimage = buildDepinGetPreimage({ token: scope, address, challenge });
    assert.equal(verifyRecoverableMessage(preimage, sig, identity.publicKey), true);
    return boundReply('depinlistsections', scope, address, challenge,
      { sections, next_challenge: CH2, next_expires_in: 300 }, identity.publicKey);
  });
  const res = await listDepinSectionsPrivate({
    rpc, identity, scope: '&POOL/NEWS', challenge: CH, poolPublicKey: POOL.pubCompressed
  });
  assert.deepEqual(calls[0].params[0], identity.address);
  assert.deepEqual(res.sections, sections);
  assert.equal(res.nextChallenge, CH2);
});

// ---------------------------------------------------------------------------
// Clear (§8.4)
// ---------------------------------------------------------------------------

test("clearDepinMessages: scope '' signs and verifies with the pool root", async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc(async (method, params) => {
    assert.equal(method, 'depinclearmsg');
    const [scope, address, challenge, sig, mode] = params;
    assert.equal(scope, ''); // the RPC still receives ''
    assert.equal(mode, 'all');
    // ...but the signature covers the resolved root.
    const preimage = buildDepinClearPreimage({ scope: '&POOL', address, challenge });
    assert.equal(verifyRecoverableMessage(preimage, sig, identity.publicKey), true);
    return boundReply('depinclearmsg', '&POOL', address, challenge,
      { removed: 7, remaining: 0 }, identity.publicKey);
  });
  const res = await clearDepinMessages({
    rpc, identity, scope: '', poolRoot: '&POOL', challenge: CH,
    poolPublicKey: POOL.pubCompressed, mode: 'all'
  });
  assert.equal(res.removed, 7);
  assert.equal(calls.length, 1);
});

test('clearDepinMessages: mode validation and omitted mode', async () => {
  const identity = await holderIdentity();
  const { rpc, calls } = mockRpc((method, params) =>
    boundReply('depinclearmsg', params[0], params[1], params[2],
      { removed: 0, remaining: 3 }, identity.publicKey)
  );
  await clearDepinMessages({
    rpc, identity, scope: '&POOL/NEWS', poolRoot: '&POOL', challenge: CH,
    poolPublicKey: POOL.pubCompressed
  });
  assert.equal(calls[0].params.length, 4); // no mode slot when omitted
  await assert.rejects(
    clearDepinMessages({
      rpc, identity, scope: '&POOL/NEWS', poolRoot: '&POOL', challenge: CH,
      poolPublicKey: POOL.pubCompressed, mode: -1
    }),
    /mode must be/
  );
});

// ---------------------------------------------------------------------------
// Submit (§8.3)
// ---------------------------------------------------------------------------

test('submitDepinMessage wraps for the pool key and verifies the bound confirmation', async () => {
  const senderIdentity = await createSoftwareIdentity({ privateKey: sender.privHex, network: 'test' });
  const built = await buildDepinMessage({
    token: '&POOL/NEWS',
    senderAddress: senderIdentity.address,
    senderPubKey: senderIdentity.publicKey,
    privateKey: sender.privHex,
    message: 'publicame',
    messageType: 'group',
    recipientPubKeys: [B.pubCompressed, senderIdentity.publicKey],
    timestamp: 1753900000,
    network: 'test'
  });
  const HASH = 'ff'.repeat(32);
  const { rpc, calls } = mockRpc(async (method, params) => {
    assert.equal(method, 'depinsubmitmsg');
    assert.equal(params.length, 1);
    const { sender: senderAddr, encrypted } = params[0];
    assert.equal(senderAddr, senderIdentity.address);
    // The "node" opens the envelope with the pool key and finds the hex.
    const envelope = deserializeEciesMessage(hexToBytes(encrypted));
    const opened = await eciesDecrypt(envelope, POOL.priv);
    assert.equal(new TextDecoder().decode(opened), built.hex);
    return boundReply('depinsubmitmsg', '&POOL/NEWS', senderAddr, '',
      { result: 'success', hash: HASH, timestamp: 1753900001 }, senderIdentity.publicKey);
  });
  const res = await submitDepinMessage({
    rpc, identity: senderIdentity, messageHex: built.hex,
    poolPublicKey: POOL.pubCompressed
  });
  assert.equal(res.hash, HASH);
  assert.equal(calls.length, 1);
});

test('submitDepinMessage refuses a message whose sender is not the identity', async () => {
  const otherIdentity = await createSoftwareIdentity({ privateKey: HOLDER.privHex, network: 'test' });
  const built = await buildDepinMessage({
    token: '&POOL/NEWS',
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'x',
    messageType: 'group',
    recipientPubKeys: [B.pubCompressed],
    timestamp: 1753900000,
    network: 'test'
  });
  const { rpc, calls } = mockRpc(() => { throw new Error('must not be called'); });
  await assert.rejects(
    submitDepinMessage({
      rpc, identity: otherIdentity, messageHex: built.hex,
      poolPublicKey: POOL.pubCompressed
    }),
    /does not match the identity address/
  );
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// No implicit retries
// ---------------------------------------------------------------------------

test('an RPC failure propagates once — signed requests are never retried', async () => {
  const identity = await holderIdentity();
  const boom = Object.assign(new Error('Rate limited'), { code: -1 });
  const { rpc, calls } = mockRpc(() => { throw boom; });
  await assert.rejects(
    requestDepinChallenge({
      rpc, identity, token: '&POOL/NEWS', poolPublicKey: POOL.pubCompressed
    }),
    (e) => e === boom
  );
  assert.equal(calls.length, 1);
});
