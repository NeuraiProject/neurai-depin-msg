/**
 * @neuraiproject/neurai-depin-msg
 * 
 * Build encrypted DePIN messages for Neurai blockchain
 * Self-contained library with bundled secp256k1
 */

import * as secp256k1 from '@bitcoinerlab/secp256k1';

// ============================================
// SERIALIZATION UTILITIES
// ============================================

function writeCompactSize(value) {
  if (value < 0) throw new Error('CompactSize cannot be negative');
  
  if (value < 253) {
    return new Uint8Array([value]);
  } else if (value <= 0xffff) {
    const buf = new Uint8Array(3);
    buf[0] = 253;
    buf[1] = value & 0xff;
    buf[2] = (value >> 8) & 0xff;
    return buf;
  } else if (value <= 0xffffffff) {
    const buf = new Uint8Array(5);
    buf[0] = 254;
    buf[1] = value & 0xff;
    buf[2] = (value >> 8) & 0xff;
    buf[3] = (value >> 16) & 0xff;
    buf[4] = (value >> 24) & 0xff;
    return buf;
  } else {
    const buf = new Uint8Array(9);
    buf[0] = 255;
    const low = value >>> 0;
    const high = Math.floor(value / 0x100000000) >>> 0;
    buf[1] = low & 0xff;
    buf[2] = (low >> 8) & 0xff;
    buf[3] = (low >> 16) & 0xff;
    buf[4] = (low >> 24) & 0xff;
    buf[5] = high & 0xff;
    buf[6] = (high >> 8) & 0xff;
    buf[7] = (high >> 16) & 0xff;
    buf[8] = (high >> 24) & 0xff;
    return buf;
  }
}

function serializeString(str) {
  const encoder = new TextEncoder();
  const strBytes = encoder.encode(str);
  return concatBytes(writeCompactSize(strBytes.length), strBytes);
}

function serializeVector(data) {
  return concatBytes(writeCompactSize(data.length), data);
}

function serializeInt64(value) {
  const buf = new Uint8Array(8);
  const low = value >>> 0;
  const high = Math.floor(value / 0x100000000) >>> 0;
  buf[0] = low & 0xff;
  buf[1] = (low >> 8) & 0xff;
  buf[2] = (low >> 16) & 0xff;
  buf[3] = (low >> 24) & 0xff;
  buf[4] = high & 0xff;
  buf[5] = (high >> 8) & 0xff;
  buf[6] = (high >> 16) & 0xff;
  buf[7] = (high >> 24) & 0xff;
  return buf;
}

function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error('Hex must have even length');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encode ECDSA signature to DER format
 * Takes 64-byte raw signature (32 bytes r + 32 bytes s) and converts to DER
 */
function encodeDER(signature) {
  if (signature.length !== 64) {
    throw new Error('Raw signature must be 64 bytes');
  }

  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);

  // Helper to encode an integer in DER format
  function encodeInteger(value) {
    // Remove leading zeros (but keep one if needed for sign bit)
    let i = 0;
    while (i < value.length - 1 && value[i] === 0 && (value[i + 1] & 0x80) === 0) {
      i++;
    }
    const trimmed = value.slice(i);

    // If high bit is set, prepend 0x00 to indicate positive number
    const needsPadding = (trimmed[0] & 0x80) !== 0;
    const paddedValue = needsPadding
      ? concatBytes(new Uint8Array([0x00]), trimmed)
      : trimmed;

    // DER integer: 0x02 (INTEGER tag) + length + value
    return concatBytes(
      new Uint8Array([0x02, paddedValue.length]),
      paddedValue
    );
  }

  const rDER = encodeInteger(r);
  const sDER = encodeInteger(s);

  // DER sequence: 0x30 (SEQUENCE tag) + length + rDER + sDER
  const sequenceLength = rDER.length + sDER.length;
  return concatBytes(
    new Uint8Array([0x30, sequenceLength]),
    rDER,
    sDER
  );
}

// ============================================
// BASE58 / WIF UTILITIES
// ============================================

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Decode(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const charIndex = BASE58_ALPHABET.indexOf(str[i]);
    if (charIndex === -1) throw new Error('Invalid Base58 character: ' + str[i]);
    
    let carry = charIndex;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  
  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }
  
  return new Uint8Array(bytes.reverse());
}

