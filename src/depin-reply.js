/**
 * DePIN protocol-2 reply envelopes: structural validation, `poolsig`
 * verification and authenticated opening (spec §6.2–§6.4).
 *
 * Every DePIN reply is `{ body, poolsig }` (plain) or `{ encrypted, poolsig }`
 * (bound to an address). The pool signs
 *
 *   DEPIN-RESP|method|token|address|challenge|sha256hex(replyHex)
 *
 * over the ASCII hex string exactly as received — so this module hashes the
 * string it was given and never a re-serialization (§13.7 N2).
 *
 * Processing order is an API guarantee (plan v2 §1.4): shape/limits → pin →
 * poolsig → decrypt → parse. Decoding helpers only accept values branded by
 * the verification step; the brand cannot be fabricated from outside this
 * module, so there is no convenient unauthenticated path.
 */

import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from './bytes.js';
import { hash160 } from './hash.js';
import { parsePublicKey, normalizePrivateKeyTo32Bytes } from './keys.js';
import { decodeP2PKHAddress } from './address.js';
import { validateDepinSectionToken } from './scope.js';
import { deserializeEciesMessage, eciesDecrypt } from './ecies.js';
import { recoverPublicKeyFromMessage } from './signmessage.js';
import {
  DepinProtocolError,
  DepinReplyAuthenticationError,
  DepinReplyDecryptionError,
  PoolPinMismatchError
} from './errors.js';

// Resource limits, enforced before any expensive work (plan v2 §2.5/§5).
// A reply carries at most one page of messages (limit ≤ 1000, message size
// ≤ 10 240 bytes, ≤ 50 recipient entries each) — 32 MiB of hex is far above
// any legitimate reply while still bounding allocations.
const MAX_REPLY_HEX_CHARS = 32 * 1024 * 1024;
const MAX_DECODED_JSON_BYTES = 16 * 1024 * 1024;

const VERIFIED_REPLY_BRAND = Symbol('neurai.depin.verifiedReply');

function isVerifiedDepinReply(value) {
  return Boolean(value) && typeof value === 'object' && value[VERIFIED_REPLY_BRAND] === true;
}

function sha256HexOfAscii(str) {
  return bytesToHex(nobleSha256(new TextEncoder().encode(str)));
}

function assertPreimageComponent(value, name) {
  if (typeof value !== 'string') {
    throw new DepinProtocolError(name + ' must be a string');
  }
  if (value.includes('|')) {
    throw new DepinProtocolError(name + " must not contain '|'");
  }
  return value;
}

/**
 * Builds the reply preimage over the reply hex EXACTLY as received.
 * `token`, `address` and `challenge` default to '' like the node does for
 * methods without that argument.
 */
function buildDepinReplyPreimage({ method, token = '', address = '', challenge = '', replyHex }) {
  assertPreimageComponent(method, 'method');
  if (!/^[a-z0-9]+$/.test(method)) {
    throw new DepinProtocolError('method must be a lowercase RPC name');
  }
  assertPreimageComponent(token, 'token');
  assertPreimageComponent(address, 'address');
  assertPreimageComponent(challenge, 'challenge');
  if (typeof replyHex !== 'string' || replyHex.length === 0) {
    throw new DepinProtocolError('replyHex is required');
  }
  return (
    'DEPIN-RESP|' + method + '|' + token + '|' + address + '|' + challenge +
    '|' + sha256HexOfAscii(replyHex)
  );
}

function validateReplyShape(reply) {
  if (!reply || typeof reply !== 'object' || Array.isArray(reply)) {
    throw new DepinProtocolError('DePIN reply must be an object');
  }
  const hasBody = typeof reply.body === 'string';
  const hasEncrypted = typeof reply.encrypted === 'string';
  if (hasBody === hasEncrypted) {
    throw new DepinProtocolError(
      "DePIN reply must carry exactly one of 'body' or 'encrypted'"
    );
  }
  if (typeof reply.poolsig !== 'string' || reply.poolsig.length === 0) {
    throw new DepinProtocolError('DePIN reply is missing poolsig');
  }
  const replyHex = hasBody ? reply.body : reply.encrypted;
  if (replyHex.length === 0 || replyHex.length > MAX_REPLY_HEX_CHARS) {
    throw new DepinProtocolError('DePIN reply hex is empty or exceeds the size limit');
  }
  if (replyHex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(replyHex)) {
    throw new DepinProtocolError('DePIN reply hex must be canonical lowercase hex');
  }
  return { kind: hasBody ? 'plain' : 'bound', replyHex };
}

