import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveDepinRecipients, buildDepinMessageForPool,
  parseDepinPoolInfo, getRemoteDepinPoolInfo, buildDepinMessageForRemotePool,
  parseDepinMessage, decryptDepinReceiveEncryptedPayload
} from '../src/index.js';
import { keypair, addressFor } from './helpers.mjs';

const sender = keypair('11'.repeat(32));
const B = keypair('22'.repeat(32));
const C = keypair('33'.repeat(32));
const D = keypair('44'.repeat(32));

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

function mockRpc(response) {
  const calls = [];
  return {
    calls,
    rpc: {
      call: async (method, params) => {
        calls.push({ method, params });
        return typeof response === 'function' ? response(method, params) : response;
      }
    }
  };
}

const baseArgs = () => ({
  token: '&POOL/NEWS',
  poolRoot: '&POOL',
  maxRecipients: 3,
  senderPubKey: sender.pub,
  network: 'test'
});

test('happy path: resolves, dedupes by point, sizes final map with sender', async () => {
  const { rpc, calls } = mockRpc(await holdersResponse());
  const res = await resolveDepinRecipients({ ...baseArgs(), rpc });

  assert.deepEqual(calls[0], {
    method: 'depingetancestorrecipients',
    params: ['&POOL/NEWS', 4, '&POOL'] // maxRecipients + 1
  });
  assert.equal(res.recipientCount, 3); // B + C + sender
  assert.equal(res.senderIncludedInHolders, false);
  assert.deepEqual(res.recipientPubKeys, [B.pubCompressed, C.pubUncompressed]);
});

test('truncated or inconsistent responses fail closed', async () => {
  for (const [patch, re] of [
    [{ truncated: true }, /truncated/],
    [{ token: '&POOL/OTHER' }, /does not match requested/],
    [{ stop_at: '&POOL/NEWS' }, /does not match pool root/],
    [{ returned: 5 }, /returned count/],
    [{ ancestors: ['&POOL'] }, /ancestors is inconsistent/],
    [{ recipients: 'nope' }, /not an array/]
  ]) {
    const { rpc } = mockRpc(await holdersResponse(patch));
    await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc }), re);
  }
});

test('recipient key must hash to its own address', async () => {
  const { rpc } = mockRpc(await holdersResponse({
    recipients: [{ address: await addressFor(B.pubCompressed), pubkey: C.pubCompressed }],
    returned: 1
  }));
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc }), /does not match its address/);
});

test('same holder in both key forms collapses to one point', async () => {
  const { rpc } = mockRpc(await holdersResponse({
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(B.pubUncompressed), pubkey: B.pubUncompressed }
    ],
    returned: 2
  }));
  const res = await resolveDepinRecipients({ ...baseArgs(), rpc });
  assert.equal(res.recipientCount, 2); // B (one point) + sender
});

test('limit is on the final map: exact fit passes, sender overflow fails', async () => {
  // holders B,C and the sender itself; limit 3 -> exactly 3: OK
  const withSender = await holdersResponse({
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(C.pubUncompressed), pubkey: C.pubUncompressed },
      { address: await addressFor(sender.pub), pubkey: sender.pub }
    ],
    returned: 3
  });
  const ok = await resolveDepinRecipients({ ...baseArgs(), rpc: mockRpc(withSender).rpc });
  assert.equal(ok.recipientCount, 3);
  assert.equal(ok.senderIncludedInHolders, true);

  // holders B,C,D (limit 3) and sender NOT among them -> final map 4: reject
  const noSender = await holdersResponse({
    recipients: [
      { address: await addressFor(B.pubCompressed), pubkey: B.pubCompressed },
      { address: await addressFor(C.pubUncompressed), pubkey: C.pubUncompressed },
      { address: await addressFor(D.pubCompressed), pubkey: D.pubCompressed }
    ],
    returned: 3
  });
  await assert.rejects(
    resolveDepinRecipients({ ...baseArgs(), rpc: mockRpc(noSender).rpc }),
    /sender included.*above the pool limit/s
  );
});

test('parameter validation', async () => {
  const { rpc } = mockRpc(await holdersResponse());
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, token: '&OTHER/XYZ' }), /not under pool root/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, maxRecipients: 0 }), /between 1 and 50/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, maxRecipients: 51 }), /between 1 and 50/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs(), rpc, senderPubKey: undefined }), /senderPubKey is required/);
  await assert.rejects(resolveDepinRecipients({ ...baseArgs() }), /rpc with a call/);
});

