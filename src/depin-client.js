/**
 * DePIN Protocol-2 client flows (plan v2 §3.3–§3.6; spec §7–§9).
 *
 * Network access is injected — `rpc.call(method, params)` — and every reply
 * is authenticated (`poolsig` against the pinned pool key) BEFORE it is
 * decrypted or interpreted. Identities provide capabilities (signMessage /
 * signDigest / openReply, see identity.js); flows fail with
 * DepinCapabilityError before any RPC when one is missing. Private keys are
 * never sent anywhere.
 *
 * Timestamps: request signatures are deterministic, so two DEPIN-REQ with
 * the same millisecond are the same request for the node's replay guard.
 * When the caller does not pass `timestampMs`, a per-address monotonic
 * source (`max(clock(), last + 1)`) is used; a deliberate retry therefore
 * always produces a fresh timestamp and signature.
 */

import { validateDepinSectionToken, isDepinTokenInScope } from './scope.js';
import { parsePublicKey } from './keys.js';
import { decodeP2PKHAddress } from './address.js';
import { hash160 } from './hash.js';
import { bytesToHex, timingSafeEqual } from './bytes.js';
import {
  verifyDepinReply,
  decodePlainReply,
  openBoundReply,
  decodeDepinPoolInfo
} from './depin-reply.js';
import { assertIdentityCapabilities } from './identity.js';
import { wrapMessageForServer, decodeDepinReceiveResponse } from './receive.js';
import {
  parseDepinMessage,
  buildDepinMessage,
  buildDepinPreimage,
  assembleDepinMessage,
  verifyDepinReceivedMessage,
  MAX_DEPIN_RECIPIENTS
} from './message.js';
import { DepinProtocolError } from './errors.js';

const CHALLENGE_HEX = /^[0-9a-f]{64}$/;
const RECEIVE_MAX_LIMIT = 1000;

// ---------------------------------------------------------------------------
// Preimage builders (§7.1, §7.2, §11) — pure, exported for external signers.
// ---------------------------------------------------------------------------

function assertComponent(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new DepinProtocolError(name + ' is required');
  }
  if (value.includes('|')) {
    throw new DepinProtocolError(name + " must not contain '|'");
  }
  return value;
}

function assertToken(token, name = 'token') {
  const check = validateDepinSectionToken(token);
  if (!check.valid) throw new DepinProtocolError(name + ' invalid: ' + check.error);
  return token;
}

function assertChallenge(challenge) {
  if (typeof challenge !== 'string' || !CHALLENGE_HEX.test(challenge)) {
    throw new DepinProtocolError('challenge must be 64 lowercase hex chars');
  }
  return challenge;
}

function assertTimestampMs(value) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new DepinProtocolError('timestampMs must be a positive safe integer');
  }
  return value;
}

/** `DEPIN-REQ|<type>|<token>|<address>|<ms>` (§7.1). */
function buildDepinRequestPreimage({ type = 'receive', token, address, timestampMs }) {
  if (type !== 'receive' && type !== 'admin') {
    throw new DepinProtocolError("type must be 'receive' or 'admin'");
  }
  assertToken(token);
  assertComponent(address, 'address');
  assertTimestampMs(timestampMs);
  return 'DEPIN-REQ|' + type + '|' + token + '|' + address + '|' + timestampMs;
}

/** `DEPIN-GET|<token>|<address>|<challenge>` (§7.2). */
function buildDepinGetPreimage({ token, address, challenge }) {
  assertToken(token);
  assertComponent(address, 'address');
  assertChallenge(challenge);
  return 'DEPIN-GET|' + token + '|' + address + '|' + challenge;
}

/** `DEPIN-CLEAR|<scope>|<address>|<challenge>` (§7.2). */
function buildDepinClearPreimage({ scope, address, challenge }) {
  assertToken(scope, 'scope');
  assertComponent(address, 'address');
  assertChallenge(challenge);
  return 'DEPIN-CLEAR|' + scope + '|' + address + '|' + challenge;
}

// ---------------------------------------------------------------------------
// Monotonic per-address timestamps (plan v2 §3.6)
// ---------------------------------------------------------------------------

