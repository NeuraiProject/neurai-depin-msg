var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  DEPIN_RECEIVE_MAX_LIMIT: () => DEPIN_RECEIVE_MAX_LIMIT,
  MAX_DEPIN_MESSAGE_SIZE: () => MAX_DEPIN_MESSAGE_SIZE,
  MAX_DEPIN_RECIPIENTS: () => MAX_DEPIN_RECIPIENTS,
  MAX_DEPIN_TOKEN_LENGTH: () => MAX_DEPIN_TOKEN_LENGTH,
  P2PKH_PREFIX: () => P2PKH_PREFIX,
  _setDepinTestRng: () => _setDepinTestRng,
  assembleDepinMessage: () => assembleDepinMessage,
  base58CheckDecode: () => base58CheckDecode,
  base58Decode: () => base58Decode,
  buildDepinMessage: () => buildDepinMessage,
  buildDepinMessageForPool: () => buildDepinMessageForPool,
  buildDepinMessageForRemotePool: () => buildDepinMessageForRemotePool,
  buildDepinPreimage: () => buildDepinPreimage,
  bytesToHex: () => bytesToHex,
  concatBytes: () => concatBytes,
  decodeDepinReceiveResponse: () => decodeDepinReceiveResponse,
  decodeP2PKHAddress: () => decodeP2PKHAddress,
  decryptDepinReceiveEncryptedPayload: () => decryptDepinReceiveEncryptedPayload,
  decryptDepinReceivedMessage: () => decryptDepinReceivedMessage,
  derivePublicKeyForms: () => derivePublicKeyForms,
  deserializeEciesMessage: () => deserializeEciesMessage,
  doubleSha256: () => doubleSha256,
  eciesDecrypt: () => eciesDecrypt,
  eciesEncrypt: () => eciesEncrypt,
  getDepinTokenAncestors: () => getDepinTokenAncestors,
  getRemoteDepinPoolInfo: () => getRemoteDepinPoolInfo,
  hash160: () => hash160,
  hexToBytes: () => hexToBytes,
  isDepinTokenInScope: () => isDepinTokenInScope,
  isPreAuthenticatedSentinel: () => isPreAuthenticatedSentinel,
  isWIF: () => isWIF,
  kdfSha256: () => kdfSha256,
  normalizeHex: () => normalizeHex,
  normalizeNetwork: () => normalizeNetwork,
  normalizePrivateKeyTo32Bytes: () => normalizePrivateKeyTo32Bytes,
  parseDepinMessage: () => parseDepinMessage,
  parseDepinPoolInfo: () => parseDepinPoolInfo,
  parsePublicKey: () => parsePublicKey,
  privateKeyMatchesPublicKey: () => privateKeyMatchesPublicKey,
  pubKeyMatchesAddress: () => pubKeyMatchesAddress,
  resolveDepinRecipients: () => resolveDepinRecipients,
  ripemd160: () => ripemd160,
  serializeEciesMessage: () => serializeEciesMessage,
  sha256: () => sha256,
  timingSafeEqual: () => timingSafeEqual,
  unwrapMessageFromServer: () => unwrapMessageFromServer,
  validateAndDecryptDepinMessage: () => validateAndDecryptDepinMessage,
  validateDepinSectionToken: () => validateDepinSectionToken,
  verifyDepinReceivedMessage: () => verifyDepinReceivedMessage,
  wifToHex: () => wifToHex,
  wrapMessageForServer: () => wrapMessageForServer
});
module.exports = __toCommonJS(index_exports);

// src/bytes.js
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
  if (typeof hex !== "string") throw new Error("Hex must be a string");
  if (hex.length % 2 !== 0) throw new Error("Hex must have even length");
  if (!/^[0-9a-fA-F]*$/.test(hex)) throw new Error("Invalid hex characters");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function normalizeHex(hex) {
  if (typeof hex !== "string") return null;
  const trimmed = hex.trim().toLowerCase();
  const noPrefix = trimmed.startsWith("0x") ? trimmed.slice(2) : trimmed;
  if (noPrefix.length === 0) return null;
  if (!/^[0-9a-f]+$/.test(noPrefix)) return null;
  if (noPrefix.length % 2 !== 0) return null;
  return noPrefix;
}
function timingSafeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// src/hash.js
var import_sha256 = require("@noble/hashes/sha256");
var import_ripemd160 = require("@noble/hashes/ripemd160");
async function sha256(data) {
  return (0, import_sha256.sha256)(data);
}
async function doubleSha256(data) {
  return (0, import_sha256.sha256)((0, import_sha256.sha256)(data));
}
function ripemd160(data) {
  return (0, import_ripemd160.ripemd160)(data);
}
async function hash160(data) {
  return (0, import_ripemd160.ripemd160)((0, import_sha256.sha256)(data));
}
async function kdfSha256(sharedSecret, outputLen) {
  const output = new Uint8Array(outputLen);
  let offset = 0;
  let counter = 1;
  while (offset < outputLen) {
    const counterBytes = new Uint8Array(4);
    counterBytes[0] = counter >> 24 & 255;
    counterBytes[1] = counter >> 16 & 255;
    counterBytes[2] = counter >> 8 & 255;
    counterBytes[3] = counter & 255;
    const hash = (0, import_sha256.sha256)(concatBytes(sharedSecret, counterBytes));
    const remaining = outputLen - offset;
    const toCopy = Math.min(remaining, 32);
    output.set(hash.slice(0, toCopy), offset);
    offset += toCopy;
    counter++;
  }
  return output;
}

// src/base58.js
var BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58Decode(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const charIndex = BASE58_ALPHABET.indexOf(str[i]);
    if (charIndex === -1) throw new Error("Invalid Base58 character: " + str[i]);
    let carry = charIndex;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 255;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 255);
      carry >>= 8;
    }
  }
  for (let i = 0; i < str.length && str[i] === "1"; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}
async function base58CheckDecode(str) {
  const decoded = base58Decode(str);
  if (decoded.length < 5) throw new Error("Base58Check: too short");
  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = await doubleSha256(payload);
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) throw new Error("Base58Check: checksum mismatch");
  }
  return { version: payload[0], payload: payload.slice(1) };
}

// src/address.js
var P2PKH_PREFIX = {
  mainnet: 53,
  test: 127
};
function normalizeNetwork(network) {
  if (network === "mainnet") return "mainnet";
  if (network === "test" || network === "testnet" || network === "regtest") return "test";
  throw new Error(
    "network must be 'mainnet' or 'test' (aliases: 'testnet', 'regtest'); got: " + network
  );
}
async function decodeP2PKHAddress(address, network) {
  if (typeof address !== "string" || address.length === 0) {
    throw new Error("Address is required");
  }
  const { version, payload } = await base58CheckDecode(address);
  if (payload.length !== 20) {
    throw new Error("Address payload must be 20 bytes (P2PKH)");
  }
  let addressNetwork = null;
  if (version === P2PKH_PREFIX.mainnet) addressNetwork = "mainnet";
  else if (version === P2PKH_PREFIX.test) addressNetwork = "test";
  if (network !== void 0 && network !== null) {
    const expected = P2PKH_PREFIX[normalizeNetwork(network)];
    if (version !== expected) {
      throw new Error(
        "Address version byte " + version + " does not match network prefix " + expected
      );
    }
  } else if (addressNetwork === null) {
    throw new Error("Unknown address version byte: " + version);
  }
  return { version, payload, network: addressNetwork };
}
async function pubKeyMatchesAddress(pubKeyBytes, address, network) {
  const { payload } = await decodeP2PKHAddress(address, network);
  const keyHash = await hash160(pubKeyBytes);
  return timingSafeEqual(keyHash, payload);
}