async function wifToHex(wif) {
  const decoded = base58Decode(wif);
  
  if (decoded.length < 37) {
    throw new Error('Invalid WIF: too short');
  }
  
  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = await doubleSha256(payload);
  
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new Error('Invalid WIF: checksum mismatch');
    }
  }
  
  let privateKeyBytes;
  if (payload.length === 34) {
    privateKeyBytes = payload.slice(1, 33);
  } else if (payload.length === 33) {
    privateKeyBytes = payload.slice(1, 33);
  } else {
    throw new Error('Invalid WIF: unexpected length ' + payload.length);
  }
  
  return bytesToHex(privateKeyBytes);
}

function isWIF(str) {
  return /^[5KLcT][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(str);
}

// ============================================
// CRYPTOGRAPHIC FUNCTIONS
// ============================================

async function sha256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

async function doubleSha256(data) {
  const first = await sha256(data);
  return sha256(first);
}

function ripemd160(data) {
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;

  const K1 = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
  const K2 = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

  const R1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
  const R2 = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
  const S1 = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
  const S2 = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

  function rotl(x, n) { return ((x << n) | (x >>> (32 - n))) >>> 0; }

  const bitLen = data.length * 8;
  const padLen = (64 - ((data.length + 9) % 64)) % 64;
  const padded = new Uint8Array(data.length + 1 + padLen + 8);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bitLen, true);

  const blocks = padded.length / 64;

  for (let i = 0; i < blocks; i++) {
    const X = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      const offset = i * 64 + j * 4;
      X[j] = padded[offset] | (padded[offset + 1] << 8) | (padded[offset + 2] << 16) | (padded[offset + 3] << 24);
    }

    let a1 = h0, b1 = h1, c1 = h2, d1 = h3, e1 = h4;
    let a2 = h0, b2 = h1, c2 = h2, d2 = h3, e2 = h4;

    for (let j = 0; j < 80; j++) {
      const round = Math.floor(j / 16);
      let f1, f2;

      if (round === 0) { f1 = b1 ^ c1 ^ d1; f2 = b2 ^ (c2 | ~d2); }
      else if (round === 1) { f1 = (b1 & c1) | (~b1 & d1); f2 = (b2 & d2) | (c2 & ~d2); }
      else if (round === 2) { f1 = (b1 | ~c1) ^ d1; f2 = (b2 | ~c2) ^ d2; }
      else if (round === 3) { f1 = (b1 & d1) | (c1 & ~d1); f2 = (b2 & c2) | (~b2 & d2); }
      else { f1 = b1 ^ (c1 | ~d1); f2 = b2 ^ c2 ^ d2; }

      const t1 = (rotl((a1 + f1 + X[R1[j]] + K1[round]) >>> 0, S1[j]) + e1) >>> 0;
      a1 = e1; e1 = d1; d1 = rotl(c1, 10); c1 = b1; b1 = t1;

      const t2 = (rotl((a2 + f2 + X[R2[j]] + K2[round]) >>> 0, S2[j]) + e2) >>> 0;
      a2 = e2; e2 = d2; d2 = rotl(c2, 10); c2 = b2; b2 = t2;
    }

    const t = (h1 + c1 + d2) >>> 0;
    h1 = (h2 + d1 + e2) >>> 0;
    h2 = (h3 + e1 + a2) >>> 0;
    h3 = (h4 + a1 + b2) >>> 0;
    h4 = (h0 + b1 + c2) >>> 0;
    h0 = t;
  }

  const result = new Uint8Array(20);
  const rv = new DataView(result.buffer);
  rv.setUint32(0, h0, true); rv.setUint32(4, h1, true);
  rv.setUint32(8, h2, true); rv.setUint32(12, h3, true);
  rv.setUint32(16, h4, true);
  return result;
}

async function hash160(data) {
  const sha = await sha256(data);
  return ripemd160(sha);
}

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

    const data = concatBytes(sharedSecret, counterBytes);
    const hash = await sha256(data);

    const remaining = outputLen - offset;
    const toCopy = Math.min(remaining, 32);
    output.set(hash.slice(0, toCopy), offset);
    offset += toCopy;
    counter++;
  }

  return output;
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function aes256CbcEncrypt(plaintext, key, iv) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'AES-CBC' }, false, ['encrypt']
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv }, cryptoKey, plaintext
  );
  return new Uint8Array(ciphertext);
}

async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return new Uint8Array(mac);
}

// ============================================
// ECIES ENCRYPTION (using @bitcoinerlab/secp256k1)
// ============================================

