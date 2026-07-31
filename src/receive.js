/**
 * Non-custodial reception: decode depinreceivemsg results (plain array,
 * paginated object, or {encrypted} privacy wrapper), validate each message
 * locally, and decrypt.
 *
 * The token filter of depinreceivemsg is not authentication and the response
 * wrapper does not authenticate the server. Everything is validated locally:
 * hash, signature (or explicit pre-authenticated policy), scope, sizes.
 * A payload that does not decrypt is NOT an error: it simply was not
 * encrypted for this key.
 */

import { hexToBytes, bytesToHex, normalizeHex } from './bytes.js';
import { normalizePrivateKeyTo32Bytes, isWIF, wifToHex, parsePublicKey } from './keys.js';
import {
  eciesEncrypt, serializeEciesMessage, deserializeEciesMessage, eciesDecrypt
} from './ecies.js';
import {
  MAX_DEPIN_RECIPIENTS, MAX_DEPIN_MESSAGE_SIZE, DEPIN_RECEIVE_MAX_LIMIT,
  normalizeReceivedMessage, verifyDepinReceivedMessage
} from './message.js';
import { isDepinTokenInScope } from './scope.js';

const DEFAULT_LIMITS = {
  maxMessages: DEPIN_RECEIVE_MAX_LIMIT,
  maxPayloadBytes: MAX_DEPIN_MESSAGE_SIZE * MAX_DEPIN_RECIPIENTS
};

/**
 * Decrypts `encrypted_payload_hex` from Neurai RPC `depinreceivemsg`.
 * Returns the decrypted plaintext (UTF-8) or null if the payload is not
 * intended for the provided private key, or if authentication fails.
 * Both public key forms (compressed and uncompressed) are tried.
 */
async function decryptDepinReceiveEncryptedPayload(encryptedPayloadHex, recipientPrivateKey) {
  const normalized = normalizeHex(encryptedPayloadHex);
  if (!normalized) throw new Error('Invalid encryptedPayloadHex');

  const msg = deserializeEciesMessage(hexToBytes(normalized));
  const privKeyBytes = await normalizePrivateKeyTo32Bytes(recipientPrivateKey);

  const plaintextBytes = await eciesDecrypt(msg, privKeyBytes);
  if (plaintextBytes === null) return null;
  return new TextDecoder().decode(plaintextBytes);
}

/**
 * Decrypts one received message's payload. Accepts the RPC message shape or
 * the parsed shape. Returns { plaintext } (null when not addressed to this
 * key) — decryption only, no validation.
 */
async function decryptDepinReceivedMessage(message, privateKey) {
  const norm = normalizeReceivedMessage(message);
  const privKeyBytes = await normalizePrivateKeyTo32Bytes(privateKey);
  const ecies = deserializeEciesMessage(norm.encryptedPayload);
  const plaintextBytes = await eciesDecrypt(ecies, privKeyBytes);
  return {
    plaintext: plaintextBytes === null ? null : new TextDecoder().decode(plaintextBytes)
  };
}

/**
 * Full local pipeline for one received message: shape and size checks, hash,
 * scope, signature (or pre-authenticated policy), then decryption.
 *
 * options:
 *   network            required for signature verification
 *   privateKey         optional; when given the payload is decrypted
 *   requestedToken     optional; the message token must be in this scope
 *   limits             { maxPayloadBytes }
 *   preAuthenticatedPolicy  'reject' (default) | 'trust-gateway'
 *   senderPubKey / resolveSenderPubKey  optional verification fast path
 *
 * Returns { ok, reason, hash, message, signatureValid, authentication,
 * senderPubKey, plaintext }. `ok: false` means the message failed validation
 * and must not be displayed. `plaintext` is null when the key was not among
 * the recipients (that alone does not make ok false).
 */
