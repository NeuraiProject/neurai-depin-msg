/**
 * Holder / sender identities and their cryptographic capabilities
 * (plan v2 §2.2).
 *
 * Protocol 2 uses two DIFFERENT signatures plus one decryption capability:
 *
 *   signMessage(preimage)  recoverable base64 over the Neurai signed-message
 *                          envelope — DEPIN-REQ / DEPIN-GET / DEPIN-CLEAR;
 *   signDigest(digest)     ECDSA over the CDepinMessage binary digest —
 *                          publishing only;
 *   openReply(hex)         opens a CECIESEncryptedMessage addressed to the
 *                          identity — bound replies and message payloads.
 *
 * High-level flows check the capabilities they need BEFORE any RPC and fail
 * with DepinCapabilityError otherwise. Hardware/external signers implement
 * the same three callbacks without ever exporting the private key;
 * `createSoftwareIdentity` builds them from a local key.
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes, timingSafeEqual } from './bytes.js';
import { hash160 } from './hash.js';
import { base58CheckEncode } from './base58.js';
import { P2PKH_PREFIX, normalizeNetwork, decodeP2PKHAddress } from './address.js';
import { normalizeSigningKey, signRecoverableMessage } from './signmessage.js';
import { deserializeEciesMessage, eciesDecrypt } from './ecies.js';
import { DepinProtocolError, DepinCapabilityError, DepinReplyDecryptionError } from './errors.js';

/**
 * Builds an identity from a local key: compressed WIF or 32-byte hex.
 * `network` is required ('mainnet' | 'test' | aliases). When `address` is
 * given it must be the P2PKH of the compressed key on that network;
 * otherwise it is derived.
 *
 * Returns { address, publicKey, network, signMessage, signDigest, openReply }.
 * The private key stays inside the closures.
 */
async function createSoftwareIdentity({ privateKey, network, address } = {}) {
  if (!privateKey) {
    throw new DepinProtocolError('privateKey (compressed WIF or 64-hex) is required');
  }
  if (!network) {
    throw new DepinProtocolError("network is required ('mainnet' or 'test')");
  }
  const net = normalizeNetwork(network);
  const { privateKey: keyBytes, network: wifNetwork } = normalizeSigningKey(privateKey);
  if (wifNetwork !== null && wifNetwork !== net) {
    throw new DepinProtocolError(
      'WIF network (' + wifNetwork + ') does not match the requested network (' + net + ')'
    );
  }

  const publicKeyBytes = secp256k1.getPublicKey(keyBytes, true);
  const publicKey = bytesToHex(publicKeyBytes);
  const keyHash = await hash160(publicKeyBytes);

  let finalAddress;
  if (address !== undefined && address !== null) {
    const { payload } = await decodeP2PKHAddress(address, net);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new DepinProtocolError(
        'address does not correspond to the compressed public key of this private key'
      );
    }
    finalAddress = address;
  } else {
    finalAddress = await base58CheckEncode(P2PKH_PREFIX[net], keyHash);
  }

  return {
    address: finalAddress,
    publicKey,
    network: net,
    signMessage: (preimage) => signRecoverableMessage(preimage, bytesToHex(keyBytes)),
    signDigest: (digest) => {
      if (!(digest instanceof Uint8Array) || digest.length !== 32) {
        throw new DepinProtocolError('signDigest expects a 32-byte digest');
      }
      return secp256k1.sign(digest, keyBytes).toDERRawBytes();
    },
    openReply: async (encryptedHex) => {
      let message;
      try {
        message = deserializeEciesMessage(hexToBytes(encryptedHex));
      } catch (e) {
        throw new DepinReplyDecryptionError('envelope does not deserialize', e);
      }
      const plaintext = await eciesDecrypt(message, keyBytes);
      if (plaintext === null) {
        throw new DepinReplyDecryptionError(
          'envelope is not encrypted for this identity or failed authentication'
        );
      }
      return plaintext;
    }
  };
}

/**
 * Asserts an identity object provides the listed capabilities
 * ('signMessage' | 'signDigest' | 'openReply') plus a valid address.
 * Throws DepinCapabilityError BEFORE any network use otherwise.
 */
function assertIdentityCapabilities(identity, capabilities) {
  if (!identity || typeof identity !== 'object') {
    throw new DepinCapabilityError('identity object is required');
  }
  if (typeof identity.address !== 'string' || identity.address.length === 0) {
    throw new DepinCapabilityError('identity.address is required');
  }
  for (const capability of capabilities) {
    if (typeof identity[capability] !== 'function') {
      throw new DepinCapabilityError(
        'identity is missing the ' + capability + ' capability required by this flow'
      );
    }
  }
}

export { createSoftwareIdentity, assertIdentityCapabilities };
