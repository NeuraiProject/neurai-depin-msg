# @neuraiproject/neurai-depin-msg

Build, send-prepare, **receive, validate and decrypt** DePIN encrypted
messages for the [Neurai](https://neurai.org) blockchain, from a
**non-custodial** client: the user's private key never leaves the
application. Pure-JS crypto ([noble](https://paulmillr.com/noble/)), so it
runs in browsers, Node.js (>= 18) and React Native (Hermes) without
`crypto.subtle` or native modules.

The library never opens network connections. Applications inject an
`rpc.call(method, params)` function (node JSON-RPC), and keep full control of
transport, TLS, authentication and CORS.

**Protocol 2** (this is 3.x): every operation is a single JSON-RPC call on
the node's RPC port — there is no separate gateway port or socket. Every
DePIN reply is a signed envelope (`poolsig`), and this library **verifies it
against the pinned pool key before decrypting or interpreting anything**.
Reads and purges authenticate per call with a single-use challenge signed by
the holder's key. See "Migrating from 2.x" below for the removed surface.

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

Protocol 1's pre-authenticated gateway sentinel (65 zero bytes in place of a
signature) can no longer arrive over protocol 2; if one appears it is
**always rejected** (`ok: false`, `authentication: 'invalid'`,
`reason: 'protocol-1-preauthenticated'`). There is no trust-gateway option.

## High-level flows (protocol 2)

The client-flow helpers take an injected `rpc`, the **pinned pool key**, and
an **identity** (its capabilities), authenticate every reply, and return
decrypted results. Identities separate the two protocol-2 signatures and the
decryptor: `signMessage` (recoverable, for DEPIN-REQ/GET/CLEAR), `signDigest`
(the message's ECDSA digest, publishing only) and `openReply` (decrypts bound
replies). `createSoftwareIdentity` builds them from a local key; a hardware
wallet implements the same three callbacks without exporting the key.

```js
import {
  getDepinPoolInfo, listDepinSectionsPublic,
  requestDepinChallenge, receiveDepinMessages,
  buildDepinMessageForPool, submitDepinMessage,
  createSoftwareIdentity,
} from '@neuraiproject/neurai-depin-msg';

const rpc = { call: (method, params) => myNodeRpc(method, params) };

// 1. Bootstrap and PIN the pool (service identity + root + key). Trust modes:
//    { mode: 'pinned', pin } — enforce a full pin you already stored;
//    { mode: 'key', poolPublicKey } — key shipped, learn the root from a
//        verified body; { mode: 'tofu' } — first contact, records the pin
//    OBSERVED (persist it after your own confirmation).
const { info, pin, fingerprint } = await getDepinPoolInfo({
  rpc, serviceId: 'https://pool.example/rpc', trust: { mode: 'tofu' }, network: 'mainnet',
});
const poolPublicKey = pin.poolPublicKey;

// 2. Public section list (plain reply, poolsig bound to the pool root).
const { sections } = await listDepinSectionsPublic({ rpc, poolRoot: pin.poolRoot, poolPublicKey });

// 3. Read loop for (token, address): challenge → receive → chain.
const identity = await createSoftwareIdentity({ privateKey: holderWif, network: 'mainnet' });
const ch = await requestDepinChallenge({ rpc, identity, token: '&NEWS/GENERAL', poolPublicKey });
let page = await receiveDepinMessages({
  rpc, identity, token: '&NEWS/GENERAL', challenge: ch.challenge,
  poolPublicKey, network: 'mainnet', limit: 25,
  resolveSenderPubKey: async (addr) => myPubkeyCache(addr), // getpubkey, cacheable
});
for (const m of page.messages) if (m.ok) console.log(m.message.sender, m.plaintext);
// Keep reading within 300 s without another depinchallenge:
if (page.hasMore) page = await receiveDepinMessages({
  rpc, identity, token: '&NEWS/GENERAL', challenge: page.nextChallenge,
  poolPublicKey, network: 'mainnet', afterHash: page.messages.at(-1)?.hash ?? '',
});

// 4. Publish: resolve recipients (a SIGNED envelope), build, submit.
const built = await buildDepinMessageForPool({
  rpc, token: '&NEWS/GENERAL', poolRoot: pin.poolRoot,
  maxRecipients: info.maxrecipients, poolPublicKey, network: 'mainnet',
  senderAddress: identity.address, senderPubKey: identity.publicKey, privateKey: holderWif,
  message: 'hello sections', messageType: 'group', timestamp: Math.floor(Date.now() / 1000),
});
const receipt = await submitDepinMessage({ rpc, identity, messageHex: built.hex, poolPublicKey });
// receipt = { result: 'success', hash, ... } from a reply bound to the sender.
```

`buildDepinMessageForPool` / `resolveDepinRecipients` enforce the pool
contract and **fail closed**: the recipients reply's `poolsig` is verified
first, a `truncated` response is never used, every returned key must hash to
its own address, holders dedupe by curve point, and the *final* ECIES map
(recipients ∪ auto-included sender) must fit `maxRecipients`.

> The node answering `depingetancestorrecipients` is a **trust root** for
> confidentiality: the library authenticates that the reply came from the
> pinned service and checks its internal consistency, but not that the holder
> set itself is honest.

Purging is `clearDepinMessages` with an `admin` challenge (owner access);
`scope: ''` targets the whole pool (verified against the pool root).
`listDepinSectionsPrivate` is the address-scoped section list.

### External signers (hardware wallets)

Provide an identity whose `signMessage` / `signDigest` / `openReply` are
backed by the device. For one-off message assembly, `buildDepinPreimage`
encrypts and returns the digest to sign and `assembleDepinMessage` combines
it with the DER (or compact 64-byte) signature. The private key never touches
the library.

## Utilities

`validateDepinSectionToken`, `isDepinTokenInScope`, `getDepinTokenAncestors`,
`parseDepinMessage`, `verifyDepinReceivedMessage`, the reply/pin primitives
(`verifyDepinReply`, `decodePlainReply`, `openBoundReply`,
`decodeDepinPoolInfo`, `poolKeyFingerprint`), the signature primitives
(`signRecoverableMessage`, `recoverPublicKeyFromMessage`,
`verifyRecoverableMessage`, `decodeWIF`), key/address helpers and the ECIES
primitives are all exported — see `index.d.ts` for the full typed surface.
Errors are typed with stable `code`s: `DepinProtocolError`,
`DepinReplyAuthenticationError`, `DepinReplyDecryptionError`,
`PoolPinMismatchError`, `DepinCapabilityError`.

Public keys are accepted in both serializations (33-byte compressed and
65-byte uncompressed) everywhere, matching Core; identity comparisons are by
curve point, while `hash160`/address bindings always use the exact bytes.

## Migrating from 2.x

3.0.0 implements DePIN Messaging Protocol 2 and removes the protocol-1
surface (breaking):

- **Removed**: `parseDepinPoolInfo`, `getRemoteDepinPoolInfo`,
  `buildDepinMessageForRemotePool` and the `DepinTransport` type — the TCP
  gateway (`INFO`/`AUTH`, port 19002) no longer exists on the node.
  `depingetmsginfo` is now a JSON-RPC call returning a signed `{body}`;
  use `getDepinPoolInfo`.
- **Removed**: the `preAuthenticatedPolicy: 'trust-gateway'` option and the
  `isPreAuthenticatedSentinel` export. The sentinel is always rejected.
  `Authentication` no longer includes `'gateway-preauthenticated'`.
- **Added**: recoverable `signmessage` signatures, reply-envelope
  verification (`poolsig`) with pinning/TOFU, identities and capabilities,
  and the client flows above. `resolveDepinRecipients` now requires
  `poolPublicKey` and verifies the reply envelope (its shape is unchanged);
  the pure `decodeDepinRecipients` decodes an already-verified body.
- `decodeDepinReceiveResponse` now also returns `nextChallenge` /
  `nextExpiresIn` for challenge chaining.

The message wire format (§5) and the ECIES envelope (§4) are unchanged: a
message built with 2.x `buildDepinMessage` is still valid.

## Testing

```
npm test                 # builds, runs the suite + the package gate
```

The suite verifies the official protocol-2 vectors (spec §13,
`test/fixtures/protocol2-vectors.txt`, a checksum-pinned copy of the node's
`contrib/depin/vectors.txt`): recoverable signatures byte-for-byte (§13.2/5),
`poolsig` on plain and bound replies (§13.3–13.6) and the full negative table
(§13.7). Client flows run against a scripted RPC with signed fixtures.

## License

MIT