async function validateAndDecryptDepinMessage(message, options = {}) {
  const {
    network,
    privateKey = null,
    requestedToken = null,
    limits = {},
    preAuthenticatedPolicy = 'reject',
    senderPubKey = null,
    resolveSenderPubKey = null
  } = options;

  if (preAuthenticatedPolicy !== 'reject' && preAuthenticatedPolicy !== 'trust-gateway') {
    throw new Error("preAuthenticatedPolicy must be 'reject' or 'trust-gateway'");
  }

  const effLimits = { ...DEFAULT_LIMITS, ...limits };

  const result = {
    ok: false,
    reason: null,
    hash: null,
    message: null,
    signatureValid: false,
    authentication: 'invalid',
    senderPubKey: null,
    plaintext: null
  };

  let norm;
  try {
    norm = normalizeReceivedMessage(message);
  } catch (e) {
    result.reason = e.message;
    return result;
  }
  result.message = {
    token: norm.token,
    sender: norm.senderAddress,
    timestamp: norm.timestamp,
    messageType: norm.messageTypeStr
  };

  if (norm.encryptedPayload.length === 0) {
    result.reason = 'empty encrypted payload';
    return result;
  }
  if (norm.encryptedPayload.length > effLimits.maxPayloadBytes) {
    result.reason = 'encrypted payload exceeds limit of ' + effLimits.maxPayloadBytes + ' bytes';
    return result;
  }

  if (requestedToken !== null && !isDepinTokenInScope(norm.token, requestedToken)) {
    result.reason = "message token '" + norm.token + "' is outside requested scope '" + requestedToken + "'";
    return result;
  }

  const verification = await verifyDepinReceivedMessage(message, {
    network, senderPubKey, resolveSenderPubKey
  });
  result.hash = verification.hash;
  result.signatureValid = verification.signatureValid;
  result.authentication = verification.authentication;
  result.senderPubKey = verification.senderPubKey;

  if (verification.authentication === 'gateway-preauthenticated') {
    if (preAuthenticatedPolicy !== 'trust-gateway') {
      result.reason = 'pre-authenticated gateway message rejected by policy';
      return result;
    }
  } else if (!verification.signatureValid) {
    result.reason = verification.reason || 'signature verification failed';
    return result;
  }

  result.ok = true;

  if (privateKey !== null) {
    try {
      const ecies = deserializeEciesMessage(norm.encryptedPayload);
      const privKeyBytes = await normalizePrivateKeyTo32Bytes(privateKey);
      const plaintextBytes = await eciesDecrypt(ecies, privKeyBytes);
      if (plaintextBytes !== null) {
        result.plaintext = new TextDecoder().decode(plaintextBytes);
      }
    } catch (e) {
      // Structurally invalid ECIES payload: not decryptable by anyone.
      result.ok = false;
      result.reason = 'encrypted payload is malformed: ' + e.message;
      return result;
    }
  }

  return result;
}

/**
 * Decodes a complete depinreceivemsg result already extracted from JSON-RPC.
 * Handles the three formats: plain array (limit 0), paginated
 * {messages, has_more}, and either wrapped as {encrypted}.
 *
 * options: everything validateAndDecryptDepinMessage takes, plus
 *   limits.maxMessages (default 1000).
 * privateKey is required when the response is {encrypted}.
 *
 * Returns { messages, hasMore, wasEncrypted } where each entry is a
 * validateAndDecryptDepinMessage result (duplicated hashes are rejected).
 */