const lastTimestampByAddress = new Map();

function nextTimestampMs(address, clock) {
  const now = clock ? clock() : Date.now();
  assertTimestampMs(now);
  const last = lastTimestampByAddress.get(address) ?? 0;
  const next = Math.max(now, last + 1);
  lastTimestampByAddress.set(address, next);
  return next;
}

function assertRpc(rpc) {
  if (!rpc || typeof rpc.call !== 'function') {
    throw new DepinProtocolError('rpc with a call(method, params) function is required');
  }
}

function assertPoolKey(poolPublicKey) {
  if (!poolPublicKey) {
    throw new DepinProtocolError('poolPublicKey (the pinned pool key) is required');
  }
  return poolPublicKey;
}

// ---------------------------------------------------------------------------
// Pool info
// ---------------------------------------------------------------------------

/**
 * `depingetmsginfo` + authentication under an explicit trust mode (§6.4).
 * Params: { rpc, serviceId, trust, network? }.
 * Returns { info, pin, trust, fingerprint } (see depin-reply.js).
 */
async function getDepinPoolInfo({ rpc, serviceId, trust, network }) {
  assertRpc(rpc);
  const reply = await rpc.call('depingetmsginfo', []);
  return decodeDepinPoolInfo({ reply, trust, serviceId, network });
}

// ---------------------------------------------------------------------------
// Recipients (§8.3 step 2) — the reply is a SIGNED plain envelope.
// ---------------------------------------------------------------------------

/**
 * Pure decoder for an already verified/decoded `depingetancestorrecipients`
 * body. Enforces the pool contract: complete response, pubkey↔address
 * binding, curve-point dedupe and the final map (sender included) within
 * `maxRecipients`.
 */
async function decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, network = null }) {
  if (!body || typeof body !== 'object') {
    throw new DepinProtocolError('depingetancestorrecipients returned no result');
  }
  if (body.token !== token) {
    throw new DepinProtocolError(
      "Response token '" + body.token + "' does not match requested '" + token + "'"
    );
  }
  if (body.stop_at !== poolRoot) {
    throw new DepinProtocolError(
      "Response stop_at '" + body.stop_at + "' does not match pool root '" + poolRoot + "'"
    );
  }
  if (body.truncated !== false) {
    throw new DepinProtocolError(
      'Recipient list is truncated or incomplete; refusing to build a partial group'
    );
  }
  if (!Array.isArray(body.recipients)) {
    throw new DepinProtocolError('Response recipients is not an array');
  }
  if (typeof body.returned === 'number' && body.returned !== body.recipients.length) {
    throw new DepinProtocolError('Response returned count does not match recipients length');
  }
  if (!Array.isArray(body.ancestors) || body.ancestors[0] !== token) {
    throw new DepinProtocolError('Response ancestors is inconsistent with the requested token');
  }

  const senderKey = parsePublicKey(senderPubKey);
  const byPoint = new Map();
  for (const entry of body.recipients) {
    if (!entry || typeof entry.address !== 'string' || typeof entry.pubkey !== 'string') {
      throw new DepinProtocolError('Malformed recipient entry in response');
    }
    const parsed = parsePublicKey(entry.pubkey);
    const { payload } = await decodeP2PKHAddress(entry.address, network);
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new DepinProtocolError(
        "Recipient pubkey does not match its address '" + entry.address + "'"
      );
    }
    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }

  const senderIncludedInHolders = byPoint.has(senderKey.pointId);
  const finalCount = byPoint.size + (senderIncludedInHolders ? 0 : 1);
  if (finalCount > maxRecipients) {
    throw new DepinProtocolError(
      'Final recipient map would have ' + finalCount + ' entries (sender included), ' +
      'above the pool limit of ' + maxRecipients
    );
  }

  return {
    recipientPubKeys: Array.from(byPoint.values()).map(bytesToHex),
    recipientCount: finalCount,
    senderIncludedInHolders,
    ancestors: body.ancestors,
    maxRecipients,
    skipped: {
      noPubKey: body.skipped_no_pubkey ?? null,
      noPubKeyComplete: body.skipped_no_pubkey_complete ?? null,
      restricted: body.skipped_restricted ?? null,
      restrictedComplete: body.skipped_restricted_complete ?? null
    }
  };
}

