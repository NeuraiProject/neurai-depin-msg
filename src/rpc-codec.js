/** RPC 5 binary signing contract. Never JSON.stringify a signing preimage. */
import { sha256 } from '@noble/hashes/sha256';
import { concatBytes, bytesToHex, hexToBytes } from './bytes.js';
import { parsePublicKey } from './keys.js';
import { randomBytes } from './ecies.js';
import { isDepinTokenInScope } from './scope.js';
import { DepinProtocolError } from './errors.js';

const DEPIN_RPC_PROTOCOL = 5;
const ZERO = '00'.repeat(32);
const MAX_I64 = (1n << 63n) - 1n;
function fail(message) {
  throw new DepinProtocolError(message);
}
function keys(value, allowed, required = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Expected object');
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail('Unknown field: ' + key);
  for (const key of required) if (value[key] == null) fail('Required field: ' + key);
}
function ascii(value, maximum = 128) {
  if (typeof value !== 'string' || value.length > maximum || /[^\x20-\x7e]/.test(value)) fail('Invalid ASCII string');
  return value;
}
function hex(value, size, empty = false) {
  if (empty && value === '') return value;
  if (typeof value !== 'string' || value.length !== size * 2 || !/^[0-9a-f]+$/.test(value)) fail('Expected fixed lowercase hex');
  return value;
}
function integer(value, minimum = 0n, maximum = MAX_I64) {
  if (typeof value !== 'bigint' && !Number.isSafeInteger(value)) fail('Expected an exact integer (number or bigint)');
  const n = BigInt(value);
  if (n < minimum || n > maximum) fail('Integer outside allowed range');
  return n;
}
function number(value, width) {
  let n = BigInt(value);
  const out = new Uint8Array(width);
  for (let i = 0; i < width; i++) {
    out[i] = Number(n & 255n);
    n >>= 8n;
  }
  return out;
}
function blob(bytes) {
  return concatBytes(number(bytes.length, 4), bytes);
}
function text(value) {
  return blob(new TextEncoder().encode(value));
}
function fixed(value) {
  return hexToBytes(value);
}
function optionalInt(a, key, fallback, max = MAX_I64, min = 0n) {
  return integer(a[key] ?? fallback, min, max);
}

function depinRequestBytes(method, request) {
  const r = request;
  if (r?.protocol !== 5) fail('RPC protocol 5 required; no legacy fallback');
  let network = ZERO,
    pool = '',
    root = '',
    instance = ZERO,
    revision = ZERO;
  let token = '',
    address = '',
    nonce = '',
    kind = 0,
    args = new Uint8Array();
  if (method === 'depingetmsginfo') {
    keys(r, ['protocol', 'request_id', 'timestamp_ms'], ['protocol', 'request_id', 'timestamp_ms']);
  } else {
    const fields = [
      'protocol',
      'network',
      'pool_pubkey',
      'pool_root',
      'instance_id',
      'membership_revision',
      'request_id',
      'timestamp_ms',
      'token',
      'address',
      'challenge',
      'args',
      'signature',
    ];
    keys(r, fields, fields);
    network = hex(r.network, 32);
    pool = hex(r.pool_pubkey, 33);
    if (parsePublicKey(pool).bytes.length !== 33) fail('Pool key must be compressed');
    root = ascii(r.pool_root);
    instance = hex(r.instance_id, 32);
    revision = hex(r.membership_revision, 32);
    token = ascii(r.token);
    address = ascii(r.address, 64);
    nonce = hex(r.challenge, 32, true);
    ascii(r.signature, 128);
    const a = r.args;
    keys(a, [
      'type',
      'timestamp',
      'after_hash',
      'limit',
      'cursor',
      'from_timestamp',
      'mode',
      'hours',
      'encrypted',
      'max_results',
      'stop_at',
    ]);
    switch (method) {
      case 'depinchallenge': {
        keys(a, ['type']);
        kind = 1;
        const type = a.type ?? 'receive';
        if (type !== 'receive' && type !== 'admin') fail('Invalid challenge type');
        args = number(type === 'admin' ? 1 : 0, 1);
        break;
      }
      case 'depinreceivemsg':
        keys(a, ['timestamp', 'after_hash', 'limit']);
        kind = 2;
        args = concatBytes(
          number(optionalInt(a, 'timestamp', 0), 8),
          blob(fixed(hex(a.after_hash ?? '', 32, true))),
          number(optionalInt(a, 'limit', 0, 1000n), 8),
        );
        break;
      case 'depinreceiveseq': {
        keys(a, ['cursor', 'limit', 'from_timestamp']);
        kind = 2;
        const from = optionalInt(a, 'from_timestamp', 0),
          c = a.cursor;
        let stream = ZERO,
          after = 0n;
        if (c != null) {
          const fields = ['version', 'stream_id', 'after_seq', 'scope', 'address', 'from_timestamp'];
          keys(c, fields, fields);
          if (integer(c.version) !== 1n || c.scope !== token || c.address !== address || integer(c.from_timestamp) !== from)
            fail('Cursor identity/filter mismatch');
          stream = hex(c.stream_id, 32);
          after = integer(c.after_seq);
        }
        args = concatBytes(
          number(c != null ? 1 : 0, 1),
          fixed(stream),
          number(after, 8),
          number(optionalInt(a, 'limit', 100, 1000n, 1n), 8),
          number(from, 8),
        );
        break;
      }
      case 'depinclearmsg': {
        keys(a, ['mode', 'hours']);
        kind = 3;
        const mode = a.mode ?? 'expired';
        if (!['expired', 'all', 'hours'].includes(mode)) fail('Invalid clear mode');
        if (mode !== 'hours' && a.hours != null) fail('hours requires hours mode');
        if (mode === 'hours' && a.hours == null) fail('hours required');
        const hours = mode === 'hours' ? integer(a.hours, 0n, MAX_I64 / 3600n) : 0n;
        token ||= root;
        args = concatBytes(number(mode === 'hours' ? 2 : mode === 'all' ? 1 : 0, 1), number(hours, 8));
        break;
      }
      case 'depinsubmitmsg':
        keys(a, ['encrypted'], ['encrypted']);
        kind = 1;
        if (token !== '' || typeof a.encrypted !== 'string' || !/^(?:[0-9a-f]{2})+$/.test(a.encrypted) || a.encrypted.length > 65888)
          fail('Invalid submit envelope');
        args = blob(fixed(a.encrypted));
        break;
      case 'depingetancestorrecipients':
        keys(a, ['max_results', 'stop_at']);
        args = concatBytes(number(optionalInt(a, 'max_results', 1000, 10000n, 1n), 8), text(ascii(a.stop_at ?? root) || root));
        break;
      case 'depinlistsections':
        keys(a, []);
        kind = address ? 2 : 0;
        break;
      case 'depinpoolstats':
      case 'depinmcpstatus':
        keys(a, []);
        break;
      default:
        fail('Unsupported DePIN RPC method');
    }
    if (kind === 0) {
      if (address || nonce || r.signature || (method !== 'depingetancestorrecipients' && token !== root))
        fail('Invalid public authentication fields');
    } else {
      if (!address || (kind >= 2 ? !nonce : nonce !== '')) fail('Invalid private authentication fields');
      if (method !== 'depinsubmitmsg' && !isDepinTokenInScope(token, root)) fail('Token outside pool scope');
    }
  }
  hex(r.request_id, 32);
  integer(r.timestamp_ms);
  return concatBytes(
    text('Neurai/DePIN/RPC/request'),
    number(5, 2),
    text(method),
    number(kind, 1),
    fixed(network),
    blob(fixed(pool)),
    text(root),
    fixed(instance),
    fixed(revision),
    fixed(r.request_id),
    number(r.timestamp_ms, 8),
    text(token),
    text(address),
    blob(fixed(nonce)),
    blob(args),
  );
}
function depinRequestHash(method, request) {
  return bytesToHex(sha256(depinRequestBytes(method, request)));
}
function buildDepinRpcRequestPreimage({ method, request }) {
  return 'DEPIN-RPC-REQUEST-v5|' + depinRequestHash(method, request);
}

