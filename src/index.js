/**
 * @neuraiproject/neurai-depin-msg
 *
 * Build, send-prepare, receive, validate, and decrypt DePIN encrypted
 * messages for the Neurai blockchain. Self-contained (noble crypto), runs in
 * browsers, Node, and React Native. Network access is always injected; the
 * library never opens connections itself.
 */

import { hexToBytes, bytesToHex, normalizeHex, concatBytes, timingSafeEqual } from './bytes.js';
import { sha256, doubleSha256, ripemd160, hash160, kdfSha256 } from './hash.js';
import { base58Decode, base58CheckDecode } from './base58.js';
import { P2PKH_PREFIX, normalizeNetwork, decodeP2PKHAddress, pubKeyMatchesAddress } from './address.js';
import {
  isWIF, wifToHex, normalizePrivateKeyTo32Bytes,
  parsePublicKey, derivePublicKeyForms, privateKeyMatchesPublicKey
} from './keys.js';
import {
  _setDepinTestRng, eciesEncrypt, serializeEciesMessage, deserializeEciesMessage, eciesDecrypt
} from './ecies.js';
import {
  MAX_DEPIN_RECIPIENTS, MAX_DEPIN_MESSAGE_SIZE, DEPIN_RECEIVE_MAX_LIMIT,
  isPreAuthenticatedSentinel,
  buildDepinMessage, buildDepinPreimage, assembleDepinMessage,
  parseDepinMessage, verifyDepinReceivedMessage
} from './message.js';
import {
  MAX_DEPIN_TOKEN_LENGTH,
  validateDepinSectionToken, isDepinTokenInScope, getDepinTokenAncestors
} from './scope.js';
import {
  decryptDepinReceiveEncryptedPayload, decryptDepinReceivedMessage,
  validateAndDecryptDepinMessage, decodeDepinReceiveResponse,
  wrapMessageForServer, unwrapMessageFromServer
} from './receive.js';
import {
  resolveDepinRecipients, buildDepinMessageForPool,
  parseDepinPoolInfo, getRemoteDepinPoolInfo, buildDepinMessageForRemotePool
} from './resolve.js';

export {
  // Build / sign
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,

  // Pure utilities
  isDepinTokenInScope,
  validateDepinSectionToken,
  getDepinTokenAncestors,
  parseDepinMessage,
  verifyDepinReceivedMessage,
  isPreAuthenticatedSentinel,

  // Non-custodial reception
  decodeDepinReceiveResponse,
  decryptDepinReceivedMessage,
  validateAndDecryptDepinMessage,
  decryptDepinReceiveEncryptedPayload,

  // Recipient resolution / assisted send (network injected)
  resolveDepinRecipients,
  buildDepinMessageForPool,
  parseDepinPoolInfo,
  getRemoteDepinPoolInfo,
  buildDepinMessageForRemotePool,

  // Transport privacy wrapper
  wrapMessageForServer,
  unwrapMessageFromServer,

  // Keys / addresses
  isWIF,
  wifToHex,
  normalizePrivateKeyTo32Bytes,
  parsePublicKey,
  derivePublicKeyForms,
  privateKeyMatchesPublicKey,
  decodeP2PKHAddress,
  pubKeyMatchesAddress,
  normalizeNetwork,
  P2PKH_PREFIX,

  // Byte / hash utilities
  hexToBytes,
  bytesToHex,
  normalizeHex,
  concatBytes,
  timingSafeEqual,
  sha256,
  doubleSha256,
  ripemd160,
  hash160,
  kdfSha256,
  base58Decode,
  base58CheckDecode,

  // ECIES primitives
  eciesEncrypt,
  serializeEciesMessage,
  deserializeEciesMessage,
  eciesDecrypt,

  // Constants
  MAX_DEPIN_RECIPIENTS,
  MAX_DEPIN_MESSAGE_SIZE,
  DEPIN_RECEIVE_MAX_LIMIT,
  MAX_DEPIN_TOKEN_LENGTH,

  // Test-only hook (deterministic RNG); never call in production
  _setDepinTestRng
};

// Expose on globalThis (browser + Node) for the IIFE bundle.
if (typeof globalThis !== 'undefined') {
  globalThis.neuraiDepinMsg = {
    buildDepinMessage,
    buildDepinPreimage,
    assembleDepinMessage,
    isDepinTokenInScope,
    validateDepinSectionToken,
    getDepinTokenAncestors,
    parseDepinMessage,
    verifyDepinReceivedMessage,
    isPreAuthenticatedSentinel,
    decodeDepinReceiveResponse,
    decryptDepinReceivedMessage,
    validateAndDecryptDepinMessage,
    decryptDepinReceiveEncryptedPayload,
    resolveDepinRecipients,
    buildDepinMessageForPool,
    parseDepinPoolInfo,
    getRemoteDepinPoolInfo,
    buildDepinMessageForRemotePool,
    wrapMessageForServer,
    unwrapMessageFromServer,
    wifToHex,
    isWIF,
    MAX_DEPIN_RECIPIENTS,
    MAX_DEPIN_MESSAGE_SIZE,
    DEPIN_RECEIVE_MAX_LIMIT,
    MAX_DEPIN_TOKEN_LENGTH,
    utils: {
      hexToBytes,
      bytesToHex,
      normalizeHex,
      concatBytes,
      timingSafeEqual,
      sha256,
      doubleSha256,
      ripemd160,
      hash160,
      kdfSha256,
      base58Decode,
      base58CheckDecode,
      normalizePrivateKeyTo32Bytes,
      parsePublicKey,
      derivePublicKeyForms,
      privateKeyMatchesPublicKey,
      decodeP2PKHAddress,
      pubKeyMatchesAddress,
      normalizeNetwork,
      P2PKH_PREFIX,
      eciesEncrypt,
      serializeEciesMessage,
      deserializeEciesMessage,
      eciesDecrypt
    }
  };
}