// src/keys.js
var import_secp256k1 = require("@noble/curves/secp256k1");
function isWIF(str) {
  return typeof str === "string" && /^[59KLcT][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(str);
}
async function wifToHex(wif) {
  const decoded = base58Decode(wif);
  if (decoded.length < 37) {
    throw new Error("Invalid WIF: too short");
  }
  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = await doubleSha256(payload);
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new Error("Invalid WIF: checksum mismatch");
    }
  }
  let privateKeyBytes;
  if (payload.length === 34) {
    privateKeyBytes = payload.slice(1, 33);
  } else if (payload.length === 33) {
    privateKeyBytes = payload.slice(1, 33);
  } else {
    throw new Error("Invalid WIF: unexpected length " + payload.length);
  }
  return bytesToHex(privateKeyBytes);
}
async function normalizePrivateKeyTo32Bytes(wifOrHex) {
  if (typeof wifOrHex !== "string" || wifOrHex.length === 0) {
    throw new Error("Private key is required");
  }
  if (isWIF(wifOrHex)) {
    return hexToBytes(await wifToHex(wifOrHex));
  }
  const norm = normalizeHex(wifOrHex);
  if (!norm) throw new Error("Private key must be WIF or 64-hex");
  if (norm.length !== 64) throw new Error("Private key must be 32 bytes (64 hex chars)");
  return hexToBytes(norm);
}
function parsePublicKey(pubKeyHexOrBytes) {
  let bytes;
  if (pubKeyHexOrBytes instanceof Uint8Array) {
    bytes = pubKeyHexOrBytes;
  } else {
    const norm = normalizeHex(pubKeyHexOrBytes);
    if (!norm) throw new Error("Public key must be hex or bytes");
    bytes = hexToBytes(norm);
  }
  if (bytes.length !== 33 && bytes.length !== 65) {
    throw new Error("Public key must be 33 or 65 bytes; got " + bytes.length);
  }
  let point;
  try {
    point = import_secp256k1.secp256k1.ProjectivePoint.fromHex(bytes);
  } catch (e) {
    throw new Error("Invalid secp256k1 public key: " + (e && e.message ? e.message : e));
  }
  return {
    bytes,
    pointId: bytesToHex(point.toRawBytes(true))
  };
}
function derivePublicKeyForms(privKeyBytes) {
  return {
    compressed: import_secp256k1.secp256k1.getPublicKey(privKeyBytes, true),
    uncompressed: import_secp256k1.secp256k1.getPublicKey(privKeyBytes, false)
  };
}
function privateKeyMatchesPublicKey(privKeyBytes, pubKeyHexOrBytes) {
  const parsed = parsePublicKey(pubKeyHexOrBytes);
  const derived = bytesToHex(import_secp256k1.secp256k1.getPublicKey(privKeyBytes, true));
  return parsed.pointId === derived;
}

// src/ecies.js
var import_secp256k12 = require("@noble/curves/secp256k1");
var import_aes = require("@noble/ciphers/aes");

// src/serialize.js
function writeCompactSize(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("CompactSize must be a non-negative integer");
  }
  if (value < 253) {
    return new Uint8Array([value]);
  } else if (value <= 65535) {
    const buf = new Uint8Array(3);
    buf[0] = 253;
    buf[1] = value & 255;
    buf[2] = value >> 8 & 255;
    return buf;
  } else if (value <= 4294967295) {
    const buf = new Uint8Array(5);
    buf[0] = 254;
    buf[1] = value & 255;
    buf[2] = value >> 8 & 255;
    buf[3] = value >> 16 & 255;
    buf[4] = value >> 24 & 255;
    return buf;
  } else {
    const buf = new Uint8Array(9);
    buf[0] = 255;
    const low = value >>> 0;
    const high = Math.floor(value / 4294967296) >>> 0;
    buf[1] = low & 255;
    buf[2] = low >> 8 & 255;
    buf[3] = low >> 16 & 255;
    buf[4] = low >> 24 & 255;
    buf[5] = high & 255;
    buf[6] = high >> 8 & 255;
    buf[7] = high >> 16 & 255;
    buf[8] = high >> 24 & 255;
    return buf;
  }
}
function readCompactSize(buf, offset) {
  if (offset >= buf.length) throw new Error("CompactSize: out of bounds");
  const first = buf[offset];
  if (first < 253) return { value: first, offset: offset + 1 };
  if (first === 253) {
    if (offset + 3 > buf.length) throw new Error("CompactSize: truncated uint16");
    const value2 = buf[offset + 1] | buf[offset + 2] << 8;
    if (value2 < 253) throw new Error("CompactSize: non-canonical encoding");
    return { value: value2, offset: offset + 3 };
  }
  if (first === 254) {
    if (offset + 5 > buf.length) throw new Error("CompactSize: truncated uint32");
    const value2 = (buf[offset + 1] | buf[offset + 2] << 8 | buf[offset + 3] << 16 | buf[offset + 4] << 24) >>> 0;
    if (value2 < 65536) throw new Error("CompactSize: non-canonical encoding");
    return { value: value2, offset: offset + 5 };
  }
  if (offset + 9 > buf.length) throw new Error("CompactSize: truncated uint64");
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value |= BigInt(buf[offset + 1 + i]) << 8n * BigInt(i);
  }
  if (value < 0x100000000n) throw new Error("CompactSize: non-canonical encoding");
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("CompactSize: value too large");
  }
  return { value: Number(value), offset: offset + 9 };
}
function serializeString(str) {
  const strBytes = new TextEncoder().encode(str);
  return concatBytes(writeCompactSize(strBytes.length), strBytes);
}
function serializeVector(data) {
  return concatBytes(writeCompactSize(data.length), data);
}
function serializeInt64(value) {
  if (!Number.isSafeInteger(value)) throw new Error("int64 must be a safe integer");
  const buf = new Uint8Array(8);
  const low = value >>> 0;
  const high = Math.floor(value / 4294967296) >>> 0;
  buf[0] = low & 255;
  buf[1] = low >> 8 & 255;
  buf[2] = low >> 16 & 255;
  buf[3] = low >> 24 & 255;
  buf[4] = high & 255;
  buf[5] = high >> 8 & 255;
  buf[6] = high >> 16 & 255;
  buf[7] = high >> 24 & 255;
  return buf;
}
function readVector(buf, offset, maxLength = Infinity) {
  const { value: len, offset: afterLen } = readCompactSize(buf, offset);
  if (len > maxLength) throw new Error("Vector: length exceeds limit");
  if (afterLen + len > buf.length) throw new Error("Vector: truncated");
  const data = buf.slice(afterLen, afterLen + len);
  return { data, offset: afterLen + len };
}
function readString(buf, offset, maxLength = Infinity) {
  const { data, offset: after } = readVector(buf, offset, maxLength);
  return { value: new TextDecoder().decode(data), offset: after };
}
function readInt64(buf, offset) {
  if (offset + 8 > buf.length) throw new Error("int64: truncated");
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value |= BigInt(buf[offset + i]) << 8n * BigInt(i);
  }
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("int64: value too large");
  }
  return { value: Number(value), offset: offset + 8 };
}

