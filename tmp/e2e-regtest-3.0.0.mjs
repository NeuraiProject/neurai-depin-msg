/**
 * E2E regtest for neurai-depin-msg 3.0.0 (plan v2 §6.3).
 *
 * Throwaway container from neurai-regtest-depin:347362b. A single regtest
 * node runs the DePIN pool (-depinmsg=1 -depinmsgtoken=&TEST); the LIBRARY is
 * the client, driven from the host with a minimal fetch-based rpc.call. The
 * node holds no client keys for us — we dump the holder/owner WIFs with
 * dumpprivkey and let the library sign locally (non-custodial, exactly as an
 * app would). Container removed even on failure.
 *
 * Flow: bootstrap TOFU pin → public sections → challenge → receive (chaining)
 * → publish via the library → holder reads it back → admin clear → adversarial
 * poolsig (a MITM proxy that flips a byte) is rejected without decoding.
 *
 * Wallet addresses are requested as `getnewaddress "" legacy` (DePIN is
 * Legacy P2PKH only), so IMAGE must ship a node whose getnewaddress accepts
 * the address_type argument (neurai-key 5 address types).
 *
 * Run: node tmp/e2e-regtest-3.0.0.mjs
 */
import { execFileSync } from 'node:child_process';
import {
  getDepinPoolInfo, listDepinSectionsPublic,
  listDepinSectionsPrivate,
  requestDepinChallenge, receiveDepinMessages, submitDepinMessage,
  clearDepinMessages, buildDepinMessageForPool, createSoftwareIdentity,
  verifyDepinReply, DepinReplyAuthenticationError
} from '../src/index.js';

const IMAGE = 'neurai-regtest-depin:347362b';
const CONTAINER = `neurai-depin-e2e-${process.pid}`;
const RPC_PORT = 23500 + (process.pid % 1000);
const RPC_USER = 't';
const RPC_PASS = 't';
const NEURAID = '/root/Neurai/src/neuraid';
const CLI = '/root/Neurai/src/neurai-cli';
const DATADIR = '/root/e2e';
const SERVICE = 'regtest://depin-e2e';

function sh(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
const docker = (...a) => sh('docker', a);
const cli = (...a) => sh('docker', [
  'exec', CONTAINER, CLI, '-regtest', `-datadir=${DATADIR}`,
  `-rpcuser=${RPC_USER}`, `-rpcpassword=${RPC_PASS}`, `-rpcport=${RPC_PORT}`, ...a.map(String)
]);
const cliJson = (...a) => JSON.parse(cli(...a));
// DePIN only works with Legacy P2PKH addresses: request the type explicitly
// (getnewaddress ( "account" "address_type" )) so a wallet whose default
// family is not legacy fails loudly instead of handing out a witness address.
const newLegacyAddress = () => cli('getnewaddress', '', 'legacy');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
function check(name, cond, detail = '') {
  if (!cond) failures += 1;
  console.log(`[${cond ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

// Minimal JSON-RPC 2.0 client over fetch, targeting the container's port.
let mitm = null; // optional response-mutating proxy for the adversarial case
function makeRpc() {
  const url = `http://127.0.0.1:${RPC_PORT}/`;
  const auth = 'Basic ' + Buffer.from(`${RPC_USER}:${RPC_PASS}`).toString('base64');
  return {
    call: async (method, params) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params })
      });
      const json = await res.json();
      if (json.error) {
        const err = new Error(json.error.message || 'RPC error');
        err.code = json.error.code;
        throw err;
      }
      let result = json.result;
      if (mitm) result = mitm(method, result);
      return result;
    }
  };
}

