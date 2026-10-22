// Private fixture data arrives over stdin from core-driver.py. Do not log it.
import assert from 'node:assert/strict';
import { createInterface } from 'node:readline';
import * as sdk from '../../dist/neurai-depin-msg.mjs';
import { parse, stringify } from 'lossless-json';
import { assertNoDuplicateJsonKeys } from '../../src/json.js';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';
import { resolve } from 'node:path';

let fixture, rpc, pool, identities, staleChallenge, preparedForMarta, savedCursor;
let firstHash, mixedHash, aliasHash, streamBeforeRestart;
const records = [];
const require = createRequire(import.meta.url);
const exactParse = (text) =>
  parse(text, null, (token) => (/^-?\d+$/.test(token) && !Number.isSafeInteger(Number(token)) ? BigInt(token) : Number(token)));

function transport(rawUrl) {
  const url = new URL(rawUrl);
  const authorization =
    'Basic ' + Buffer.from(decodeURIComponent(url.username) + ':' + decodeURIComponent(url.password)).toString('base64');
  url.username = '';
  url.password = '';
  return {
    call: async (method, params = []) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { authorization, 'content-type': 'application/json' },
        body: stringify({ jsonrpc: '1.0', id: 1, method, params }),
      });
      const raw = await res.text();
      assertNoDuplicateJsonKeys(raw);
      const value = exactParse(raw);
      if (value.error) throw Object.assign(new Error(value.error.message), value.error);
      return value.result;
    },
  };
}
const refresh = async () =>
  (pool = await sdk.getDepinPoolInfo({
    rpc,
    serviceId: 'regtest-sdk',
    trust: { mode: 'key', poolPublicKey: fixture.poolKey },
    network: 'regtest',
    expectedNetworkHash: fixture.genesis,
  }));
const call = (method, identity, args = {}, extra = {}) =>
  sdk.callDepinRpc({ rpc, context: pool.context, method, identity, token: fixture.token, args, ...extra });
const challenge = (identity, type = 'receive') =>
  sdk.requestDepinChallenge({ rpc, context: pool.context, identity, token: fixture.token, type });
const build = (identity, message, extra = {}) =>
  sdk.buildDepinMessageForPool({
    rpc,
    context: pool.context,
    identity,
    token: fixture.token,
    poolRoot: fixture.token,
    maxRecipients: pool.info.maxrecipients,
    network: 'regtest',
    message,
    timestamp: Math.floor(Date.now() / 1000),
    messageType: 'group',
    ...extra,
  });
async function submit(identity, built) {
  const receipt = await sdk.submitDepinMessage({ rpc, context: pool.context, identity, messageHex: built.hex });
  assert.equal(receipt.hash, built.messageHash);
  records.push({ hash: receipt.hash, text: built.expectedText });
  return receipt.hash;
}
async function send(identity, text, extra = {}) {
  const built = await build(identity, text, extra);
  built.expectedText = text;
  return submit(identity, built);
}
async function page(identity, { cursor, limit = 100, nonce } = {}) {
  const ch = nonce ?? (await challenge(identity)).challenge;
  return sdk.receiveDepinMessages({
    rpc,
    context: pool.context,
    identity,
    token: fixture.token,
    network: 'regtest',
    challenge: ch,
    cursor,
    limit,
  });
}
const validText = (result) => result.messages.filter((m) => m.ok && m.plaintext !== null);
const expectReason = (promise, reason) => assert.rejects(promise, (e) => e instanceof sdk.DepinRpcError && e.depinError === reason);

async function invokeSigned(method, request, identity) {
  const response = await rpc.call(method, [request]);
  const verified = sdk.verifyDepinReply({ method, request, reply: response, poolPublicKey: pool.context.pool_pubkey });
  const body = await sdk.openBoundReply(verified, identity.openReply);
  if (body.error) throw Object.assign(new Error(body.error.message), body.error);
  return body;
}