// src/ecies.js
var _rng = null;
function _setDepinTestRng(fn) {
  _rng = typeof fn === "function" ? fn : null;
}
function randomBytes(length) {
  if (_rng) {
    const out = _rng(length);
    if (!(out instanceof Uint8Array) || out.length !== length) {
      throw new Error("Test RNG returned invalid bytes");
    }
    return out;
  }
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}
async function aes256GcmEncrypt(plaintext, key, nonce) {
  if (key.length !== 32) throw new Error("Key must be 32 bytes");
  if (nonce.length !== 12) throw new Error("Nonce must be 12 bytes");
  const out = (0, import_aes.gcm)(key, nonce).encrypt(plaintext);
  return { ciphertext: out.slice(0, -16), tag: out.slice(-16) };
}
async function aes256GcmDecrypt(ciphertext, key, nonce, tag) {
  if (key.length !== 32) throw new Error("Key must be 32 bytes");
  if (nonce.length !== 12) throw new Error("Nonce must be 12 bytes");
  if (tag.length !== 16) throw new Error("Tag must be 16 bytes");
  return (0, import_aes.gcm)(key, nonce).decrypt(concatBytes(ciphertext, tag));
}
async function eciesEncrypt(plaintext, recipientPubKeys) {
  const ephemeralPrivKey = randomBytes(32);
  const ephemeralPubKey = import_secp256k12.secp256k1.getPublicKey(ephemeralPrivKey, true);
  const aesKey = await kdfSha256(ephemeralPrivKey, 32);
  const nonce = randomBytes(12);
  const { ciphertext, tag } = await aes256GcmEncrypt(plaintext, aesKey, nonce);
  const payload = concatBytes(nonce, ciphertext, tag);
  const recipientKeys = /* @__PURE__ */ new Map();
  for (const recipientPubKey of recipientPubKeys) {
    const { bytes: keyBytes } = parsePublicKey(recipientPubKey);
    const sharedPointCompressed = import_secp256k12.secp256k1.getSharedSecret(ephemeralPrivKey, keyBytes, true);
    const sharedSecret = await sha256(sharedPointCompressed);
    const encKey = await kdfSha256(sharedSecret, 32);
    const recipientNonce = randomBytes(12);
    const { ciphertext: encryptedAESKey, tag: recipientTag } = await aes256GcmEncrypt(aesKey, encKey, recipientNonce);
    const recipientPackage = concatBytes(recipientNonce, encryptedAESKey, recipientTag);
    const keyHashHex = bytesToHex(await hash160(keyBytes));
    if (recipientKeys.has(keyHashHex)) {
      throw new Error("Duplicate recipient key (same hash160): " + keyHashHex);
    }
    recipientKeys.set(keyHashHex, recipientPackage);
  }
  return { ephemeralPubKey, encryptedPayload: payload, recipientKeys };
}
function compareUint160(a, b) {
  for (let i = 19; i >= 0; i--) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}
function serializeEciesMessage(msg) {
  const parts = [];
  parts.push(serializeVector(msg.ephemeralPubKey));
  parts.push(serializeVector(msg.encryptedPayload));
  const entries = Array.from(msg.recipientKeys.entries()).map(([hash160Hex, recipientPackage]) => {
    const keyBytes = hexToBytes(hash160Hex);
    if (keyBytes.length !== 20) throw new Error("recipient key hash160 must be 20 bytes");
    return { keyBytes, recipientPackage };
  });
  entries.sort((a, b) => compareUint160(a.keyBytes, b.keyBytes));
  parts.push(writeCompactSize(entries.length));
  for (const { keyBytes, recipientPackage } of entries) {
    parts.push(keyBytes);
    parts.push(serializeVector(recipientPackage));
  }
  return concatBytes(...parts);
}
function deserializeEciesMessage(serialized, options = {}) {
  const { allowTrailing = false } = options;
  if (!(serialized instanceof Uint8Array)) {
    throw new Error("deserializeEciesMessage: invalid input");
  }
  let offset = 0;
  const ephem = readVector(serialized, offset);
  const ephemeralPubKey = ephem.data;
  offset = ephem.offset;
  if (ephemeralPubKey.length !== 33 && ephemeralPubKey.length !== 65) {
    throw new Error("Invalid ephemeral pubkey length: " + ephemeralPubKey.length);
  }
  const payloadVec = readVector(serialized, offset);
  const encryptedPayload = payloadVec.data;
  offset = payloadVec.offset;
  const countRes = readCompactSize(serialized, offset);
  const count = countRes.value;
  offset = countRes.offset;
  const recipientKeys = /* @__PURE__ */ new Map();
  for (let i = 0; i < count; i++) {
    if (offset + 20 > serialized.length) throw new Error("recipientKeys: truncated keyid");
    const keyId = serialized.slice(offset, offset + 20);
    offset += 20;
    const v = readVector(serialized, offset);
    offset = v.offset;
    const keyIdHex = bytesToHex(keyId);
    if (recipientKeys.has(keyIdHex)) {
      throw new Error("recipientKeys: duplicate key id " + keyIdHex);
    }
    recipientKeys.set(keyIdHex, v.data);
  }
  if (!allowTrailing && offset !== serialized.length) {
    throw new Error("deserializeEciesMessage: trailing bytes after message");
  }
  return { ephemeralPubKey, encryptedPayload, recipientKeys };
}
async function eciesDecrypt(msg, privKeyBytes) {
  const forms = derivePublicKeyForms(privKeyBytes);
  const candidateIds = [
    bytesToHex(await hash160(forms.compressed)),
    bytesToHex(await hash160(forms.uncompressed))
  ];
  const packages = [];
  for (const id of candidateIds) {
    const pkg = msg.recipientKeys.get(id);
    if (pkg) packages.push(pkg);
  }
  if (packages.length === 0) return null;
  const payload = msg.encryptedPayload;
  if (payload.length < 12 + 1 + 16) return null;
  const payloadNonce = payload.slice(0, 12);
  const ciphertext = payload.slice(12, payload.length - 16);
  const payloadTag = payload.slice(payload.length - 16);
  const sharedPointCompressed = import_secp256k12.secp256k1.getSharedSecret(privKeyBytes, msg.ephemeralPubKey, true);
  const sharedSecret = await sha256(sharedPointCompressed);
  const encKey = await kdfSha256(sharedSecret, 32);
  for (const recipientPackage of packages) {
    if (recipientPackage.length < 12 + 32 + 16) continue;
    const recipientNonce = recipientPackage.slice(0, 12);
    const encryptedAESKey = recipientPackage.slice(12, recipientPackage.length - 16);
    const recipientTag = recipientPackage.slice(recipientPackage.length - 16);
    let aesKey;
    try {
      aesKey = await aes256GcmDecrypt(encryptedAESKey, encKey, recipientNonce, recipientTag);
    } catch {
      continue;
    }
    if (aesKey.length !== 32) continue;
    try {
      return await aes256GcmDecrypt(ciphertext, aesKey, payloadNonce, payloadTag);
    } catch {
      continue;
    }
  }
  return null;
}