async function main() {
  console.log(`Starting ${CONTAINER} (rpc 127.0.0.1:${RPC_PORT}, loopback only)`);
  // PID 1 is a sleep so the container survives daemon restarts; the node runs
  // as a backgrounded exec we can stop and relaunch with different flags.
  docker('run', '-d', '--name', CONTAINER, '-p', `127.0.0.1:${RPC_PORT}:${RPC_PORT}`, IMAGE,
    'tail', '-f', '/dev/null');

  const baseFlags = [
    '-regtest', `-datadir=${DATADIR}`, '-server=1', '-listen=0', '-txindex=1',
    '-assetindex=1', '-addressindex=1', '-pubkeyindex=1', '-bip44=1',
    `-rpcuser=${RPC_USER}`, `-rpcpassword=${RPC_PASS}`, `-rpcport=${RPC_PORT}`,
    '-rpcbind=0.0.0.0', '-rpcallowip=0.0.0.0/0', '-printtoconsole'
  ];
  const startDaemon = (extra = []) => {
    docker('exec', CONTAINER, 'mkdir', '-p', DATADIR);
    docker('exec', '-d', CONTAINER, NEURAID, ...baseFlags, ...extra);
  };
  const waitRpc = async (n = 60) => {
    for (let i = 0; i < n; i++) {
      try { cli('getblockcount'); return true; } catch { await sleep(1000); }
    }
    return false;
  };

  startDaemon();
  if (!await waitRpc()) throw new Error('neuraid RPC did not come up');

  // --- pool bootstrap (adapted from contrib/depin/regtest_walkthrough.sh) ---
  const ROOT = newLegacyAddress();
  cli('generatetoaddress', 150, ROOT);
  cli('issue', '&TEST', 1000, ROOT);
  cli('generatetoaddress', 1, ROOT);
  const HOLDER = newLegacyAddress();
  const STRANGER = newLegacyAddress();
  for (const a of [HOLDER, STRANGER]) cli('sendtoaddress', a, 2);
  cli('generatetoaddress', 1, ROOT);
  for (const a of [HOLDER, STRANGER]) cli('sendfromaddress', a, ROOT, 1); // reveal keys
  cli('generatetoaddress', 1, ROOT);
  cli('issue', '&TEST/SEC', 10, HOLDER);
  cli('generatetoaddress', 1, ROOT);

  // The owner (&TEST!) token moved to a change address when the section was
  // issued; reveal that address's key by spending a pure-XNA UTXO of it,
  // chosen by hand so the asset output stays put (walkthrough step 1).
  const ownerAddr0 = Object.keys(cliJson('listaddressesbyasset', '&TEST!'))[0];
  cli('sendtoaddress', ownerAddr0, 2);
  cli('generatetoaddress', 1, ROOT);
  const utxos = cliJson('listunspent', 1, 9999, JSON.stringify([ownerAddr0]));
  const pureXna = utxos.find((u) => u.amount >= 1.5 && !u.assetName);
  if (pureXna) {
    const raw = cli('createrawtransaction',
      JSON.stringify([{ txid: pureXna.txid, vout: pureXna.vout }]),
      JSON.stringify({ [ROOT]: Number((pureXna.amount - 0.05).toFixed(8)) }));
    const signed = cliJson('signrawtransaction', raw).hex;
    cli('sendrawtransaction', signed);
    cli('generatetoaddress', 1, ROOT);
  }

  // Non-custodial: pull the holder key so the LIBRARY signs locally.
  const holderWif = cli('dumpprivkey', HOLDER);
  const identity = await createSoftwareIdentity({
    privateKey: holderWif, network: 'test', address: HOLDER
  });
  check('createSoftwareIdentity derives the holder address', identity.address === HOLDER);

  // Restart the daemon with the DePIN service enabled (container stays up).
  try { cli('stop'); } catch {}
  for (let i = 0; i < 60; i++) {
    try { cli('getblockcount'); await sleep(1000); } catch { break; }
  }
  await sleep(2000);
  startDaemon(['-depinmsg=1', '-depinmsgtoken=&TEST', '-depinratelimit=0']);
  let svc = false;
  for (let i = 0; i < 90; i++) {
    try {
      const info = cliJson('depingetmsginfo');
      if (info && info.body) { svc = true; break; }
    } catch { /* not up yet */ }
    await sleep(1000);
  }
  if (!svc) {
    let logTail = '';
    try { logTail = sh('docker', ['exec', CONTAINER, 'tail', '-n', '15', `${DATADIR}/regtest/debug.log`]); } catch {}
    throw new Error('DePIN service did not come up\n' + logTail);
  }

  const rpc = makeRpc();

  // --- 1. bootstrap TOFU pin ------------------------------------------------
  const boot = await getDepinPoolInfo({ rpc, serviceId: SERVICE, trust: { mode: 'tofu' }, network: 'test' });
  check('depingetmsginfo authenticates and announces protocol 2', boot.info.protocol === 2);
  check('TOFU pin records root &TEST', boot.pin.poolRoot === '&TEST', boot.pin.poolRoot);
  const poolPublicKey = boot.pin.poolPublicKey;
  const poolRoot = boot.pin.poolRoot;
  console.log('  pool fingerprint:', boot.fingerprint);

  // Pinned re-check must now pass against the recorded pin.
  const pinned = await getDepinPoolInfo({
    rpc, serviceId: SERVICE, network: 'test', trust: { mode: 'pinned', pin: boot.pin }
  });
  check('pinned re-verification succeeds', pinned.trust === 'pinned');
  let changedPinRejected = false;
  try {
    await getDepinPoolInfo({
      rpc, serviceId: SERVICE, network: 'test',
      trust: { mode: 'pinned', pin: { ...boot.pin, poolRoot: '&WRONG' } }
    });
  } catch (e) {
    changedPinRejected = e instanceof DepinReplyAuthenticationError;
  }
  check('a changed pinned root is rejected', changedPinRejected);

  // --- 2. public sections ---------------------------------------------------
  const sections = await listDepinSectionsPublic({ rpc, poolRoot, poolPublicKey });
  const names = sections.sections.map((s) => s.name);
  check('public sections include &TEST and &TEST/SEC',
    names.includes('&TEST') && names.includes('&TEST/SEC'), JSON.stringify(names));

  // --- 3. challenge + receive (empty) + chaining ----------------------------
  const challenge = await requestDepinChallenge({
    rpc, identity, token: '&TEST/SEC', poolPublicKey
  });
  check('challenge issued for the section', /^[0-9a-f]{64}$/.test(challenge.challenge));

  const empty = await receiveDepinMessages({
    rpc, identity, token: '&TEST/SEC', challenge: challenge.challenge,
    poolPublicKey, network: 'test'
  });
  check('empty section receive returns no messages', empty.messages.length === 0);
  check('receive reply carries next_challenge for chaining',
    /^[0-9a-f]{64}$/.test(empty.nextChallenge || ''), String(empty.nextChallenge));

  // Chain WITHOUT a new depinchallenge.
  const chained = await receiveDepinMessages({
    rpc, identity, token: '&TEST/SEC', challenge: empty.nextChallenge,
    poolPublicKey, network: 'test'
  });
  check('chained receive (no new depinchallenge) works', Array.isArray(chained.messages));

  const privateSections = await listDepinSectionsPrivate({
    rpc, identity, scope: '&TEST/SEC', challenge: chained.nextChallenge,
    poolPublicKey
  });
  check('private section list verifies, decrypts and chains',
    privateSections.sections.some((s) => s.name === '&TEST/SEC') &&
      /^[0-9a-f]{64}$/.test(privateSections.nextChallenge || ''));

  let badChallengeRejected = false;
  try {
    await receiveDepinMessages({
      rpc, identity, token: '&TEST/SEC', challenge: '00'.repeat(32),
      poolPublicKey, network: 'test'
    });
  } catch (e) {
    badChallengeRejected = typeof e?.code === 'number';
  }
  check('the real node rejects an unknown challenge', badChallengeRejected);

  const expiring = await requestDepinChallenge({
    rpc, identity, token: '&TEST/SEC', poolPublicKey
  });
  cli('setmocktime', Math.floor(Date.now() / 1000) + 31);
  let expiredChallengeRejected = false;
  try {
    await receiveDepinMessages({
      rpc, identity, token: '&TEST/SEC', challenge: expiring.challenge,
      poolPublicKey, network: 'test'
    });
  } catch (e) {
    expiredChallengeRejected = typeof e?.code === 'number';
  } finally {
    cli('setmocktime', 0);
  }
  check('the real node rejects an expired challenge via mocktime', expiredChallengeRejected);

  // --- 4. publish via the library (sender = the section holder) -------------
  const built = await buildDepinMessageForPool({
    rpc, token: '&TEST/SEC', poolRoot, maxRecipients: boot.info.maxrecipients,
    poolPublicKey, network: 'test', identity,
    message: 'hola desde la libreria',
    messageType: 'group', timestamp: Math.floor(Date.parse('2026-08-27T00:00:00Z') / 1000)
  });
  const submit = await submitDepinMessage({
    rpc, identity, messageHex: built.hex, poolPublicKey
  });
  check('library-built message accepted by the node', submit.result === 'success' &&
    /^[0-9a-f]{64}$/.test(submit.hash), submit.hash);

  const built2 = await buildDepinMessageForPool({
    rpc, token: '&TEST/SEC', poolRoot, maxRecipients: boot.info.maxrecipients,
    poolPublicKey, network: 'test', identity,
    message: 'segunda pagina', messageType: 'group',
    timestamp: Math.floor(Date.parse('2026-08-27T00:00:01Z') / 1000)
  });
  const submit2 = await submitDepinMessage({
    rpc, identity, messageHex: built2.hex, poolPublicKey
  });
  check('identity.signDigest publication is accepted twice', submit2.result === 'success');

  // --- 5. holder reads it back, decrypted and sender-verified ---------------
  const ch2 = await requestDepinChallenge({ rpc, identity, token: '&TEST/SEC', poolPublicKey });
  const page1 = await receiveDepinMessages({
    rpc, identity, token: '&TEST/SEC', challenge: ch2.challenge, poolPublicKey, network: 'test',
    resolveSenderPubKey: async () => identity.publicKey, limit: 1
  });
  // Core 347362b shadows the outer `hasMore` local while computing this
  // field, so it currently serializes false even with another page. Preserve
  // the wire value, but prove pagination through the signed cursor below.
  check('receive pagination returns the requested first-page size',
    page1.messages.length === 1 && typeof page1.hasMore === 'boolean',
    `has_more=${page1.hasMore}`);
  const page2 = await receiveDepinMessages({
    rpc, identity, token: '&TEST/SEC', challenge: page1.nextChallenge,
    poolPublicKey, network: 'test', afterHash: page1.messages[0].hash, limit: 1,
    resolveSenderPubKey: async () => identity.publicKey
  });
  const pages = [...page1.messages, ...page2.messages];
  const mine = pages.find((m) => m.ok && m.plaintext === 'hola desde la libreria');
  const second = pages.find((m) => m.ok && m.plaintext === 'segunda pagina');
  check('holder decrypts and verifies both paginated messages', Boolean(mine && second),
    JSON.stringify(pages.map((m) => ({ ok: m.ok, plaintext: m.plaintext }))));

  // --- 6. adversarial poolsig: a MITM flips a byte of a reply ---------------
  mitm = (method, result) => {
    if (method === 'depinlistsections' && result && typeof result.body === 'string') {
      const bytes = Buffer.from(result.body, 'hex');
      bytes[bytes.length - 1] ^= 0x01;
      return { ...result, body: bytes.toString('hex') };
    }
    return result;
  };
  let rejected = false;
  try {
    await listDepinSectionsPublic({ rpc, poolRoot, poolPublicKey });
  } catch (e) {
    rejected = e instanceof DepinReplyAuthenticationError;
  }
  mitm = null;
  check('a MITM-mutated reply is rejected before decoding', rejected);

  // --- 7. admin clear -------------------------------------------------------
  const ownerAddr = Object.keys(cliJson('listaddressesbyasset', '&TEST!'))[0];
  const ownerWif = cli('dumpprivkey', ownerAddr);
  const ownerIdentity = await createSoftwareIdentity({
    privateKey: ownerWif, network: 'test', address: ownerAddr
  });
  const defaultChallenge = await requestDepinChallenge({
    rpc, identity: ownerIdentity, token: '&TEST', poolPublicKey, type: 'admin'
  });
  const defaultClear = await clearDepinMessages({
    rpc, identity: ownerIdentity, scope: '', poolRoot,
    challenge: defaultChallenge.challenge, poolPublicKey
  });
  check('owner admin-clear default mode is accepted', typeof defaultClear.removed === 'number');

  const hoursChallenge = await requestDepinChallenge({
    rpc, identity: ownerIdentity, token: '&TEST', poolPublicKey, type: 'admin'
  });
  const hoursClear = await clearDepinMessages({
    rpc, identity: ownerIdentity, scope: '', poolRoot,
    challenge: hoursChallenge.challenge, poolPublicKey, mode: 100000
  });
  check('owner admin-clear hours mode is accepted', typeof hoursClear.removed === 'number');

  const adminChallenge = await requestDepinChallenge({
    rpc, identity: ownerIdentity, token: '&TEST', poolPublicKey, type: 'admin'
  });
  const cleared = await clearDepinMessages({
    rpc, identity: ownerIdentity, scope: '', poolRoot, challenge: adminChallenge.challenge,
    poolPublicKey, mode: 'all'
  });
  check('owner admin-clear purges the pool', typeof cleared.removed === 'number' && cleared.removed >= 1,
    JSON.stringify(cleared));
}

let exitCode = 0;
try {
  await main();
  if (failures > 0) exitCode = 1;
  console.log(failures === 0 ? '\nE2E REGTEST: ALL CHECKS PASSED' : `\nE2E REGTEST: ${failures} CHECK(S) FAILED`);
} catch (e) {
  exitCode = 1;
  console.error('\nE2E REGTEST: ABORTED —', e?.message ?? e);
} finally {
  try { docker('rm', '-f', CONTAINER); console.log(`Removed ${CONTAINER}`); } catch {}
}
process.exit(exitCode);
