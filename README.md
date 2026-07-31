# @neuraiproject/neurai-depin-msg

Build, send-prepare, **receive, validate and decrypt** DePIN encrypted
messages for the [Neurai](https://neurai.org) blockchain, from a
**non-custodial** client: the user's private key never leaves the
application. Pure-JS crypto ([noble](https://paulmillr.com/noble/)), so it
runs in browsers, Node.js (>= 18) and React Native (Hermes) without
`crypto.subtle` or native modules.

The library never opens network connections. Applications inject an
`rpc.call(method, params)` function (node JSON-RPC) and, for remote pools, a
`transport.request(host, port, payload)` function, and keep full control of
transports, TLS, authentication and CORS.

```
npm install @neuraiproject/neurai-depin-msg
```

| Entry | File |
| --- | --- |
| ESM `import` | `dist/neurai-depin-msg.mjs` |
| CommonJS `require` | `dist/neurai-depin-msg.cjs` |
| Browser `<script>` (global `neuraiDepinMsg`) | `dist/neurai-depin-msg.min.js` |
| TypeScript types | `index.d.ts` |

## The DePIN model in one minute

A message pool is rooted at a DePIN token such as `&NEWS`. Sub-assets are
hierarchical **sections**: `&NEWS/GENERAL`, `&NEWS/GENERAL/SPORT`. A request
for a token covers that token *and its descendants* — never its parent or
siblings, and never lookalikes (`&TEST` does not cover `&TESTING`).

A holder is **active** for a token when it has positive balance, is not
owner-frozen and not self-revoked. Sending to a section encrypts for the
deduplicated union of active holders of the section and of its ancestors up
to the pool root. The recipient set is fixed at send time.

Messages are hybrid-encrypted (ECIES secp256k1 + AES-256-GCM): one wrapped
copy of the symmetric key per recipient public key. The sender is always
included so it can read its own messages.

The node needs `-assetindex` and `-pubkeyindex` for recipient resolution,
and only addresses with an on-chain **revealed public key** can receive.

## Receiving (non-custodial)

```js
import { decodeDepinReceiveResponse } from '@neuraiproject/neurai-depin-msg';

// rpcResult = result of depinreceivemsg(token, address, 0, "", 25) — the
// library accepts all three shapes: plain array, {messages, has_more},
// or the privacy-wrapped {encrypted}.
const { messages, hasMore, wasEncrypted } = await decodeDepinReceiveResponse(rpcResult, {
  network: 'mainnet',            // or 'test' ('testnet'/'regtest' aliases)
  privateKey: userWifOrHex,      // decrypts and unwraps
  requestedToken: '&NEWS',       // scope check: token must be &NEWS or a descendant
});

for (const m of messages) {
  if (!m.ok) continue;                    // failed local validation: do not display
  if (m.plaintext === null) continue;     // not addressed to this key (normal)
  console.log(m.message.sender, m.message.token, m.plaintext, m.signatureValid);
}
```

Every message is validated locally before it is considered displayable:

1. **Hash** — recomputed from the fields (`doubleSHA256` over the canonical
   preimage *including* `messageType`) and compared with the `hash` field.
2. **Signature** — DER secp256k1 over that hash. By default the library
   *recovers* the public key from the signature and accepts it only when its
   `hash160` (compressed or uncompressed form) equals the sender address
   payload — no external key lookup needed. A `senderPubKey` /
   `resolveSenderPubKey` fast path is available and is bound to the address
   the same way. Signatures over the legacy pre-2.1.3 preimage (without
   `messageType`) are rejected, as Core rejects them.
3. **Scope** — the message token must be inside the requested scope.
4. **Limits** — payload sizes, response counts, duplicate hashes.
5. **Decryption** — last. A payload that does not decrypt just was not
   addressed to this key; it is *not* an authorization error.

The `token` filter of `depinreceivemsg` is a UI scope, **not**
authentication: real visibility is the cryptographic recipient list inside
each message. Treat the RPC as an untrusted retrieval endpoint and rely on
the local validation above.

### Pre-authenticated gateway messages

Messages sent through `depinsendmsg`'s gateway path carry a 65-byte all-zero
sentinel instead of a signature; Core authorized them via the gateway
challenge/response, which the client cannot re-verify. By default they are
**rejected** (`ok: false`, `authentication: 'gateway-preauthenticated'`).
Pass `preAuthenticatedPolicy: 'trust-gateway'` only when the application
authenticates and trusts the serving gateway session; even then
`signatureValid` stays `false`.

## Sending

### 1. Resolve recipients and build (local pool)

```js
import { buildDepinMessageForPool } from '@neuraiproject/neurai-depin-msg';

const rpc = { call: (method, params) => myNodeRpc(method, params) };

const { hex, messageHash, resolution } = await buildDepinMessageForPool({
  token: '&NEWS/GENERAL',
  poolRoot: '&NEWS',        // the pool's configured root (stop_at)
  maxRecipients: 20,        // the pool's -depinmsgmaxusers (absolute cap 50)
  rpc,
  network: 'mainnet',
  senderAddress, senderPubKey, privateKey,
  message: 'hello sections', messageType: 'group',
  timestamp: Math.floor(Date.now() / 1000),
});
await rpc.call('depinsubmitmsg', [hex]);
```

`resolveDepinRecipients` enforces the pool contract and **fails closed**: a
`truncated` response is never used, every returned key must hash to its own
address, holders are deduplicated by curve point, and the *final* ECIES map
(recipients ∪ auto-included sender) must fit `maxRecipients` — Core applies
the limit to that map, so an over-limit message would be rejected anyway.

> The node answering `depingetancestorrecipients` is a **trust root** for
> confidentiality: the library can check the response's internal consistency,
> but not that the holder set itself is honest. Resolve recipients against a
> node you trust.

### 2. Remote pools

```js
const transport = { request: (host, port, payload) => myTcpRequest(host, port, payload) };
const out = await buildDepinMessageForRemotePool({
  host, port, transport, rpc,
  token: '&NEWS/GENERAL', network: 'mainnet',
  senderAddress, senderPubKey, privateKey,
  message: 'hi', messageType: 'group',
  timestamp: Math.floor(Date.now() / 1000),
});
```

The remote pool's `INFO` is queried first; its root becomes `stop_at` and its
limit becomes `maxRecipients`. If `INFO` fails or is unrecognized, the build
fails — never encrypt for a pool whose contract you could not read.

Alternatively, Core's wallet-backed `depinsendmsg` performs the gateway
`AUTH` challenge itself; that TCP flow is intentionally out of scope here
(implement it in an application adapter if needed).

### 3. External signers (hardware wallets)

`buildDepinPreimage` encrypts and returns the fields to sign;
`assembleDepinMessage` combines them with the DER (or compact 64-byte)
signature into the final wire format. The private key never touches the
library.

## Transport privacy wrapper

`wrapMessageForServer` / `unwrapMessageFromServer` ECIES-wrap traffic for a
pool's key. This hides content from the transport only — it does **not**
authenticate the server. Same for the `{encrypted}` response wrapper:
authenticate the RPC transport separately when that property matters.

## Utilities

`validateDepinSectionToken`, `isDepinTokenInScope`, `getDepinTokenAncestors`,
`parseDepinMessage`, `verifyDepinReceivedMessage`, `parseDepinPoolInfo`,
key/address helpers (`parsePublicKey`, `decodeP2PKHAddress`,
`pubKeyMatchesAddress`, `wifToHex`...) and the ECIES primitives are all
exported — see `index.d.ts` for the full typed surface.

Public keys are accepted in both serializations (33-byte compressed and
65-byte uncompressed) everywhere, matching Core; identity comparisons are by
curve point, while `hash160`/address bindings always use the exact bytes.

## Testing

```
npm test                 # runs against committed Core-generated fixtures
npm run gen-fixtures     # regenerates fixtures against a throwaway neuraid regtest
```

`scripts/generate-fixtures.mjs` drives a real `neuraid` (set
`NEURAI_BIN_DIR`): issues `&FIXTURE` and `&FIXTURE/NEWS`, reveals compressed
and uncompressed keys, submits library-built messages (Core's acceptance
validates serialization, hash and signature) and captures
`depinreceivemsg` / `depingetancestorrecipients` / gateway `INFO` responses.

## 2.3.0 changes

- New: full non-custodial receive pipeline, recipient resolution, remote
  pool helpers, token/scope utilities, message parsing and verification.
- Signature verification uses only the unified hash (`messageType`
  included); legacy signatures are rejected — requires a Core with the
  unified signing (2026-07 or later).
- Pre-authenticated gateway sentinels are rejected unless the application
  explicitly opts into trusting the gateway.
- Uncompressed (65-byte) public keys supported end to end; decryption tries
  both forms of the recipient key.
- `buildDepinMessage` now validates key coherence (privateKey ↔ senderPubKey
  ↔ senderAddress), token syntax, and the final recipient map size —
  messages Core would reject now fail at build time.
- Stricter parsing everywhere: canonical CompactSize, no duplicate recipient
  ids, no trailing bytes, validated hex. ECIES map entries serialize in
  Core's `std::map<uint160,...>` numeric order.
- Packaging: ESM + CJS entries with an `exports` map, TypeScript
  definitions, `buildDepinPreimage`/`assembleDepinMessage` properly exported.
- Removed `console.log` noise from the build path.

## License

MIT