// src/message.js
var import_secp256k13 = require("@noble/curves/secp256k1");

// src/scope.js
var DEPIN_ROOT_RE = /^&[A-Z0-9._]{3,}$/;
var DEPIN_SUB_RE = /^&[A-Z0-9._]+\/[A-Z0-9._/]+$/;
var MAX_DEPIN_TOKEN_LENGTH = 121;
function validateDepinSectionToken(token, options = {}) {
  const { maxLength = MAX_DEPIN_TOKEN_LENGTH } = options;
  if (typeof token !== "string" || token.length === 0) {
    return { valid: false, error: "Token is required", parts: null };
  }
  if (token.length > maxLength) {
    return { valid: false, error: "Token exceeds maximum length of " + maxLength, parts: null };
  }
  if (token[0] !== "&") {
    return { valid: false, error: "DePIN token must start with '&'", parts: null };
  }
  if (token.includes("/")) {
    if (!DEPIN_SUB_RE.test(token)) {
      return { valid: false, error: "Invalid DePIN section token characters", parts: null };
    }
    const parts = token.split("/");
    for (const part of parts) {
      if (part.length < 3) {
        return { valid: false, error: "Each token part must be at least 3 characters", parts: null };
      }
    }
    return { valid: true, error: null, parts };
  }
  if (!DEPIN_ROOT_RE.test(token)) {
    return { valid: false, error: "Invalid DePIN root token (need &, then 3+ of A-Z 0-9 . _)", parts: null };
  }
  return { valid: true, error: null, parts: [token] };
}
function isDepinTokenInScope(messageToken, requestedRootOrSection) {
  const msg = validateDepinSectionToken(messageToken);
  const scope = validateDepinSectionToken(requestedRootOrSection);
  if (!msg.valid || !scope.valid) return false;
  return messageToken === requestedRootOrSection || messageToken.startsWith(requestedRootOrSection + "/");
}
function getDepinTokenAncestors(token, stopAt) {
  const v = validateDepinSectionToken(token);
  if (!v.valid) throw new Error(v.error);
  const ancestors = [];
  let current = token;
  for (; ; ) {
    ancestors.push(current);
    if (stopAt !== void 0 && stopAt !== null && current === stopAt) return ancestors;
    const idx = current.lastIndexOf("/");
    if (idx === -1) break;
    current = current.slice(0, idx);
  }
  if (stopAt !== void 0 && stopAt !== null) {
    throw new Error("stop_at '" + stopAt + "' is not '" + token + "' or one of its ancestors");
  }
  return ancestors;
}