const stages = {
  async initial(input) {
    fixture = input.fixture;
    rpc = transport(fixture.url);
    identities = {};
    for (const [name, params] of Object.entries(fixture.identities))
      identities[name] = await sdk.createSoftwareIdentity({ ...params, network: 'regtest' });
    await refresh();
    assert.equal(pool.info.protocol, 5);
    assert.deepEqual(pool.info.address_types, ['legacy', 'ecdsa']);
    const publicMethods = ['depinpoolstats', 'depinmcpstatus', 'depinlistsections', 'depingetancestorrecipients'];
    for (const method of publicMethods) await call(method);
    const directory = await sdk.resolveDepinRecipients({
      rpc,
      context: pool.context,
      token: fixture.token,
      poolRoot: fixture.token,
      maxRecipients: 50,
      senderAddress: identities.alice.address,
      senderPubKey: identities.alice.publicKey,
      network: 'regtest',
    });
    assert.equal(directory.recipientCount, 4);
    assert(!directory.recipients.some((r) => r.address === identities.alias.address));
    await assert.rejects(challenge(identities.alias), /balance|authorized|permission/i);
    await assert.rejects(challenge(identities.outsider), /balance|authorized|permission/i);
    const now = Math.floor(Date.now() / 1000);
    firstHash = await send(identities.alice, 'SDK Legacy to mixed group', { timestamp: now });
    mixedHash = await send(identities.carlos, 'SDK ECDSA to mixed group', { timestamp: now });
    const subsetHash = await send(identities.carlos, 'private mixed subset', {
      messageType: 'private',
      selectedAddresses: [identities.bob.address],
    });
    for (const identity of [identities.alice, identities.bob, identities.carlos, identities.marta]) {
      const messages = validText(await page(identity));
      assert(messages.some((m) => m.hash === firstHash && m.plaintext === 'SDK Legacy to mixed group'));
      assert(messages.some((m) => m.hash === mixedHash && m.plaintext === 'SDK ECDSA to mixed group'));
      assert.equal(
        messages.some((m) => m.hash === subsetHash),
        identity === identities.bob || identity === identities.carlos,
      );
    }
    const first = await page(identities.bob, { limit: 1 });
    assert.equal(first.messages.length, 1);
    assert.equal(first.hasMore, true);
    const second = await page(identities.bob, { cursor: first.cursor, limit: 1 });
    assert.equal(second.messages.length, 1);
    assert.equal(second.hasMore, true);
    const third = await page(identities.bob, { cursor: second.cursor, limit: 1 });
    assert.equal(third.messages.length, 1);
    assert.equal(third.hasMore, false);
    const hashes = new Set([first.messages[0].hash, second.messages[0].hash, third.messages[0].hash]);
    assert.equal(hashes.size, 3);
    const late = await send(identities.alice, 'late old timestamp', { timestamp: now - 60 });
    const fourth = await page(identities.bob, { cursor: third.cursor, limit: 1 });
    assert.equal(fourth.messages[0].hash, late);
    assert.equal(fourth.hasMore, false);
    savedCursor = fourth.cursor;
    const nonce = await challenge(identities.bob);
    const sections = await sdk.listDepinSectionsPrivate({
      rpc,
      context: pool.context,
      identity: identities.bob,
      scope: fixture.token,
      challenge: nonce.challenge,
    });
    assert(Array.isArray(sections.sections));
    const timestampNonce = await challenge(identities.bob);
    const timestampPage = await sdk.receiveDepinMessages({
      rpc,
      context: pool.context,
      identity: identities.bob,
      token: fixture.token,
      network: 'regtest',
      challenge: timestampNonce.challenge,
      mode: 'timestamp',
      timestamp: 0,
      limit: 100,
    });
    assert.equal(validText(timestampPage).length, 4);
    // A request-id replay, argument mutation and cross-method reuse must fail.
    const signed = sdk.createDepinRpcRequest({
      method: 'depinchallenge',
      context: pool.context,
      address: identities.bob.address,
      token: fixture.token,
      args: { type: 'receive' },
    });
    signed.signature = await identities.bob.signMessage(sdk.buildDepinRpcRequestPreimage({ method: 'depinchallenge', request: signed }));
    await invokeSigned('depinchallenge', signed, identities.bob);
    await assert.rejects(invokeSigned('depinchallenge', signed, identities.bob));
    await assert.rejects(
      invokeSigned('depinchallenge', { ...signed, request_id: 'fe'.repeat(32), args: { type: 'admin' } }, identities.bob),
    );
    await assert.rejects(invokeSigned('depinclearmsg', signed, identities.bob));
    // Node and software identities agree on both signature domains.
    for (const identity of [identities.alice, identities.carlos]) {
      const request = sdk.createDepinRpcRequest({
        method: 'depinchallenge',
        context: pool.context,
        address: identity.address,
        token: fixture.token,
        args: { type: 'receive' },
      });
      const signingRpc = identity === identities.alice ? rpc : transport(fixture.strictUrl);
      const signedByNode = await signingRpc.call('depinsignrpc', ['depinchallenge', request]);
      assert.equal(
        sdk.recoverPublicKeyFromMessage(
          sdk.buildDepinRpcRequestPreimage({ method: 'depinchallenge', request }),
          signedByNode.request.signature,
          identity.address,
        ),
        identity.publicKey,
      );
    }
    // A sender cannot authenticate as its same-key, unfunded Legacy alias.
    assert.equal(identities.alias.publicKey, identities.carlos.publicKey);
    preparedForMarta = await build(identities.carlos, 'prepared before freeze', {
      messageType: 'private',
      selectedAddresses: [identities.marta.address],
    });
    staleChallenge = await challenge(identities.bob);
    streamBeforeRestart = pool.info.stream_id;
    if (process.env.NEURAI_CLIENT_WORKSPACE) await testRelays();
  },
  async frozen() {
    const oldContext = pool.context;
    await expectReason(
      sdk.receiveDepinMessages({
        rpc,
        context: oldContext,
        identity: identities.bob,
        token: fixture.token,
        network: 'regtest',
        challenge: staleChallenge.challenge,
      }),
      'membership_stale',
    );
    await refresh();
    assert.notEqual(pool.context.membership_revision, oldContext.membership_revision);
    await assert.rejects(challenge(identities.marta), /balance|authorized|permission/i);
    await assert.rejects(submit(identities.carlos, preparedForMarta), /Recipient not authorized/);
    const nonce = await challenge(identities.bob);
    assert.notEqual(nonce.challenge, staleChallenge.challenge);
    const fresh = await send(identities.carlos, 'after freeze');
    const resumed = await page(identities.bob, { cursor: savedCursor });
    assert(resumed.messages.some((m) => m.hash === fresh));
    savedCursor = resumed.cursor;
  },
  async reorg() {
    await refresh();
    await challenge(identities.marta);
  },
  async alias() {
    await refresh();
    await challenge(identities.alias);
    aliasHash = await send(identities.alias, 'same key distinct Legacy identity', {
      selectedAddresses: [identities.bob.address, identities.carlos.address],
    });
    assert(validText(await page(identities.carlos)).some((m) => m.hash === aliasHash));
    savedCursor = (await page(identities.bob)).cursor;
  },
  async restart(input) {
    const oldContext = pool.context;
    rpc = transport(input.url);
    await refresh();
    assert.notEqual(pool.context.instance_id, oldContext.instance_id);
    assert.equal(pool.info.stream_id, streamBeforeRestart);
    const messages = validText(await page(identities.bob));
    for (const hash of [firstHash, mixedHash, aliasHash]) assert(messages.some((m) => m.hash === hash));
    assert.equal((await page(identities.bob, { cursor: savedCursor })).messages.length, 0);
    const admin = await challenge(identities.alice, 'admin');
    const cleared = await sdk.clearDepinMessages({
      rpc,
      context: pool.context,
      identity: identities.alice,
      scope: fixture.token,
      challenge: admin.challenge,
      mode: 'all',
    });
    assert(cleared.removed >= 6);
    assert.equal((await page(identities.bob)).messages.length, 0);
    await assert.rejects(submit(identities.carlos, preparedForMarta), /Recipient not authorized|administratively deleted/);
    savedCursor = (await page(identities.bob)).cursor;
  },
  async 'stream-reset'(input) {
    rpc = transport(input.url);
    await refresh();
    assert.notEqual(pool.info.stream_id, streamBeforeRestart);
    await assert.rejects(page(identities.bob, { cursor: savedCursor }), /stream changed/i);
    assert.equal((await page(identities.bob)).messages.length, 0);
  },
};

