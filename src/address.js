/** Neurai Legacy P2PKH and strict ECDSA v3 address identities.
 * decodeP2PKHAddress remains the Legacy-only utility; decodeDepinAddress
 * accepts both supported families. Generic AuthScript and PQ are excluded.
 */

import { base58CheckDecode } from './base58.js';
import { hash160 } from './hash.js';
import { timingSafeEqual } from './bytes.js';
import { concatBytes, bytesToHex } from './bytes.js';
import { sha256 as sha256Sync } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';

const P2PKH_PREFIX = {
  mainnet: 53,
  test: 127,
};

const WITNESS_ADDRESS_ERROR =
  'This decoder requires a Legacy P2PKH address; use decodeDepinAddress for Legacy or strict ECDSA. Generic AuthScript and PQ messaging are unsupported';

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
    checksumValid: check === BECH32_CONST || check === BECH32M_CONST,
  };
}

/**
 * Normalizes a network name. Accepts 'mainnet' | 'test' plus the aliases
 * 'testnet' and 'regtest' (both share the P2PKH prefix byte 127).
 */
function normalizeNetwork(network) {
  if (network === 'mainnet') return 'mainnet';
  if (network === 'test' || network === 'testnet' || network === 'regtest') return 'test';
  throw new Error("network must be 'mainnet' or 'test' (aliases: 'testnet', 'regtest'); got: " + network);
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
      throw new Error('Address looks like a Bech32m witness address but its checksum is invalid; ' + WITNESS_ADDRESS_ERROR);
    }
    throw new Error('Unsupported witness v' + witness.witnessVersion + " address ('" + witness.hrp + "1…'): " + WITNESS_ADDRESS_ERROR);
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
      throw new Error('Address version byte ' + version + ' does not match network prefix ' + expected);
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
  const { type, payload } = await decodeDepinAddress(address, network);
  if (type === 'ecdsa' && pubKeyBytes.length !== 33) return false;
  const keyHash = type === 'ecdsa' ? strictEcdsaCommitment(pubKeyBytes) : await hash160(pubKeyBytes);
  return timingSafeEqual(keyHash, payload);
}

function convertBits(data, from, to, pad) {
  let acc = 0,
    bits = 0;
  const out = [],
    mask = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >>> from) throw new Error('Invalid witness data');
    acc = ((acc << from) | value) & ((1 << (from + to - 1)) - 1);
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >>> bits) & mask);
    }
  }
  if (pad) {
    if (bits) out.push((acc << (to - bits)) & mask);
  } else if (bits >= from || (acc << (to - bits)) & mask) throw new Error('Noncanonical witness padding');
  return new Uint8Array(out);
}

function strictEcdsaCommitment(publicKey) {
  if (!(publicKey instanceof Uint8Array) || publicKey.length !== 33 || ![2, 3].includes(publicKey[0])) {
    throw new Error('Strict ECDSA requires a compressed public key');
  }
  const tag = sha256Sync(new TextEncoder().encode('NeuraiAuthScript'));
  return sha256Sync(concatBytes(tag, tag, new Uint8Array([3, 2]), ripemd160(sha256Sync(publicKey)), sha256Sync(new Uint8Array([0x51]))));
}

function encodeEcdsaAddress(publicKey, network) {
  const hrp = normalizeNetwork(network) === 'mainnet' ? 'nq' : 'tnq';
  const data = [3, ...convertBits(strictEcdsaCommitment(publicKey), 8, 5, true)];
  const expanded = [...hrp]
    .map((c) => c.charCodeAt(0) >>> 5)
    .concat(
      [0],
      [...hrp].map((c) => c.charCodeAt(0) & 31),
    );
  const mod = (bech32Polymod(expanded.concat(data, [0, 0, 0, 0, 0, 0])) ^ BECH32M_CONST) >>> 0;
  for (let i = 0; i < 6; i++) data.push((mod >>> (5 * (5 - i))) & 31);
  return hrp + '1' + data.map((v) => BECH32_CHARSET[v]).join('');
}

async function decodeDepinAddress(address, network) {
  try {
    const decoded = await decodeP2PKHAddress(address, network);
    return { ...decoded, type: 'legacy', recipientId: bytesToHex(decoded.payload) };
  } catch (legacyError) {
    try {
      return decodeStrictEcdsaAddress(address, network);
    } catch {
      throw legacyError;
    }
  }
}

function decodeStrictEcdsaAddress(address, network) {
  if (typeof address !== 'string' || address !== address.toLowerCase() || address.length > 64)
    throw new Error('Unsupported DePIN address; use Legacy or strict ECDSA');
  const witness = inspectWitnessAddress(address);
  if (!witness || !['nq', 'tnq'].includes(witness.hrp) || witness.witnessVersion !== 3 || !witness.checksumValid)
    throw new Error('Unsupported DePIN address; use Legacy or strict ECDSA');
  const hrp = witness.hrp;
  const raw = [...address.slice(hrp.length + 1)].map((c) => BECH32_CHARSET.indexOf(c));
  const expanded = [...hrp]
    .map((c) => c.charCodeAt(0) >>> 5)
    .concat(
      [0],
      [...hrp].map((c) => c.charCodeAt(0) & 31),
    );
  if (bech32Polymod(expanded.concat(raw)) !== BECH32M_CONST) throw new Error('Strict ECDSA requires Bech32m');
  const payload = convertBits(raw.slice(1, -6), 5, 8, false);
  if (payload.length !== 32) throw new Error('Strict ECDSA commitment must be 32 bytes');
  const net = hrp === 'nq' ? 'mainnet' : 'test';
  if (network != null && normalizeNetwork(network) !== net) throw new Error('Address network mismatch');
  return { type: 'ecdsa', payload, network: net, recipientId: '03' + bytesToHex(payload) };
}

export {
  P2PKH_PREFIX,
  normalizeNetwork,
  decodeP2PKHAddress,
  decodeDepinAddress,
  decodeStrictEcdsaAddress,
  strictEcdsaCommitment,
  encodeEcdsaAddress,
  pubKeyMatchesAddress,
};