// src/message.js
var MAX_DEPIN_RECIPIENTS = 50;
var MAX_DEPIN_MESSAGE_SIZE = 10240;
var DEPIN_RECEIVE_MAX_LIMIT = 1e3;
var PRE_AUTH_SENTINEL_LENGTH = 65;
function isPreAuthenticatedSentinel(signatureBytes) {
  if (!(signatureBytes instanceof Uint8Array)) return false;
  if (signatureBytes.length !== PRE_AUTH_SENTINEL_LENGTH) return false;
  for (let i = 0; i < signatureBytes.length; i++) {
    if (signatureBytes[i] !== 0) return false;
  }
  return true;
}
function normalizeMessageType(value) {
  if (value === "private" || value === 1 || value === "0x01") {
    return { str: "private", byte: 1 };
  }
  if (value === "group" || value === 2 || value === "0x02") {
    return { str: "group", byte: 2 };
  }
  throw new Error('messageType must be "private" or "group"');
}
function buildPreimageBytes({ token, senderAddress, timestamp, messageTypeByte, encryptedPayload }) {
  return concatBytes(
    serializeString(token),
    serializeString(senderAddress),
    serializeInt64(timestamp),
    new Uint8Array([messageTypeByte]),
    serializeVector(encryptedPayload)
  );
}
async function computeDepinMessageHashBytes(fields) {
  return doubleSha256(buildPreimageBytes(fields));
}
async function prepareBuildInputs(params) {
  if (!params.token) throw new Error("Token is required");
  const tokenCheck = validateDepinSectionToken(params.token);
  if (!tokenCheck.valid) throw new Error("Invalid DePIN token: " + tokenCheck.error);
  if (!params.senderAddress) throw new Error("Sender address is required");
  if (!params.senderPubKey) throw new Error("Sender public key is required");
  const senderKey = parsePublicKey(params.senderPubKey);
  const { payload } = await decodeP2PKHAddress(params.senderAddress, params.network ?? null);
  const senderKeyHash = await hash160(senderKey.bytes);
  if (!timingSafeEqual(senderKeyHash, payload)) {
    throw new Error("senderPubKey does not correspond to senderAddress");
  }
  const messageType = normalizeMessageType(params.messageType);
  if (!params.message) throw new Error("Message is required");
  if (!params.recipientPubKeys || params.recipientPubKeys.length === 0) {
    throw new Error("At least one recipient is required");
  }
  if (!Number.isInteger(params.timestamp) || params.timestamp <= 0) {
    throw new Error("Timestamp must be a positive integer");
  }
  const byPoint = /* @__PURE__ */ new Map();
  for (const pk of params.recipientPubKeys) {
    const parsed = parsePublicKey(pk);
    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }
  if (messageType.byte === 1) {
    const uniquePoints = new Set(byPoint.keys());
    uniquePoints.add(senderKey.pointId);
    if (uniquePoints.size > 2) {
      throw new Error('messageType "private" allows only one recipient plus the sender');
    }
  }
  if (!byPoint.has(senderKey.pointId)) {
    byPoint.set(senderKey.pointId, senderKey.bytes);
  }
  if (byPoint.size > MAX_DEPIN_RECIPIENTS) {
    throw new Error(
      "Final recipient map has " + byPoint.size + " entries (sender included); Core rejects more than " + MAX_DEPIN_RECIPIENTS
    );
  }
  return {
    messageType,
    senderKey,
    recipientKeyBytes: Array.from(byPoint.values())
  };
}
async function buildDepinMessage(params) {
  const { messageType, senderKey, recipientKeyBytes } = await prepareBuildInputs(params);
  let privateKeyHex = params.privateKey;
  if (!privateKeyHex) throw new Error("Private key is required");
  if (isWIF(privateKeyHex)) privateKeyHex = await wifToHex(privateKeyHex);
  if (privateKeyHex.length !== 64) {
    throw new Error("Private key must be 64 hex characters (or WIF format)");
  }
  const privateKey = hexToBytes(privateKeyHex);
  if (!privateKeyMatchesPublicKey(privateKey, senderKey.bytes)) {
    throw new Error("privateKey does not correspond to senderPubKey; Core would reject the signature");
  }
  const messageBytes = new TextEncoder().encode(params.message);
  const eciesMsg = await eciesEncrypt(messageBytes, recipientKeyBytes);
  const encryptedPayload = serializeEciesMessage(eciesMsg);
  const fields = {
    token: params.token,
    senderAddress: params.senderAddress,
    timestamp: params.timestamp,
    messageTypeByte: messageType.byte,
    encryptedPayload
  };
  const messageHashBytes = await computeDepinMessageHashBytes(fields);
  const messageHash = bytesToHex(messageHashBytes.slice().reverse());
  const signature = import_secp256k13.secp256k1.sign(messageHashBytes, privateKey).toDERRawBytes();
  const serialized = concatBytes(
    buildPreimageBytes(fields),
    serializeVector(signature)
  );
  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    recipientCount: recipientKeyBytes.length,
    messageType: messageType.str
  };
}
async function buildDepinPreimage(params) {
  const { messageType, recipientKeyBytes } = await prepareBuildInputs(params);
  const messageBytes = new TextEncoder().encode(params.message);
  const eciesMsg = await eciesEncrypt(messageBytes, recipientKeyBytes);
  const encryptedPayload = serializeEciesMessage(eciesMsg);
  return {
    encryptedPayloadHex: bytesToHex(encryptedPayload),
    messageType: messageType.str,
    messageTypeByte: messageType.byte,
    encryptedSize: encryptedPayload.length,
    recipientCount: recipientKeyBytes.length
  };
}
async function assembleDepinMessage(params, signatureHexOrBytes) {
  if (!params.token) throw new Error("Token is required");
  if (!params.senderAddress) throw new Error("Sender address is required");
  if (!params.encryptedPayloadHex) throw new Error("encryptedPayloadHex is required");
  const messageType = normalizeMessageType(params.messageType);
  if (!Number.isInteger(params.timestamp) || params.timestamp <= 0) {
    throw new Error("Timestamp must be a positive integer");
  }
  if (!signatureHexOrBytes) throw new Error("signature is required");
  const normalizedPayload = normalizeHex(params.encryptedPayloadHex);
  if (!normalizedPayload) throw new Error("Invalid encryptedPayloadHex");
  const encryptedPayload = hexToBytes(normalizedPayload);
  let signature;
  if (typeof signatureHexOrBytes === "string") {
    const norm = normalizeHex(signatureHexOrBytes);
    if (!norm) throw new Error("Invalid signature hex");
    signature = hexToBytes(norm);
  } else {
    signature = signatureHexOrBytes;
  }
  if (signature.length === 64) {
    signature = import_secp256k13.secp256k1.Signature.fromCompact(signature).toDERRawBytes();
  } else {
    try {
      import_secp256k13.secp256k1.Signature.fromDER(signature);
    } catch (e) {
      throw new Error("Signature is not valid DER: " + (e && e.message ? e.message : e));
    }
  }
  const fields = {
    token: params.token,
    senderAddress: params.senderAddress,
    timestamp: params.timestamp,
    messageTypeByte: messageType.byte,
    encryptedPayload
  };
  const messageHashBytes = await computeDepinMessageHashBytes(fields);
  const messageHash = bytesToHex(messageHashBytes.slice().reverse());
  const serialized = concatBytes(
    buildPreimageBytes(fields),
    serializeVector(signature)
  );
  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    messageType: messageType.str
  };
}
async function parseDepinMessage(hexOrBytes, options = {}) {
  const { maxPayloadBytes = MAX_DEPIN_MESSAGE_SIZE * MAX_DEPIN_RECIPIENTS } = options;
  let bytes;
  if (hexOrBytes instanceof Uint8Array) {
    bytes = hexOrBytes;
  } else {
    const norm = normalizeHex(hexOrBytes);
    if (!norm) throw new Error("Invalid message hex");
    bytes = hexToBytes(norm);
  }
  let offset = 0;
  const tokenRes = readString(bytes, offset, 1024);
  offset = tokenRes.offset;
  const senderRes = readString(bytes, offset, 1024);
  offset = senderRes.offset;
  const tsRes = readInt64(bytes, offset);
  offset = tsRes.offset;
  if (offset >= bytes.length) throw new Error("CDepinMessage: truncated messageType");
  const messageTypeByte = bytes[offset];
  offset += 1;
  if (messageTypeByte !== 1 && messageTypeByte !== 2) {
    throw new Error("Invalid messageType: 0x" + messageTypeByte.toString(16).padStart(2, "0"));
  }
  const payloadRes = readVector(bytes, offset, maxPayloadBytes);
  offset = payloadRes.offset;
  const sigRes = readVector(bytes, offset, 144);
  offset = sigRes.offset;
  if (offset !== bytes.length) throw new Error("CDepinMessage: trailing bytes after message");
  const fields = {
    token: tokenRes.value,
    senderAddress: senderRes.value,
    timestamp: tsRes.value,
    messageTypeByte,
    encryptedPayload: payloadRes.data
  };
  const hashBytes = await computeDepinMessageHashBytes(fields);
  return {
    token: fields.token,
    senderAddress: fields.senderAddress,
    timestamp: fields.timestamp,
    messageType: messageTypeByte === 1 ? "private" : "group",
    messageTypeByte,
    encryptedPayloadHex: bytesToHex(payloadRes.data),
    signatureHex: bytesToHex(sigRes.data),
    isPreAuthenticated: isPreAuthenticatedSentinel(sigRes.data),
    hash: bytesToHex(hashBytes.slice().reverse()),
    hashBytes: bytesToHex(hashBytes),
    size: bytes.length
  };
}
function normalizeReceivedMessage(message) {
  if (!message || typeof message !== "object") {
    throw new Error("Message object is required");
  }
  const token = message.token;
  const senderAddress = message.senderAddress ?? message.sender;
  const timestamp = message.timestamp;
  const rawType = message.messageTypeByte ?? message.messageType ?? message.message_type;
  const payloadHex = message.encryptedPayloadHex ?? message.encrypted_payload_hex;
  const signatureHex = message.signatureHex ?? message.signature_hex;
  const claimedHash = message.hash ?? null;
  if (typeof token !== "string" || token.length === 0) throw new Error("Message token missing");
  if (typeof senderAddress !== "string" || senderAddress.length === 0) {
    throw new Error("Message sender missing");
  }
  if (!Number.isInteger(timestamp) || timestamp <= 0) throw new Error("Message timestamp invalid");
  const messageType = normalizeMessageType(rawType);
  const normPayload = normalizeHex(payloadHex);
  if (!normPayload) throw new Error("Message encrypted payload hex invalid");
  const normSig = normalizeHex(signatureHex);
  if (!normSig) throw new Error("Message signature hex invalid");
  let normClaimedHash = null;
  if (claimedHash !== null && claimedHash !== void 0) {
    normClaimedHash = normalizeHex(claimedHash);
    if (!normClaimedHash || normClaimedHash.length !== 64) {
      throw new Error("Message hash field invalid");
    }
  }
  return {
    token,
    senderAddress,
    timestamp,
    messageTypeStr: messageType.str,
    messageTypeByte: messageType.byte,
    encryptedPayload: hexToBytes(normPayload),
    signature: hexToBytes(normSig),
    claimedHash: normClaimedHash
  };
}
async function verifyDepinReceivedMessage(message, options = {}) {
  const { network, senderPubKey = null, resolveSenderPubKey = null } = options;
  if (!network) {
    throw new Error("options.network is required ('mainnet' or 'test'/'testnet'/'regtest')");
  }
  let norm;
  try {
    norm = normalizeReceivedMessage(message);
  } catch (e) {
    return {
      signatureValid: false,
      authentication: "invalid",
      hash: null,
      senderPubKey: null,
      reason: e.message
    };
  }
  const hashBytes = await computeDepinMessageHashBytes(norm);
  const hash = bytesToHex(hashBytes.slice().reverse());
  const result = { signatureValid: false, authentication: "invalid", hash, senderPubKey: null, reason: null };
  if (norm.claimedHash && norm.claimedHash !== hash) {
    result.reason = "hash field does not match computed message hash";
    return result;
  }
  if (isPreAuthenticatedSentinel(norm.signature)) {
    result.authentication = "gateway-preauthenticated";
    result.reason = "pre-authenticated gateway sentinel; not cryptographically verifiable";
    return result;
  }
  let addressPayload;
  try {
    ({ payload: addressPayload } = await decodeP2PKHAddress(norm.senderAddress, network));
  } catch (e) {
    result.reason = "sender address invalid: " + e.message;
    return result;
  }
  let sig;
  try {
    sig = import_secp256k13.secp256k1.Signature.fromDER(norm.signature);
  } catch (e) {
    result.reason = "signature is not valid DER";
    return result;
  }
  let suppliedKey = senderPubKey;
  if (!suppliedKey && typeof resolveSenderPubKey === "function") {
    suppliedKey = await resolveSenderPubKey(norm.senderAddress);
  }
  if (suppliedKey) {
    let parsed;
    try {
      parsed = parsePublicKey(suppliedKey);
    } catch (e) {
      result.reason = "supplied sender public key invalid: " + e.message;
      return result;
    }
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, addressPayload)) {
      result.reason = "supplied sender public key does not match sender address";
      return result;
    }
    if (import_secp256k13.secp256k1.verify(sig, hashBytes, parsed.bytes, { lowS: false })) {
      result.signatureValid = true;
      result.authentication = "signature";
      result.senderPubKey = bytesToHex(parsed.bytes);
      return result;
    }
    result.reason = "signature verification failed for supplied sender public key";
    return result;
  }
  for (let bit = 0; bit < 4; bit++) {
    let point;
    try {
      point = sig.addRecoveryBit(bit).recoverPublicKey(hashBytes);
    } catch {
      continue;
    }
    for (const compressed of [true, false]) {
      const candidate = point.toRawBytes(compressed);
      const keyHash = await hash160(candidate);
      if (timingSafeEqual(keyHash, addressPayload)) {
        result.signatureValid = true;
        result.authentication = "signature";
        result.senderPubKey = bytesToHex(candidate);
        return result;
      }
    }
  }
  result.reason = "no recovered public key matches the sender address";
  return result;
}

