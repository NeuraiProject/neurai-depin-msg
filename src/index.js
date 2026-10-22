/**
 * @neuraiproject/neurai-depin-msg — DePIN Messaging RPC 5 client.
 *
 * Build, send-prepare, receive, validate, and decrypt DePIN encrypted
 * messages for the Neurai blockchain. Self-contained (noble crypto), runs in
 * browsers, Node, and React Native. Network access is always injected
 * (`rpc.call(method, params)`); the library never opens connections itself,
 * and every DePIN reply is authenticated (`poolsig` against the pinned pool
 * key) before it is decrypted or interpreted.
 *
 * 3.0.0 removes the protocol-1 surface: the TCP gateway transport
 * (`getRemoteDepinPoolInfo`, `buildDepinMessageForRemotePool`,
 * `parseDepinPoolInfo`, `DepinTransport`) and the pre-authenticated gateway
 * sentinel policy (`isPreAuthenticatedSentinel`, `'trust-gateway'`) — the
 * sentinel is now always rejected with reason `protocol-1-preauthenticated`.
 */

import { hexToBytes, bytesToHex, normalizeHex, concatBytes, timingSafeEqual } from './bytes.js';
import { sha256, doubleSha256, ripemd160, hash160, kdfSha256 } from './hash.js';
import { base58Encode, base58CheckEncode, base58Decode, base58CheckDecode } from './base58.js';
import {
  P2PKH_PREFIX,
  normalizeNetwork,
  decodeP2PKHAddress,
  decodeDepinAddress,
  encodeEcdsaAddress,
  strictEcdsaCommitment,
  pubKeyMatchesAddress,
} from './address.js';
import { isWIF, wifToHex, normalizePrivateKeyTo32Bytes, parsePublicKey, derivePublicKeyForms, privateKeyMatchesPublicKey } from './keys.js';
import { _setDepinTestRng, eciesEncrypt, serializeEciesMessage, deserializeEciesMessage, eciesDecrypt } from './ecies.js';
import {
  MAX_DEPIN_RECIPIENTS,
  MAX_DEPIN_MESSAGE_SIZE,
  DEPIN_RECEIVE_MAX_LIMIT,
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,
  parseDepinMessage,
  verifyDepinReceivedMessage,
} from './message.js';
import { MAX_DEPIN_TOKEN_LENGTH, validateDepinSectionToken, isDepinTokenInScope, getDepinTokenAncestors } from './scope.js';
import {
  decryptDepinReceiveEncryptedPayload,
  decryptDepinReceivedMessage,
  validateAndDecryptDepinMessage,
  decodeDepinReceiveResponse,
  wrapMessageForServer,
  unwrapMessageFromServer,
} from './receive.js';
import {
  DepinRpcError,
  DepinError,
  DepinProtocolError,
  DepinReplyAuthenticationError,
  DepinReplyDecryptionError,
  PoolPinMismatchError,
  DepinCapabilityError,
} from './errors.js';
import {
  NEURAI_MESSAGE_MAGIC,
  base64Encode,
  base64Decode,
  decodeWIF,
  neuraiSignedMessageHash,
  signRecoverableMessage,
  recoverPublicKeyFromMessage,
  verifyRecoverableMessage,
} from './signmessage.js';
import {
  isVerifiedDepinReply,
  buildDepinReplyPreimage,
  verifyDepinReply,
  decodePlainReply,
  openBoundReply,
  decodeDepinPoolInfo,
  poolKeyFingerprint,
} from './depin-reply.js';
import { createSoftwareIdentity, assertIdentityCapabilities } from './identity.js';
import {
  buildDepinRequestPreimage,
  buildDepinGetPreimage,
  buildDepinClearPreimage,
  callDepinRpc,
  getDepinPoolInfo,
  decodeDepinRecipientDirectory,
  decodeDepinRecipients,
  resolveDepinRecipients,
  buildDepinMessageForPool,
  requestDepinChallenge,
  decodeChallengeResult,
  receiveDepinMessages,
  listDepinSectionsPublic,
  listDepinSectionsPrivate,
  clearDepinMessages,
  submitDepinMessage,
  decodeSubmitResult,
} from './depin-client.js';

import {
  DEPIN_RPC_PROTOCOL,
  depinRequestBytes,
  depinRequestHash,
  createDepinRpcRequest,
  buildDepinRpcRequestPreimage,
  buildDepinRpcResponsePreimage,
} from './rpc-codec.js';