async function eciesEncrypt(plaintext, recipientPubKeys) {
  // Neurai Core-compatible hybrid ECIES (see src/depinecies.cpp)
  // - Ephemeral keypair per message
  // - AES key derived from ephemeral privkey via KDF_SHA256
  // - Payload: [IV(16) || ciphertext || HMAC_SHA256(aesKey, ciphertext)]
  // - Per-recipient package: [recipientIV(16) || AES256_CBC(encKey, aesKey) || HMAC_SHA256(encKey, encryptedAESKey)]
  // - encKey derived from ECDH secret (secp256k1_ecdh default), then KDF_SHA256

  // Generate ephemeral key pair
  const ephemeralPrivKey = randomBytes(32);
  const ephemeralPubKey = secp256k1.pointFromScalar(ephemeralPrivKey, true);
  if (!(ephemeralPubKey instanceof Uint8Array) || ephemeralPubKey.length !== 33) {
    throw new Error('Failed to generate ephemeral public key');
  }

  // Derive AES key from ephemeral private key (matches KDF_SHA256 in C++)
  const aesKey = await kdfSha256(ephemeralPrivKey, 32);

  // Encrypt message with AES-256-CBC (PKCS7 padding)
  const iv = randomBytes(16);
  const ciphertext = await aes256CbcEncrypt(plaintext, aesKey, iv);

  // HMAC over ciphertext only (matches C++)
  const payloadHmac = await hmacSha256(aesKey, ciphertext);
  const payload = concatBytes(iv, ciphertext, payloadHmac);

  // For each recipient, encrypt the AES key
  const recipientKeys = new Map();

  for (const recipientPubKey of recipientPubKeys) {
    if (!(recipientPubKey instanceof Uint8Array) || recipientPubKey.length !== 33) {
      throw new Error('Recipient pubkey must be 33 bytes compressed');
    }

    // ECDH secret must match libsecp256k1's default: SHA256(compressed(shared_point))
    // See src/secp256k1/src/modules/ecdh/main_impl.h
    const sharedPointCompressed = secp256k1.pointMultiply(recipientPubKey, ephemeralPrivKey, true);
    const sharedSecret = await sha256(sharedPointCompressed);

    // Derive per-recipient encryption key
    const encKey = await kdfSha256(sharedSecret, 32);

    // Encrypt the AES key using AES-256-CBC with random per-recipient IV
    const recipientIV = randomBytes(16);
    const encryptedAESKey = await aes256CbcEncrypt(aesKey, encKey, recipientIV);

    // HMAC over encrypted AES key
    const recipientHmac = await hmacSha256(encKey, encryptedAESKey);

    const recipientPackage = concatBytes(recipientIV, encryptedAESKey, recipientHmac);

    // Map key is address hash160 (CKeyID): Hash160(serialized pubkey)
    const keyHash = await hash160(recipientPubKey);
    const keyHashHex = bytesToHex(keyHash);
    recipientKeys.set(keyHashHex, recipientPackage);
  }

  return {
    ephemeralPubKey,
    encryptedPayload: payload,
    recipientKeys
  };
}

function serializeEciesMessage(msg) {
  const parts = [];
  parts.push(serializeVector(msg.ephemeralPubKey));

  // CECIESEncryptedMessage serializes encryptedPayload as a vector (CompactSize + bytes)
  parts.push(serializeVector(msg.encryptedPayload));

  // recipientKeys is a std::map<uint160, vector<unsigned char>>
  // Serialize as: CompactSize(count) + repeated (uint160 key raw 20 bytes) + (vector value)
  const entries = Array.from(msg.recipientKeys.entries()).map(([hash160Hex, recipientPackage]) => {
    const keyBytes = hexToBytes(hash160Hex);
    if (keyBytes.length !== 20) throw new Error('recipient key hash160 must be 20 bytes');
    return { keyBytes, recipientPackage };
  });

  // Deterministic order (helps reproducibility; C++ map is ordered)
  entries.sort((a, b) => {
    for (let i = 0; i < 20; i++) {
      if (a.keyBytes[i] !== b.keyBytes[i]) return a.keyBytes[i] - b.keyBytes[i];
    }
    return 0;
  });

  parts.push(writeCompactSize(entries.length));
  for (const { keyBytes, recipientPackage } of entries) {
    parts.push(keyBytes);
    parts.push(serializeVector(recipientPackage));
  }

  return concatBytes(...parts);
}

// ============================================
// MAIN API
// ============================================