// src/receive.js
var DEFAULT_LIMITS = {
  maxMessages: DEPIN_RECEIVE_MAX_LIMIT,
  maxPayloadBytes: MAX_DEPIN_MESSAGE_SIZE * MAX_DEPIN_RECIPIENTS
};
async function decryptDepinReceiveEncryptedPayload(encryptedPayloadHex, recipientPrivateKey) {
  const normalized = normalizeHex(encryptedPayloadHex);
  if (!normalized) throw new Error("Invalid encryptedPayloadHex");
  const msg = deserializeEciesMessage(hexToBytes(normalized));
  const privKeyBytes = await normalizePrivateKeyTo32Bytes(recipientPrivateKey);
  const plaintextBytes = await eciesDecrypt(msg, privKeyBytes);
  if (plaintextBytes === null) return null;
  return new TextDecoder().decode(plaintextBytes);
}
async function decryptDepinReceivedMessage(message, privateKey) {
  const norm = normalizeReceivedMessage(message);
  const privKeyBytes = await normalizePrivateKeyTo32Bytes(privateKey);
  const ecies = deserializeEciesMessage(norm.encryptedPayload);
  const plaintextBytes = await eciesDecrypt(ecies, privKeyBytes);
  return {
    plaintext: plaintextBytes === null ? null : new TextDecoder().decode(plaintextBytes)
  };
}
async function validateAndDecryptDepinMessage(message, options = {}) {
  const {
    network,
    privateKey = null,
    requestedToken = null,
    limits = {},
    preAuthenticatedPolicy = "reject",
    senderPubKey = null,
    resolveSenderPubKey = null
  } = options;
  if (preAuthenticatedPolicy !== "reject" && preAuthenticatedPolicy !== "trust-gateway") {
    throw new Error("preAuthenticatedPolicy must be 'reject' or 'trust-gateway'");
  }
  const effLimits = { ...DEFAULT_LIMITS, ...limits };
  const result = {
    ok: false,
    reason: null,
    hash: null,
    message: null,
    signatureValid: false,
    authentication: "invalid",
    senderPubKey: null,
    plaintext: null
  };
  let norm;
  try {
    norm = normalizeReceivedMessage(message);
  } catch (e) {
    result.reason = e.message;
    return result;
  }
  result.message = {
    token: norm.token,
    sender: norm.senderAddress,
    timestamp: norm.timestamp,
    messageType: norm.messageTypeStr
  };
  if (norm.encryptedPayload.length === 0) {
    result.reason = "empty encrypted payload";
    return result;
  }
  if (norm.encryptedPayload.length > effLimits.maxPayloadBytes) {
    result.reason = "encrypted payload exceeds limit of " + effLimits.maxPayloadBytes + " bytes";
    return result;
  }
  if (requestedToken !== null && !isDepinTokenInScope(norm.token, requestedToken)) {
    result.reason = "message token '" + norm.token + "' is outside requested scope '" + requestedToken + "'";
    return result;
  }
  const verification = await verifyDepinReceivedMessage(message, {
    network,
    senderPubKey,
    resolveSenderPubKey
  });
  result.hash = verification.hash;
  result.signatureValid = verification.signatureValid;
  result.authentication = verification.authentication;
  result.senderPubKey = verification.senderPubKey;
  if (verification.authentication === "gateway-preauthenticated") {
    if (preAuthenticatedPolicy !== "trust-gateway") {
      result.reason = "pre-authenticated gateway message rejected by policy";
      return result;
    }
  } else if (!verification.signatureValid) {
    result.reason = verification.reason || "signature verification failed";
    return result;
  }
  result.ok = true;
  if (privateKey !== null) {
    try {
      const ecies = deserializeEciesMessage(norm.encryptedPayload);
      const privKeyBytes = await normalizePrivateKeyTo32Bytes(privateKey);
      const plaintextBytes = await eciesDecrypt(ecies, privKeyBytes);
      if (plaintextBytes !== null) {
        result.plaintext = new TextDecoder().decode(plaintextBytes);
      }
    } catch (e) {
      result.ok = false;
      result.reason = "encrypted payload is malformed: " + e.message;
      return result;
    }
  }
  return result;
}
async function decodeDepinReceiveResponse(rpcResult, options = {}) {
  const { privateKey = null, limits = {} } = options;
  const effLimits = { ...DEFAULT_LIMITS, ...limits };
  let wasEncrypted = false;
  let payload = rpcResult;
  if (payload && typeof payload === "object" && !Array.isArray(payload) && typeof payload.encrypted === "string") {
    if (!privateKey) {
      throw new Error("privateKey is required to unwrap an { encrypted } response");
    }
    const plaintext = await decryptDepinReceiveEncryptedPayload(payload.encrypted, privateKey);
    if (plaintext === null) {
      throw new Error("Could not decrypt { encrypted } response with the provided key");
    }
    try {
      payload = JSON.parse(plaintext);
    } catch {
      throw new Error("Decrypted response wrapper is not valid JSON");
    }
    wasEncrypted = true;
  }
  let rawMessages;
  let hasMore = null;
  if (Array.isArray(payload)) {
    rawMessages = payload;
  } else if (payload && typeof payload === "object" && Array.isArray(payload.messages)) {
    rawMessages = payload.messages;
    if (typeof payload.has_more === "boolean") hasMore = payload.has_more;
    else if (typeof payload.hasMore === "boolean") hasMore = payload.hasMore;
    else throw new Error("Paginated response missing has_more");
  } else {
    throw new Error("Unrecognized depinreceivemsg result shape");
  }
  if (rawMessages.length > effLimits.maxMessages) {
    throw new Error(
      "Response has " + rawMessages.length + " messages, above the limit of " + effLimits.maxMessages
    );
  }
  const seenHashes = /* @__PURE__ */ new Set();
  const messages = [];
  for (const raw of rawMessages) {
    const entry = await validateAndDecryptDepinMessage(raw, options);
    if (entry.ok && entry.hash) {
      if (seenHashes.has(entry.hash)) {
        entry.ok = false;
        entry.reason = "duplicate message hash in response";
        entry.plaintext = null;
      } else {
        seenHashes.add(entry.hash);
      }
    }
    messages.push(entry);
  }
  return { messages, hasMore, wasEncrypted };
}
async function wrapMessageForServer(messageHex, serverPubKeyHex, senderAddress) {
  if (!messageHex || !serverPubKeyHex || !senderAddress) {
    throw new Error("messageHex, serverPubKeyHex, and senderAddress are required");
  }
  const normalizedMsg = normalizeHex(messageHex);
  if (!normalizedMsg) throw new Error("Invalid messageHex");
  let serverPubKey;
  try {
    serverPubKey = parsePublicKey(serverPubKeyHex).bytes;
  } catch (e) {
    throw new Error("Invalid serverPubKeyHex: " + e.message);
  }
  const messageBytes = new TextEncoder().encode(normalizedMsg);
  const eciesMsg = await eciesEncrypt(messageBytes, [serverPubKey]);
  return {
    sender: senderAddress,
    encrypted: bytesToHex(serializeEciesMessage(eciesMsg))
  };
}
async function unwrapMessageFromServer(encryptedHex, recipientPrivateKeyWifOrHex, options = {}) {
  if (!encryptedHex || !recipientPrivateKeyWifOrHex) {
    throw new Error("encryptedHex and recipientPrivateKey are required");
  }
  let privKeyHex = recipientPrivateKeyWifOrHex;
  if (isWIF(privKeyHex)) {
    privKeyHex = await wifToHex(privKeyHex);
  }
  const decrypted = await decryptDepinReceiveEncryptedPayload(encryptedHex, privKeyHex);
  if (decrypted === null || !options.parseJson) return decrypted;
  try {
    return JSON.parse(decrypted);
  } catch {
    throw new Error("Decrypted server response is not valid JSON");
  }
}

