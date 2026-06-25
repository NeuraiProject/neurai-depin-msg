# @neuraiproject/neurai-depin-msg

Build, encrypt, sign, and serialize DePIN messages compatible with Neurai Core.

This library produces the hex payload for the Neurai RPC method `depinsubmitmsg`.
It runs fully client-side (browser / local scripts) and does not require a backend.

## What you get

Given:
- A plaintext message
- Your sender address + private key
- The compressed public keys of all recipients

It returns:
- `hex`: a serialized `CDepinMessage` ready to submit via `depinsubmitmsg`
- `messageHash`: the message hash as typically displayed by Neurai Core

## Install

```bash
npm install @neuraiproject/neurai-depin-msg
```

## Usage (Browser)

Include the bundled build (IIFE). It exposes a global `neuraiDepinMsg` object.

```html
<script src="./dist/neurai-depin-msg.min.js"></script>
<script>
  async function build() {
    const res = await neuraiDepinMsg.buildDepinMessage({
      token: 'MYTOKEN',
      senderAddress: 'NxxxxYourAddress',
      senderPubKey: '02abcdef... (66 hex chars)',
      privateKey: 'L... (WIF) OR 64-hex private key',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Hello from the browser!',
      recipientPubKeys: [
        '02deadbeef... (recipient 1 compressed pubkey)',
        '03cafebabe... (recipient 2 compressed pubkey)'
      ],
      messageType: 'group'
    });

    console.log('depinsubmitmsg hex:', res.hex);
    console.log('messageHash:', res.messageHash);
  }

  build();
</script>
```

Submit it to your node:

```bash
neurai-cli depinsubmitmsg "<HEX_FROM_LIBRARY>"
```

## Usage (Node.js)

The published build is browser-style (IIFE) and attaches to `globalThis.neuraiDepinMsg`.
All cryptography is pure-JS ([noble](https://paulmillr.com/noble/)), so it runs in
the browser, Node and React Native/Hermes with no `crypto.subtle` requirement. The
only host dependency is a secure RNG (`crypto.getRandomValues`) **when encrypting**
— see [Environments](#environments) below.

```js
// This executes the IIFE bundle and sets globalThis.neuraiDepinMsg
import '@neuraiproject/neurai-depin-msg/dist/neurai-depin-msg.js';

const { buildDepinMessage } = globalThis.neuraiDepinMsg;

const res = await buildDepinMessage({
  token: 'MYTOKEN',
  senderAddress: 'NxxxxYourAddress',
  senderPubKey: '02abcdef...(66 hex chars)',
  privateKey: 'L... (WIF) OR 64-hex private key',
  timestamp: Math.floor(Date.now() / 1000),
  message: 'Hello from Node!',
  recipientPubKeys: ['02deadbeef...'],
  messageType: 'private'
});

console.log(res.hex);
```

## API

### `neuraiDepinMsg.buildDepinMessage(params)`

The browser/IIFE global is `neuraiDepinMsg`.

Builds a complete serialized `CDepinMessage` (as hex) suitable for `depinsubmitmsg`.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | `string` | yes | Token/asset name for the DePIN channel |
| `senderAddress` | `string` | yes | Sender Neurai address (string as used by Core RPC) |
| `senderPubKey` | `string` | yes | Sender compressed public key as hex (66 chars / 33 bytes) |
| `privateKey` | `string` | yes | Sender private key as **WIF** or **64-hex** (32 bytes) |
| `timestamp` | `number` | yes | Unix time (seconds) |
| `message` | `string` | yes | Plaintext message (UTF-8) |
| `recipientPubKeys` | `string[]` | yes | Recipient compressed pubkeys as hex (66 chars each). The sender pubkey is automatically added if missing so you can decrypt your own messages. |
| `messageType` | `"private" \| "group"` | yes | Message type: `"private"` allows only one recipient plus the sender, `"group"` allows multiple recipients. |

### `neuraiDepinMsg.decryptDepinReceiveEncryptedPayload(encryptedPayloadHex, recipientPrivateKey)`

Decrypts the `encrypted_payload_hex` returned by Neurai Core RPC `depinreceivemsg`.

- `encryptedPayloadHex`: hex string for the serialized `CECIESEncryptedMessage`.
- `recipientPrivateKey`: recipient private key as WIF or 64-hex.

Returns `string | null` (it returns `null` if the message is not for that key or authentication fails).

Notes:
- Public keys must be **compressed** (start with `02` or `03`).
- This library does not discover recipients for a token; it only encrypts for the pubkeys you provide.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `hex` | `string` | Hex-encoded serialized `CDepinMessage` |
| `messageHash` | `string` | Double-SHA256 signing hash displayed in the typical Core-style (byte-reversed) |
| `messageHashBytes` | `string` | Raw 32-byte digest as hex (not reversed) |
| `encryptedSize` | `number` | Size of the serialized `CECIESEncryptedMessage` in bytes |
| `recipientCount` | `number` | Number of recipients (including sender if auto-added) |
| `messageType` | `"private" \| "group"` | The message type that was specified in the parameters. |

## How it works (Core-compatible)

### Encryption (Hybrid ECIES with AES-256-GCM)

This matches Neurai Core's `CECIESEncryptedMessage` format (v2.0+):

- Ephemeral keypair is generated per message.
- Message encryption:
  - AES-256-GCM encrypts plaintext with a derived AES key (no padding).
  - Payload is stored as `[Nonce(12) || ciphertext || AuthTag(16)]`.
- Per-recipient key wrapping:
  - ECDH derives a shared secret from ephemeral privkey + recipient pubkey.
  - A per-recipient `encKey` is derived and used to AES-256-GCM encrypt the 32-byte AES key.
  - Recipient package is `[Nonce(12) || encryptedAESKey(32) || AuthTag(16)]` (60 bytes).

### Serialization

All fields are serialized using Bitcoin-style rules:
- CompactSize prefixes for vectors/strings
- Little-endian integers

**Message structure:**
```
[token (string)]
[senderAddress (string)]
[timestamp (int64)]
[messageType (uint8)]       // 0x01 = private, 0x02 = group
[encryptedPayload (vector)]
[signature (vector)]
```

### Signing

The signature hash is:

`doubleSHA256( serialize(token) || serialize(senderAddress) || int64(timestamp) || uint8(messageType) || vector(encryptedPayloadBytes) )`

`messageHash` is the display-friendly byte-reversed form (similar to how Core prints `uint256`).

## Demo

Open `demo.html` in a browser (a local server is recommended):

```bash
python3 -m http.server 8080
# Open http://localhost:8080/demo.html
```

## Environments

All cryptography is pure-JS ([`@noble/curves`](https://github.com/paulmillr/noble-curves),
[`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers),
[`@noble/hashes`](https://github.com/paulmillr/noble-hashes)) — **no `crypto.subtle`
(WebCrypto) needed**. Works in the browser, Node and React Native/Hermes.

The only host requirement is a secure random source, `crypto.getRandomValues`, used
to generate the ephemeral key and nonces **when encrypting**:

- **Browser / Node 18+**: available natively, nothing to do.
- **React Native / Hermes**: `crypto.getRandomValues` is **not** built in. Add the
  polyfill once, at your app entry point, before using the library:

  ```js
  import 'react-native-get-random-values';   // must run before buildDepinMessage()
  ```

**Decryption** (`decryptDepinReceiveEncryptedPayload`) needs no RNG and no polyfill.

## Development

```bash
npm run build:dev   # dist/neurai-depin-msg.js
npm run build       # dist/neurai-depin-msg.min.js
```

## License

MIT