/**
 * Resolves the recipient set for sending to `token` through the pool rooted
 * at `poolRoot`. The node's reply is a `{ body, poolsig }` envelope whose
 * poolsig binds the queried token — it is verified against `poolPublicKey`
 * BEFORE the body is interpreted. The recipient list is authenticated as
 * coming from the pinned service; the service remains the trust root for
 * its on-chain correctness.
 *
 * Params: { rpc, token, poolRoot, maxRecipients, senderPubKey,
 *           poolPublicKey, network? }.
 */
async function resolveDepinRecipients(params) {
  const { rpc, token, poolRoot, maxRecipients, senderPubKey, poolPublicKey, network = null } = params;
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertToken(token);
  assertToken(poolRoot, 'poolRoot');
  if (!isDepinTokenInScope(token, poolRoot)) {
    throw new DepinProtocolError("token '" + token + "' is not under pool root '" + poolRoot + "'");
  }
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > MAX_DEPIN_RECIPIENTS) {
    throw new DepinProtocolError(
      'maxRecipients must be an integer between 1 and ' + MAX_DEPIN_RECIPIENTS
    );
  }
  if (!senderPubKey) {
    throw new DepinProtocolError('senderPubKey is required to size the final recipient map');
  }

  // One above the limit so "at the limit" and "over it" stay distinguishable.
  const reply = await rpc.call('depingetancestorrecipients', [token, maxRecipients + 1, poolRoot]);
  const verified = verifyDepinReply({
    reply, method: 'depingetancestorrecipients', token, poolPublicKey
  });
  const body = decodePlainReply(verified);
  return decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, network });
}

/**
 * Resolves recipients against the pool and builds the encrypted, signed
 * message in one step (verified envelope included). The legacy local-key
 * form accepts `privateKey`; the non-custodial form accepts `identity` and
 * invokes its `signDigest` capability exactly once with the canonical digest.
 */
async function buildDepinMessageForPool(params) {
  const {
    rpc, token, poolRoot, maxRecipients, poolPublicKey, network,
    identity = null, ...buildParams
  } = params;

  let senderPubKey = buildParams.senderPubKey;
  let senderAddress = buildParams.senderAddress;
  if (identity !== null) {
    assertIdentityCapabilities(identity, ['signDigest']);
    if (!network) {
      throw new DepinProtocolError('network is required for identity-based publishing');
    }
    if (typeof identity.publicKey !== 'string' || identity.publicKey.length === 0) {
      throw new DepinProtocolError('identity.publicKey is required to publish a message');
    }
    const identityKey = parsePublicKey(identity.publicKey);
    if (identityKey.bytes.length !== 33) {
      throw new DepinProtocolError('identity.publicKey must be a compressed 33-byte SEC1 key');
    }
    const { payload: identityAddressHash } = await decodeP2PKHAddress(identity.address, network);
    const identityKeyHash = await hash160(identityKey.bytes);
    if (!timingSafeEqual(identityAddressHash, identityKeyHash)) {
      throw new DepinProtocolError('identity.publicKey does not correspond to identity.address');
    }
    if (buildParams.privateKey !== undefined) {
      throw new DepinProtocolError('Provide either identity or privateKey, not both');
    }
    if (senderPubKey !== undefined &&
        parsePublicKey(senderPubKey).pointId !== identityKey.pointId) {
      throw new DepinProtocolError('senderPubKey does not match identity.publicKey');
    }
    if (senderAddress !== undefined && senderAddress !== identity.address) {
      throw new DepinProtocolError('senderAddress does not match identity.address');
    }
    senderPubKey = identity.publicKey;
    senderAddress = identity.address;
  }

  const resolution = await resolveDepinRecipients({
    rpc, token, poolRoot, maxRecipients, poolPublicKey, network,
    senderPubKey
  });

  if (identity !== null) {
    const preimage = await buildDepinPreimage({
      ...buildParams,
      network,
      token,
      senderAddress,
      senderPubKey,
      recipientPubKeys: resolution.recipientPubKeys
    });
    // Give the device its own copy: a callback cannot mutate the value kept
    // in the preimage result or affect assembly.
    const signature = await identity.signDigest(preimage.messageDigest.slice());
    const built = await assembleDepinMessage({
      token,
      senderAddress,
      timestamp: buildParams.timestamp,
      messageType: preimage.messageType,
      encryptedPayloadHex: preimage.encryptedPayloadHex
    }, signature);

    // External devices are untrusted capabilities too: fail locally before
    // submit if they returned a signature for another digest/key.
    const parsed = await parseDepinMessage(built.hex);
    const verification = await verifyDepinReceivedMessage(parsed, {
      network,
      senderPubKey
    });
    if (!verification.signatureValid) {
      throw new DepinProtocolError(
        'signDigest returned a signature that does not verify for identity.publicKey'
      );
    }
    return { ...built, recipientCount: preimage.recipientCount, resolution };
  }

  const built = await buildDepinMessage({
    ...buildParams,
    network,
    token,
    senderAddress,
    senderPubKey,
    recipientPubKeys: resolution.recipientPubKeys
  });
  return { ...built, resolution };
}