async function decodeDepinReceiveResponse(rpcResult, options = {}) {
  const { privateKey = null, limits = {} } = options;
  const effLimits = { ...DEFAULT_LIMITS, ...limits };

  let wasEncrypted = false;
  let payload = rpcResult;

  if (payload && typeof payload === 'object' && !Array.isArray(payload) &&
      typeof payload.encrypted === 'string') {
    if (!privateKey) {
      throw new Error('privateKey is required to unwrap an { encrypted } response');
    }
    const plaintext = await decryptDepinReceiveEncryptedPayload(payload.encrypted, privateKey);
    if (plaintext === null) {
      throw new Error('Could not decrypt { encrypted } response with the provided key');
    }
    try {
      payload = JSON.parse(plaintext);
    } catch {
      throw new Error('Decrypted response wrapper is not valid JSON');
    }
    wasEncrypted = true;
  }

  let rawMessages;
  let hasMore = null;
  if (Array.isArray(payload)) {
    rawMessages = payload;
  } else if (payload && typeof payload === 'object' && Array.isArray(payload.messages)) {
    rawMessages = payload.messages;
    if (typeof payload.has_more === 'boolean') hasMore = payload.has_more;
    else if (typeof payload.hasMore === 'boolean') hasMore = payload.hasMore;
    else throw new Error('Paginated response missing has_more');
  } else {
    throw new Error('Unrecognized depinreceivemsg result shape');
  }

  if (rawMessages.length > effLimits.maxMessages) {
    throw new Error(
      'Response has ' + rawMessages.length + ' messages, above the limit of ' + effLimits.maxMessages
    );
  }

  const seenHashes = new Set();
  const messages = [];
  for (const raw of rawMessages) {
    const entry = await validateAndDecryptDepinMessage(raw, options);
    if (entry.ok && entry.hash) {
      if (seenHashes.has(entry.hash)) {
        entry.ok = false;
        entry.reason = 'duplicate message hash in response';
        entry.plaintext = null;
      } else {
        seenHashes.add(entry.hash);
      }
    }
    messages.push(entry);
  }

  return { messages, hasMore, wasEncrypted };
}

/**
 * wrapMessageForServer
 * Encrypts a serialized CDepinMessage hex for the server's pool public key.
 * This hides the content from the transport only; it does not authenticate
 * the node's identity.
 */
async function wrapMessageForServer(messageHex, serverPubKeyHex, senderAddress) {
  if (!messageHex || !serverPubKeyHex || !senderAddress) {
    throw new Error('messageHex, serverPubKeyHex, and senderAddress are required');
  }

  const normalizedMsg = normalizeHex(messageHex);
  if (!normalizedMsg) throw new Error('Invalid messageHex');

  // Core's ECIES accepts both secp256k1 serializations; parse validates
  // 33/65 bytes and that the point is on the curve.
  let serverPubKey;
  try {
    serverPubKey = parsePublicKey(serverPubKeyHex).bytes;
  } catch (e) {
    throw new Error('Invalid serverPubKeyHex: ' + e.message);
  }

  // The server decrypts this and expects to find a HEX STRING (IsHex() in the
  // node), so the hex string itself is encrypted as UTF-8 bytes, not the raw
  // binary message.
  const messageBytes = new TextEncoder().encode(normalizedMsg);
  const eciesMsg = await eciesEncrypt(messageBytes, [serverPubKey]);

  return {
    sender: senderAddress,
    encrypted: bytesToHex(serializeEciesMessage(eciesMsg))
  };
}

/**
 * unwrapMessageFromServer
 * Decrypts a privacy-wrapped response from depinreceivemsg. Returns the
 * decrypted string (2.2.1-compatible), or the parsed value when
 * options.parseJson is true. Returns null when the key does not match.
 */
async function unwrapMessageFromServer(encryptedHex, recipientPrivateKeyWifOrHex, options = {}) {
  if (!encryptedHex || !recipientPrivateKeyWifOrHex) {
    throw new Error('encryptedHex and recipientPrivateKey are required');
  }

  let privKeyHex = recipientPrivateKeyWifOrHex;
  if (isWIF(privKeyHex)) {
    privKeyHex = await wifToHex(privKeyHex);
  }

  const decrypted = await decryptDepinReceiveEncryptedPayload(encryptedHex, privKeyHex);
  if (decrypted === null || !options.parseJson) return decrypted;

  try {
    return JSON.parse(decrypted);
  } catch {
    throw new Error('Decrypted server response is not valid JSON');
  }
}

export {
  decryptDepinReceiveEncryptedPayload,
  decryptDepinReceivedMessage,
  validateAndDecryptDepinMessage,
  decodeDepinReceiveResponse,
  wrapMessageForServer,
  unwrapMessageFromServer
};
