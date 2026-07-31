/**
 * Recipient resolution and pool-assisted building.
 *
 * Network access is injected: `rpc.call(method, paramsArray)` must reach a
 * Neurai node's JSON-RPC (the application decides transport, auth, CORS...),
 * and `transport.request(host, port, payload)` must reach a DePIN gateway
 * for the INFO command. The library never opens connections itself.
 *
 * Trust note: the hash160 binding below catches inconsistent responses, but
 * the recipient list itself cannot be verified locally — the node answering
 * depingetancestorrecipients is a trust root for message confidentiality.
 */

import { bytesToHex, timingSafeEqual } from './bytes.js';
import { hash160 } from './hash.js';
import { parsePublicKey } from './keys.js';
import { decodeP2PKHAddress } from './address.js';
import { validateDepinSectionToken, isDepinTokenInScope } from './scope.js';
import { MAX_DEPIN_RECIPIENTS, buildDepinMessage } from './message.js';

/**
 * Resolves the recipient set for sending to `token` through a pool rooted at
 * `poolRoot`, enforcing the pool contract:
 *  - the response must be complete (`truncated: false`) — never silently cut;
 *  - every returned pubkey must parse and hash to its own address;
 *  - recipients are deduplicated by curve point;
 *  - the final ECIES map (recipients ∪ sender) must not exceed maxRecipients.
 *
 * Params: { token, poolRoot, maxRecipients, senderPubKey, rpc, network? }
 * Returns { recipientPubKeys, recipientCount, senderIncludedInHolders,
 *           ancestors, maxRecipients, skipped }
 * `recipientPubKeys` is the deduplicated holder list exactly as returned by
 * the node — when the sender itself is a holder its revealed key appears in
 * it (`senderIncludedInHolders: true`); otherwise buildDepinMessage
 * auto-includes the sender. Both cases reproduce exactly the final map
 * counted by `recipientCount`.
 */
async function resolveDepinRecipients(params) {
  const { token, poolRoot, maxRecipients, senderPubKey, rpc, network = null } = params;

  if (!rpc || typeof rpc.call !== 'function') {
    throw new Error('rpc with a call(method, params) function is required');
  }
  const tokenCheck = validateDepinSectionToken(token);
  if (!tokenCheck.valid) throw new Error('Invalid token: ' + tokenCheck.error);
  const rootCheck = validateDepinSectionToken(poolRoot);
  if (!rootCheck.valid) throw new Error('Invalid poolRoot: ' + rootCheck.error);
  if (!isDepinTokenInScope(token, poolRoot)) {
    throw new Error("token '" + token + "' is not under pool root '" + poolRoot + "'");
  }
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > MAX_DEPIN_RECIPIENTS) {
    throw new Error('maxRecipients must be an integer between 1 and ' + MAX_DEPIN_RECIPIENTS);
  }
  if (!senderPubKey) {
    throw new Error('senderPubKey is required to size the final recipient map');
  }
  const senderKey = parsePublicKey(senderPubKey);

  // Ask for one above the limit so "exactly at the limit" and "over it" are
  // distinguishable without ever trusting a truncated list.
  const result = await rpc.call('depingetancestorrecipients', [token, maxRecipients + 1, poolRoot]);

  if (!result || typeof result !== 'object') {
    throw new Error('depingetancestorrecipients returned no result');
  }
  if (result.token !== token) {
    throw new Error("Response token '" + result.token + "' does not match requested '" + token + "'");
  }
  if (result.stop_at !== poolRoot) {
    throw new Error("Response stop_at '" + result.stop_at + "' does not match pool root '" + poolRoot + "'");
  }
  if (result.truncated !== false) {
    throw new Error('Recipient list is truncated or incomplete; refusing to build a partial group');
  }
  if (!Array.isArray(result.recipients)) {
    throw new Error('Response recipients is not an array');
  }
  if (typeof result.returned === 'number' && result.returned !== result.recipients.length) {
    throw new Error('Response returned count does not match recipients length');
  }
  if (!Array.isArray(result.ancestors) || result.ancestors[0] !== token) {
    throw new Error('Response ancestors is inconsistent with the requested token');
  }

  const byPoint = new Map();
  for (const entry of result.recipients) {
    if (!entry || typeof entry.address !== 'string' || typeof entry.pubkey !== 'string') {
      throw new Error('Malformed recipient entry in response');
    }
    const parsed = parsePublicKey(entry.pubkey);

    // Consistency: the key must hash to its own address. This catches bugs
    // and corruption; it does not authenticate the holder set itself.
    const { payload } = await decodeP2PKHAddress(entry.address, network);
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new Error("Recipient pubkey does not match its address '" + entry.address + "'");
    }

    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }

  const senderIncludedInHolders = byPoint.has(senderKey.pointId);
  const finalCount = byPoint.size + (senderIncludedInHolders ? 0 : 1);

  // Core enforces the limit on the final ECIES map, sender entry included.
  if (finalCount > maxRecipients) {
    throw new Error(
      'Final recipient map would have ' + finalCount + ' entries (sender included), ' +
      'above the pool limit of ' + maxRecipients
    );
  }

  return {
    recipientPubKeys: Array.from(byPoint.values()).map(bytesToHex),
    recipientCount: finalCount,
    senderIncludedInHolders,
    ancestors: result.ancestors,
    maxRecipients,
    skipped: {
      noPubKey: result.skipped_no_pubkey ?? null,
      noPubKeyComplete: result.skipped_no_pubkey_complete ?? null,
      restricted: result.skipped_restricted ?? null,
      restrictedComplete: result.skipped_restricted_complete ?? null
    }
  };
}