// ---------------------------------------------------------------------------
// Challenge (§7.1)
// ---------------------------------------------------------------------------

function decodeChallengeResult(opened, expectedType) {
  if (!opened || typeof opened !== 'object' ||
      typeof opened.challenge !== 'string' || !CHALLENGE_HEX.test(opened.challenge)) {
    throw new DepinProtocolError('depinchallenge reply has no valid challenge');
  }
  if (typeof opened.type === 'string' && opened.type !== expectedType) {
    throw new DepinProtocolError(
      "depinchallenge reply type '" + opened.type + "' does not match requested '" + expectedType + "'"
    );
  }
  return {
    challenge: opened.challenge,
    expiresIn: typeof opened.expires_in === 'number' ? opened.expires_in : null,
    type: opened.type ?? expectedType
  };
}

/**
 * Signs DEPIN-REQ, calls `depinchallenge`, verifies the bound reply and
 * decrypts the single-use challenge.
 *
 * Params: { rpc, identity, token, poolPublicKey, type?='receive',
 *           timestampMs?, clock? }.
 * Returns { challenge, expiresIn, type, timestampMs }.
 */
async function requestDepinChallenge({ rpc, identity, token, poolPublicKey, type = 'receive', timestampMs, clock }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ['signMessage', 'openReply']);
  assertToken(token);

  const t = timestampMs !== undefined ? assertTimestampMs(timestampMs)
    : nextTimestampMs(identity.address, clock);
  const preimage = buildDepinRequestPreimage({
    type, token, address: identity.address, timestampMs: t
  });
  const signature = await identity.signMessage(preimage);

  const reply = await rpc.call('depinchallenge', [token, identity.address, t, signature, type]);
  const verified = verifyDepinReply({
    reply, method: 'depinchallenge', token, address: identity.address,
    challenge: '', poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  return { ...decodeChallengeResult(opened, type), timestampMs: t };
}

// ---------------------------------------------------------------------------
// Receive (§7.2, §7.3, §8.2)
// ---------------------------------------------------------------------------

/**
 * Signs DEPIN-GET, calls `depinreceivemsg`, verifies the challenge-bound
 * reply, decrypts it and runs every message through the local validation
 * pipeline (sender signature over the recomputed digest, scope, size,
 * decryption).
 *
 * Params: { rpc, identity, token, challenge, poolPublicKey, afterHash?,
 *           limit?, timestamp?, network, resolveSenderPubKey?,
 *           requestedToken?, limits? }.
 * Returns { messages, hasMore, nextChallenge, nextExpiresIn, raw }.
 */
async function receiveDepinMessages(params) {
  const {
    rpc, identity, token, challenge, poolPublicKey,
    afterHash, limit, timestamp, network,
    resolveSenderPubKey, requestedToken, limits
  } = params;
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ['signMessage', 'openReply']);
  assertToken(token);
  assertChallenge(challenge);
  if (!network) {
    throw new DepinProtocolError("network is required ('mainnet' or 'test')");
  }
  if (afterHash !== undefined && afterHash !== '' &&
      (typeof afterHash !== 'string' || !CHALLENGE_HEX.test(afterHash))) {
    throw new DepinProtocolError('afterHash must be empty or 64 lowercase hex chars');
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 0 || limit > RECEIVE_MAX_LIMIT)) {
    throw new DepinProtocolError('limit must be an integer between 0 and ' + RECEIVE_MAX_LIMIT);
  }
  if (timestamp !== undefined && (!Number.isInteger(timestamp) || timestamp < 0)) {
    throw new DepinProtocolError('timestamp must be a non-negative integer (Unix seconds)');
  }

  const preimage = buildDepinGetPreimage({ token, address: identity.address, challenge });
  const signature = await identity.signMessage(preimage);

  // Positional optionals: null fills a skipped slot when a later one is set.
  const rpcParams = [token, identity.address, challenge, signature];
  const tail = [timestamp, afterHash, limit];
  let lastProvided = -1;
  for (let i = 0; i < tail.length; i++) if (tail[i] !== undefined) lastProvided = i;
  for (let i = 0; i <= lastProvided; i++) rpcParams.push(tail[i] === undefined ? null : tail[i]);

  const reply = await rpc.call('depinreceivemsg', rpcParams);
  const verified = verifyDepinReply({
    reply, method: 'depinreceivemsg', token, address: identity.address,
    challenge, poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);

  const decoded = await decodeDepinReceiveResponse(opened, {
    network,
    // openPayload hands over raw payload bytes; identity.openReply takes the
    // hex form (same as bound replies), so bridge the encoding here.
    openPayload: (payloadBytes) => identity.openReply(bytesToHex(payloadBytes)),
    requestedToken: requestedToken ?? token,
    resolveSenderPubKey,
    limits
  });

  return {
    messages: decoded.messages,
    hasMore: decoded.hasMore,
    nextChallenge: decoded.nextChallenge,
    nextExpiresIn: decoded.nextExpiresIn,
    raw: opened
  };
}

