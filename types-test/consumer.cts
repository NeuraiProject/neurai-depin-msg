// CommonJS consumer: resolves the `require` condition
// (dist/neurai-depin-msg.d.cts). Every value export of the CommonJS bundle is
// used, so a missing declaration fails to compile.
import depin = require('@neuraiproject/neurai-depin-msg');

export const values = [
  depin.DEPIN_RECEIVE_MAX_LIMIT, depin.DepinCapabilityError, depin.DepinError,
  depin.DepinProtocolError, depin.DepinReplyAuthenticationError, depin.DepinReplyDecryptionError,
  depin.MAX_DEPIN_MESSAGE_SIZE, depin.MAX_DEPIN_RECIPIENTS, depin.MAX_DEPIN_TOKEN_LENGTH,
  depin.NEURAI_MESSAGE_MAGIC, depin.P2PKH_PREFIX, depin.PoolPinMismatchError,
  depin._setDepinTestRng, depin.assembleDepinMessage, depin.assertIdentityCapabilities,
  depin.base58CheckDecode, depin.base58CheckEncode, depin.base58Decode, depin.base58Encode,
  depin.base64Decode, depin.base64Encode, depin.buildDepinClearPreimage,
  depin.buildDepinGetPreimage, depin.buildDepinMessage, depin.buildDepinMessageForPool,
  depin.buildDepinPreimage, depin.buildDepinReplyPreimage, depin.buildDepinRequestPreimage,
  depin.bytesToHex, depin.clearDepinMessages, depin.concatBytes, depin.createSoftwareIdentity,
  depin.decodeChallengeResult, depin.decodeDepinPoolInfo, depin.decodeDepinReceiveResponse,
  depin.decodeDepinRecipients, depin.decodeP2PKHAddress, depin.decodePlainReply,
  depin.decodeSubmitResult, depin.decodeWIF, depin.decryptDepinReceiveEncryptedPayload,
  depin.decryptDepinReceivedMessage, depin.derivePublicKeyForms, depin.deserializeEciesMessage,
  depin.doubleSha256, depin.eciesDecrypt, depin.eciesEncrypt, depin.getDepinPoolInfo,
  depin.getDepinTokenAncestors, depin.hash160, depin.hexToBytes, depin.isDepinTokenInScope,
  depin.isVerifiedDepinReply, depin.isWIF, depin.kdfSha256, depin.listDepinSectionsPrivate,
  depin.listDepinSectionsPublic, depin.neuraiSignedMessageHash, depin.normalizeHex,
  depin.normalizeNetwork, depin.normalizePrivateKeyTo32Bytes, depin.openBoundReply,
  depin.parseDepinMessage, depin.parsePublicKey, depin.poolKeyFingerprint,
  depin.privateKeyMatchesPublicKey, depin.pubKeyMatchesAddress, depin.receiveDepinMessages,
  depin.recoverPublicKeyFromMessage, depin.requestDepinChallenge, depin.resolveDepinRecipients,
  depin.ripemd160, depin.serializeEciesMessage, depin.sha256, depin.signRecoverableMessage,
  depin.submitDepinMessage, depin.timingSafeEqual, depin.unwrapMessageFromServer,
  depin.validateAndDecryptDepinMessage, depin.validateDepinSectionToken,
  depin.verifyDepinReceivedMessage, depin.verifyDepinReply, depin.verifyRecoverableMessage,
  depin.wifToHex, depin.wrapMessageForServer,
];
export const rpc: depin.DepinRpc = { call: async () => ({}) };
export const signature: string = depin.signRecoverableMessage('probe', '11'.repeat(32));