/**
 * Verifies a DePIN reply against the pinned pool public key. Returns a
 * branded VerifiedReply `{ kind, replyHex, method, token, address,
 * challenge, poolPublicKey }`; throws DepinReplyAuthenticationError when the
 * signature does not recover to the expected key.
 */
function verifyDepinReply({ reply, method, token = '', address = '', challenge = '', poolPublicKey }) {
  const { kind, replyHex } = validateReplyShape(reply);
  if (!poolPublicKey) {
    throw new DepinProtocolError('poolPublicKey is required to verify a DePIN reply');
  }
  const expected = parsePublicKey(poolPublicKey);
  const preimage = buildDepinReplyPreimage({ method, token, address, challenge, replyHex });

  let recovered;
  try {
    recovered = recoverPublicKeyFromMessage(preimage, reply.poolsig);
  } catch (e) {
    throw new DepinReplyAuthenticationError(
      'poolsig is malformed or unrecoverable for ' + method, e
    );
  }
  if (parsePublicKey(recovered).pointId !== expected.pointId) {
    throw new DepinReplyAuthenticationError(
      'poolsig for ' + method + ' does not verify against the pinned pool key'
    );
  }

  return Object.freeze({
    [VERIFIED_REPLY_BRAND]: true,
    kind,
    replyHex,
    method,
    token,
    address,
    challenge,
    poolPublicKey: expected.pointId
  });
}

