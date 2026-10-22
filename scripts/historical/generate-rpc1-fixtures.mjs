#!/usr/bin/env node
/**
 * Generates the Core-produced test fixtures in test/fixtures/ by driving a
 * throwaway neuraid regtest node: issues a DePIN root and section, reveals
 * public keys (compressed and uncompressed), resolves recipients, submits
 * messages built by this library (Core's acceptance validates serialization,
 * hash and signature), and captures depinreceivemsg responses (plain,
 * paginated, and ECIES-wrapped) plus the gateway INFO line.
 *
 * Usage:
 *   NEURAI_BIN_DIR=/path/to/Neurai/src node scripts/generate-fixtures.mjs
 *
 * The daemon and its datadir are temporary; fixtures and key material
 * (regtest-only keys, safe to commit) are written to test/fixtures/.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { secp256k1 } from '@noble/curves/secp256k1';
import * as lib from '../src/index.js';

const BIN_DIR = process.env.NEURAI_BIN_DIR || '/home/code/src/neurai/Neurai/src';
const NEURAID = join(BIN_DIR, 'neuraid');
const CLI = join(BIN_DIR, 'neurai-cli');

const ROOT = '&FIXTURE';
const SECTION = '&FIXTURE/NEWS';
const DEPIN_PORT = 18771;

const repoDir = dirname(dirname(fileURLToPath(import.meta.url)));
const fixturesDir = join(repoDir, 'test', 'fixtures');
mkdirSync(fixturesDir, { recursive: true });

// NEURAI_DATADIR reuses an already-running daemon's datadir (resume after a
// failure without re-mining); otherwise a throwaway datadir is created.
const reusedDatadir = process.env.NEURAI_DATADIR || null;
const datadir = reusedDatadir || mkdtempSync(join(tmpdir(), 'neurai-fixtures-'));
console.log('datadir:', datadir, reusedDatadir ? '(reused)' : '(new)');

function cli(...args) {
  const out = execFileSync(CLI, ['-regtest', `-datadir=${datadir}`, ...args], {
    encoding: 'utf8', timeout: 60000
  }).trim();
  try { return JSON.parse(out); } catch { return out; }
}

// DePIN only works with Legacy P2PKH addresses, so every wallet address is
// requested with an explicit address type. Without it a wallet whose default
// family is not legacy (a -pqwallet=1 wallet defaults to generic AuthScript
// v1) would silently hand out witness addresses; with it the node fails
// loudly instead. Needs a node whose getnewaddress accepts
// ( "account" "address_type" ).
function newLegacyAddress() {
  return cli('getnewaddress', '', 'legacy');
}

function cliRaw(...args) {
  try {
    return { ok: true, result: cli(...args) };
  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || '').toString().trim();
    return { ok: false, error: msg };
  }
}

// --- base58check encode (script-local; the library only decodes) ---
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
async function base58CheckEncode(versionBytes, payload) {
  const data = new Uint8Array([...versionBytes, ...payload]);
  const checksum = (await lib.doubleSha256(data)).slice(0, 4);
  const full = new Uint8Array([...data, ...checksum]);
  let num = 0n;
  for (const b of full) num = num * 256n + BigInt(b);
  let out = '';
  while (num > 0n) { out = ALPHABET[Number(num % 58n)] + out; num /= 58n; }
  for (const b of full) { if (b === 0) out = '1' + out; else break; }
  return out;
}

// Regtest still runs real KAWPOW with DGW retargeting: back-to-back blocks
// with real timestamps send the difficulty up until CPU mining stalls, and a
// single generatetoaddress call can exhaust maxtries without finding a block.
// Advance mocktime past the tip before every block (large steps while the
// difficulty is high, ~2 target spacings at the floor) and retry until the
// height actually advances.
function mineBlocks(n, addr) {
  const target = cli('getblockcount') + n;
  let attempts = 0;
  while (cli('getblockcount') < target) {
    const tipTime = cli('getblock', cli('getbestblockhash')).time;
    const difficulty = cli('getmininginfo').difficulty;
    const step = difficulty > 2e-06 ? 3600 : 120;
    cli('setmocktime', String(tipTime + step));
    cliRaw('generatetoaddress', '1', addr, '10000000');
    if (++attempts > n * 20 + 200) throw new Error('mining stalled at ' + cli('getblockcount'));
  }
}

async function main() {
  // 1. Launch the daemon (unless one is already serving the reused datadir)
  if (reusedDatadir && cliRaw('getblockcount').ok) {
    console.log('reusing running daemon at height', cli('getblockcount'));
  } else {
  execFileSync(NEURAID, [
    '-regtest', `-datadir=${datadir}`, '-daemon', '-server',
    // -addressindex should not be needed, but Core gates pubkey-index
    // ingestion behind (fAddressIndex || fSpentIndex) in ConnectBlock, so
    // without it no revealed key is ever indexed (bug reported upstream).
    '-assetindex', '-pubkeyindex', '-addressindex',
    '-depinmsg=1', `-depinmsgtoken=${ROOT}`, `-depinmsgport=${DEPIN_PORT}`,
    '-depinmsgbind=0.0.0.0', '-depinmsgmaxusers=20',
    '-fallbackfee=0.001', '-txindex',
    // Regtest deployment timeouts are in the past; extend them so the asset
    // softforks can still lock in and activate.
    '-vbparams=assets:0:9999999999',
    '-vbparams=messaging_restricted:0:9999999999',
    '-vbparams=transfer_script:0:9999999999',
    '-vbparams=enforce_value:0:9999999999',
    '-vbparams=coinbase:0:9999999999'
  ], { encoding: 'utf8' });

  for (let i = 0; ; i++) {
    await sleep(500);
    if (cliRaw('getblockcount').ok) break;
    if (i > 60) throw new Error('neuraid did not come up');
  }
  console.log('daemon up');
  }

  try {
    // 2. Mine until the asset softfork is active (BIP9: 144-block windows,
    // threshold 108) and coinbase maturity is covered.
    const minerAddr = newLegacyAddress();
    for (let i = 0; ; i++) {
      mineBlocks(20, minerAddr);
      const info = cli('getblockchaininfo');
      const forks = info.bip9_softforks || {};
      const assets = forks.assets && forks.assets.status;
      if (assets === 'active') break;
      if (i % 5 === 0) console.log('height', info.blocks, 'assets:', assets);
      if (i > 40) throw new Error('assets softfork never activated: ' + JSON.stringify(forks));
    }
    console.log('assets active at height', cli('getblockcount'));

    // 3. Key material. r2 uses an uncompressed key imported from a fixed
    // regtest WIF so the fixture exercises 65-byte pubkeys end to end.
    const sender = newLegacyAddress();
    const r1 = newLegacyAddress();

    const r2PrivHex = '5a'.repeat(32);
    const r2Wif = await base58CheckEncode([239], lib.hexToBytes(r2PrivHex)); // no 0x01: uncompressed
    cli('importprivkey', r2Wif, '', 'false');
    const r2PubUncompressed = lib.bytesToHex(secp256k1.getPublicKey(lib.hexToBytes(r2PrivHex), false));
    const r2 = await base58CheckEncode([127], await lib.hash160(lib.hexToBytes(r2PubUncompressed)));
    console.log('addresses:', { sender, r1, r2 });

    // 4. Fund
    for (const a of [sender, r1, r2]) cli('sendtoaddress', a, '10');
    mineBlocks(1, minerAddr);

    // 5. Reveal pubkeys: one self-spend per address puts the key in scriptSig
    for (const a of [sender, r1, r2]) {
      const utxos = cli('listunspent', '1', '9999999', JSON.stringify([a]));
      if (!utxos.length) throw new Error('no utxo for ' + a);
      const u = utxos[0];
      const amount = (u.amount - 0.01).toFixed(8);
      const raw = cli('createrawtransaction',
        JSON.stringify([{ txid: u.txid, vout: u.vout }]),
        JSON.stringify({ [a]: Number(amount) }));
      let signed = cliRaw('signrawtransaction', raw);
      if (!signed.ok) signed = cliRaw('signrawtransactionwithwallet', raw);
      if (!signed.ok || !signed.result.complete) throw new Error('sign failed for ' + a);
      cli('sendrawtransaction', signed.result.hex);
    }
    mineBlocks(1, minerAddr);
    console.log('pubkeys revealed');

    // 6. Issue the DePIN root and section (units must be 0)
    cli('issue', ROOT, '100', '', '', '0', 'true');
    mineBlocks(1, minerAddr);
    cli('issue', SECTION, '100', '', '', '0', 'true');
    mineBlocks(1, minerAddr);
    console.log('issued', ROOT, 'and', SECTION);

    // 7. Distribute: sender+r1 hold the section, r2 holds the ROOT only
    // (ancestor union must still include it when sending to the section).
    // DePIN assets are soulbound: a transfer must spend AND re-output the
    // owner token, and the wallet's `transfer` coin selection sweeps every
    // UTXO of the asset (wiping earlier recipients), while
    // `transferfromaddress` never attaches the owner token. The only way to
    // fan out to several holders from one wallet is a single raw transaction
    // with explicit inputs (asset UTXO + owner token + fee) and one output
    // per recipient. Required output order: coin change, owner change, then
    // the transfers.
    const outpointOf = (asset) => {
      const info = cli('listmyassets', asset, 'true')[asset];
      if (!info || !info.outpoints || !info.outpoints.length) {
        throw new Error('no outpoint found for ' + asset);
      }
      return info.outpoints[0];
    };
    const distributeAsset = (asset, recipients) => {
      const assetOp = outpointOf(asset);
      const ownerOp = outpointOf(asset + '!');
      const feeUtxo = cli('listunspent', '1', '9999999')
        .find(u => u.spendable && u.amount >= 1);
      if (!feeUtxo) throw new Error('no XNA utxo for fees');

      const total = recipients.length; // 1 unit each
      const outputs = [
        { [newLegacyAddress()]: Number((feeUtxo.amount - 0.01).toFixed(8)) },
        { [newLegacyAddress()]: { transfer: { [asset + '!']: 1 } } },
        ...recipients.map(to => ({ [to]: { transfer: { [asset]: 1 } } }))
      ];
      const change = assetOp.amount - total;
      if (change > 0) {
        outputs.push({ [newLegacyAddress()]: { transfer: { [asset]: change } } });
      }

      const raw = cli('createrawtransaction',
        JSON.stringify([
          { txid: assetOp.txid, vout: assetOp.vout },
          { txid: ownerOp.txid, vout: ownerOp.vout },
          { txid: feeUtxo.txid, vout: feeUtxo.vout }
        ]),
        JSON.stringify(outputs));
      let signed = cliRaw('signrawtransaction', raw);
      if (!signed.ok) signed = cliRaw('signrawtransactionwithwallet', raw);
      if (!signed.ok || !signed.result.complete) {
        throw new Error('could not sign distribution tx for ' + asset);
      }
      cli('sendrawtransaction', signed.result.hex);
      mineBlocks(1, minerAddr);
    };
    distributeAsset(SECTION, [sender, r1]);
    distributeAsset(ROOT, [r2]);

    for (const [asset, addr] of [[SECTION, sender], [SECTION, r1], [ROOT, r2]]) {
      const holders = cli('listaddressesbyasset', asset);
      if (!holders[addr]) {
        throw new Error(addr + ' lost its ' + asset + ' balance: ' + JSON.stringify(holders));
      }
    }

    // 8. Recipient resolution fixtures
    const ancestorRecipients = cli('depingetancestorrecipients', SECTION, '21', ROOT);
    if (ancestorRecipients.returned < 3) {
      throw new Error('Expected sender+r1+r2 as recipients, got ' +
        JSON.stringify(ancestorRecipients));
    }
    const ancestorRecipientsDefault = cli('depingetancestorrecipients', SECTION);
    console.log('recipients:', ancestorRecipients.returned, 'truncated:', ancestorRecipients.truncated);

    // this codebase predates getaddressinfo; validateaddress carries pubkey
    const senderInfo = cli('validateaddress', sender);
    const r1Info = cli('validateaddress', r1);
    const senderWif = cli('dumpprivkey', sender);
    const r1Wif = cli('dumpprivkey', r1);
    const senderPub = senderInfo.pubkey;
    const r1Pub = r1Info.pubkey;

    // 9. Build a group message with THIS library and let Core validate it.
    // Node time is mocked chain time (mineBlocks advances it from the 2023
    // genesis); wall-clock timestamps would be years in the node's future
    // and rejected. Stamp messages with the tip's time instead.
    const timestamp = cli('getblock', cli('getbestblockhash')).time;
    const groupBuilt = await lib.buildDepinMessage({
      token: SECTION,
      senderAddress: sender,
      senderPubKey: senderPub,
      privateKey: senderWif,
      message: 'group fixture message: hello &FIXTURE/NEWS',
      messageType: 'group',
      recipientPubKeys: ancestorRecipients.recipients.map(r => r.pubkey),
      timestamp,
      network: 'regtest'
    });
    const submitGroup = cliRaw('depinsubmitmsg', groupBuilt.hex);
    if (!submitGroup.ok) throw new Error('Core rejected group message: ' + submitGroup.error);
    console.log('group message accepted:', JSON.stringify(submitGroup.result));

    // Private message: sender -> r2 (uncompressed recipient)
    const privateBuilt = await lib.buildDepinMessage({
      token: SECTION,
      senderAddress: sender,
      senderPubKey: senderPub,
      privateKey: senderWif,
      message: 'private fixture message for the uncompressed key',
      messageType: 'private',
      recipientPubKeys: [r2PubUncompressed],
      timestamp: timestamp + 1,
      network: 'regtest'
    });
    const submitPrivate = cliRaw('depinsubmitmsg', privateBuilt.hex);
    if (!submitPrivate.ok) throw new Error('Core rejected private message: ' + submitPrivate.error);
    console.log('private message accepted:', JSON.stringify(submitPrivate.result));

    // 10. Negative submissions Core must reject
    // (a) tampered payload byte -> signature no longer matches
    const tampered = groupBuilt.hex.slice(0, 120) +
      (groupBuilt.hex[120] === '0' ? '1' : '0') + groupBuilt.hex.slice(121);
    const submitTampered = cliRaw('depinsubmitmsg', tampered);

    // (b) signature over the legacy preimage (no messageType) -> rejected
    const legacyFields = lib.concatBytes(
      // serialize(token) || serialize(sender) || int64 || vector(payload)  — NO messageType
      new Uint8Array(await (async () => {
        const enc = new TextEncoder();
        const t = enc.encode(SECTION), s = enc.encode(sender);
        const payload = lib.hexToBytes(lib.normalizeHex(
          (await lib.parseDepinMessage(groupBuilt.hex)).encryptedPayloadHex));
        const parts = [];
        parts.push(new Uint8Array([t.length]), t);
        parts.push(new Uint8Array([s.length]), s);
        const ts = new Uint8Array(8);
        new DataView(ts.buffer).setBigInt64(0, BigInt(timestamp + 2), true);
        parts.push(ts);
        const lenPrefix = payload.length < 253
          ? new Uint8Array([payload.length])
          : new Uint8Array([253, payload.length & 0xff, payload.length >> 8]);
        parts.push(lenPrefix, payload);
        return lib.concatBytes(...parts);
      })())
    );
    const legacyHash = await lib.doubleSha256(legacyFields);
    const senderPrivHex = await lib.wifToHex(senderWif);
    const legacySig = secp256k1.sign(legacyHash, lib.hexToBytes(senderPrivHex)).toDERRawBytes();
    const legacyAssembled = await lib.assembleDepinMessage({
      token: SECTION,
      senderAddress: sender,
      encryptedPayloadHex: (await lib.parseDepinMessage(groupBuilt.hex)).encryptedPayloadHex,
      messageType: 'group',
      timestamp: timestamp + 2
    }, lib.bytesToHex(legacySig));
    const submitLegacy = cliRaw('depinsubmitmsg', legacyAssembled.hex);
    console.log('tampered rejected:', !submitTampered.ok, '| legacy rejected:', !submitLegacy.ok);

    // 11. Reception fixtures (wrapped, since the wallet knows revealed keys)
    const receiveR1 = cli('depinreceivemsg', SECTION, r1, '0');
    const receiveR1Paged = cli('depinreceivemsg', SECTION, r1, '0', '', '1');
    const receiveR2Root = cli('depinreceivemsg', ROOT, r2, '0');

    // Decrypt the wrappers now so the plain shapes are also committed
    const r1PrivHex = await lib.wifToHex(r1Wif);
    const unwrapOrPassthrough = async (resp, privHex) => {
      if (resp && typeof resp === 'object' && !Array.isArray(resp) && resp.encrypted) {
        const plaintext = await lib.decryptDepinReceiveEncryptedPayload(resp.encrypted, privHex);
        if (plaintext === null) throw new Error('could not unwrap response fixture');
        return JSON.parse(plaintext);
      }
      return resp;
    };
    const receiveR1Plain = await unwrapOrPassthrough(receiveR1, r1PrivHex);
    const receiveR1PagedPlain = await unwrapOrPassthrough(receiveR1Paged, r1PrivHex);
    const receiveR2Plain = await unwrapOrPassthrough(receiveR2Root, r2PrivHex);

    // 12. Gateway INFO line over TCP. NEURAI_INFO_HOST overrides the target
    // when the daemon runs elsewhere (e.g. inside a container).
    const infoHost = process.env.NEURAI_INFO_HOST || '127.0.0.1';
    const infoLine = await new Promise((resolve, reject) => {
      const sock = connect({ host: infoHost, port: DEPIN_PORT }, () => sock.write('INFO\n'));
      let data = '';
      sock.on('data', d => {
        data += d.toString();
        if (data.includes('\n') || data.includes('|')) { sock.end(); }
      });
      sock.on('close', () => resolve(data.trim()));
      sock.on('error', reject);
      setTimeout(() => { try { sock.destroy(); } catch {} resolve(data.trim()); }, 5000);
    });
    console.log('INFO:', infoLine.slice(0, 100));

    const msgInfo = cliRaw('depingetmsginfo').result ?? null;

    // 13. Write fixtures
    const fixtures = {
      generatedBy: 'scripts/generate-fixtures.mjs',
      coreVersion: cli('getnetworkinfo').subversion,
      network: 'regtest',
      material: {
        sender: { address: sender, pubkey: senderPub, wif: senderWif, privHex: senderPrivHex },
        r1: { address: r1, pubkey: r1Pub, wif: r1Wif, privHex: r1PrivHex },
        r2: { address: r2, pubkey: r2PubUncompressed, wif: r2Wif, privHex: r2PrivHex, uncompressed: true }
      },
      tokens: { root: ROOT, section: SECTION },
      ancestorRecipients,
      ancestorRecipientsDefault,
      messages: {
        group: { params: { token: SECTION, sender, timestamp, messageType: 'group' }, built: groupBuilt, submitResult: submitGroup.result },
        private: { params: { token: SECTION, sender, timestamp: timestamp + 1, messageType: 'private' }, built: privateBuilt, submitResult: submitPrivate.result }
      },
      negative: {
        tampered: { hex: tampered, error: submitTampered.ok ? null : submitTampered.error, rejected: !submitTampered.ok },
        legacyPreimage: { hex: legacyAssembled.hex, error: submitLegacy.ok ? null : submitLegacy.error, rejected: !submitLegacy.ok }
      },
      receive: {
        r1: { raw: receiveR1, plain: receiveR1Plain },
        r1Paginated: { raw: receiveR1Paged, plain: receiveR1PagedPlain },
        r2Root: { raw: receiveR2Root, plain: receiveR2Plain }
      },
      gateway: { infoLine, depinPort: DEPIN_PORT },
      poolInfo: msgInfo
    };

    writeFileSync(join(fixturesDir, 'core-regtest.json'), JSON.stringify(fixtures, null, 2));
    console.log('\nFixtures written to test/fixtures/core-regtest.json');
  } catch (e) {
    // Keep the daemon and datadir on failure so the run can be resumed with
    // NEURAI_DATADIR (the chain took real mining work to build).
    console.error('\nFAILED — daemon left running for resumption:');
    console.error('  NEURAI_DATADIR=' + datadir + ' node scripts/generate-fixtures.mjs');
    throw e;
  }

  if (process.env.KEEP_DAEMON !== '1') {
    cliRaw('stop');
    await sleep(2000);
    if (!reusedDatadir) rmSync(datadir, { recursive: true, force: true });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