/** Actual HTTP/WSS listeners and upstream RPC client, with private regtest config. */
async function testRelays() {
  const workspace = process.env.NEURAI_CLIENT_WORKSPACE;
  const { getRPC } = await import(resolve(workspace, 'rpc/dist/index.mjs'));
  const WebSocket = require(resolve(workspace, 'services/node_modules/ws'));
  const url = new URL(fixture.url);
  const node = {
    name: 'regtest',
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    neurai_url: `${url.origin}${url.pathname}`,
  };
  const processes = [];
  const launch = async (folder, config, proxy) => {
    const path = resolve(workspace, folder);
    const script = `let s='';process.stdin.on('data',b=>s+=b);process.stdin.on('end',()=>{const c=JSON.parse(s);const p=require('path');const key=p.join(process.cwd(),'getConfig.js');require.cache[key]={id:key,filename:key,loaded:true,exports:()=>c};${proxy ? "require('./index.js').listen(c.local_port,'127.0.0.1');" : "require('./index.js');"}});`;
    const child = spawn(process.execPath, ['-e', script], { cwd: path, stdio: ['pipe', 'ignore', 'inherit'] });
    child.stdin.end(JSON.stringify(config));
    processes.push(child);
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(folder + ' listener exited');
      try {
        const response = await fetch(`http://127.0.0.1:${proxy ? config.local_port : config.wss.port}/whitelist`);
        if (response.status === 200) return;
      } catch {}
      await sleep(50);
    }
    throw new Error(folder + ' listener not ready');
  };
  const originalRpc = rpc;
  let ws;
  try {
    await launch(
      'proxy',
      { nodes: [node], expected_genesis: fixture.genesis, local_port: 29181, concurrency: 4, depin_rate_limit: 0 },
      true,
    );
    await launch(
      'services',
      {
        nodes: [node],
        service_id: 'regtest-sdk-services',
        network: 'regtest',
        genesis_hash: fixture.genesis,
        depin: { rate_limit: 0 },
        wss: {
          enabled: true,
          host: '127.0.0.1',
          port: 29182,
          path: '/push',
          tls_enabled: false,
          auth_transport: 'sec-websocket-protocol',
          auth_token: 'regtest-only',
          zmq_enabled: false,
          send_initial_state: false,
        },
        http: { enabled: true, serve_www: false },
      },
      false,
    );
    const http = (endpoint) => ({ call: getRPC('public', 'public', endpoint) });
    ws = new WebSocket('ws://127.0.0.1:29182/push', ['wss', 'auth.regtest-only']);
    await once(ws, 'open');
    const pending = new Map();
    let counter = 0;
    ws.on('message', (bytes) => {
      const reply = exactParse(bytes.toString());
      const item = pending.get(reply.id);
      if (!item) return;
      pending.delete(reply.id);
      clearTimeout(item.timer);
      if (reply.error) item.reject(Object.assign(new Error(reply.error.message), reply.error));
      else item.resolve(reply.result);
    });
    const wssCall = (method, params) =>
      new Promise((resolve, reject) => {
        const id = ++counter;
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error('WSS integration timeout'));
        }, 10000);
        pending.set(id, { resolve, reject, timer });
        ws.send(stringify({ id, method, params }));
      });
    const hello = await wssCall('hello', { client: 'SDK-integration', version: '4.0.0', network: 'regtest', protocol: 'wss/2' });
    assert.equal(hello.genesis_hash, fixture.genesis);
    const aliases = {
      depingetmsginfo: 'msg_info',
      depinpoolstats: 'pool_stats',
      depinmcpstatus: 'mcp_status',
      depingetancestorrecipients: 'ancestor_recipients',
      depinchallenge: 'challenge',
      depinreceivemsg: 'receive_msg',
      depinreceiveseq: 'receive_seq',
      depinlistsections: 'sections',
      depinsubmitmsg: 'submit_msg',
      depinclearmsg: 'clear_msg',
    };
    const routes = [
      ['RPC client', { call: getRPC(node.username, node.password, node.neurai_url) }],
      ['HTTP proxy', http('http://127.0.0.1:29181/rpc')],
      ['HTTP indexer', http('http://127.0.0.1:29182/rpc')],
      ['WSS indexer', { call: (method, params) => wssCall('depin.' + aliases[method], params) }],
    ];
    for (const [name, adapter] of routes) {
      rpc = adapter;
      await refresh();
      for (const method of ['depinpoolstats', 'depinmcpstatus', 'depinlistsections', 'depingetancestorrecipients']) await call(method);
      const hash = await send(identities.carlos, 'message through ' + name, {
        messageType: 'private',
        selectedAddresses: [identities.bob.address],
      });
      assert(validText(await page(identities.bob)).some((m) => m.hash === hash));
      const ch = await challenge(identities.bob);
      await sdk.listDepinSectionsPrivate({
        rpc,
        context: pool.context,
        identity: identities.bob,
        scope: fixture.token,
        challenge: ch.challenge,
      });
      const timeCh = await challenge(identities.bob);
      await sdk.receiveDepinMessages({
        rpc,
        context: pool.context,
        identity: identities.bob,
        token: fixture.token,
        challenge: timeCh.challenge,
        network: 'regtest',
        mode: 'timestamp',
      });
      const admin = await challenge(identities.alice, 'admin');
      await sdk.clearDepinMessages({
        rpc,
        context: pool.context,
        identity: identities.alice,
        scope: fixture.token,
        challenge: admin.challenge,
        mode: 'expired',
      });
      await assert.rejects(
        sdk.callDepinRpc({
          rpc,
          context: { ...pool.context, instance_id: 'aa'.repeat(32) },
          method: 'depinchallenge',
          identity: identities.bob,
          token: fixture.token,
        }),
        (error) =>
          error.data?.depin_error === 'service_mismatch' ||
          error.error?.data?.depin_error === 'service_mismatch' ||
          error.depinError === 'service_mismatch' ||
          /identity mismatch|service/i.test(error.message ?? error.error?.message ?? error.description),
      );
      console.error('Relay coverage passed:', name);
    }
  } finally {
    ws?.close();
    rpc = originalRpc;
    for (const child of processes) {
      if (child.exitCode === null) {
        const exited = once(child, 'exit');
        child.kill('SIGTERM');
        await exited;
      }
    }
    await refresh();
  }
}
for await (const line of createInterface({ input: process.stdin })) {
  let input;
  try {
    input = JSON.parse(line);
    await stages[input.stage](input);
    console.log(JSON.stringify({ ok: true, stage: input.stage }));
  } catch (error) {
    console.error(error.stack);
    console.log(JSON.stringify({ ok: false, stage: input?.stage, error: error.message }));
    process.exitCode = 1;
    break;
  }
}