async function buildDepinMessage(params) {
  // Validate
  if (!params.token) throw new Error('Token is required');
  if (!params.senderAddress) throw new Error('Sender address is required');
  if (!params.senderPubKey || params.senderPubKey.length !== 66) {
    throw new Error('Sender public key must be 66 hex characters');
  }
  
  // Handle private key - can be WIF or hex
  let privateKeyHex = params.privateKey;
  if (!privateKeyHex) {
    throw new Error('Private key is required');
  }
  
  // Auto-detect and convert WIF to hex
  if (isWIF(privateKeyHex)) {
    console.log('Detected WIF format, converting to hex...');
    privateKeyHex = await wifToHex(privateKeyHex);
    console.log('Private key converted successfully');
  }
  
  if (privateKeyHex.length !== 64) {
    throw new Error('Private key must be 64 hex characters (or WIF format)');
  }
  
  if (!params.message) throw new Error('Message is required');
  if (!params.recipientPubKeys || params.recipientPubKeys.length === 0) {
    throw new Error('At least one recipient is required');
  }
  if (!params.timestamp || params.timestamp <= 0) {
    throw new Error('Timestamp must be positive');
  }

  // Convert to bytes
  const privateKey = hexToBytes(privateKeyHex);
  const senderPubKey = hexToBytes(params.senderPubKey);

  // Parse recipients
  const recipientPubKeys = params.recipientPubKeys.map(pk => {
    if (pk.length !== 66) throw new Error('Recipient pubkey must be 66 hex chars');
    return hexToBytes(pk);
  });

  // Include sender so they can decrypt their own messages
  const senderHex = params.senderPubKey.toLowerCase();
  if (!params.recipientPubKeys.some(pk => pk.toLowerCase() === senderHex)) {
    recipientPubKeys.push(senderPubKey);
  }

  // Encode message
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(params.message);

  // ECIES encrypt
  const eciesMsg = await eciesEncrypt(messageBytes, recipientPubKeys);
  const encryptedPayload = serializeEciesMessage(eciesMsg);

  // Build hash data for signing
  const hashData = concatBytes(
    serializeString(params.token),
    serializeString(params.senderAddress),
    serializeInt64(params.timestamp),
    serializeVector(encryptedPayload)
  );

  // Neurai Core uses CHashWriter (SER_GETHASH), which is double-SHA256.
  // This MUST match VerifyDepinMessageSignature in src/depinmsgpool.cpp.
  const messageHashBytes = await doubleSha256(hashData);
  // Neurai (like Bitcoin) typically displays uint256 hashes byte-reversed.
  // This makes `messageHash` match what you'll see in debug.log.
  const messageHash = bytesToHex(messageHashBytes.slice().reverse());

  // Sign with secp256k1
  const sigResult = secp256k1.sign(messageHashBytes, privateKey);

  // Convert to DER format if needed
  let signature;
  if (sigResult instanceof Uint8Array) {
    // Check if it's raw (64 bytes) or already DER (70-72 bytes typically)
    if (sigResult.length === 64) {
      // Raw signature - convert to DER
      signature = encodeDER(sigResult);
    } else {
      // Assume already DER
      signature = sigResult;
    }
  } else if (typeof sigResult === 'object' && sigResult.toDER) {
    // Some libraries provide toDER method
    signature = sigResult.toDER();
  } else if (typeof sigResult === 'object' && sigResult.signature) {
    // Some libraries return { signature, recovery }
    if (sigResult.signature.length === 64) {
      signature = encodeDER(sigResult.signature);
    } else {
      signature = sigResult.signature;
    }
  } else {
    throw new Error('Unknown signature format from secp256k1.sign()');
  }

  // Serialize complete message
  const serialized = concatBytes(
    serializeString(params.token),
    serializeString(params.senderAddress),
    serializeInt64(params.timestamp),
    serializeVector(signature),
    serializeVector(encryptedPayload)
  );

  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    recipientCount: recipientPubKeys.length
  };
}

// Export for browser (IIFE global)
export {
  buildDepinMessage,
  wifToHex,
  isWIF,
  hexToBytes,
  bytesToHex,
  sha256,
  doubleSha256,
  hash160,
  base58Decode
};

// Expose on globalThis (browser + Node) for the IIFE bundle.
if (typeof globalThis !== 'undefined') {
  globalThis.neuraiDepinMsg = {
    buildDepinMessage,
    wifToHex,
    isWIF,
    utils: {
      hexToBytes,
      bytesToHex,
      sha256,
      doubleSha256,
      hash160,
      base58Decode
    }
  };
}
