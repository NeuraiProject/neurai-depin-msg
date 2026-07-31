/**
 * CDepinMessage: build, parse, hash, sign, verify.
 *
 * Wire format:
 *   [token][senderAddress][timestamp int64][messageType u8][encryptedPayload][signature]
 * The signed hash is the message identifier itself (Core's
 * CDepinMessage::GetHash), double-SHA256 over everything except the
 * signature. This is the only preimage Core accepts; the legacy preimage
 * without messageType is rejected.
 */

import { secp256k1 } from '@noble/curves/secp256k1';
import {
  concatBytes, hexToBytes, bytesToHex, normalizeHex, timingSafeEqual
} from './bytes.js';
import { doubleSha256, hash160 } from './hash.js';
import {
  serializeString, serializeVector, serializeInt64,
  readString, readVector, readInt64
} from './serialize.js';
import {
  isWIF, wifToHex, parsePublicKey, privateKeyMatchesPublicKey
} from './keys.js';
import { decodeP2PKHAddress } from './address.js';
import { eciesEncrypt, serializeEciesMessage } from './ecies.js';
import { validateDepinSectionToken } from './scope.js';

// Core limits (depinmsgpool.h)
const MAX_DEPIN_RECIPIENTS = 50;
const MAX_DEPIN_MESSAGE_SIZE = 10240;
const DEPIN_RECEIVE_MAX_LIMIT = 1000;

// depinsendmsg's pre-authenticated gateway path stores this sentinel instead
// of a signature: 65 zero bytes. It cannot be verified cryptographically.
const PRE_AUTH_SENTINEL_LENGTH = 65;

function isPreAuthenticatedSentinel(signatureBytes) {
  if (!(signatureBytes instanceof Uint8Array)) return false;
  if (signatureBytes.length !== PRE_AUTH_SENTINEL_LENGTH) return false;
  for (let i = 0; i < signatureBytes.length; i++) {
    if (signatureBytes[i] !== 0) return false;
  }
  return true;
}

function normalizeMessageType(value) {
  if (value === 'private' || value === 0x01 || value === '0x01') {
    return { str: 'private', byte: 0x01 };
  }
  if (value === 'group' || value === 0x02 || value === '0x02') {
    return { str: 'group', byte: 0x02 };
  }
  throw new Error('messageType must be "private" or "group"');
}

function buildPreimageBytes({ token, senderAddress, timestamp, messageTypeByte, encryptedPayload }) {
  return concatBytes(
    serializeString(token),
    serializeString(senderAddress),
    serializeInt64(timestamp),
    new Uint8Array([messageTypeByte]),
    serializeVector(encryptedPayload)
  );
}

async function computeDepinMessageHashBytes(fields) {
  return doubleSha256(buildPreimageBytes(fields));
}

/**
 * Validates the common build inputs and resolves the final recipient set.
 * Keys keep their given serialization; identity is by curve point. The sender
 * is auto-included when its point is not already present. Returns
 * { messageType, recipientKeyBytes, senderKey } with recipientKeyBytes being
 * the final, deduplicated list (Core's ECIES map size).
 */
