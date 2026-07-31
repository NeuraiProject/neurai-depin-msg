/**
 * Neurai P2PKH address handling and pubkey<->address binding.
 *
 * Network prefixes (chainparams.cpp PUBKEY_ADDRESS):
 *   mainnet: 53 ('N...')
 *   testnet and regtest: 127 ('t...') — byte-identical, so both map to 'test'.
 */

import { base58CheckDecode } from './base58.js';
import { hash160 } from './hash.js';
import { timingSafeEqual } from './bytes.js';

const P2PKH_PREFIX = {
  mainnet: 53,
  test: 127
};

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
 * Returns { version, payload, network }.
 */
async function decodeP2PKHAddress(address, network) {
  if (typeof address !== 'string' || address.length === 0) {
    throw new Error('Address is required');
  }
  const { version, payload } = await base58CheckDecode(address);
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
