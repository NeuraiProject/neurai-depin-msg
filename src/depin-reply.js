/** Authenticated RPC 5 replies. Shape -> request/identity binding -> signature -> opening. */
import { sha256 } from '@noble/hashes/sha256';
import { parse } from 'lossless-json';
import { assertNoDuplicateJsonKeys } from './json.js';
import { bytesToHex, hexToBytes } from './bytes.js';
import { parsePublicKey, normalizePrivateKeyTo32Bytes } from './keys.js';
import { pubKeyMatchesAddress, normalizeNetwork, decodeDepinAddress } from './address.js';
import { deserializeEciesMessage, eciesDecrypt } from './ecies.js';
import { base64Decode, recoverPublicKeyFromMessage } from './signmessage.js';
import { validateDepinSectionToken } from './scope.js';
import { depinRequestHash, buildDepinRpcResponsePreimage } from './rpc-codec.js';
import { DepinProtocolError, DepinReplyAuthenticationError, DepinReplyDecryptionError, PoolPinMismatchError } from './errors.js';

const MAX_DECODED_JSON_BYTES = 4 * 1024 * 1024;
const MAX_REPLY_HEX_CHARS = 2 * (82 + MAX_DECODED_JSON_BYTES + 94 * 50);
const VERIFIED_REPLIES = new WeakSet();
function isVerifiedDepinReply(value) {
  return !!value && VERIFIED_REPLIES.has(value);
}
const MAIN_GENESIS = '00000044d33c0c0ba019be5c0249730424a69cb4c222153322f68c6104484806';
const TEST_GENESIS = '000000c710413a4265a996d30c86043aedef6a563900f1bc43fea61d5b2dc77d';
function expectedDepinNetwork(network, expectedNetworkHash) {
  if (expectedNetworkHash !== undefined) {
    if (!/^[0-9a-f]{64}$/.test(expectedNetworkHash)) throw new DepinProtocolError('Invalid expected genesis');
    return expectedNetworkHash;
  }
  if (network === 'regtest') throw new DepinProtocolError('regtest requires expectedNetworkHash');
  return normalizeNetwork(network) === 'mainnet' ? MAIN_GENESIS : TEST_GENESIS;
}
function poolKeyFingerprint(pubKey) {
  const hash = bytesToHex(sha256(hexToBytes(parsePublicKey(pubKey).pointId)));
  return hash.slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
}
function buildDepinReplyPreimage({ method, reply, request }) {
  return buildDepinRpcResponsePreimage({ method, reply, requestHash: depinRequestHash(method, request) });
}
function verifyDepinReply({ reply, method, request, poolPublicKey, expectedNetworkHash }) {
  if (!reply || typeof reply !== 'object' || Array.isArray(reply)) throw new DepinProtocolError('Invalid reply object');
  const field = reply.body_kind === 1 ? 'encrypted' : 'body';
  const fields = [
    'protocol',
    'network',
    'pool_pubkey',
    'pool_root',
    'instance_id',
    'membership_revision',
    'membership_height',
    'membership_blockhash',
    'request_hash',
    'body_kind',
    field,
    'poolsig',
  ];
  if (Object.keys(reply).length !== fields.length || fields.some((k) => !Object.prototype.hasOwnProperty.call(reply, k)))
    throw new DepinProtocolError('Invalid RPC 5 reply fields');
  const requestHash = depinRequestHash(method, request);
  if (reply.request_hash !== requestHash) throw new DepinReplyAuthenticationError('Reply request hash mismatch');
  const expectedKey = parsePublicKey(poolPublicKey);
  if (expectedKey.bytes.length !== 33 || reply.pool_pubkey !== bytesToHex(expectedKey.bytes))
    throw new PoolPinMismatchError('Reply poolPublicKey mismatch');
  const bootstrap = method === 'depingetmsginfo';
  const bound =
    (!bootstrap && ['depinchallenge', 'depinreceivemsg', 'depinreceiveseq', 'depinclearmsg', 'depinsubmitmsg'].includes(method)) ||
    (method === 'depinlistsections' && !!request.address);
  if (reply.body_kind !== (bound ? 1 : 0)) throw new DepinReplyAuthenticationError('Reply confidentiality mismatch');
  if (bootstrap) {
    if (!expectedNetworkHash || reply.network !== expectedNetworkHash) throw new PoolPinMismatchError('Reply genesis/network mismatch');
  } else {
    for (const key of ['network', 'pool_pubkey', 'pool_root', 'instance_id'])
      if (reply[key] !== request[key]) throw new PoolPinMismatchError('Reply service identity mismatch: ' + key);
  }
  if (typeof reply.poolsig !== 'string' || reply.poolsig.length !== 88) throw new DepinProtocolError('Invalid poolsig length');
  const compact = base64Decode(reply.poolsig);
  if (compact.length !== 65 || compact[0] < 31 || compact[0] > 34)
    throw new DepinProtocolError('Pool signature requires a compressed compact key');
  const preimage = buildDepinReplyPreimage({ method, reply, request });
  let recovered;
  try {
    recovered = recoverPublicKeyFromMessage(preimage, reply.poolsig);
  } catch (cause) {
    throw new DepinReplyAuthenticationError('Invalid pool signature', cause);
  }
  if (recovered !== reply.pool_pubkey) throw new DepinReplyAuthenticationError('Pool signature does not verify');
  const context = Object.freeze(
    Object.fromEntries(
      ['network', 'pool_pubkey', 'pool_root', 'instance_id', 'membership_revision', 'membership_height', 'membership_blockhash'].map(
        (k) => [k, reply[k]],
      ),
    ),
  );
  const verified = Object.freeze({
    kind: bound ? 'bound' : 'plain',
    replyHex: reply[field],
    method,
    address: request.address ?? '',
    poolPublicKey: reply.pool_pubkey,
    context,
  });
  VERIFIED_REPLIES.add(verified);
  return verified;
}
function parseJsonBytes(bytes, context) {
  if (bytes.length > MAX_DECODED_JSON_BYTES) throw new DepinProtocolError('Decoded JSON exceeds reply budget');
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    // Cursor integers must remain exact across decode, storage and the next signature.
    assertNoDuplicateJsonKeys(text);
    const value = parse(text, null, (s) => (/^-?\d+$/.test(s) && !Number.isSafeInteger(Number(s)) ? BigInt(s) : Number(s)));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Reply JSON must be an object');
    return value;
  } catch (cause) {
    throw new DepinProtocolError(context + ': invalid JSON/UTF-8', cause);
  }
}
function decodePlainReply(verified) {
  if (!isVerifiedDepinReply(verified) || verified.kind !== 'plain') throw new DepinProtocolError('A verified plain reply is required');
  return parseJsonBytes(hexToBytes(verified.replyHex), verified.method);
}
async function openBoundReply(verified, opener) {
  if (!isVerifiedDepinReply(verified) || verified.kind !== 'bound') throw new DepinProtocolError('A verified bound reply is required');
  const message = deserializeEciesMessage(hexToBytes(verified.replyHex));
  // Replies are addressed to exactly this identity, including its address family.
  const recipient = await decodeDepinAddress(verified.address);
  if (message.recipientKeys.size !== 1 || !message.recipientKeys.has(recipient.recipientId))
    throw new DepinReplyDecryptionError('Reply recipient identity mismatch');
  let bytes;
  try {
    bytes =
      typeof opener === 'function'
        ? await opener(verified.replyHex)
        : await eciesDecrypt(message, await normalizePrivateKeyTo32Bytes(opener), verified.address);
    if (typeof bytes === 'string') bytes = new TextEncoder().encode(bytes);
    if (!(bytes instanceof Uint8Array)) throw new Error('Opener did not return plaintext bytes');
  } catch (cause) {
    throw new DepinReplyDecryptionError('Could not open authenticated reply', cause);
  }
  return parseJsonBytes(bytes, verified.method);
}
async function decodeDepinPoolInfo({ reply, request, trust, serviceId, network, expectedNetworkHash }) {
  if (!trust || !['pinned', 'key', 'tofu'].includes(trust.mode) || typeof serviceId !== 'string' || !serviceId)
    throw new DepinProtocolError('Explicit service identity and trust mode required');
  const pin = trust.mode === 'pinned' ? trust.pin : null;
  if (pin && pin.serviceId !== serviceId) throw new PoolPinMismatchError('Pinned service mismatch');
  const expectedGenesis = expectedDepinNetwork(network, expectedNetworkHash ?? (network === undefined ? pin?.network : undefined));
  if (pin?.network && pin.network !== expectedGenesis) throw new PoolPinMismatchError('Pinned genesis/network mismatch');
  const poolPublicKey = pin?.poolPublicKey ?? (trust.mode === 'key' ? trust.poolPublicKey : reply.pool_pubkey);
  const verified = verifyDepinReply({ reply, method: 'depingetmsginfo', request, poolPublicKey, expectedNetworkHash: expectedGenesis });
  const info = decodePlainReply(verified);
  if (
    info.protocol !== 5 ||
    !info.accepted_protocols?.includes(5) ||
    info.token !== reply.pool_root ||
    info.depinpoolpkey !== reply.pool_pubkey ||
    info.network !== reply.network ||
    info.instance_id !== reply.instance_id
  )
    throw new DepinProtocolError('Bootstrap body/identity mismatch or unsupported protocol');
  for (const key of ['membership_revision', 'membership_height', 'membership_blockhash'])
    if (info[key] !== reply[key]) throw new DepinProtocolError('Bootstrap membership mismatch');
  if (pin && info.token !== pin.poolRoot) throw new PoolPinMismatchError('Pinned pool root mismatch');
  if (
    !validateDepinSectionToken(info.token).valid ||
    !Number.isInteger(info.maxmessagesize) ||
    info.maxmessagesize < 1 ||
    info.maxmessagesize > 10240
  )
    throw new DepinProtocolError('Invalid pool token/plaintext limit');
  if (
    !Number.isSafeInteger(info.server_time_ms) ||
    !Number.isInteger(info.maxrecipients) ||
    info.maxrecipients < 1 ||
    info.maxrecipients > 50
  )
    throw new DepinProtocolError('Invalid pool limits/clock');
  if (info.depinpoolkeyaddress && !(await pubKeyMatchesAddress(hexToBytes(poolPublicKey), info.depinpoolkeyaddress, network)))
    throw new PoolPinMismatchError('Pool address/key mismatch');
  const context = Object.freeze({ ...verified.context, clockOffsetMs: info.server_time_ms - Date.now() });
  return {
    info,
    context,
    pin: { serviceId, poolRoot: info.token, poolPublicKey, network: expectedGenesis },
    trust: trust.mode,
    fingerprint: poolKeyFingerprint(poolPublicKey),
  };
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
  poolKeyFingerprint,
  expectedDepinNetwork,
};