/**
 * Resolves recipients against the pool and builds the encrypted, signed
 * message in one step. Takes resolveDepinRecipients params plus every
 * buildDepinMessage param. Returns the build result plus `resolution`.
 */
async function buildDepinMessageForPool(params) {
  const { token, poolRoot, maxRecipients, rpc, network, ...buildParams } = params;

  const resolution = await resolveDepinRecipients({
    token, poolRoot, maxRecipients, rpc, network,
    senderPubKey: buildParams.senderPubKey
  });

  const built = await buildDepinMessage({
    ...buildParams,
    network,
    token,
    recipientPubKeys: resolution.recipientPubKeys
  });

  return { ...built, resolution };
}

/**
 * Parses the pipe-separated response of the gateway INFO command:
 * OK|token|port|cipher|maxRecipients|maxMessageSize|expiryHours|maxPoolMB|
 * msgCount|memUsage|oldest|newest|poolPubKey
 * Fails closed on anything unrecognized: exactly 13 fields, every numeric
 * field a full decimal integer (no suffixes), port 1..65535. A shifted or
 * extended format must fail rather than be misread. maxRecipients is capped
 * at Core's absolute maximum (50) and must be at least 1.
 */
function parseDepinPoolInfo(raw) {
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new Error('Empty INFO response');
  }
  const line = raw.trim();
  const parts = line.split('|');

  if (parts[0] !== 'OK') {
    throw new Error('Gateway INFO error: ' + line);
  }
  if (parts.length !== 13) {
    throw new Error('Unrecognized INFO format (' + parts.length + ' fields, expected 13)');
  }

  const strictInt = (value, name) => {
    if (!/^\d+$/.test(value)) throw new Error('INFO ' + name + ' is not a decimal integer: ' + value);
    const n = Number.parseInt(value, 10);
    if (!Number.isSafeInteger(n)) throw new Error('INFO ' + name + ' out of range');
    return n;
  };

  const token = parts[1];
  const tokenCheck = validateDepinSectionToken(token);
  if (!tokenCheck.valid) throw new Error('INFO token invalid: ' + tokenCheck.error);

  const port = strictInt(parts[2], 'port');
  if (port < 1 || port > 65535) throw new Error('INFO port out of range: ' + port);
  const reportedMaxRecipients = strictInt(parts[4], 'maxRecipients');
  if (reportedMaxRecipients <= 0) {
    throw new Error('INFO maxRecipients invalid or zero; failing closed');
  }
  const maxMessageSize = strictInt(parts[5], 'maxMessageSize');
  if (maxMessageSize <= 0) throw new Error('INFO maxMessageSize invalid');

  let poolPubKey = null;
  if (parts[12] && parts[12] !== '0') {
    poolPubKey = bytesToHex(parsePublicKey(parts[12]).bytes);
  }

  return {
    token,
    port,
    cipher: parts[3],
    maxRecipients: Math.min(reportedMaxRecipients, MAX_DEPIN_RECIPIENTS),
    maxMessageSize,
    messageExpiryHours: strictInt(parts[6], 'messageExpiryHours'),
    maxPoolSizeMB: strictInt(parts[7], 'maxPoolSizeMB'),
    messageCount: strictInt(parts[8], 'messageCount'),
    memoryUsage: strictInt(parts[9], 'memoryUsage'),
    oldestMessage: parts[10],
    newestMessage: parts[11],
    poolPubKey,
    raw: line
  };
}

/**
 * Queries a remote pool's INFO through the injected transport.
 * transport.request(host, port, payload) -> Promise<string>.
 */
async function getRemoteDepinPoolInfo({ host, port, transport }) {
  if (!transport || typeof transport.request !== 'function') {
    throw new Error('transport with a request(host, port, payload) function is required');
  }
  const raw = await transport.request(host, port, 'INFO');
  return parseDepinPoolInfo(raw);
}

/**
 * Builds a message for a remote pool: queries INFO first, verifies the token
 * is under the remote root, then uses that root as stop_at and the remote
 * maxRecipients as the limit. Fails closed when INFO fails.
 * Params: { host, port, transport, rpc, network?, ...buildDepinMessage params }
 */
async function buildDepinMessageForRemotePool(params) {
  const { host, port, transport, ...rest } = params;

  const poolInfo = await getRemoteDepinPoolInfo({ host, port, transport });

  if (!isDepinTokenInScope(rest.token, poolInfo.token)) {
    throw new Error(
      "token '" + rest.token + "' is not under the remote pool root '" + poolInfo.token + "'"
    );
  }

  const built = await buildDepinMessageForPool({
    ...rest,
    poolRoot: poolInfo.token,
    maxRecipients: poolInfo.maxRecipients
  });

  return { ...built, poolInfo };
}

export {
  resolveDepinRecipients,
  buildDepinMessageForPool,
  parseDepinPoolInfo,
  getRemoteDepinPoolInfo,
  buildDepinMessageForRemotePool
};