async function prepareBuildInputs(params) {
  if (!params.token) throw new Error('Token is required');
  const tokenCheck = validateDepinSectionToken(params.token);
  if (!tokenCheck.valid) throw new Error('Invalid DePIN token: ' + tokenCheck.error);

  if (!params.senderAddress) throw new Error('Sender address is required');
  if (!params.senderPubKey) throw new Error('Sender public key is required');

  const senderKey = parsePublicKey(params.senderPubKey);

  // The address is derived from the key bytes: bind exact serialization.
  const { payload } = await decodeP2PKHAddress(params.senderAddress, params.network ?? null);
  const senderKeyHash = await hash160(senderKey.bytes);
  if (!timingSafeEqual(senderKeyHash, payload)) {
    throw new Error('senderPubKey does not correspond to senderAddress');
  }

  const messageType = normalizeMessageType(params.messageType);

  if (!params.message) throw new Error('Message is required');
  if (!params.recipientPubKeys || params.recipientPubKeys.length === 0) {
    throw new Error('At least one recipient is required');
  }
  if (!Number.isInteger(params.timestamp) || params.timestamp <= 0) {
    throw new Error('Timestamp must be a positive integer');
  }

  // Dedupe by curve point, keeping the first serialization seen.
  const byPoint = new Map();
  for (const pk of params.recipientPubKeys) {
    const parsed = parsePublicKey(pk);
    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }

  if (messageType.byte === 0x01) {
    const uniquePoints = new Set(byPoint.keys());
    uniquePoints.add(senderKey.pointId);
    if (uniquePoints.size > 2) {
      throw new Error('messageType "private" allows only one recipient plus the sender');
    }
  }

  // Include the sender so it can decrypt its own messages.
  if (!byPoint.has(senderKey.pointId)) {
    byPoint.set(senderKey.pointId, senderKey.bytes);
  }

  if (byPoint.size > MAX_DEPIN_RECIPIENTS) {
    throw new Error(
      'Final recipient map has ' + byPoint.size + ' entries (sender included); ' +
      'Core rejects more than ' + MAX_DEPIN_RECIPIENTS
    );
  }

  return {
    messageType,
    senderKey,
    recipientKeyBytes: Array.from(byPoint.values())
  };
}

async function buildDepinMessage(params) {
  const { messageType, senderKey, recipientKeyBytes } = await prepareBuildInputs(params);

  let privateKeyHex = params.privateKey;
  if (!privateKeyHex) throw new Error('Private key is required');
  if (isWIF(privateKeyHex)) privateKeyHex = await wifToHex(privateKeyHex);
  if (privateKeyHex.length !== 64) {
    throw new Error('Private key must be 64 hex characters (or WIF format)');
  }
  const privateKey = hexToBytes(privateKeyHex);

  if (!privateKeyMatchesPublicKey(privateKey, senderKey.bytes)) {
    throw new Error('privateKey does not correspond to senderPubKey; Core would reject the signature');
  }

  const messageBytes = new TextEncoder().encode(params.message);
  const eciesMsg = await eciesEncrypt(messageBytes, recipientKeyBytes);
  const encryptedPayload = serializeEciesMessage(eciesMsg);

  const fields = {
    token: params.token,
    senderAddress: params.senderAddress,
    timestamp: params.timestamp,
    messageTypeByte: messageType.byte,
    encryptedPayload
  };

  // Core uses CHashWriter (SER_GETHASH): double-SHA256 of the preimage.
  const messageHashBytes = await computeDepinMessageHashBytes(fields);
  // uint256 hashes display byte-reversed; messageHash matches debug.log.
  const messageHash = bytesToHex(messageHashBytes.slice().reverse());

  // noble: deterministic RFC6979, low-S canonical, DER as Core expects.
  const signature = secp256k1.sign(messageHashBytes, privateKey).toDERRawBytes();

  const serialized = concatBytes(
    buildPreimageBytes(fields),
    serializeVector(signature)
  );

  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    recipientCount: recipientKeyBytes.length,
    messageType: messageType.str
  };
}

/**
 * buildDepinPreimage
 * The signature-less half of buildDepinMessage, for external signers (hardware
 * wallets that never expose the private key). ECIES-encrypts the message for
 * the recipients (the sender is auto-included) and returns the
 * `encryptedPayload` hex plus the fields needed to sign. The signer feeds
 * token / senderAddress / timestamp / messageTypeByte / encryptedPayload to
 * the device, then passes the returned DER signature to
 * {@link assembleDepinMessage}. No private key.
 */
