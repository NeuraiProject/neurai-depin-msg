import { secp256k1 } from '@noble/curves/secp256k1';
import * as lib from '../src/index.js';

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export async function base58CheckEncode(versionBytes, payload) {
  const data = new Uint8Array([...versionBytes, ...payload]);
  const checksum = (await lib.doubleSha256(data)).slice(0, 4);
  const full = new Uint8Array([...data, ...checksum]);
  let num = 0n;
  for (const b of full) num = num * 256n + BigInt(b);
  let out = '';
  while (num > 0n) { out = ALPHABET[Number(num % 58n)] + out; num /= 58n; }
  for (const b of full) { if (b === 0) out = '1' + out; else break; }
  return out;
}

/** P2PKH regtest/testnet address (prefix 127) for the given pubkey bytes. */
export async function addressFor(pubKeyHexOrBytes, version = 127) {
  const bytes = typeof pubKeyHexOrBytes === 'string'
    ? lib.hexToBytes(pubKeyHexOrBytes)
    : pubKeyHexOrBytes;
  return base58CheckEncode([version], await lib.hash160(bytes));
}

/** Deterministic keypair material for tests. */
export function keypair(privHex, compressed = true) {
  const priv = lib.hexToBytes(privHex);
  return {
    privHex,
    priv,
    pub: lib.bytesToHex(secp256k1.getPublicKey(priv, compressed)),
    pubCompressed: lib.bytesToHex(secp256k1.getPublicKey(priv, true)),
    pubUncompressed: lib.bytesToHex(secp256k1.getPublicKey(priv, false))
  };
}

/** Installs a deterministic RNG for reproducible ECIES output. */
export function useDeterministicRng(seedByte = 7) {
  let counter = seedByte;
  lib._setDepinTestRng((len) => {
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) out[i] = (counter + i * 31) & 0xff;
    counter = (counter + 97) & 0xff;
    return out;
  });
  return () => lib._setDepinTestRng(null);
}

/** Standard build params against sender key A. */
export async function baseParams(overrides = {}) {
  const sender = keypair('11'.repeat(32));
  const recipient = keypair('22'.repeat(32));
  return {
    token: '&TEST/APPLE',
    senderAddress: await addressFor(sender.pub),
    senderPubKey: sender.pub,
    privateKey: sender.privHex,
    message: 'test message',
    messageType: 'group',
    recipientPubKeys: [recipient.pub],
    timestamp: 1753900000,
    network: 'regtest',
    ...overrides
  };
}

export { lib, secp256k1 };