// src/resolve.js
async function resolveDepinRecipients(params) {
  const { token, poolRoot, maxRecipients, senderPubKey, rpc, network = null } = params;
  if (!rpc || typeof rpc.call !== "function") {
    throw new Error("rpc with a call(method, params) function is required");
  }
  const tokenCheck = validateDepinSectionToken(token);
  if (!tokenCheck.valid) throw new Error("Invalid token: " + tokenCheck.error);
  const rootCheck = validateDepinSectionToken(poolRoot);
  if (!rootCheck.valid) throw new Error("Invalid poolRoot: " + rootCheck.error);
  if (!isDepinTokenInScope(token, poolRoot)) {
    throw new Error("token '" + token + "' is not under pool root '" + poolRoot + "'");
  }
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > MAX_DEPIN_RECIPIENTS) {
    throw new Error("maxRecipients must be an integer between 1 and " + MAX_DEPIN_RECIPIENTS);
  }
  if (!senderPubKey) {
    throw new Error("senderPubKey is required to size the final recipient map");
  }
  const senderKey = parsePublicKey(senderPubKey);
  const result = await rpc.call("depingetancestorrecipients", [token, maxRecipients + 1, poolRoot]);
  if (!result || typeof result !== "object") {
    throw new Error("depingetancestorrecipients returned no result");
  }
  if (result.token !== token) {
    throw new Error("Response token '" + result.token + "' does not match requested '" + token + "'");
  }
  if (result.stop_at !== poolRoot) {
    throw new Error("Response stop_at '" + result.stop_at + "' does not match pool root '" + poolRoot + "'");
  }
  if (result.truncated !== false) {
    throw new Error("Recipient list is truncated or incomplete; refusing to build a partial group");
  }
  if (!Array.isArray(result.recipients)) {
    throw new Error("Response recipients is not an array");
  }
  if (typeof result.returned === "number" && result.returned !== result.recipients.length) {
    throw new Error("Response returned count does not match recipients length");
  }
  if (!Array.isArray(result.ancestors) || result.ancestors[0] !== token) {
    throw new Error("Response ancestors is inconsistent with the requested token");
  }
  const byPoint = /* @__PURE__ */ new Map();
  for (const entry of result.recipients) {
    if (!entry || typeof entry.address !== "string" || typeof entry.pubkey !== "string") {
      throw new Error("Malformed recipient entry in response");
    }
    const parsed = parsePublicKey(entry.pubkey);
    const { payload } = await decodeP2PKHAddress(entry.address, network);
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new Error("Recipient pubkey does not match its address '" + entry.address + "'");
    }
    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }
  const senderIncludedInHolders = byPoint.has(senderKey.pointId);
  const finalCount = byPoint.size + (senderIncludedInHolders ? 0 : 1);
  if (finalCount > maxRecipients) {
    throw new Error(
      "Final recipient map would have " + finalCount + " entries (sender included), above the pool limit of " + maxRecipients
    );
  }
  return {
    recipientPubKeys: Array.from(byPoint.values()).map(bytesToHex),
    recipientCount: finalCount,
    senderIncludedInHolders,
    ancestors: result.ancestors,
    maxRecipients,
    skipped: {
      noPubKey: result.skipped_no_pubkey ?? null,
      noPubKeyComplete: result.skipped_no_pubkey_complete ?? null,
      restricted: result.skipped_restricted ?? null,
      restrictedComplete: result.skipped_restricted_complete ?? null
    }
  };
}
async function buildDepinMessageForPool(params) {
  const { token, poolRoot, maxRecipients, rpc, network, ...buildParams } = params;
  const resolution = await resolveDepinRecipients({
    token,
    poolRoot,
    maxRecipients,
    rpc,
    network,
    senderPubKey: buildParams.senderPubKey
  });
  const built = await buildDepinMessage({
    ...buildParams,
    network,
    token,
    recipientPubKeys: resolution.recipientPubKeys
  });
  return { ...built, resolution };
}
function parseDepinPoolInfo(raw) {
  if (typeof raw !== "string" || raw.length === 0) {
    throw new Error("Empty INFO response");
  }
  const line = raw.trim();
  const parts = line.split("|");
  if (parts[0] !== "OK") {
    throw new Error("Gateway INFO error: " + line);
  }
  if (parts.length !== 13) {
    throw new Error("Unrecognized INFO format (" + parts.length + " fields, expected 13)");
  }
  const strictInt = (value, name) => {
    if (!/^\d+$/.test(value)) throw new Error("INFO " + name + " is not a decimal integer: " + value);
    const n = Number.parseInt(value, 10);
    if (!Number.isSafeInteger(n)) throw new Error("INFO " + name + " out of range");
    return n;
  };
  const token = parts[1];
  const tokenCheck = validateDepinSectionToken(token);
  if (!tokenCheck.valid) throw new Error("INFO token invalid: " + tokenCheck.error);
  const port = strictInt(parts[2], "port");
  if (port < 1 || port > 65535) throw new Error("INFO port out of range: " + port);
  const reportedMaxRecipients = strictInt(parts[4], "maxRecipients");
  if (reportedMaxRecipients <= 0) {
    throw new Error("INFO maxRecipients invalid or zero; failing closed");
  }
  const maxMessageSize = strictInt(parts[5], "maxMessageSize");
  if (maxMessageSize <= 0) throw new Error("INFO maxMessageSize invalid");
  let poolPubKey = null;
  if (parts[12] && parts[12] !== "0") {
    poolPubKey = bytesToHex(parsePublicKey(parts[12]).bytes);
  }
  return {
    token,
    port,
    cipher: parts[3],
    maxRecipients: Math.min(reportedMaxRecipients, MAX_DEPIN_RECIPIENTS),
    maxMessageSize,
    messageExpiryHours: strictInt(parts[6], "messageExpiryHours"),
    maxPoolSizeMB: strictInt(parts[7], "maxPoolSizeMB"),
    messageCount: strictInt(parts[8], "messageCount"),
    memoryUsage: strictInt(parts[9], "memoryUsage"),
    oldestMessage: parts[10],
    newestMessage: parts[11],
    poolPubKey,
    raw: line
  };
}
async function getRemoteDepinPoolInfo({ host, port, transport }) {
  if (!transport || typeof transport.request !== "function") {
    throw new Error("transport with a request(host, port, payload) function is required");
  }
  const raw = await transport.request(host, port, "INFO");
  return parseDepinPoolInfo(raw);
}
async function buildDepinMessageForRemotePool(params) {
  const { host, port, transport, ...rest } = params;
  const poolInfo = await getRemoteDepinPoolInfo({ host, port, transport });
  if (!isDepinTokenInScope(rest.token, poolInfo.token)) {
    throw new Error(
      "token '" + rest.token + "' is not under the remote pool root '" + poolInfo.token + "'"
    );
  }
  const built = await buildDepinMessageForPool({
    ...rest,
    poolRoot: poolInfo.token,
    maxRecipients: poolInfo.maxRecipients
  });
  return { ...built, poolInfo };
}

