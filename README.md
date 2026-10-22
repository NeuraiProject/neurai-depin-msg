# neurai-depin-msg

Portable Neurai messaging SDK for **RPC 5**, Legacy P2PKH and strict ECDSA v3 addresses. Version 4 requires the updated node; RPC 2, 3 and 4 have no automatic fallback. PQ messaging is outside this version.

Content uses hybrid secp256k1 ECDH and AES-256-GCM. The relay opens the transport shell, verifies permissions and stores ciphertext. It does not receive the content keys or plaintext.

```sh
npm install @neuraiproject/neurai-depin-msg@^4.0.0 @neuraiproject/neurai-rpc@^0.8.0
```

The install command applies after the matching releases are published. This coordinated checkout has not published them: build and `npm pack` the source packages, or use the pinned archives supplied with the wallet/proxy/indexer.

Node 18+, browsers and React Native are supported. React Native needs `crypto.getRandomValues`, `TextEncoder` and `TextDecoder`. The package provides ESM, CommonJS, declarations and an IIFE at `dist/neurai-depin-msg.js` (`globalThis.neuraiDepinMsg`).

## Bootstrap and trust

```js
import {getRPC} from '@neuraiproject/neurai-rpc';
import {
  getDepinPoolInfo, createSoftwareIdentity, buildDepinMessageForPool,
  submitDepinMessage, requestDepinChallenge, receiveDepinMessages,
} from '@neuraiproject/neurai-depin-msg';

const rpc = {call: getRPC(username, password, endpoint)};
const pool = await getDepinPoolInfo({
  rpc, serviceId: endpoint, network: 'test',
  trust: storedPin ? {mode: 'pinned', pin: storedPin} : {mode: 'tofu'},
});
// Show the fingerprint on first contact; persist pool.pin under the endpoint.
let context = pool.context;
const identity = await createSoftwareIdentity({
  privateKey: wif, network: 'test', address: selectedAddress,
});
```

TOFU records an observed key; first-contact self-consistency does not authenticate the operator. `mode: 'key'` accepts an independently obtained pool key. Pins bind endpoint, pool key, root and genesis. Regtest requires an explicit `expectedNetworkHash`. Never automatically replace a mismatching pin.

`address` selects the exact identity controlled by the key. Without it, `addressType: 'legacy'` is the default; `addressType: 'ecdsa'` derives a strict v3 address. An ECDSA wallet's key can sign for its Legacy alias when that exact Legacy address holds permission. Wallet type alone does not grant that permission.

## Send

```js
const built = await buildDepinMessageForPool({
  rpc, context, identity, network: 'test',
  token: '&GROUP/CHAT', poolRoot: pool.info.token,
  maxRecipients: pool.info.maxrecipients,
  maxMessageBytes: pool.info.maxmessagesize,
  message: 'Hello', messageType: 'group',
  timestamp: Math.floor(Date.now() / 1000),
});
context = built.context; // The verified directory can carry a newer revision.
const receipt = await submitDepinMessage({rpc, context, identity, messageHex: built.hex});
console.log(receipt.hash);
```

The default resolves the complete group and refuses truncation or an excessive final recipient count. For an explicit subset, set `selectedAddresses: [recipientAddress]`; use `messageType: 'private'` for one recipient plus the sender. Every selected address must appear in the verified directory. A private selection can therefore work when the whole group exceeds the message recipient limit. An unavailable selected address fails locally.

Recipient identity includes the address family: Legacy and strict ECDSA destinations sharing one curve key remain distinct entries. Low-level builders accept `{address, publicKey}` recipients; raw public keys select Legacy destinations. The sender is always included.

A signed directory proves which pool supplied it. It does **not** prove asset ownership. Applications can compare it with independent chain sources and apply their own destination policy before encryption/submission. A node holding only ciphertext also cannot erase content keys already downloaded by a former member.

## Read by admission sequence

```js
let cursor = null; // Preserve with the corresponding local message history.
let challenge = (await requestDepinChallenge({
  rpc, context, identity, token: '&GROUP/CHAT',
})).challenge;

const page = await receiveDepinMessages({
  rpc, context, identity, network: 'test', token: '&GROUP/CHAT',
  challenge, cursor, limit: 100,
});
context = page.context;
cursor = page.cursor;
challenge = page.nextChallenge; // Obtain another challenge if absent/expired.
for (const item of page.messages) {
  if (item.ok && item.plaintext !== null) console.log(item.plaintext);
}
```

