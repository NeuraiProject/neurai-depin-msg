import * as lib from '../src/index.js';
import { stringify } from 'lossless-json';
export const POOL_KEY = '66'.repeat(32);
export const pool = await lib.createSoftwareIdentity({ privateKey: POOL_KEY, network: 'test' });
export const context = Object.freeze({
  network: '0000008b384aeffecdab182575dc4e86c9f07f90318c65088532660ed9a8a021',
  pool_pubkey: pool.publicKey,
  pool_root: '&POOL',
  instance_id: '22'.repeat(32),
  membership_revision: '33'.repeat(32),
  membership_height: 123,
  membership_blockhash: '44'.repeat(32),
});
export const CH = 'ab'.repeat(32);
export async function holder(addressType = 'legacy', key = '77'.repeat(32)) {
  return lib.createSoftwareIdentity({ privateKey: key, network: 'test', addressType });
}
export async function reply(method, request, body, { identity, served = context } = {}) {
  const r = { ...served, protocol: 5, request_hash: lib.depinRequestHash(method, request), body_kind: identity ? 1 : 0 };
  const bytes = new TextEncoder().encode(stringify(body));
  if (identity)
    r.encrypted = lib.bytesToHex(
      lib.serializeEciesMessage(await lib.eciesEncrypt(bytes, [{ address: identity.address, publicKey: identity.publicKey }])),
    );
  else r.body = lib.bytesToHex(bytes);
  r.poolsig = lib.signRecoverableMessage(lib.buildDepinRpcResponsePreimage({ method, reply: r, requestHash: r.request_hash }), POOL_KEY);
  return r;
}
export function mockRpc(responder) {
  const calls = [];
  return {
    calls,
    call: async (method, params) => {
      calls.push({ method, params });
      return responder(method, params[0]);
    },
  };
}
export function bootstrapBody(served = context) {
  return {
    enabled: true,
    token: served.pool_root,
    protocol: 5,
    depinpoolpkey: pool.publicKey,
    depinpoolkeyaddress: pool.address,
    maxrecipients: 20,
    maxmessagesize: 1024,
    network: served.network,
    instance_id: served.instance_id,
    membership_revision: served.membership_revision,
    membership_height: served.membership_height,
    membership_blockhash: served.membership_blockhash,
    server_time_ms: Date.now(),
    accepted_protocols: [5],
    address_types: ['legacy', 'ecdsa'],
    ecies_formats: [1, 2],
  };
}
export function directory(identities, token = '&POOL/NEWS') {
  return {
    token,
    stop_at: '&POOL',
    truncated: false,
    recipients: identities.map((i) => ({ address: i.address, pubkey: i.publicKey })),
    returned: identities.length,
    ancestors: [token, '&POOL'],
    skipped_no_pubkey: 0,
    skipped_no_pubkey_complete: true,
    skipped_restricted: 0,
    skipped_restricted_complete: true,
  };
}