async function buildDepinPreimage(params) {
  const { messageType, recipientKeyBytes } = await prepareBuildInputs(params);

  const messageBytes = new TextEncoder().encode(params.message);
  const eciesMsg = await eciesEncrypt(messageBytes, recipientKeyBytes);
  const encryptedPayload = serializeEciesMessage(eciesMsg);

  return {
    encryptedPayloadHex: bytesToHex(encryptedPayload),
    messageType: messageType.str,
    messageTypeByte: messageType.byte,
    encryptedSize: encryptedPayload.length,
    recipientCount: recipientKeyBytes.length
  };
}

/**
 * assembleDepinMessage
 * Finalizes a message from buildDepinPreimage plus an external DER signature
 * (hex or bytes; a raw 64-byte r||s signature is DER-encoded automatically).
 * Produces the identical wire format to buildDepinMessage.
 */
async function assembleDepinMessage(params, signatureHexOrBytes) {
  if (!params.token) throw new Error('Token is required');
  if (!params.senderAddress) throw new Error('Sender address is required');
  if (!params.encryptedPayloadHex) throw new Error('encryptedPayloadHex is required');
  const messageType = normalizeMessageType(params.messageType);
  if (!Number.isInteger(params.timestamp) || params.timestamp <= 0) {
    throw new Error('Timestamp must be a positive integer');
  }
  if (!signatureHexOrBytes) throw new Error('signature is required');

  const normalizedPayload = normalizeHex(params.encryptedPayloadHex);
  if (!normalizedPayload) throw new Error('Invalid encryptedPayloadHex');
  const encryptedPayload = hexToBytes(normalizedPayload);

  let signature;
  if (typeof signatureHexOrBytes === 'string') {
    const norm = normalizeHex(signatureHexOrBytes);
    if (!norm) throw new Error('Invalid signature hex');
    signature = hexToBytes(norm);
  } else {
    signature = signatureHexOrBytes;
  }
  if (signature.length === 64) {
    // Raw compact (r||s) -> DER, matching buildDepinMessage's DER form.
    signature = secp256k1.Signature.fromCompact(signature).toDERRawBytes();
  } else {
    try {
      secp256k1.Signature.fromDER(signature);
    } catch (e) {
      throw new Error('Signature is not valid DER: ' + (e && e.message ? e.message : e));
    }
  }

  const fields = {
    token: params.token,
    senderAddress: params.senderAddress,
    timestamp: params.timestamp,
    messageTypeByte: messageType.byte,
    encryptedPayload
  };
  const messageHashBytes = await computeDepinMessageHashBytes(fields);
  const messageHash = bytesToHex(messageHashBytes.slice().reverse());

  const serialized = concatBytes(
    buildPreimageBytes(fields),
    serializeVector(signature)
  );

  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    messageType: messageType.str
  };
}

/**
 * Parses a serialized CDepinMessage (hex or bytes). Strict: canonical
 * CompactSize, messageType 0x01/0x02, no trailing bytes. Returns the fields
 * plus the computed message hash (byte-reversed hex, as displayed by Core).
 */
