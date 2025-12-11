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
      ]
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
Node must have WebCrypto available.

```js
// Node 18+ usually has WebCrypto; if not, enable it explicitly:
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto?.subtle) globalThis.crypto = webcrypto;

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
  recipientPubKeys: ['02deadbeef...']
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

## How it works (Core-compatible)

### Encryption (Hybrid ECIES)

This matches Neurai Core's `CECIESEncryptedMessage` format:

- Ephemeral keypair is generated per message.
- Message encryption:
  - AES-256-CBC encrypts plaintext with a derived AES key.
  - Payload is stored as `[IV(16) || ciphertext || HMAC-SHA256(aesKey, ciphertext)]`.
- Per-recipient key wrapping:
  - ECDH derives a shared secret from ephemeral privkey + recipient pubkey.
  - A per-recipient `encKey` is derived and used to AES-CBC encrypt the 32-byte AES key.
  - Recipient package is `[recipientIV(16) || encryptedAESKey || HMAC-SHA256(encKey, encryptedAESKey)]`.

### Serialization

All fields are serialized using Bitcoin-style rules:
- CompactSize prefixes for vectors/strings
- Little-endian integers

### Signing

The signature hash is:

`doubleSHA256( serialize(token) || serialize(senderAddress) || int64(timestamp) || vector(encryptedPayloadBytes) )`

`messageHash` is the display-friendly byte-reversed form (similar to how Core prints `uint256`).

## Demo

Open `demo.html` in a browser (a local server is recommended):

```bash
python3 -m http.server 8080
# Open http://localhost:8080/demo.html
```

## Development

```bash
npm run build:dev   # dist/neurai-depin-msg.js
npm run build       # dist/neurai-depin-msg.min.js
```

## License

MIT
