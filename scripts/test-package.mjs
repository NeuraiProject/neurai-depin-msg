/**
 * Persistent package-consumer gate (plan v2 §7.2).
 *
 * Packs the already-built artifacts without lifecycle scripts, installs the
 * tarball in an isolated consumer, and verifies:
 *   1. ESM import and CJS require with the 3.0.0 surface;
 *   2. retired protocol-1 symbols are absent;
 *   3. the IIFE bundle runs in a scope without Node globals (no Buffer,
 *      no require, no process) and still signs/verifies;
 *   4. a minimal TypeScript consumer compiles under NodeNext.
 * Nothing outside the mkdtemp directory is touched.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const temporaryRoot = mkdtempSync(join(tmpdir(), 'neurai-depin-msg-package-'));
const tarballDirectory = join(temporaryRoot, 'tarball');
const consumerDirectory = join(temporaryRoot, 'consumer');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args, cwd = packageRoot) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

try {
  mkdirSync(tarballDirectory, { recursive: true });
  mkdirSync(consumerDirectory, { recursive: true });

  const packOutput = run(npmCommand, [
    'pack', '--ignore-scripts', '--pack-destination', tarballDirectory, '--json'
  ]);
  const packResult = JSON.parse(packOutput);
  const tarball = join(tarballDirectory, packResult[0].filename);

  writeFileSync(
    join(consumerDirectory, 'package.json'),
    JSON.stringify({ private: true }, null, 2) + '\n'
  );
  run(npmCommand, [
    'install', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', tarball
  ], consumerDirectory);

  // 1-2. ESM + CJS surface, retired symbols absent.
  writeFileSync(join(consumerDirectory, 'runtime.mjs'), `
import * as m from '@neuraiproject/neurai-depin-msg';
const present = ['buildDepinMessage', 'signRecoverableMessage', 'verifyDepinReply',
  'decodeDepinPoolInfo', 'createSoftwareIdentity', 'requestDepinChallenge',
  'receiveDepinMessages', 'submitDepinMessage', 'clearDepinMessages',
  'listDepinSectionsPublic', 'listDepinSectionsPrivate', 'resolveDepinRecipients'];
for (const name of present) {
  if (typeof m[name] !== 'function') { console.error('ESM missing ' + name); process.exit(1); }
}
const retired = ['parseDepinPoolInfo', 'getRemoteDepinPoolInfo',
  'buildDepinMessageForRemotePool', 'isPreAuthenticatedSentinel'];
for (const name of retired) {
  if (m[name] !== undefined) { console.error('ESM still exports ' + name); process.exit(1); }
}
// A real signature roundtrip through the installed package.
const sig = m.signRecoverableMessage('gate probe', '11'.repeat(32));
const pub = m.recoverPublicKeyFromMessage('gate probe', sig);
if (!m.verifyRecoverableMessage('gate probe', sig, pub)) process.exit(1);
`);
  writeFileSync(join(consumerDirectory, 'runtime.cjs'), `
const m = require('@neuraiproject/neurai-depin-msg');
if (typeof m.buildDepinMessage !== 'function') process.exit(1);
if (typeof m.verifyDepinReply !== 'function') process.exit(1);
if (m.parseDepinPoolInfo !== undefined) process.exit(1);
if (m.isPreAuthenticatedSentinel !== undefined) process.exit(1);
`);
  run(process.execPath, ['runtime.mjs'], consumerDirectory);
  run(process.execPath, ['runtime.cjs'], consumerDirectory);

  // 3. IIFE in an isolated realm without Node globals. Merely shadowing
  // lexical names is insufficient because globalThis.Buffer/process would
  // still expose Node to the bundle.
  writeFileSync(join(consumerDirectory, 'iife-probe.cjs'), `
const { readFileSync } = require('node:fs');
const { createContext, runInContext } = require('node:vm');
const { webcrypto } = require('node:crypto');
const { TextEncoder, TextDecoder } = require('node:util');
const source = readFileSync(
  require.resolve('@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.min.js'), 'utf8');
const sandbox = createContext({ crypto: webcrypto, TextEncoder, TextDecoder });
runInContext(source, sandbox, { timeout: 5000 });
for (const nodeGlobal of ['Buffer', 'require', 'process', 'module', 'exports']) {
  if (nodeGlobal in sandbox) {
    console.error('isolated IIFE realm unexpectedly exposes ' + nodeGlobal);
    process.exit(1);
  }
}
const api = sandbox.neuraiDepinMsg;
if (!api || typeof api.signRecoverableMessage !== 'function') {
  console.error('IIFE did not expose the API without Node globals');
  process.exit(1);
}
const sig = api.signRecoverableMessage('iife probe', '22'.repeat(32));
const pub = api.recoverPublicKeyFromMessage('iife probe', sig);
if (!api.verifyRecoverableMessage('iife probe', sig, pub)) {
  console.error('IIFE signature roundtrip failed without Buffer');
  process.exit(1);
}
if (api.parseDepinPoolInfo !== undefined || api.isPreAuthenticatedSentinel !== undefined) {
  console.error('IIFE still exposes retired protocol-1 symbols');
  process.exit(1);
}
`);
  run(process.execPath, ['iife-probe.cjs'], consumerDirectory);

  // 4. Minimal TypeScript consumer under NodeNext.
  writeFileSync(join(consumerDirectory, 'consumer.mts'), `
import {
  createSoftwareIdentity, requestDepinChallenge, receiveDepinMessages,
  getDepinPoolInfo, submitDepinMessage, verifyDepinReply, openBoundReply,
  signRecoverableMessage, decodeWIF, buildDepinPreimage,
  buildDepinMessageForPool,
  type DepinRpc, type PoolTrust, type PoolPin, type SenderIdentity,
  type VerifiedDepinReply, type ReceiveMessagesResult
} from '@neuraiproject/neurai-depin-msg';

const rpc: DepinRpc = { call: async () => ({}) };
const trust: PoolTrust = { mode: 'tofu' };

async function usage(): Promise<void> {
  const identity: SenderIdentity = await createSoftwareIdentity({
    privateKey: '11'.repeat(32), network: 'test'
  });
  const preimage = await buildDepinPreimage({
    token: '&TEST', senderAddress: identity.address,
    senderPubKey: identity.publicKey, message: 'x', messageType: 'group',
    recipientPubKeys: [identity.publicKey], timestamp: 1, network: 'test'
  });
  const digest: Uint8Array = preimage.messageDigest;
  const digestHex: string = preimage.messageDigestHex;
  const poolInfo = await getDepinPoolInfo({ rpc, serviceId: 'svc', trust });
  const pin: PoolPin = poolInfo.pin;
  const c = await requestDepinChallenge({
    rpc, identity, token: pin.poolRoot, poolPublicKey: pin.poolPublicKey
  });
  const r: ReceiveMessagesResult = await receiveDepinMessages({
    rpc, identity, token: pin.poolRoot, challenge: c.challenge,
    poolPublicKey: pin.poolPublicKey, network: 'test'
  });
  const verified: VerifiedDepinReply = verifyDepinReply({
    reply: {}, method: 'depingetmsginfo', token: pin.poolRoot,
    poolPublicKey: pin.poolPublicKey
  });
  await openBoundReply(verified, identity.openReply);
  await submitDepinMessage({ rpc, identity, messageHex: '00', poolPublicKey: pin.poolPublicKey });
  await buildDepinMessageForPool({
    rpc, identity, token: pin.poolRoot, poolRoot: pin.poolRoot,
    poolPublicKey: pin.poolPublicKey, maxRecipients: 20,
    message: 'x', messageType: 'group', timestamp: 1, network: 'test'
  });
  const sig: string = signRecoverableMessage('x', '11'.repeat(32));
  const wif = decodeWIF('cW8vy4nJbZZ4W4L8CsRZp22h3WeWrCXgNwrm1264wW8VAmzHMuJ4');
  void [r, sig, wif.compressed, digest, digestHex];
}
void usage;
`);
  writeFileSync(join(consumerDirectory, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      strict: true, noEmit: true, module: 'NodeNext',
      moduleResolution: 'NodeNext', target: 'ES2022'
    },
    include: ['consumer.mts']
  }, null, 2) + '\n');

  const typescriptBin = resolve(packageRoot, 'node_modules/typescript/bin/tsc');
  readFileSync(typescriptBin); // clear error if dev deps are missing
  run(process.execPath, [typescriptBin, '-p', 'tsconfig.json'], consumerDirectory);

  console.log('package gate: ESM, CJS, IIFE (no Node globals) and NodeNext types passed');
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