async function parseDepinMessage(hexOrBytes, options = {}) {
  const { maxPayloadBytes = MAX_DEPIN_MESSAGE_SIZE * MAX_DEPIN_RECIPIENTS } = options;

  let bytes;
  if (hexOrBytes instanceof Uint8Array) {
    bytes = hexOrBytes;
  } else {
    const norm = normalizeHex(hexOrBytes);
    if (!norm) throw new Error('Invalid message hex');
    bytes = hexToBytes(norm);
  }

  let offset = 0;
  const tokenRes = readString(bytes, offset, 1024);
  offset = tokenRes.offset;
  const senderRes = readString(bytes, offset, 1024);
  offset = senderRes.offset;
  const tsRes = readInt64(bytes, offset);
  offset = tsRes.offset;

  if (offset >= bytes.length) throw new Error('CDepinMessage: truncated messageType');
  const messageTypeByte = bytes[offset];
  offset += 1;
  if (messageTypeByte !== 0x01 && messageTypeByte !== 0x02) {
    throw new Error('Invalid messageType: 0x' + messageTypeByte.toString(16).padStart(2, '0'));
  }

  const payloadRes = readVector(bytes, offset, maxPayloadBytes);
  offset = payloadRes.offset;
  const sigRes = readVector(bytes, offset, 144);
  offset = sigRes.offset;

  if (offset !== bytes.length) throw new Error('CDepinMessage: trailing bytes after message');

  const fields = {
    token: tokenRes.value,
    senderAddress: senderRes.value,
    timestamp: tsRes.value,
    messageTypeByte,
    encryptedPayload: payloadRes.data
  };
  const hashBytes = await computeDepinMessageHashBytes(fields);

  return {
    token: fields.token,
    senderAddress: fields.senderAddress,
    timestamp: fields.timestamp,
    messageType: messageTypeByte === 0x01 ? 'private' : 'group',
    messageTypeByte,
    encryptedPayloadHex: bytesToHex(payloadRes.data),
    signatureHex: bytesToHex(sigRes.data),
    isPreAuthenticated: isPreAuthenticatedSentinel(sigRes.data),
    hash: bytesToHex(hashBytes.slice().reverse()),
    hashBytes: bytesToHex(hashBytes),
    size: bytes.length
  };
}

/**
 * Accepts either the RPC message shape ({token, sender, timestamp,
 * message_type, encrypted_payload_hex, signature_hex, hash?}) or the parsed
 * shape from parseDepinMessage, and returns canonical fields.
 */
function normalizeReceivedMessage(message) {
  if (!message || typeof message !== 'object') {
    throw new Error('Message object is required');
  }

  const token = message.token;
  const senderAddress = message.senderAddress ?? message.sender;
  const timestamp = message.timestamp;
  const rawType = message.messageTypeByte ?? message.messageType ?? message.message_type;
  const payloadHex = message.encryptedPayloadHex ?? message.encrypted_payload_hex;
  const signatureHex = message.signatureHex ?? message.signature_hex;
  const claimedHash = message.hash ?? null;

  if (typeof token !== 'string' || token.length === 0) throw new Error('Message token missing');
  if (typeof senderAddress !== 'string' || senderAddress.length === 0) {
    throw new Error('Message sender missing');
  }
  if (!Number.isInteger(timestamp) || timestamp <= 0) throw new Error('Message timestamp invalid');

  const messageType = normalizeMessageType(rawType);

  const normPayload = normalizeHex(payloadHex);
  if (!normPayload) throw new Error('Message encrypted payload hex invalid');
  const normSig = normalizeHex(signatureHex);
  if (!normSig) throw new Error('Message signature hex invalid');

  let normClaimedHash = null;
  if (claimedHash !== null && claimedHash !== undefined) {
    normClaimedHash = normalizeHex(claimedHash);
    if (!normClaimedHash || normClaimedHash.length !== 64) {
      throw new Error('Message hash field invalid');
    }
  }

  return {
    token,
    senderAddress,
    timestamp,
    messageTypeStr: messageType.str,
    messageTypeByte: messageType.byte,
    encryptedPayload: hexToBytes(normPayload),
    signature: hexToBytes(normSig),
    claimedHash: normClaimedHash
  };
}

/**
 * Verifies a received message's signature against its canonical hash
 * (message.GetHash(), messageType included) and binds the signing key to the
 * sender address.
 *
 * By default the public key is recovered from the DER signature (all four
 * recovery candidates) and accepted only when the hash160 of its compressed
 * or uncompressed serialization equals the sender address payload. When
 * `senderPubKey` or `resolveSenderPubKey` supplies a key, that key is bound
 * to the address the same way before use — the fast path is never weaker.
 *
 * Returns { signatureValid, authentication, hash, senderPubKey, reason }:
 *   authentication: 'signature' | 'gateway-preauthenticated' | 'invalid'
 * The 65-byte all-zero sentinel is reported as gateway-preauthenticated with
 * signatureValid=false; whether to accept it is the caller's policy.
 */