// src/index.js
if (typeof globalThis !== "undefined") {
  globalThis.neuraiDepinMsg = {
    buildDepinMessage,
    buildDepinPreimage,
    assembleDepinMessage,
    isDepinTokenInScope,
    validateDepinSectionToken,
    getDepinTokenAncestors,
    parseDepinMessage,
    verifyDepinReceivedMessage,
    isPreAuthenticatedSentinel,
    decodeDepinReceiveResponse,
    decryptDepinReceivedMessage,
    validateAndDecryptDepinMessage,
    decryptDepinReceiveEncryptedPayload,
    resolveDepinRecipients,
    buildDepinMessageForPool,
    parseDepinPoolInfo,
    getRemoteDepinPoolInfo,
    buildDepinMessageForRemotePool,
    wrapMessageForServer,
    unwrapMessageFromServer,
    wifToHex,
    isWIF,
    MAX_DEPIN_RECIPIENTS,
    MAX_DEPIN_MESSAGE_SIZE,
    DEPIN_RECEIVE_MAX_LIMIT,
    MAX_DEPIN_TOKEN_LENGTH,
    utils: {
      hexToBytes,
      bytesToHex,
      normalizeHex,
      concatBytes,
      timingSafeEqual,
      sha256,
      doubleSha256,
      ripemd160,
      hash160,
      kdfSha256,
      base58Decode,
      base58CheckDecode,
      normalizePrivateKeyTo32Bytes,
      parsePublicKey,
      derivePublicKeyForms,
      privateKeyMatchesPublicKey,
      decodeP2PKHAddress,
      pubKeyMatchesAddress,
      normalizeNetwork,
      P2PKH_PREFIX,
      eciesEncrypt,
      serializeEciesMessage,
      deserializeEciesMessage,
      eciesDecrypt
    }
  };
}
