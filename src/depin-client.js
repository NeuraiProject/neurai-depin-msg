/** RPC 5 flows: no legacy request/signature fallback and no implicit replay of writes. */
import { parsePublicKey } from './keys.js';
import { decodeDepinAddress, pubKeyMatchesAddress } from './address.js';
import { bytesToHex } from './bytes.js';
import { verifyDepinReply, decodePlainReply, openBoundReply, decodeDepinPoolInfo } from './depin-reply.js';
import { createDepinRpcRequest, buildDepinRpcRequestPreimage, depinRequestHash, depinRequestBytes } from './rpc-codec.js';
import { recoverPublicKeyFromMessage } from './signmessage.js';
import { assertIdentityCapabilities } from './identity.js';
import { wrapMessageForServer, decodeDepinReceiveResponse } from './receive.js';
import { parseDepinMessage, buildDepinMessage, buildDepinPreimage, assembleDepinMessage, verifyDepinReceivedMessage } from './message.js';
import { DepinProtocolError, DepinRpcError } from './errors.js';

function buildDepinRequestPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function buildDepinGetPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function buildDepinClearPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function frozenCopy(value) {
  if (value === null || typeof value !== 'object') return value;
  return Object.freeze(
    Array.isArray(value) ? value.map(frozenCopy) : Object.fromEntries(Object.entries(value).map(([key, item]) => [key, frozenCopy(item)])),
  );
}
function assertRpc(rpc) {
  if (typeof rpc?.call !== 'function') throw new DepinProtocolError('rpc.call is required');
}

async function getDepinPoolInfo({ rpc, serviceId, trust, network, expectedNetworkHash, timestampMs, requestId }) {
  assertRpc(rpc);
  const request = createDepinRpcRequest({ method: 'depingetmsginfo', timestampMs, requestId });
  const reply = await rpc.call('depingetmsginfo', [frozenCopy(request)]);
  return decodeDepinPoolInfo({ reply, request, trust, serviceId, network, expectedNetworkHash });
}

async function callDepinRpc({ rpc, context, method, identity, token, address, challenge = '', args = {}, timestampMs, requestId }) {
  assertRpc(rpc);
  if (!context) throw new DepinProtocolError('Verified pool context is required for RPC 5');
  const privateCall =
    ['depinchallenge', 'depinreceivemsg', 'depinreceiveseq', 'depinclearmsg', 'depinsubmitmsg'].includes(method) ||
    (method === 'depinlistsections' && !!identity);
  if (privateCall) assertIdentityCapabilities(identity, ['signMessage', 'openReply']);
  const request = createDepinRpcRequest({
    method,
    context,
    token,
    address: privateCall ? identity.address : (address ?? ''),
    challenge,
    args,
    timestampMs: timestampMs ?? Date.now() + (context.clockOffsetMs ?? 0),
    requestId,
  });
  if (privateCall) {
    const preimage = buildDepinRpcRequestPreimage({ method, request });
    request.signature = await identity.signMessage(preimage, {
      kind: 'rpc',
      method,
      request: frozenCopy(request),
      requestHash: depinRequestHash(method, request),
    });
    // A device must support the new domain and exact identity before any request is sent.
    const recovered = recoverPublicKeyFromMessage(preimage, request.signature, identity.address);
    if (!(await pubKeyMatchesAddress(parsePublicKey(recovered).bytes, identity.address)))
      throw new DepinProtocolError('signMessage returned a signature for another address/domain');
  }
  const reply = await rpc.call(method, [frozenCopy(request)]);
  const verified = verifyDepinReply({ reply, method, request, poolPublicKey: context.pool_pubkey });
  const servedContext = Object.freeze({ ...verified.context, clockOffsetMs: context.clockOffsetMs ?? 0 });
  const body = privateCall ? await openBoundReply(verified, identity.openReply) : decodePlainReply(verified);
  if (body?.error) throw new DepinRpcError(body.error, servedContext);
  return { body, context: servedContext, membershipChanged: servedContext.membership_revision !== context.membership_revision };
}