async function verifyDepinReceivedMessage(message, options = {}) {
  const { network, senderPubKey = null, resolveSenderPubKey = null } = options;
  if (!network) {
    throw new Error("options.network is required ('mainnet' or 'test'/'testnet'/'regtest')");
  }

  let norm;
  try {
    norm = normalizeReceivedMessage(message);
  } catch (e) {
    return {
      signatureValid: false,
      authentication: 'invalid',
      hash: null,
      senderPubKey: null,
      reason: e.message
    };
  }

  const hashBytes = await computeDepinMessageHashBytes(norm);
  const hash = bytesToHex(hashBytes.slice().reverse());
  const result = { signatureValid: false, authentication: 'invalid', hash, senderPubKey: null, reason: null };

  if (norm.claimedHash && norm.claimedHash !== hash) {
    result.reason = 'hash field does not match computed message hash';
    return result;
  }

  if (isPreAuthenticatedSentinel(norm.signature)) {
    result.authentication = 'gateway-preauthenticated';
    result.reason = 'pre-authenticated gateway sentinel; not cryptographically verifiable';
    return result;
  }

  let addressPayload;
  try {
    ({ payload: addressPayload } = await decodeP2PKHAddress(norm.senderAddress, network));
  } catch (e) {
    result.reason = 'sender address invalid: ' + e.message;
    return result;
  }

  let sig;
  try {
    sig = secp256k1.Signature.fromDER(norm.signature);
  } catch (e) {
    result.reason = 'signature is not valid DER';
    return result;
  }

  // Fast path: a supplied key must still hash to the sender address.
  let suppliedKey = senderPubKey;
  if (!suppliedKey && typeof resolveSenderPubKey === 'function') {
    suppliedKey = await resolveSenderPubKey(norm.senderAddress);
  }
  if (suppliedKey) {
    let parsed;
    try {
      parsed = parsePublicKey(suppliedKey);
    } catch (e) {
      result.reason = 'supplied sender public key invalid: ' + e.message;
      return result;
    }
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, addressPayload)) {
      result.reason = 'supplied sender public key does not match sender address';
      return result;
    }
    // lowS: false — Core parses signatures laxly and accepts high-S.
    if (secp256k1.verify(sig, hashBytes, parsed.bytes, { lowS: false })) {
      result.signatureValid = true;
      result.authentication = 'signature';
      result.senderPubKey = bytesToHex(parsed.bytes);
      return result;
    }
    result.reason = 'signature verification failed for supplied sender public key';
    return result;
  }

  // Recovery path: try all four candidates, bind by hash160 of either form.
  for (let bit = 0; bit < 4; bit++) {
    let point;
    try {
      point = sig.addRecoveryBit(bit).recoverPublicKey(hashBytes);
    } catch {
      continue;
    }
    for (const compressed of [true, false]) {
      const candidate = point.toRawBytes(compressed);
      const keyHash = await hash160(candidate);
      if (timingSafeEqual(keyHash, addressPayload)) {
        result.signatureValid = true;
        result.authentication = 'signature';
        result.senderPubKey = bytesToHex(candidate);
        return result;
      }
    }
  }

  result.reason = 'no recovered public key matches the sender address';
  return result;
}

export {
  MAX_DEPIN_RECIPIENTS,
  MAX_DEPIN_MESSAGE_SIZE,
  DEPIN_RECEIVE_MAX_LIMIT,
  isPreAuthenticatedSentinel,
  normalizeMessageType,
  buildPreimageBytes,
  computeDepinMessageHashBytes,
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,
  parseDepinMessage,
  normalizeReceivedMessage,
  verifyDepinReceivedMessage
};