`hasMore` is the verified node value. Continue using the entire returned cursor, even across membership changes while the stream is unchanged. Sequence values may be `bigint`: never round them or reuse a stringified number as an RPC number. A BigInt-capable transport such as `neurai-rpc.stringifyRpcJson` preserves every digit. Persisting a cursor without its local history can hide older messages on restart; the mobile wallet keeps both in memory.

Reads using sender timestamp/hash remain available only through explicit `mode: 'timestamp'`. They still use fully signed RPC 5 requests. Admission sequences are the default because a late message can have an older sender timestamp.

## Membership, failures and external signers

`context` carries the verified genesis, pool, instance, membership revision and reference block. Each private request signs those fields, method, arguments, fresh random request ID, timestamp and optional challenge. The response is verified against the **locally computed request hash** before JSON parsing or ECIES opening.

`DepinRpcError` contains a verified error's numeric `code`, `data`, `depinError` and served `context`. On `membership_stale`, discard all cached nonces for the old pool revision, refresh the directory and obtain new challenges. Rebuild and sign a message against the refreshed recipients. Preserve its read cursor if the stream remains unchanged. A restart requires bootstrap; a different stream requires restarting pagination with hash deduplication. Bound retries and apply backoff. The SDK never automatically replays a submit or clear operation after an ambiguous failure.

External identities provide `address`, `publicKey`, `signMessage`, `signDigest` and `openReply`. Authentication callbacks receive `{kind:'rpc', method, request, requestHash}` so a device can reconstruct the RPC 5 preimage. Message callbacks receive the canonical digest and its structured fields. Signature results are checked locally. Old hardware authentication callbacks need their own firmware/library migration.

`callDepinRpc` handles other migrated methods such as public stats and sections. Admin clear uses an admin challenge and signs its exact mode/hours. `createDepinRpcRequest`, `depinRequestBytes`, `depinRequestHash` and both `buildDepinRpc*Preimage` helpers expose the canonical codec. The older Request/Get/Clear preimage helper names now also require `{method, request}`; they never generate old authentication strings.

## Format and validation

Legacy-only messages use canonical ECIES 1. Mixed/strict destinations use ECIES 2 (`00 02` plus typed IDs). Parsing rejects invalid points, unsupported versions/types, unordered or duplicated IDs, nonminimal CompactSize, malformed lengths, oversized frames and trailing bytes. Recipient IDs sort by raw bytes, matching Core.

Canonical Legacy history remains readable. Some older SDK versions emitted recipient IDs in the opposite order; those noncanonical frames are rejected by the updated node and SDK. Historical examples remain negative fixtures rather than enabling a permissive network fallback.

Hard limits include 50 recipients, 10,240 plaintext message bytes, 16,384 message wire bytes and 4 MiB reply plaintext. Apply the pool's smaller advertised limits. Payload validation recomputes the message hash, verifies the sender signature and exact address, checks scope, then decrypts. Gateway preauthentication sentinels are rejected.

```sh
npm test
```

Tests cover independent node RPC 5 vectors, both address families, exact identity binding, encryption, tampering, cursor integers, external signers, declarations and installed ESM/CJS/IIFE consumers. Live node integration is run separately in the private regtest Docker environment; offline unit tests do not contact public nodes.

## Real Core integration

`test/integration/core-driver.py` starts two disposable regtest nodes using Core's functional test framework. It tests all RPC 5 flows, mixed identities, wrong destinations, freezes/reorgs, exact cursors, persistence and stream reset. Build the SDK first and point the runner at a compatible node source/build:

```sh
NEURAI_SOURCE=/path/to/Neurai NODE_BINARY=$(command -v node) \
  python3 test/integration/core-driver.py --srcdir=/path/to/Neurai/src --portseed=287
```

For real HTTP/WSS relay tests, set `NEURAI_CLIENT_WORKSPACE` to a private test workspace containing `rpc/`, `proxy/` and `services/` with their dependencies installed. The runner binds temporary loopback listeners on 29181/29182 and stops them after the test. Private regtest keys/cookies travel through pipes and are not printed. Run only in an isolated test environment. The old RPC 1 fixture generator is archived under `scripts/historical/`; its output is historical evidence, not a current fixture generator.