function parseJsonBytes(bytes, context) {
  if (bytes.length > MAX_DECODED_JSON_BYTES) {
    throw new DepinProtocolError(context + ': decoded JSON exceeds the size limit');
  }
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (e) {
    throw new DepinProtocolError(context + ': decoded bytes are not valid UTF-8', e);
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch (e) {
    throw new DepinProtocolError(context + ': decoded text is not valid JSON', e);
  }
  if (!value || typeof value !== 'object') {
    throw new DepinProtocolError(context + ': decoded JSON is not an object');
  }
  return value;
}

/**
 * Decodes the JSON of a verified PLAIN reply.
 */
function decodePlainReply(verifiedReply) {
  if (!isVerifiedDepinReply(verifiedReply)) {
    throw new DepinProtocolError('decodePlainReply requires a verified reply');
  }
  if (verifiedReply.kind !== 'plain') {
    throw new DepinProtocolError('decodePlainReply requires a plain reply');
  }
  return parseJsonBytes(hexToBytes(verifiedReply.replyHex), verifiedReply.method);
}

/**
 * Opens a verified BOUND reply: ECIES-decrypts the envelope for the holder
 * and parses the JSON. `opener` is a 32-byte private key / compressed WIF, or
 * an OpenReply callback `(encryptedHex) => bytes|string` for external
 * signers/decryptors.
 */
async function openBoundReply(verifiedReply, opener) {
  if (!isVerifiedDepinReply(verifiedReply)) {
    throw new DepinProtocolError('openBoundReply requires a verified reply');
  }
  if (verifiedReply.kind !== 'bound') {
    throw new DepinProtocolError('openBoundReply requires a bound reply');
  }
  if (!opener) {
    throw new DepinProtocolError('openBoundReply requires a private key or an openReply callback');
  }

  let plaintext;
  if (typeof opener === 'function') {
    let out;
    try {
      out = await opener(verifiedReply.replyHex);
    } catch (e) {
      throw new DepinReplyDecryptionError(
        'openReply callback failed for ' + verifiedReply.method, e
      );
    }
    if (typeof out === 'string') plaintext = new TextEncoder().encode(out);
    else if (out instanceof Uint8Array) plaintext = out;
    else {
      throw new DepinReplyDecryptionError(
        'openReply callback must return bytes or a string'
      );
    }
  } else {
    const privKey = await normalizePrivateKeyTo32Bytes(opener);
    let message;
    try {
      message = deserializeEciesMessage(hexToBytes(verifiedReply.replyHex));
    } catch (e) {
      throw new DepinReplyDecryptionError(
        'bound reply envelope does not deserialize for ' + verifiedReply.method, e
      );
    }
    plaintext = await eciesDecrypt(message, privKey);
    if (plaintext === null) {
      throw new DepinReplyDecryptionError(
        'bound reply for ' + verifiedReply.method +
        ' is not encrypted for this key or failed authentication'
      );
    }
  }

  return parseJsonBytes(plaintext, verifiedReply.method);
}

// ---------------------------------------------------------------------------
// Pool info, pin and TOFU (§6.4)
// ---------------------------------------------------------------------------

function canonicalPubKeyHex(pubKey) {
  return parsePublicKey(pubKey).pointId;
}

/** Human-comparable fingerprint of a pool key: SHA-256 of the compressed
 *  point, first 16 hex chars in 4-char groups ("ab12 cd34 ef56 7890"). */
function poolKeyFingerprint(pubKey) {
  const canonical = canonicalPubKeyHex(pubKey);
  const digest = bytesToHex(nobleSha256(hexToBytes(canonical)));
  return digest.slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
}

function readUntrustedBodyJson(reply) {
  const { kind, replyHex } = validateReplyShape(reply);
  if (kind !== 'plain') {
    throw new DepinProtocolError('depingetmsginfo reply must be a plain reply');
  }
  return { untrustedBody: parseJsonBytes(hexToBytes(replyHex), 'depingetmsginfo (untrusted)') };
}

async function checkAnnouncedPoolIdentity(info, poolPublicKey, network) {
  const announcedKey = info.depinpoolpkey;
  if (typeof announcedKey !== 'string' ||
      canonicalPubKeyHex(announcedKey) !== canonicalPubKeyHex(poolPublicKey)) {
    throw new PoolPinMismatchError(
      'Announced depinpoolpkey does not match the verified pool key'
    );
  }
  if (typeof info.depinpoolkeyaddress === 'string' && info.depinpoolkeyaddress.length > 0) {
    const { payload } = await decodeP2PKHAddress(info.depinpoolkeyaddress, network ?? null);
    const keyHash = await hash160(parsePublicKey(announcedKey).bytes);
    if (bytesToHex(keyHash) !== bytesToHex(payload)) {
      throw new PoolPinMismatchError(
        'depinpoolkeyaddress does not correspond to depinpoolpkey'
      );
    }
  }
}

function validatePoolInfoShape(info) {
  if (info.protocol !== 2) {
    throw new DepinProtocolError(
      'Pool announces protocol ' + JSON.stringify(info.protocol) + '; this library requires protocol 2'
    );
  }
  const tokenCheck = validateDepinSectionToken(info.token);
  if (!tokenCheck.valid) {
    throw new DepinProtocolError('Pool root token invalid: ' + tokenCheck.error);
  }
  if (!Number.isInteger(info.maxrecipients) || info.maxrecipients < 1) {
    throw new DepinProtocolError('Pool maxrecipients invalid');
  }
}

/**
 * Decodes and authenticates `depingetmsginfo` under an explicit trust mode
 * (plan v2 §2.4):
 *
 *   { mode: 'pinned', pin: { serviceId, poolRoot, poolPublicKey } }
 *   { mode: 'key',    serviceId, poolPublicKey }
 *   { mode: 'tofu',   serviceId }
 *
 * `serviceId` is the caller-supplied identity of the endpoint this reply
 * came from; with a pinned trust it must equal the pin's serviceId.
 * Returns { info, pin, trust, fingerprint } — `pin` is what the application
 * should persist ('tofu' returns it as OBSERVED, not authenticated).
 */
async function decodeDepinPoolInfo({ reply, trust, serviceId, network }) {
  if (!trust || typeof trust !== 'object' || typeof trust.mode !== 'string') {
    throw new DepinProtocolError("trust must be an object with a 'mode'");
  }
  if (typeof serviceId !== 'string' || serviceId.length === 0) {
    throw new DepinProtocolError('serviceId is required (endpoint identity)');
  }

  if (trust.mode === 'pinned') {
    const pin = trust.pin;
    if (!pin || typeof pin.serviceId !== 'string' || typeof pin.poolRoot !== 'string' ||
        typeof pin.poolPublicKey !== 'string') {
      throw new DepinProtocolError('pinned trust requires { serviceId, poolRoot, poolPublicKey }');
    }
    if (pin.serviceId !== serviceId) {
      throw new PoolPinMismatchError(
        'Reply comes from a different service than the pinned one'
      );
    }
    const verified = verifyDepinReply({
      reply, method: 'depingetmsginfo', token: pin.poolRoot,
      poolPublicKey: pin.poolPublicKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    if (info.token !== pin.poolRoot) {
      throw new PoolPinMismatchError('Announced pool root does not match the pinned root');
    }
    await checkAnnouncedPoolIdentity(info, pin.poolPublicKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: pin.poolRoot, poolPublicKey: canonicalPubKeyHex(pin.poolPublicKey) },
      trust: 'pinned',
      fingerprint: poolKeyFingerprint(pin.poolPublicKey)
    };
  }

  if (trust.mode === 'key') {
    if (typeof trust.poolPublicKey !== 'string') {
      throw new DepinProtocolError('key trust requires poolPublicKey');
    }
    // §6.4: read body.token and NOTHING else as untrusted input, only to
    // build the preimage; every other field waits for the signature.
    const { untrustedBody } = readUntrustedBodyJson(reply);
    const untrustedToken = untrustedBody.token;
    if (typeof untrustedToken !== 'string') {
      throw new DepinProtocolError('depingetmsginfo body has no token to bind the preimage');
    }
    const verified = verifyDepinReply({
      reply, method: 'depingetmsginfo', token: untrustedToken,
      poolPublicKey: trust.poolPublicKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    await checkAnnouncedPoolIdentity(info, trust.poolPublicKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: info.token, poolPublicKey: canonicalPubKeyHex(trust.poolPublicKey) },
      trust: 'key',
      fingerprint: poolKeyFingerprint(trust.poolPublicKey)
    };
  }

  if (trust.mode === 'tofu') {
    // §6.4 TOFU: decode as untrusted material, then check self-consistency —
    // the key recovered from poolsig must equal the announced depinpoolpkey
    // and hash to depinpoolkeyaddress. This is consistency, NOT
    // authentication of the first contact.
    const { untrustedBody } = readUntrustedBodyJson(reply);
    const announcedKey = untrustedBody.depinpoolpkey;
    const untrustedToken = untrustedBody.token;
    if (typeof announcedKey !== 'string' || typeof untrustedToken !== 'string') {
      throw new DepinProtocolError(
        'depingetmsginfo body lacks depinpoolpkey/token for TOFU'
      );
    }
    const verified = verifyDepinReply({
      reply, method: 'depingetmsginfo', token: untrustedToken,
      poolPublicKey: announcedKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    await checkAnnouncedPoolIdentity(info, announcedKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: info.token, poolPublicKey: canonicalPubKeyHex(announcedKey) },
      trust: 'tofu',
      fingerprint: poolKeyFingerprint(announcedKey)
    };
  }

  throw new DepinProtocolError("Unknown trust mode: " + trust.mode);
}

export {
  MAX_REPLY_HEX_CHARS,
  MAX_DECODED_JSON_BYTES,
  isVerifiedDepinReply,
  buildDepinReplyPreimage,
  verifyDepinReply,
  decodePlainReply,
  openBoundReply,
  decodeDepinPoolInfo,
  poolKeyFingerprint
};
