/**
 * Neurai P2PKH address handling and pubkey<->address binding.
 *
 * Network prefixes (chainparams.cpp PUBKEY_ADDRESS):
 *   mainnet: 53 ('N...')
 *   testnet and regtest: 127 ('t...') — byte-identical, so both map to 'test'.
 *
 * DePIN (messaging, challenges, pool keys, recipients) only works with Legacy
 * P2PKH addresses on the node. Bech32m witness addresses — generic AuthScript
 * v1 (nc1p.../tnc1p...), post-quantum v2 (pq1z.../tpq1z...) and ECDSA v3
 * (nq1r.../tnq1r...) — are rejected here with an explicit error.
 */

import { base58CheckDecode } from './base58.js';
import { hash160 } from './hash.js';
import { timingSafeEqual } from './bytes.js';

const P2PKH_PREFIX = {
  mainnet: 53,
  test: 127
};

const WITNESS_ADDRESS_ERROR =
  "DePIN requires a Legacy P2PKH address (neurai-key network 'xna-legacy' / " +
  "'xna-legacy-test'); witness addresses (nc1…, pq1…, nq1…) are not accepted by the node";

// Bech32 / Bech32m (BIP-173 / BIP-350), only as far as needed to recognise a
// Neurai witness address and give a clear error instead of a Base58 one.
const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;
const WITNESS_HRPS = ['nc', 'tnc', 'pq', 'tpq', 'nq', 'tnq'];

function bech32Polymod(values) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((top >>> i) & 1) chk ^= GEN[i];
    }
  }
  return chk >>> 0;
}

/**
 * Recognises a Bech32/Bech32m string with a Neurai witness HRP
 * (nc/tnc, pq/tpq, nq/tnq, any case). Returns
 * { hrp, witnessVersion, checksumValid } or null when the string does not have
 * that shape. Mixed-case strings are never Bech32, so Base58 look-alikes such
 * as 'NQ1…' or 'tNc1…' P2PKH addresses return null.
 */
function inspectWitnessAddress(address) {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return null;
  const str = address.toLowerCase();
  const sep = str.lastIndexOf('1');
  if (sep < 1 || str.length - sep - 1 < 7) return null;
  const hrp = str.slice(0, sep);
  if (!WITNESS_HRPS.includes(hrp)) return null;

  const data = [];
  for (const ch of str.slice(sep + 1)) {
    const v = BECH32_CHARSET.indexOf(ch);
    if (v === -1) return null;
    data.push(v);
  }

  const expanded = [];
  for (let i = 0; i < hrp.length; i++) expanded.push(hrp.charCodeAt(i) >> 5);
  expanded.push(0);
  for (let i = 0; i < hrp.length; i++) expanded.push(hrp.charCodeAt(i) & 31);
  const check = bech32Polymod(expanded.concat(data));

  return {
    hrp,
    witnessVersion: data[0],
    checksumValid: check === BECH32_CONST || check === BECH32M_CONST
  };
}

/**
 * Normalizes a network name. Accepts 'mainnet' | 'test' plus the aliases
 * 'testnet' and 'regtest' (both share the P2PKH prefix byte 127).
 */
function normalizeNetwork(network) {
  if (network === 'mainnet') return 'mainnet';
  if (network === 'test' || network === 'testnet' || network === 'regtest') return 'test';
  throw new Error(
    "network must be 'mainnet' or 'test' (aliases: 'testnet', 'regtest'); got: " + network
  );
}

/**
 * Decodes and validates a P2PKH address (Base58Check + 20-byte payload).
 * When `network` is given, the version byte must match that network's prefix;
 * otherwise any known Neurai P2PKH prefix is accepted.
 * Bech32m witness addresses (nc1…, pq1…, nq1… and their testnet forms) are
 * rejected with an explicit "DePIN requires a Legacy P2PKH address" error.
 * Returns { version, payload, network }.
 */
async function decodeP2PKHAddress(address, network) {
  if (typeof address !== 'string' || address.length === 0) {
    throw new Error('Address is required');
  }

  // Base58 first: valid P2PKH addresses may start with 'NQ1…' or 'tNc1…'.
  let decoded;
  try {
    decoded = await base58CheckDecode(address);
  } catch (err) {
    const witness = inspectWitnessAddress(address);
    if (witness === null) throw err;
    if (!witness.checksumValid) {
      throw new Error(
        'Address looks like a Bech32m witness address but its checksum is invalid; ' +
        WITNESS_ADDRESS_ERROR
      );
    }
    throw new Error(
      'Unsupported witness v' + witness.witnessVersion + " address ('" + witness.hrp +
      "1…'): " + WITNESS_ADDRESS_ERROR
    );
  }
  const { version, payload } = decoded;
  if (payload.length !== 20) {
    throw new Error('Address payload must be 20 bytes (P2PKH)');
  }

  let addressNetwork = null;
  if (version === P2PKH_PREFIX.mainnet) addressNetwork = 'mainnet';
  else if (version === P2PKH_PREFIX.test) addressNetwork = 'test';

  if (network !== undefined && network !== null) {
    const expected = P2PKH_PREFIX[normalizeNetwork(network)];
    if (version !== expected) {
      throw new Error(
        'Address version byte ' + version + ' does not match network prefix ' + expected
      );
    }
  } else if (addressNetwork === null) {
    throw new Error('Unknown address version byte: ' + version);
  }

  return { version, payload, network: addressNetwork };
}

/**
 * True when hash160 of the given public key bytes (as serialized) equals the
 * address's P2PKH payload. The comparison is over the exact serialization:
 * compressed and uncompressed forms of the same point hash differently.
 */
async function pubKeyMatchesAddress(pubKeyBytes, address, network) {
  const { payload } = await decodeP2PKHAddress(address, network);
  const keyHash = await hash160(pubKeyBytes);
  return timingSafeEqual(keyHash, payload);
}

export { P2PKH_PREFIX, normalizeNetwork, decodeP2PKHAddress, pubKeyMatchesAddress };
