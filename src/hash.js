/**
 * Hash primitives. Pure-JS (noble) so they run under Hermes/React Native
 * (no crypto.subtle). Async signatures are kept for 2.2.1 compatibility.
 */

import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/ripemd160';
import { concatBytes } from './bytes.js';

async function sha256(data) {
  return nobleSha256(data);
}

async function doubleSha256(data) {
  return nobleSha256(nobleSha256(data));
}

function ripemd160(data) {
  return nobleRipemd160(data);
}

async function hash160(data) {
  return nobleRipemd160(nobleSha256(data));
}

/**
 * KDF_SHA256 as implemented by Neurai Core's depinecies.cpp:
 * SHA256(secret || counter_be32) blocks concatenated to outputLen.
 */
async function kdfSha256(sharedSecret, outputLen) {
  const output = new Uint8Array(outputLen);
  let offset = 0;
  let counter = 1;

  while (offset < outputLen) {
    const counterBytes = new Uint8Array(4);
    counterBytes[0] = (counter >> 24) & 0xff;
    counterBytes[1] = (counter >> 16) & 0xff;
    counterBytes[2] = (counter >> 8) & 0xff;
    counterBytes[3] = counter & 0xff;

    const hash = nobleSha256(concatBytes(sharedSecret, counterBytes));

    const remaining = outputLen - offset;
    const toCopy = Math.min(remaining, 32);
    output.set(hash.slice(0, toCopy), offset);
    offset += toCopy;
    counter++;
  }

  return output;
}

export { sha256, doubleSha256, ripemd160, hash160, kdfSha256 };