// ---------------------------------------------------------------------------
// Sections (§8.1, §8.2)
// ---------------------------------------------------------------------------

function decodeSectionsResult(opened) {
  if (!opened || typeof opened !== 'object' || !Array.isArray(opened.sections)) {
    throw new DepinProtocolError('depinlistsections reply has no sections array');
  }
  for (const section of opened.sections) {
    if (!section || typeof section.name !== 'string') {
      throw new DepinProtocolError('depinlistsections reply has a malformed section entry');
    }
  }
  return opened;
}

/**
 * Public section list: plain reply, no auth, poolsig bound to the pool root.
 * Params: { rpc, poolRoot, poolPublicKey }.
 */
async function listDepinSectionsPublic({ rpc, poolRoot, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertToken(poolRoot, 'poolRoot');
  const reply = await rpc.call('depinlistsections', []);
  const verified = verifyDepinReply({
    reply, method: 'depinlistsections', token: poolRoot, poolPublicKey
  });
  const body = decodePlainReply(verified);
  return { sections: decodeSectionsResult(body).sections };
}

/**
 * Address-scoped section list: needs a `receive` challenge for `scope`;
 * bound reply with chaining.
 * Params: { rpc, identity, scope, challenge, poolPublicKey }.
 */
async function listDepinSectionsPrivate({ rpc, identity, scope, challenge, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ['signMessage', 'openReply']);
  assertToken(scope, 'scope');
  assertChallenge(challenge);

  const preimage = buildDepinGetPreimage({ token: scope, address: identity.address, challenge });
  const signature = await identity.signMessage(preimage);

  const reply = await rpc.call('depinlistsections', [identity.address, scope, challenge, signature]);
  const verified = verifyDepinReply({
    reply, method: 'depinlistsections', token: scope, address: identity.address,
    challenge, poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  const decoded = decodeSectionsResult(opened);
  return {
    sections: decoded.sections,
    nextChallenge: typeof decoded.next_challenge === 'string' ? decoded.next_challenge : null,
    nextExpiresIn: typeof decoded.next_expires_in === 'number' ? decoded.next_expires_in : null
  };
}

// ---------------------------------------------------------------------------
// Clear (§8.4)
// ---------------------------------------------------------------------------

/**
 * Purges a scope's subtree with an `admin` challenge. `scope: ''` means the
 * whole pool: the node resolves it to the pool root before signing, so the
 * preimage and the reply verification use `poolRoot` even though the RPC
 * receives ''. `mode`: omitted = expired only, 'all', or hours (int >= 0).
 *
 * Params: { rpc, identity, scope?, poolRoot, challenge, poolPublicKey, mode? }.
 */
async function clearDepinMessages({ rpc, identity, scope = '', poolRoot, challenge, poolPublicKey, mode }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ['signMessage', 'openReply']);
  assertChallenge(challenge);

  let effectiveScope;
  if (scope === '') {
    assertToken(poolRoot, 'poolRoot (required when scope is empty)');
    effectiveScope = poolRoot;
  } else {
    assertToken(scope, 'scope');
    effectiveScope = scope;
  }

  if (mode !== undefined && mode !== 'all' &&
      (!Number.isInteger(mode) || mode < 0)) {
    throw new DepinProtocolError("mode must be omitted, 'all' or a non-negative integer of hours");
  }

  const preimage = buildDepinClearPreimage({
    scope: effectiveScope, address: identity.address, challenge
  });
  const signature = await identity.signMessage(preimage);

  const rpcParams = [scope, identity.address, challenge, signature];
  if (mode !== undefined) rpcParams.push(mode);

  const reply = await rpc.call('depinclearmsg', rpcParams);
  const verified = verifyDepinReply({
    reply, method: 'depinclearmsg', token: effectiveScope, address: identity.address,
    challenge, poolPublicKey
  });
  return openBoundReply(verified, identity.openReply);
}

// ---------------------------------------------------------------------------
// Submit (§8.3)
// ---------------------------------------------------------------------------

function decodeSubmitResult(opened) {
  if (!opened || typeof opened !== 'object' || opened.result !== 'success') {
    throw new DepinProtocolError(
      'depinsubmitmsg reply did not confirm success'
    );
  }
  if (typeof opened.hash !== 'string' || !CHALLENGE_HEX.test(opened.hash)) {
    throw new DepinProtocolError('depinsubmitmsg reply has no valid message hash');
  }
  return opened;
}

/**
 * Publishes an already built & signed CDepinMessage: validates it locally,
 * wraps its hex in the ECIES envelope for the pool key
 * (`{sender, encrypted}`), calls `depinsubmitmsg` and verifies the bound
 * reply (token = the message's token, address = sender, empty challenge).
 *
 * Params: { rpc, identity, messageHex, poolPublicKey }.
 * Returns the decrypted node confirmation ({ result, hash, ... }).
 */
async function submitDepinMessage({ rpc, identity, messageHex, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ['openReply']);
  if (typeof messageHex !== 'string' || messageHex.length === 0) {
    throw new DepinProtocolError('messageHex is required');
  }

  const parsed = await parseDepinMessage(messageHex);
  if (parsed.senderAddress !== identity.address) {
    throw new DepinProtocolError(
      "message senderAddress '" + parsed.senderAddress +
      "' does not match the identity address '" + identity.address + "'"
    );
  }

  const envelope = await wrapMessageForServer(messageHex, poolPublicKey, identity.address);
  const reply = await rpc.call('depinsubmitmsg', [envelope]);
  const verified = verifyDepinReply({
    reply, method: 'depinsubmitmsg', token: parsed.token, address: identity.address,
    challenge: '', poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  return decodeSubmitResult(opened);
}

export {
  buildDepinRequestPreimage,
  buildDepinGetPreimage,
  buildDepinClearPreimage,
  getDepinPoolInfo,
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
  decodeSubmitResult
};