function createDepinRpcRequest({
  method,
  context,
  token,
  address = '',
  challenge = '',
  args = {},
  requestId,
  timestampMs,
  clock = Date.now,
}) {
  const request = { protocol: 5, request_id: requestId ?? bytesToHex(randomBytes(32)), timestamp_ms: timestampMs ?? clock() };
  if (method !== 'depingetmsginfo') {
    if (!context) fail('A verified RPC 5 context is required');
    Object.assign(request, {
      network: context.network,
      pool_pubkey: context.pool_pubkey,
      pool_root: context.pool_root,
      instance_id: context.instance_id,
      membership_revision: context.membership_revision,
      token: token ?? context.pool_root,
      address,
      challenge,
      args,
      signature: '',
    });
  }
  depinRequestBytes(method, request);
  return request;
}

function buildDepinRpcResponsePreimage({ method, reply, requestHash }) {
  const r = reply;
  hex(r.network, 32);
  hex(r.pool_pubkey, 33);
  ascii(r.pool_root);
  hex(r.instance_id, 32);
  hex(r.membership_revision, 32);
  hex(r.membership_blockhash, 32);
  hex(requestHash, 32);
  integer(r.membership_height, -1n, 2147483647n);
  if (r.protocol !== 5 || (r.body_kind !== 0 && r.body_kind !== 1)) fail('Invalid RPC 5 response');
  const content = r.body_kind ? r.encrypted : r.body;
  if (typeof content !== 'string' || !/^(?:[0-9a-f]{2})+$/.test(content) || content.length > 2 * (82 + 4194304 + 94 * 50))
    fail('Invalid response body budget/hex');
  const bytes = concatBytes(
    text('Neurai/DePIN/RPC/response'),
    number(5, 2),
    text(method),
    fixed(r.network),
    blob(fixed(r.pool_pubkey)),
    text(r.pool_root),
    fixed(r.instance_id),
    fixed(r.membership_revision),
    number(r.membership_height, 8),
    fixed(r.membership_blockhash),
    fixed(requestHash),
    number(r.body_kind, 1),
    blob(fixed(content)),
  );
  return 'DEPIN-RPC-RESPONSE-v5|' + bytesToHex(sha256(bytes));
}

export {
  DEPIN_RPC_PROTOCOL,
  depinRequestBytes,
  depinRequestHash,
  createDepinRpcRequest,
  buildDepinRpcRequestPreimage,
  buildDepinRpcResponsePreimage,
};