async function decodeDepinRecipientDirectory(body, { token, poolRoot, network, requireComplete = true }) {
  if (
    !body ||
    body.token !== token ||
    body.stop_at !== poolRoot ||
    typeof body.truncated !== 'boolean' ||
    (requireComplete && body.truncated) ||
    !Array.isArray(body.recipients) ||
    !Array.isArray(body.ancestors) ||
    body.ancestors[0] !== token ||
    body.recipients.length > 10000
  )
    throw new DepinProtocolError('Recipient directory is incomplete or has a different scope');
  if (body.returned != null && body.returned !== body.recipients.length) throw new DepinProtocolError('Recipient count mismatch');
  const recipients = new Map();
  for (const entry of body.recipients) {
    if (typeof entry?.address !== 'string' || typeof entry?.pubkey !== 'string') throw new DepinProtocolError('Malformed recipient');
    const key = parsePublicKey(entry.pubkey);
    if (!(await pubKeyMatchesAddress(key.bytes, entry.address, network)))
      throw new DepinProtocolError('Recipient pubkey does not match its address');
    const id = (await decodeDepinAddress(entry.address, network)).recipientId;
    if (!recipients.has(id)) recipients.set(id, { address: entry.address, publicKey: bytesToHex(key.bytes) });
  }
  return [...recipients.values()];
}
async function decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, senderAddress, network, selectedAddresses }) {
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > 50) throw new DepinProtocolError('Invalid recipient budget');
  if (
    selectedAddresses !== undefined &&
    (!Array.isArray(selectedAddresses) ||
      !selectedAddresses.length ||
      selectedAddresses.length > maxRecipients ||
      selectedAddresses.some((a) => typeof a !== 'string'))
  )
    throw new DepinProtocolError('Invalid selected addresses');
  const available = await decodeDepinRecipientDirectory(body, {
    token,
    poolRoot,
    network,
    requireComplete: selectedAddresses === undefined,
  });
  const selected =
    selectedAddresses === undefined
      ? available
      : selectedAddresses.map((address) => {
          const entry = available.find((r) => r.address === address);
          if (!entry) throw new DepinProtocolError('Selected address is not an eligible recipient: ' + address);
          return entry;
        });
  const recipients = new Map();
  for (const entry of selected) recipients.set((await decodeDepinAddress(entry.address, network)).recipientId, entry);
  if (!senderAddress) throw new DepinProtocolError('senderAddress is required to preserve exact recipient identity');
  if (!(await pubKeyMatchesAddress(parsePublicKey(senderPubKey).bytes, senderAddress, network)))
    throw new DepinProtocolError('Sender key/address mismatch');
  const senderId = (await decodeDepinAddress(senderAddress, network)).recipientId;
  const senderIncludedInHolders = recipients.has(senderId);
  const finalCount = recipients.size + (senderIncludedInHolders ? 0 : 1);
  if (finalCount > maxRecipients) throw new DepinProtocolError('Final recipient map exceeds pool limit');
  return {
    recipients: [...recipients.values()],
    recipientPubKeys: [...recipients.values()],
    recipientCount: finalCount,
    senderIncludedInHolders,
    ancestors: body.ancestors,
    maxRecipients,
    skipped: {
      noPubKey: body.skipped_no_pubkey ?? null,
      noPubKeyComplete: body.skipped_no_pubkey_complete ?? null,
      restricted: body.skipped_restricted ?? null,
      restrictedComplete: body.skipped_restricted_complete ?? null,
    },
  };
}
async function resolveDepinRecipients(params) {
  if (!Number.isInteger(params.maxRecipients) || params.maxRecipients < 1 || params.maxRecipients > 50)
    throw new DepinProtocolError('Invalid pool recipient limit');
  const { body, context, membershipChanged } = await callDepinRpc({
    ...params,
    method: 'depingetancestorrecipients',
    args: {
      max_results: params.selectedAddresses ? 10000 : params.maxRecipients + 1,
      stop_at: params.poolRoot ?? params.context?.pool_root,
    },
  });
  const resolution = await decodeDepinRecipients(body, params);
  return { ...resolution, body, context, membershipChanged };
}
async function buildDepinMessageForPool(params) {
  const { identity, rpc, context, ...buildParams } = params;
  let senderPubKey = params.senderPubKey,
    senderAddress = params.senderAddress;
  if (identity) {
    assertIdentityCapabilities(identity, ['signDigest']);
    if (params.privateKey !== undefined) throw new DepinProtocolError('Provide identity or privateKey, not both');
    if (senderAddress && senderAddress !== identity.address) throw new DepinProtocolError('Sender identity mismatch');
    senderAddress = identity.address;
    senderPubKey = identity.publicKey;
    if (!(await pubKeyMatchesAddress(parsePublicKey(senderPubKey).bytes, senderAddress, params.network)))
      throw new DepinProtocolError('Identity key/address mismatch');
  }
  const resolution = await resolveDepinRecipients({ ...params, senderPubKey, senderAddress });
  const fields = { ...buildParams, senderPubKey, senderAddress, recipientPubKeys: resolution.recipientPubKeys };
  let built;
  if (identity) {
    const preimage = await buildDepinPreimage(fields);
    const signature = await identity.signDigest(preimage.messageDigest.slice(), {
      kind: 'message',
      token: params.token,
      senderAddress,
      timestamp: params.timestamp,
      messageType: preimage.messageTypeByte,
      encryptedPayloadHex: preimage.encryptedPayloadHex,
    });
    built = await assembleDepinMessage({ ...fields, encryptedPayloadHex: preimage.encryptedPayloadHex }, signature);
    const verification = await verifyDepinReceivedMessage(await parseDepinMessage(built.hex), { network: params.network, senderPubKey });
    if (!verification.signatureValid) throw new DepinProtocolError('signDigest returned an invalid message signature');
    built.recipientCount = preimage.recipientCount;
  } else built = await buildDepinMessage(fields);
  return { ...built, resolution, context: resolution.context };
}
function decodeChallengeResult(body, type) {
  if (!/^[0-9a-f]{64}$/.test(body?.challenge) || body.type !== type || !Number.isInteger(body.expires_in) || body.expires_in <= 0)
    throw new DepinProtocolError('Invalid challenge reply');
  return { challenge: body.challenge, expiresIn: body.expires_in, type };
}
async function requestDepinChallenge(params) {
  const type = params.type ?? 'receive';
  const { body, context } = await callDepinRpc({ ...params, method: 'depinchallenge', args: { type } });
  return { ...decodeChallengeResult(body, type), context };
}
async function receiveDepinMessages(params) {
  const sequence = params.mode !== 'timestamp';
  const method = sequence ? 'depinreceiveseq' : 'depinreceivemsg';
  const args = sequence
    ? {
        cursor: params.cursor ?? null,
        limit: params.limit ?? 100,
        from_timestamp: params.fromTimestamp ?? params.cursor?.from_timestamp ?? 0,
      }
    : { timestamp: params.timestamp ?? 0, after_hash: params.afterHash ?? '', limit: params.limit ?? 100 };
  const { body, context, membershipChanged } = await callDepinRpc({ ...params, method, args });
  if (sequence) {
    if (!body.cursor || typeof body.has_more !== 'boolean') throw new DepinProtocolError('Sequence reply missing cursor');
    // Reuse request validation to bind all six cursor fields without lossy conversion.
    depinRequestBytes(
      method,
      createDepinRpcRequest({ ...params, method, context, address: params.identity.address, args: { ...args, cursor: body.cursor } }),
    );
    if (
      params.cursor &&
      (body.cursor.stream_id !== params.cursor.stream_id || BigInt(body.cursor.after_seq) < BigInt(params.cursor.after_seq))
    )
      throw new DepinProtocolError('Sequence cursor changed stream or regressed');
    let previous = BigInt(params.cursor?.after_seq ?? 0);
    for (const item of body.messages ?? []) {
      if (
        (typeof item.sequence !== 'bigint' && !Number.isSafeInteger(item.sequence)) ||
        BigInt(item.sequence) <= previous ||
        BigInt(item.sequence) > BigInt(body.cursor.after_seq)
      )
        throw new DepinProtocolError('Invalid message admission sequence');
      previous = BigInt(item.sequence);
    }
  }
  const decoded = await decodeDepinReceiveResponse(body, {
    network: params.network,
    openPayload: (bytes) => params.identity.openReply(bytesToHex(bytes)),
    requestedToken: params.requestedToken ?? params.token,
    resolveSenderPubKey: params.resolveSenderPubKey,
    limits: params.limits,
  });
  return { ...decoded, cursor: sequence ? Object.freeze({ ...body.cursor }) : null, context, membershipChanged, raw: body };
}
async function listDepinSectionsPublic(params) {
  const result = await callDepinRpc({ ...params, method: 'depinlistsections' });
  if (!Array.isArray(result.body?.sections)) throw new DepinProtocolError('Invalid section list');
  return { ...result.body, context: result.context };
}
async function listDepinSectionsPrivate(params) {
  const result = await callDepinRpc({ ...params, token: params.scope, method: 'depinlistsections' });
  if (!Array.isArray(result.body?.sections)) throw new DepinProtocolError('Invalid section list');
  return {
    ...result.body,
    nextChallenge: result.body.next_challenge ?? null,
    nextExpiresIn: result.body.next_expires_in ?? null,
    context: result.context,
  };
}
async function clearDepinMessages(params) {
  const args =
    typeof params.mode === 'number' || typeof params.mode === 'bigint'
      ? { mode: 'hours', hours: params.mode }
      : { mode: params.mode ?? 'expired' };
  const result = await callDepinRpc({ ...params, token: params.scope || params.context?.pool_root, method: 'depinclearmsg', args });
  return { ...result.body, context: result.context };
}
function decodeSubmitResult(body) {
  if (body?.result !== 'success' || !/^[0-9a-f]{64}$/.test(body.hash)) throw new DepinProtocolError('Submit did not confirm success');
  return body;
}
async function submitDepinMessage(params) {
  assertIdentityCapabilities(params.identity, ['signMessage', 'openReply']);
  const parsed = await parseDepinMessage(params.messageHex);
  if (parsed.senderAddress !== params.identity.address) throw new DepinProtocolError('Message sender identity mismatch');
  const envelope = await wrapMessageForServer(params.messageHex, params.context?.pool_pubkey, params.identity.address);
  const { body, context } = await callDepinRpc({ ...params, token: '', method: 'depinsubmitmsg', args: { encrypted: envelope.encrypted } });
  return { ...decodeSubmitResult(body), context };
}
export {
  buildDepinRequestPreimage,
  buildDepinGetPreimage,
  buildDepinClearPreimage,
  getDepinPoolInfo,
  callDepinRpc,
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
};