test('buildDepinMessageForPool resolves and builds a decryptable message', async () => {
  const { rpc } = mockRpc(await holdersResponse());
  const out = await buildDepinMessageForPool({
    ...baseArgs(),
    rpc,
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'pool build',
    messageType: 'group',
    timestamp: 1753900000
  });
  assert.equal(out.resolution.recipientCount, 3);
  const parsed = await parseDepinMessage(out.hex);
  assert.equal(parsed.token, '&POOL/NEWS');
  // the uncompressed holder C can decrypt
  assert.equal(
    await decryptDepinReceiveEncryptedPayload(parsed.encryptedPayloadHex, C.privHex),
    'pool build'
  );
});

const INFO_LINE = 'OK|&POOL|18770|AES-256-GCM|20|10240|24|10|3|12345|2026-07-30 10:00:00|2026-07-31 09:00:00|' +
  keypair('55'.repeat(32)).pubCompressed;

test('parseDepinPoolInfo parses and fails closed', () => {
  const info = parseDepinPoolInfo(INFO_LINE);
  assert.equal(info.token, '&POOL');
  assert.equal(info.maxRecipients, 20);
  assert.equal(info.maxMessageSize, 10240);
  assert.equal(info.cipher, 'AES-256-GCM');
  assert.ok(info.poolPubKey);

  assert.throws(() => parseDepinPoolInfo('ERROR|Chat mempool not enabled'), /Gateway INFO error/);
  assert.throws(() => parseDepinPoolInfo(''), /Empty INFO/);
  assert.throws(() => parseDepinPoolInfo('OK|&POOL|18770'), /Unrecognized INFO format/);
  assert.throws(
    () => parseDepinPoolInfo(INFO_LINE.replace('|20|', '|0|')),
    /maxRecipients invalid or zero/
  );
  // strict fail-closed: extra fields, integer suffixes, out-of-range port
  assert.throws(() => parseDepinPoolInfo(INFO_LINE + '|extra'), /expected 13/);
  assert.throws(() => parseDepinPoolInfo(INFO_LINE.replace('|18770|', '|18770junk|')), /not a decimal integer/);
  assert.throws(() => parseDepinPoolInfo(INFO_LINE.replace('|20|', '|20junk|')), /not a decimal integer/);
  assert.throws(() => parseDepinPoolInfo(INFO_LINE.replace('|18770|', '|0|')), /port out of range/);
  assert.throws(() => parseDepinPoolInfo(INFO_LINE.replace('|18770|', '|70000|')), /port out of range/);
  assert.throws(() => parseDepinPoolInfo(INFO_LINE.replace('|24|', '|-24|')), /not a decimal integer/);
  // a remote claiming more than Core's absolute cap is clamped to 50
  assert.equal(parseDepinPoolInfo(INFO_LINE.replace('|20|', '|500|')).maxRecipients, 50);
  // '0' pool key -> null
  const noKey = INFO_LINE.slice(0, INFO_LINE.lastIndexOf('|') + 1) + '0';
  assert.equal(parseDepinPoolInfo(noKey).poolPubKey, null);
});

test('remote pool flow: INFO gates everything', async () => {
  const transport = {
    request: async (host, port, payload) => {
      assert.equal(payload, 'INFO');
      return INFO_LINE + '\n';
    }
  };
  const info = await getRemoteDepinPoolInfo({ host: 'x', port: 1, transport });
  assert.equal(info.token, '&POOL');

  const { rpc } = mockRpc(await holdersResponse({ max_results: 21 }));
  const out = await buildDepinMessageForRemotePool({
    host: 'x', port: 1, transport, rpc,
    token: '&POOL/NEWS',
    network: 'test',
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'remote pool build',
    messageType: 'group',
    timestamp: 1753900000
  });
  assert.equal(out.poolInfo.token, '&POOL');
  assert.equal(out.resolution.maxRecipients, 20);

  // token outside the remote root fails closed
  await assert.rejects(buildDepinMessageForRemotePool({
    host: 'x', port: 1, transport, rpc,
    token: '&OTHER/NEWS',
    network: 'test',
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'x', messageType: 'group', timestamp: 1753900000
  }), /not under the remote pool root/);

  // INFO failure fails closed
  const badTransport = { request: async () => 'ERROR|nope' };
  await assert.rejects(
    getRemoteDepinPoolInfo({ host: 'x', port: 1, transport: badTransport }),
    /Gateway INFO error/
  );
});