export {
  DEPIN_RPC_PROTOCOL,
  depinRequestBytes,
  depinRequestHash,
  createDepinRpcRequest,
  buildDepinRpcRequestPreimage,
  buildDepinRpcResponsePreimage,
  // Build / sign messages (CDepinMessage, §5)
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,

  // Pure utilities
  isDepinTokenInScope,
  validateDepinSectionToken,
  getDepinTokenAncestors,
  parseDepinMessage,
  verifyDepinReceivedMessage,

  // Non-custodial reception
  decodeDepinReceiveResponse,
  decryptDepinReceivedMessage,
  validateAndDecryptDepinMessage,
  decryptDepinReceiveEncryptedPayload,

  // RPC-5 authentication (§3.3, §7)
  NEURAI_MESSAGE_MAGIC,
  neuraiSignedMessageHash,
  signRecoverableMessage,
  recoverPublicKeyFromMessage,
  verifyRecoverableMessage,
  decodeWIF,
  base64Encode,
  base64Decode,
  buildDepinRequestPreimage,
  buildDepinGetPreimage,
  buildDepinClearPreimage,

  // RPC-5 reply envelopes and pinning (§6)
  isVerifiedDepinReply,
  buildDepinReplyPreimage,
  verifyDepinReply,
  decodePlainReply,
  openBoundReply,
  decodeDepinPoolInfo,
  poolKeyFingerprint,

  // Identities and capabilities
  createSoftwareIdentity,
  assertIdentityCapabilities,

  // RPC-5 client flows (network injected)
  callDepinRpc,
  getDepinPoolInfo,
  decodeDepinRecipientDirectory,
  decodeDepinRecipients,
  resolveDepinRecipients,
  buildDepinMessageForPool,
  requestDepinChallenge,
  decodeChallengeResult,
  receiveDepinMessages,
  listDepinSectionsPublic,
  listDepinSectionsPrivate,
  clearDepinMessages,
  submitDepinMessage,
  decodeSubmitResult,

  // Transport privacy wrapper (depinsubmitmsg envelope)
  wrapMessageForServer,
  unwrapMessageFromServer,

  // Errors
  DepinRpcError,
  DepinError,
  DepinProtocolError,
  DepinReplyAuthenticationError,
  DepinReplyDecryptionError,
  PoolPinMismatchError,
  DepinCapabilityError,

  // Keys / addresses
  isWIF,
  wifToHex,
  normalizePrivateKeyTo32Bytes,
  parsePublicKey,
  derivePublicKeyForms,
  privateKeyMatchesPublicKey,
  decodeDepinAddress,
  encodeEcdsaAddress,
  strictEcdsaCommitment,
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
  base58Encode,
  base58CheckEncode,
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
  _setDepinTestRng,
};

// Expose on globalThis (browser + Node) for the IIFE bundle.
if (typeof globalThis !== 'undefined') {
  globalThis.neuraiDepinMsg = {
    pubKeyMatchesAddress,
    decodeDepinAddress,
    encodeEcdsaAddress,
    strictEcdsaCommitment,
    DEPIN_RPC_PROTOCOL,
    depinRequestBytes,
    depinRequestHash,
    createDepinRpcRequest,
    buildDepinRpcRequestPreimage,
    buildDepinRpcResponsePreimage,
    buildDepinMessage,
    buildDepinPreimage,
    assembleDepinMessage,
    isDepinTokenInScope,
    validateDepinSectionToken,
    getDepinTokenAncestors,
    parseDepinMessage,
    verifyDepinReceivedMessage,
    decodeDepinReceiveResponse,
    decryptDepinReceivedMessage,
    validateAndDecryptDepinMessage,
    decryptDepinReceiveEncryptedPayload,

    NEURAI_MESSAGE_MAGIC,
    neuraiSignedMessageHash,
    signRecoverableMessage,
    recoverPublicKeyFromMessage,
    verifyRecoverableMessage,
    decodeWIF,
    buildDepinRequestPreimage,
    buildDepinGetPreimage,
    buildDepinClearPreimage,
    isVerifiedDepinReply,
    buildDepinReplyPreimage,
    verifyDepinReply,
    decodePlainReply,
    openBoundReply,
    decodeDepinPoolInfo,
    poolKeyFingerprint,
    createSoftwareIdentity,
    assertIdentityCapabilities,
    callDepinRpc,
    getDepinPoolInfo,
    decodeDepinRecipientDirectory,
    decodeDepinRecipients,
    resolveDepinRecipients,
    buildDepinMessageForPool,
    requestDepinChallenge,
    decodeChallengeResult,
    receiveDepinMessages,
    listDepinSectionsPublic,
    listDepinSectionsPrivate,
    clearDepinMessages,
    submitDepinMessage,
    decodeSubmitResult,

    wrapMessageForServer,
    unwrapMessageFromServer,
    DepinRpcError,
    DepinError,
    DepinProtocolError,
    DepinReplyAuthenticationError,
    DepinReplyDecryptionError,
    PoolPinMismatchError,
    DepinCapabilityError,
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
      base58Encode,
      base58CheckEncode,
      base58Decode,
      base58CheckDecode,
      base64Encode,
      base64Decode,
      normalizePrivateKeyTo32Bytes,
      parsePublicKey,
      derivePublicKeyForms,
      privateKeyMatchesPublicKey,
      decodeDepinAddress,
      encodeEcdsaAddress,
      strictEcdsaCommitment,
      decodeP2PKHAddress,
      pubKeyMatchesAddress,
      normalizeNetwork,
      P2PKH_PREFIX,
      eciesEncrypt,
      serializeEciesMessage,
      deserializeEciesMessage,
      eciesDecrypt,
    },
  };
}
