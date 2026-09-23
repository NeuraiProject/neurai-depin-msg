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
  DepinCapabilityError: () => DepinCapabilityError,
  DepinError: () => DepinError,
  DepinProtocolError: () => DepinProtocolError,
  DepinReplyAuthenticationError: () => DepinReplyAuthenticationError,
  DepinReplyDecryptionError: () => DepinReplyDecryptionError,
  MAX_DEPIN_MESSAGE_SIZE: () => MAX_DEPIN_MESSAGE_SIZE,
  MAX_DEPIN_RECIPIENTS: () => MAX_DEPIN_RECIPIENTS,
  MAX_DEPIN_TOKEN_LENGTH: () => MAX_DEPIN_TOKEN_LENGTH,
  NEURAI_MESSAGE_MAGIC: () => NEURAI_MESSAGE_MAGIC,
  P2PKH_PREFIX: () => P2PKH_PREFIX,
  PoolPinMismatchError: () => PoolPinMismatchError,
  _setDepinTestRng: () => _setDepinTestRng,
  assembleDepinMessage: () => assembleDepinMessage,
  assertIdentityCapabilities: () => assertIdentityCapabilities,
  base58CheckDecode: () => base58CheckDecode,
  base58CheckEncode: () => base58CheckEncode,
  base58Decode: () => base58Decode,
  base58Encode: () => base58Encode,
  base64Decode: () => base64Decode,
  base64Encode: () => base64Encode,
  buildDepinClearPreimage: () => buildDepinClearPreimage,
  buildDepinGetPreimage: () => buildDepinGetPreimage,
  buildDepinMessage: () => buildDepinMessage,
  buildDepinMessageForPool: () => buildDepinMessageForPool,
  buildDepinPreimage: () => buildDepinPreimage,
  buildDepinReplyPreimage: () => buildDepinReplyPreimage,
  buildDepinRequestPreimage: () => buildDepinRequestPreimage,
  bytesToHex: () => bytesToHex,
  clearDepinMessages: () => clearDepinMessages,
  concatBytes: () => concatBytes,
  createSoftwareIdentity: () => createSoftwareIdentity,
  decodeChallengeResult: () => decodeChallengeResult,
  decodeDepinPoolInfo: () => decodeDepinPoolInfo,
  decodeDepinReceiveResponse: () => decodeDepinReceiveResponse,
  decodeDepinRecipients: () => decodeDepinRecipients,
  decodeP2PKHAddress: () => decodeP2PKHAddress,
  decodePlainReply: () => decodePlainReply,
  decodeSubmitResult: () => decodeSubmitResult,
  decodeWIF: () => decodeWIF,
  decryptDepinReceiveEncryptedPayload: () => decryptDepinReceiveEncryptedPayload,
  decryptDepinReceivedMessage: () => decryptDepinReceivedMessage,
  derivePublicKeyForms: () => derivePublicKeyForms,
  deserializeEciesMessage: () => deserializeEciesMessage,
  doubleSha256: () => doubleSha256,
  eciesDecrypt: () => eciesDecrypt,
  eciesEncrypt: () => eciesEncrypt,
  getDepinPoolInfo: () => getDepinPoolInfo,
  getDepinTokenAncestors: () => getDepinTokenAncestors,
  hash160: () => hash160,
  hexToBytes: () => hexToBytes,
  isDepinTokenInScope: () => isDepinTokenInScope,
  isVerifiedDepinReply: () => isVerifiedDepinReply,
  isWIF: () => isWIF,
  kdfSha256: () => kdfSha256,
  listDepinSectionsPrivate: () => listDepinSectionsPrivate,
  listDepinSectionsPublic: () => listDepinSectionsPublic,
  neuraiSignedMessageHash: () => neuraiSignedMessageHash,
  normalizeHex: () => normalizeHex,
  normalizeNetwork: () => normalizeNetwork,
  normalizePrivateKeyTo32Bytes: () => normalizePrivateKeyTo32Bytes,
  openBoundReply: () => openBoundReply,
  parseDepinMessage: () => parseDepinMessage,
  parsePublicKey: () => parsePublicKey,
  poolKeyFingerprint: () => poolKeyFingerprint,
  privateKeyMatchesPublicKey: () => privateKeyMatchesPublicKey,
  pubKeyMatchesAddress: () => pubKeyMatchesAddress,
  receiveDepinMessages: () => receiveDepinMessages,
  recoverPublicKeyFromMessage: () => recoverPublicKeyFromMessage,
  requestDepinChallenge: () => requestDepinChallenge,
  resolveDepinRecipients: () => resolveDepinRecipients,
  ripemd160: () => ripemd160,
  serializeEciesMessage: () => serializeEciesMessage,
  sha256: () => sha256,
  signRecoverableMessage: () => signRecoverableMessage,
  submitDepinMessage: () => submitDepinMessage,
  timingSafeEqual: () => timingSafeEqual,
  unwrapMessageFromServer: () => unwrapMessageFromServer,
  validateAndDecryptDepinMessage: () => validateAndDecryptDepinMessage,
  validateDepinSectionToken: () => validateDepinSectionToken,
  verifyDepinReceivedMessage: () => verifyDepinReceivedMessage,
  verifyDepinReply: () => verifyDepinReply,
  verifyRecoverableMessage: () => verifyRecoverableMessage,
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
function base58Encode(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new Error("base58Encode expects Uint8Array");
  if (bytes.length === 0) return "";
  let leadingZeroes = 0;
  while (leadingZeroes < bytes.length && bytes[leadingZeroes] === 0) leadingZeroes++;
  if (leadingZeroes === bytes.length) return "1".repeat(leadingZeroes);
  const digits = [0];
  for (let i = leadingZeroes; i < bytes.length; i++) {
    const byte = bytes[i];
    let carry = byte;
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = carry / 58 | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = carry / 58 | 0;
    }
  }
  let out = "1".repeat(leadingZeroes);
  for (let i = digits.length - 1; i >= 0; i--) out += BASE58_ALPHABET[digits[i]];
  return out;
}
async function base58CheckEncode(version, payload) {
  const data = concatBytes(new Uint8Array([version]), payload);
  const checksum = (await doubleSha256(data)).slice(0, 4);
  return base58Encode(concatBytes(data, checksum));
}
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
var WITNESS_ADDRESS_ERROR = "DePIN requires a Legacy P2PKH address (neurai-key network 'xna-legacy' / 'xna-legacy-test'); witness addresses (nc1\u2026, pq1\u2026, nq1\u2026) are not accepted by the node";
var BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
var BECH32_CONST = 1;
var BECH32M_CONST = 734539939;
var WITNESS_HRPS = ["nc", "tnc", "pq", "tpq", "nq", "tnq"];
function bech32Polymod(values) {
  const GEN = [996825010, 642813549, 513874426, 1027748829, 705979059];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = (chk & 33554431) << 5 ^ v;
    for (let i = 0; i < 5; i++) {
      if (top >>> i & 1) chk ^= GEN[i];
    }
  }
  return chk >>> 0;
}
function inspectWitnessAddress(address) {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return null;
  const str = address.toLowerCase();
  const sep = str.lastIndexOf("1");
  if (sep < 1 || str.length - sep - 1 < 7) return null;
  const hrp = str.slice(0, sep);
  if (!WITNESS_HRPS.includes(hrp)) return null;
  const data = [];
  for (const ch of str.slice(sep + 1)) {
    const v = BECH32_CHARSET.indexOf(ch);
    if (v === -1) return null;
    data.push(v);
  }
  const expanded = [];
  for (let i = 0; i < hrp.length; i++) expanded.push(hrp.charCodeAt(i) >> 5);
  expanded.push(0);
  for (let i = 0; i < hrp.length; i++) expanded.push(hrp.charCodeAt(i) & 31);
  const check = bech32Polymod(expanded.concat(data));
  return {
    hrp,
    witnessVersion: data[0],
    checksumValid: check === BECH32_CONST || check === BECH32M_CONST
  };
}
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
  let decoded;
  try {
    decoded = await base58CheckDecode(address);
  } catch (err) {
    const witness = inspectWitnessAddress(address);
    if (witness === null) throw err;
    if (!witness.checksumValid) {
      throw new Error(
        "Address looks like a Bech32m witness address but its checksum is invalid; " + WITNESS_ADDRESS_ERROR
      );
    }
    throw new Error(
      "Unsupported witness v" + witness.witnessVersion + " address ('" + witness.hrp + "1\u2026'): " + WITNESS_ADDRESS_ERROR
    );
  }
  const { version, payload } = decoded;
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
  const fields = {
    token: params.token,
    senderAddress: params.senderAddress,
    timestamp: params.timestamp,
    messageTypeByte: messageType.byte,
    encryptedPayload
  };
  const messageDigest = await computeDepinMessageHashBytes(fields);
  return {
    encryptedPayloadHex: bytesToHex(encryptedPayload),
    messageDigest: messageDigest.slice(),
    messageDigestHex: bytesToHex(messageDigest),
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
    openPayload = null,
    requestedToken = null,
    limits = {},
    senderPubKey = null,
    resolveSenderPubKey = null
  } = options;
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
    result.authentication = "invalid";
    result.reason = "protocol-1-preauthenticated";
    return result;
  }
  if (!verification.signatureValid) {
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
  } else if (openPayload !== null) {
    if (typeof openPayload !== "function") {
      throw new Error("options.openPayload must be a function");
    }
    try {
      deserializeEciesMessage(norm.encryptedPayload);
    } catch (e) {
      result.ok = false;
      result.reason = "encrypted payload is malformed: " + e.message;
      return result;
    }
    try {
      const out = await openPayload(norm.encryptedPayload);
      if (out !== null && out !== void 0) {
        result.plaintext = typeof out === "string" ? out : new TextDecoder().decode(out);
      }
    } catch {
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
  let nextChallenge = null;
  let nextExpiresIn = null;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    if (typeof payload.next_challenge === "string" && /^[0-9a-f]{64}$/.test(payload.next_challenge)) {
      nextChallenge = payload.next_challenge;
      if (typeof payload.next_expires_in === "number") {
        nextExpiresIn = payload.next_expires_in;
      }
    }
  }
  return { messages, hasMore, wasEncrypted, nextChallenge, nextExpiresIn };
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

// src/errors.js
var DepinError = class extends Error {
  constructor(message, code, cause) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    if (cause !== void 0) this.cause = cause;
  }
};
var DepinProtocolError = class extends DepinError {
  constructor(message, cause) {
    super(message, "DEPIN_PROTOCOL", cause);
  }
};
var DepinReplyAuthenticationError = class extends DepinError {
  constructor(message, cause) {
    super(message, "DEPIN_REPLY_AUTH", cause);
  }
};
var DepinReplyDecryptionError = class extends DepinError {
  constructor(message, cause) {
    super(message, "DEPIN_REPLY_DECRYPT", cause);
  }
};
var PoolPinMismatchError = class extends DepinError {
  constructor(message, cause) {
    super(message, "DEPIN_PIN_MISMATCH", cause);
  }
};
var DepinCapabilityError = class extends DepinError {
  constructor(message, cause) {
    super(message, "DEPIN_CAPABILITY", cause);
  }
};

// src/signmessage.js
var import_secp256k14 = require("@noble/curves/secp256k1");
var import_sha2562 = require("@noble/hashes/sha256");
var NEURAI_MESSAGE_MAGIC = "Neurai Signed Message:\n";
var WIF_PREFIX = { mainnet: 128, test: 239 };
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64_LOOKUP = (() => {
  const table = new Int16Array(128).fill(-1);
  for (let i = 0; i < B64_ALPHABET.length; i++) table[B64_ALPHABET.charCodeAt(i)] = i;
  return table;
})();
function base64Encode(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new DepinProtocolError("base64Encode expects Uint8Array");
  }
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64_ALPHABET[b0 >> 2];
    out += B64_ALPHABET[(b0 & 3) << 4 | b1 >> 4];
    out += i + 1 < bytes.length ? B64_ALPHABET[(b1 & 15) << 2 | b2 >> 6] : "=";
    out += i + 2 < bytes.length ? B64_ALPHABET[b2 & 63] : "=";
  }
  return out;
}
function base64Decode(str) {
  if (typeof str !== "string" || str.length === 0 || str.length % 4 !== 0) {
    throw new DepinProtocolError("Invalid Base64: length must be a positive multiple of 4");
  }
  let padding = 0;
  if (str.endsWith("==")) padding = 2;
  else if (str.endsWith("=")) padding = 1;
  const body = str.slice(0, str.length - padding);
  if (body.includes("=")) {
    throw new DepinProtocolError("Invalid Base64: padding inside the data");
  }
  const out = new Uint8Array(str.length / 4 * 3 - padding);
  let outPos = 0;
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < body.length; i++) {
    const code = body.charCodeAt(i);
    const value = code < 128 ? B64_LOOKUP[code] : -1;
    if (value < 0) {
      throw new DepinProtocolError("Invalid Base64 character at position " + i);
    }
    buffer = buffer << 6 | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[outPos++] = buffer >> bits & 255;
    }
  }
  if (padding > 0 && (buffer & (1 << bits) - 1) !== 0) {
    throw new DepinProtocolError("Invalid Base64: non-canonical trailing bits");
  }
  return out;
}
function decodeWIF(wif) {
  if (typeof wif !== "string" || wif.length < 50) {
    throw new DepinProtocolError("Invalid WIF: not a WIF string");
  }
  const decoded = base58Decode(wif);
  if (decoded.length < 37) throw new DepinProtocolError("Invalid WIF: too short");
  const payload = decoded.slice(0, -4);
  const checksum = decoded.slice(-4);
  const hash = (0, import_sha2562.sha256)((0, import_sha2562.sha256)(payload));
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== hash[i]) {
      throw new DepinProtocolError("Invalid WIF: checksum mismatch");
    }
  }
  const version = payload[0];
  let network = null;
  if (version === WIF_PREFIX.mainnet) network = "mainnet";
  else if (version === WIF_PREFIX.test) network = "test";
  else throw new DepinProtocolError("Invalid WIF: unknown version byte " + version);
  let compressed;
  if (payload.length === 34 && payload[33] === 1) compressed = true;
  else if (payload.length === 33) compressed = false;
  else throw new DepinProtocolError("Invalid WIF: unexpected payload length " + payload.length);
  return { privateKey: payload.slice(1, 33), compressed, network };
}
function normalizeSigningKey(privateKeyOrWif) {
  if (typeof privateKeyOrWif !== "string" || privateKeyOrWif.length === 0) {
    throw new DepinProtocolError("Private key is required (compressed WIF or 64-hex)");
  }
  const asHex = normalizeHex(privateKeyOrWif);
  if (asHex && asHex.length === 64) {
    return { privateKey: hexToBytes(asHex), network: null };
  }
  const decoded = decodeWIF(privateKeyOrWif);
  if (!decoded.compressed) {
    throw new DepinProtocolError(
      "Uncompressed WIF rejected: protocol 2 addresses derive from compressed keys"
    );
  }
  return { privateKey: decoded.privateKey, network: decoded.network };
}
function neuraiSignedMessageHash(message) {
  if (typeof message !== "string") {
    throw new DepinProtocolError("Message to hash must be a string");
  }
  const data = concatBytes(serializeString(NEURAI_MESSAGE_MAGIC), serializeString(message));
  return (0, import_sha2562.sha256)((0, import_sha2562.sha256)(data));
}
function signRecoverableMessage(message, privateKeyOrCompressedWif) {
  const { privateKey } = normalizeSigningKey(privateKeyOrCompressedWif);
  const hash = neuraiSignedMessageHash(message);
  const signature = import_secp256k14.secp256k1.sign(hash, privateKey);
  if (typeof signature.recovery !== "number") {
    throw new DepinProtocolError("Signature recovery id unavailable");
  }
  const compact = signature.toCompactRawBytes();
  const header = 27 + signature.recovery + 4;
  const out = new Uint8Array(65);
  out[0] = header;
  out.set(compact, 1);
  return base64Encode(out);
}
function decodeRecoverableSignature(signatureBase64) {
  const bytes = base64Decode(signatureBase64);
  if (bytes.length !== 65) {
    throw new DepinProtocolError(
      "Recoverable signature must be 65 bytes; got " + bytes.length
    );
  }
  const header = bytes[0];
  if (header < 27 || header > 34) {
    throw new DepinProtocolError("Invalid recoverable signature header: " + header);
  }
  return {
    recovery: header - 27 & 3,
    compressed: header >= 31,
    compact: bytes.slice(1)
  };
}
function recoverPublicKeyFromMessage(message, signatureBase64) {
  const { recovery, compressed, compact } = decodeRecoverableSignature(signatureBase64);
  const hash = neuraiSignedMessageHash(message);
  let point;
  try {
    const sig = import_secp256k14.secp256k1.Signature.fromCompact(compact).addRecoveryBit(recovery);
    point = sig.recoverPublicKey(hash);
  } catch (e) {
    throw new DepinProtocolError(
      "Public key recovery failed: " + (e && e.message ? e.message : e),
      e
    );
  }
  return bytesToHex(point.toRawBytes(compressed));
}
function verifyRecoverableMessage(message, signatureBase64, expectedPublicKey) {
  const expected = parsePublicKey(expectedPublicKey);
  let recoveredHex;
  try {
    recoveredHex = recoverPublicKeyFromMessage(message, signatureBase64);
  } catch (e) {
    if (e instanceof DepinProtocolError && /recovery failed/i.test(e.message)) {
      return false;
    }
    throw e;
  }
  return parsePublicKey(recoveredHex).pointId === expected.pointId;
}

// src/depin-reply.js
var import_sha2563 = require("@noble/hashes/sha256");
var MAX_REPLY_HEX_CHARS = 32 * 1024 * 1024;
var MAX_DECODED_JSON_BYTES = 16 * 1024 * 1024;
var VERIFIED_REPLIES = /* @__PURE__ */ new WeakSet();
function isVerifiedDepinReply(value) {
  return Boolean(value) && typeof value === "object" && VERIFIED_REPLIES.has(value);
}
function sha256HexOfAscii(str) {
  return bytesToHex((0, import_sha2563.sha256)(new TextEncoder().encode(str)));
}
function assertPreimageComponent(value, name) {
  if (typeof value !== "string") {
    throw new DepinProtocolError(name + " must be a string");
  }
  if (value.includes("|")) {
    throw new DepinProtocolError(name + " must not contain '|'");
  }
  return value;
}
function buildDepinReplyPreimage({ method, token = "", address = "", challenge = "", replyHex }) {
  assertPreimageComponent(method, "method");
  if (!/^[a-z0-9]+$/.test(method)) {
    throw new DepinProtocolError("method must be a lowercase RPC name");
  }
  assertPreimageComponent(token, "token");
  assertPreimageComponent(address, "address");
  assertPreimageComponent(challenge, "challenge");
  if (typeof replyHex !== "string" || replyHex.length === 0) {
    throw new DepinProtocolError("replyHex is required");
  }
  return "DEPIN-RESP|" + method + "|" + token + "|" + address + "|" + challenge + "|" + sha256HexOfAscii(replyHex);
}
function validateReplyShape(reply) {
  if (!reply || typeof reply !== "object" || Array.isArray(reply)) {
    throw new DepinProtocolError("DePIN reply must be an object");
  }
  const hasBody = typeof reply.body === "string";
  const hasEncrypted = typeof reply.encrypted === "string";
  if (hasBody === hasEncrypted) {
    throw new DepinProtocolError(
      "DePIN reply must carry exactly one of 'body' or 'encrypted'"
    );
  }
  if (typeof reply.poolsig !== "string" || reply.poolsig.length === 0) {
    throw new DepinProtocolError("DePIN reply is missing poolsig");
  }
  if (reply.poolsig.length !== 88) {
    throw new DepinProtocolError("poolsig must be exactly 88 Base64 characters");
  }
  let compactSignature;
  try {
    compactSignature = base64Decode(reply.poolsig);
  } catch (e) {
    throw new DepinProtocolError("poolsig must be canonical Base64", e);
  }
  if (compactSignature.length !== 65) {
    throw new DepinProtocolError("poolsig must decode to exactly 65 bytes");
  }
  if (compactSignature[0] < 31 || compactSignature[0] > 34) {
    throw new DepinProtocolError("poolsig must declare a compressed key (header 31..34)");
  }
  const replyHex = hasBody ? reply.body : reply.encrypted;
  if (replyHex.length === 0 || replyHex.length > MAX_REPLY_HEX_CHARS) {
    throw new DepinProtocolError("DePIN reply hex is empty or exceeds the size limit");
  }
  if (replyHex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(replyHex)) {
    throw new DepinProtocolError("DePIN reply hex must be canonical lowercase hex");
  }
  return { kind: hasBody ? "plain" : "bound", replyHex };
}
function verifyDepinReply({ reply, method, token = "", address = "", challenge = "", poolPublicKey }) {
  const { kind, replyHex } = validateReplyShape(reply);
  if (!poolPublicKey) {
    throw new DepinProtocolError("poolPublicKey is required to verify a DePIN reply");
  }
  const expected = parsePublicKey(poolPublicKey);
  if (expected.bytes.length !== 33) {
    throw new DepinProtocolError("poolPublicKey must be a compressed 33-byte SEC1 key");
  }
  const preimage = buildDepinReplyPreimage({ method, token, address, challenge, replyHex });
  let recovered;
  try {
    recovered = recoverPublicKeyFromMessage(preimage, reply.poolsig);
  } catch (e) {
    throw new DepinReplyAuthenticationError(
      "poolsig is malformed or unrecoverable for " + method,
      e
    );
  }
  if (parsePublicKey(recovered).pointId !== expected.pointId) {
    throw new DepinReplyAuthenticationError(
      "poolsig for " + method + " does not verify against the pinned pool key"
    );
  }
  const verifiedReply = {
    kind,
    replyHex,
    method,
    token,
    address,
    challenge,
    poolPublicKey: expected.pointId
  };
  VERIFIED_REPLIES.add(verifiedReply);
  return Object.freeze(verifiedReply);
}
function parseJsonBytes(bytes, context) {
  if (bytes.length > MAX_DECODED_JSON_BYTES) {
    throw new DepinProtocolError(context + ": decoded JSON exceeds the size limit");
  }
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (e) {
    throw new DepinProtocolError(context + ": decoded bytes are not valid UTF-8", e);
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch (e) {
    throw new DepinProtocolError(context + ": decoded text is not valid JSON", e);
  }
  if (!value || typeof value !== "object") {
    throw new DepinProtocolError(context + ": decoded JSON is not an object");
  }
  return value;
}
function decodePlainReply(verifiedReply) {
  if (!isVerifiedDepinReply(verifiedReply)) {
    throw new DepinProtocolError("decodePlainReply requires a verified reply");
  }
  if (verifiedReply.kind !== "plain") {
    throw new DepinProtocolError("decodePlainReply requires a plain reply");
  }
  return parseJsonBytes(hexToBytes(verifiedReply.replyHex), verifiedReply.method);
}
async function openBoundReply(verifiedReply, opener) {
  if (!isVerifiedDepinReply(verifiedReply)) {
    throw new DepinProtocolError("openBoundReply requires a verified reply");
  }
  if (verifiedReply.kind !== "bound") {
    throw new DepinProtocolError("openBoundReply requires a bound reply");
  }
  if (!opener) {
    throw new DepinProtocolError("openBoundReply requires a private key or an openReply callback");
  }
  let plaintext;
  if (typeof opener === "function") {
    let out;
    try {
      out = await opener(verifiedReply.replyHex);
    } catch (e) {
      throw new DepinReplyDecryptionError(
        "openReply callback failed for " + verifiedReply.method,
        e
      );
    }
    if (typeof out === "string") plaintext = new TextEncoder().encode(out);
    else if (out instanceof Uint8Array) plaintext = out;
    else {
      throw new DepinReplyDecryptionError(
        "openReply callback must return bytes or a string"
      );
    }
  } else {
    const privKey = await normalizePrivateKeyTo32Bytes(opener);
    let message;
    try {
      message = deserializeEciesMessage(hexToBytes(verifiedReply.replyHex));
    } catch (e) {
      throw new DepinReplyDecryptionError(
        "bound reply envelope does not deserialize for " + verifiedReply.method,
        e
      );
    }
    plaintext = await eciesDecrypt(message, privKey);
    if (plaintext === null) {
      throw new DepinReplyDecryptionError(
        "bound reply for " + verifiedReply.method + " is not encrypted for this key or failed authentication"
      );
    }
  }
  return parseJsonBytes(plaintext, verifiedReply.method);
}
function canonicalPubKeyHex(pubKey) {
  return parsePublicKey(pubKey).pointId;
}
function poolKeyFingerprint(pubKey) {
  const canonical = canonicalPubKeyHex(pubKey);
  const digest = bytesToHex((0, import_sha2563.sha256)(hexToBytes(canonical)));
  return digest.slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");
}
function readUntrustedBodyJson(reply) {
  const { kind, replyHex } = validateReplyShape(reply);
  if (kind !== "plain") {
    throw new DepinProtocolError("depingetmsginfo reply must be a plain reply");
  }
  return { untrustedBody: parseJsonBytes(hexToBytes(replyHex), "depingetmsginfo (untrusted)") };
}
async function checkAnnouncedPoolIdentity(info, poolPublicKey, network) {
  const announcedKey = info.depinpoolpkey;
  if (typeof announcedKey !== "string" || canonicalPubKeyHex(announcedKey) !== canonicalPubKeyHex(poolPublicKey)) {
    throw new PoolPinMismatchError(
      "Announced depinpoolpkey does not match the verified pool key"
    );
  }
  if (typeof info.depinpoolkeyaddress === "string" && info.depinpoolkeyaddress.length > 0) {
    const { payload } = await decodeP2PKHAddress(info.depinpoolkeyaddress, network ?? null);
    const keyHash = await hash160(parsePublicKey(announcedKey).bytes);
    if (bytesToHex(keyHash) !== bytesToHex(payload)) {
      throw new PoolPinMismatchError(
        "depinpoolkeyaddress does not correspond to depinpoolpkey"
      );
    }
  }
}
function validatePoolInfoShape(info) {
  if (info.protocol !== 2) {
    throw new DepinProtocolError(
      "Pool announces protocol " + JSON.stringify(info.protocol) + "; this library requires protocol 2"
    );
  }
  const tokenCheck = validateDepinSectionToken(info.token);
  if (!tokenCheck.valid) {
    throw new DepinProtocolError("Pool root token invalid: " + tokenCheck.error);
  }
  if (!Number.isInteger(info.maxrecipients) || info.maxrecipients < 1) {
    throw new DepinProtocolError("Pool maxrecipients invalid");
  }
}
async function decodeDepinPoolInfo({ reply, trust, serviceId, network }) {
  if (!trust || typeof trust !== "object" || typeof trust.mode !== "string") {
    throw new DepinProtocolError("trust must be an object with a 'mode'");
  }
  if (typeof serviceId !== "string" || serviceId.length === 0) {
    throw new DepinProtocolError("serviceId is required (endpoint identity)");
  }
  if (trust.mode === "pinned") {
    const pin = trust.pin;
    if (!pin || typeof pin.serviceId !== "string" || typeof pin.poolRoot !== "string" || typeof pin.poolPublicKey !== "string") {
      throw new DepinProtocolError("pinned trust requires { serviceId, poolRoot, poolPublicKey }");
    }
    if (pin.serviceId !== serviceId) {
      throw new PoolPinMismatchError(
        "Reply comes from a different service than the pinned one"
      );
    }
    const verified = verifyDepinReply({
      reply,
      method: "depingetmsginfo",
      token: pin.poolRoot,
      poolPublicKey: pin.poolPublicKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    if (info.token !== pin.poolRoot) {
      throw new PoolPinMismatchError("Announced pool root does not match the pinned root");
    }
    await checkAnnouncedPoolIdentity(info, pin.poolPublicKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: pin.poolRoot, poolPublicKey: canonicalPubKeyHex(pin.poolPublicKey) },
      trust: "pinned",
      fingerprint: poolKeyFingerprint(pin.poolPublicKey)
    };
  }
  if (trust.mode === "key") {
    if (typeof trust.poolPublicKey !== "string") {
      throw new DepinProtocolError("key trust requires poolPublicKey");
    }
    const { untrustedBody } = readUntrustedBodyJson(reply);
    const untrustedToken = untrustedBody.token;
    if (typeof untrustedToken !== "string") {
      throw new DepinProtocolError("depingetmsginfo body has no token to bind the preimage");
    }
    const verified = verifyDepinReply({
      reply,
      method: "depingetmsginfo",
      token: untrustedToken,
      poolPublicKey: trust.poolPublicKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    await checkAnnouncedPoolIdentity(info, trust.poolPublicKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: info.token, poolPublicKey: canonicalPubKeyHex(trust.poolPublicKey) },
      trust: "key",
      fingerprint: poolKeyFingerprint(trust.poolPublicKey)
    };
  }
  if (trust.mode === "tofu") {
    const { untrustedBody } = readUntrustedBodyJson(reply);
    const announcedKey = untrustedBody.depinpoolpkey;
    const untrustedToken = untrustedBody.token;
    if (typeof announcedKey !== "string" || typeof untrustedToken !== "string") {
      throw new DepinProtocolError(
        "depingetmsginfo body lacks depinpoolpkey/token for TOFU"
      );
    }
    const verified = verifyDepinReply({
      reply,
      method: "depingetmsginfo",
      token: untrustedToken,
      poolPublicKey: announcedKey
    });
    const info = decodePlainReply(verified);
    validatePoolInfoShape(info);
    await checkAnnouncedPoolIdentity(info, announcedKey, network);
    return {
      info,
      pin: { serviceId, poolRoot: info.token, poolPublicKey: canonicalPubKeyHex(announcedKey) },
      trust: "tofu",
      fingerprint: poolKeyFingerprint(announcedKey)
    };
  }
  throw new DepinProtocolError("Unknown trust mode: " + trust.mode);
}

// src/identity.js
var import_secp256k15 = require("@noble/curves/secp256k1");
async function createSoftwareIdentity({ privateKey, network, address } = {}) {
  if (!privateKey) {
    throw new DepinProtocolError("privateKey (compressed WIF or 64-hex) is required");
  }
  if (!network) {
    throw new DepinProtocolError("network is required ('mainnet' or 'test')");
  }
  const net = normalizeNetwork(network);
  const { privateKey: keyBytes, network: wifNetwork } = normalizeSigningKey(privateKey);
  if (wifNetwork !== null && wifNetwork !== net) {
    throw new DepinProtocolError(
      "WIF network (" + wifNetwork + ") does not match the requested network (" + net + ")"
    );
  }
  const publicKeyBytes = import_secp256k15.secp256k1.getPublicKey(keyBytes, true);
  const publicKey = bytesToHex(publicKeyBytes);
  const keyHash = await hash160(publicKeyBytes);
  let finalAddress;
  if (address !== void 0 && address !== null) {
    const { payload } = await decodeP2PKHAddress(address, net);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new DepinProtocolError(
        "address does not correspond to the compressed public key of this private key"
      );
    }
    finalAddress = address;
  } else {
    finalAddress = await base58CheckEncode(P2PKH_PREFIX[net], keyHash);
  }
  return {
    address: finalAddress,
    publicKey,
    network: net,
    signMessage: (preimage) => signRecoverableMessage(preimage, bytesToHex(keyBytes)),
    signDigest: (digest) => {
      if (!(digest instanceof Uint8Array) || digest.length !== 32) {
        throw new DepinProtocolError("signDigest expects a 32-byte digest");
      }
      return import_secp256k15.secp256k1.sign(digest, keyBytes).toDERRawBytes();
    },
    openReply: async (encryptedHex) => {
      let message;
      try {
        message = deserializeEciesMessage(hexToBytes(encryptedHex));
      } catch (e) {
        throw new DepinReplyDecryptionError("envelope does not deserialize", e);
      }
      const plaintext = await eciesDecrypt(message, keyBytes);
      if (plaintext === null) {
        throw new DepinReplyDecryptionError(
          "envelope is not encrypted for this identity or failed authentication"
        );
      }
      return plaintext;
    }
  };
}
function assertIdentityCapabilities(identity, capabilities) {
  if (!identity || typeof identity !== "object") {
    throw new DepinCapabilityError("identity object is required");
  }
  if (typeof identity.address !== "string" || identity.address.length === 0) {
    throw new DepinCapabilityError("identity.address is required");
  }
  for (const capability of capabilities) {
    if (typeof identity[capability] !== "function") {
      throw new DepinCapabilityError(
        "identity is missing the " + capability + " capability required by this flow"
      );
    }
  }
}

// src/depin-client.js
var CHALLENGE_HEX = /^[0-9a-f]{64}$/;
var RECEIVE_MAX_LIMIT = 1e3;
function assertComponent(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new DepinProtocolError(name + " is required");
  }
  if (value.includes("|")) {
    throw new DepinProtocolError(name + " must not contain '|'");
  }
  return value;
}
function assertToken(token, name = "token") {
  const check = validateDepinSectionToken(token);
  if (!check.valid) throw new DepinProtocolError(name + " invalid: " + check.error);
  return token;
}
function assertChallenge(challenge) {
  if (typeof challenge !== "string" || !CHALLENGE_HEX.test(challenge)) {
    throw new DepinProtocolError("challenge must be 64 lowercase hex chars");
  }
  return challenge;
}
function assertTimestampMs(value) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new DepinProtocolError("timestampMs must be a positive safe integer");
  }
  return value;
}
function buildDepinRequestPreimage({ type = "receive", token, address, timestampMs }) {
  if (type !== "receive" && type !== "admin") {
    throw new DepinProtocolError("type must be 'receive' or 'admin'");
  }
  assertToken(token);
  assertComponent(address, "address");
  assertTimestampMs(timestampMs);
  return "DEPIN-REQ|" + type + "|" + token + "|" + address + "|" + timestampMs;
}
function buildDepinGetPreimage({ token, address, challenge }) {
  assertToken(token);
  assertComponent(address, "address");
  assertChallenge(challenge);
  return "DEPIN-GET|" + token + "|" + address + "|" + challenge;
}
function buildDepinClearPreimage({ scope, address, challenge }) {
  assertToken(scope, "scope");
  assertComponent(address, "address");
  assertChallenge(challenge);
  return "DEPIN-CLEAR|" + scope + "|" + address + "|" + challenge;
}
var lastTimestampByAddress = /* @__PURE__ */ new Map();
function nextTimestampMs(address, clock) {
  const now = clock ? clock() : Date.now();
  assertTimestampMs(now);
  const last = lastTimestampByAddress.get(address) ?? 0;
  const next = Math.max(now, last + 1);
  lastTimestampByAddress.set(address, next);
  return next;
}
function assertRpc(rpc) {
  if (!rpc || typeof rpc.call !== "function") {
    throw new DepinProtocolError("rpc with a call(method, params) function is required");
  }
}
function assertPoolKey(poolPublicKey) {
  if (!poolPublicKey) {
    throw new DepinProtocolError("poolPublicKey (the pinned pool key) is required");
  }
  return poolPublicKey;
}
async function getDepinPoolInfo({ rpc, serviceId, trust, network }) {
  assertRpc(rpc);
  const reply = await rpc.call("depingetmsginfo", []);
  return decodeDepinPoolInfo({ reply, trust, serviceId, network });
}
async function decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, network = null }) {
  if (!body || typeof body !== "object") {
    throw new DepinProtocolError("depingetancestorrecipients returned no result");
  }
  if (body.token !== token) {
    throw new DepinProtocolError(
      "Response token '" + body.token + "' does not match requested '" + token + "'"
    );
  }
  if (body.stop_at !== poolRoot) {
    throw new DepinProtocolError(
      "Response stop_at '" + body.stop_at + "' does not match pool root '" + poolRoot + "'"
    );
  }
  if (body.truncated !== false) {
    throw new DepinProtocolError(
      "Recipient list is truncated or incomplete; refusing to build a partial group"
    );
  }
  if (!Array.isArray(body.recipients)) {
    throw new DepinProtocolError("Response recipients is not an array");
  }
  if (typeof body.returned === "number" && body.returned !== body.recipients.length) {
    throw new DepinProtocolError("Response returned count does not match recipients length");
  }
  if (!Array.isArray(body.ancestors) || body.ancestors[0] !== token) {
    throw new DepinProtocolError("Response ancestors is inconsistent with the requested token");
  }
  const senderKey = parsePublicKey(senderPubKey);
  const byPoint = /* @__PURE__ */ new Map();
  for (const entry of body.recipients) {
    if (!entry || typeof entry.address !== "string" || typeof entry.pubkey !== "string") {
      throw new DepinProtocolError("Malformed recipient entry in response");
    }
    const parsed = parsePublicKey(entry.pubkey);
    const { payload } = await decodeP2PKHAddress(entry.address, network);
    const keyHash = await hash160(parsed.bytes);
    if (!timingSafeEqual(keyHash, payload)) {
      throw new DepinProtocolError(
        "Recipient pubkey does not match its address '" + entry.address + "'"
      );
    }
    if (!byPoint.has(parsed.pointId)) byPoint.set(parsed.pointId, parsed.bytes);
  }
  const senderIncludedInHolders = byPoint.has(senderKey.pointId);
  const finalCount = byPoint.size + (senderIncludedInHolders ? 0 : 1);
  if (finalCount > maxRecipients) {
    throw new DepinProtocolError(
      "Final recipient map would have " + finalCount + " entries (sender included), above the pool limit of " + maxRecipients
    );
  }
  return {
    recipientPubKeys: Array.from(byPoint.values()).map(bytesToHex),
    recipientCount: finalCount,
    senderIncludedInHolders,
    ancestors: body.ancestors,
    maxRecipients,
    skipped: {
      noPubKey: body.skipped_no_pubkey ?? null,
      noPubKeyComplete: body.skipped_no_pubkey_complete ?? null,
      restricted: body.skipped_restricted ?? null,
      restrictedComplete: body.skipped_restricted_complete ?? null
    }
  };
}
async function resolveDepinRecipients(params) {
  const { rpc, token, poolRoot, maxRecipients, senderPubKey, poolPublicKey, network = null } = params;
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertToken(token);
  assertToken(poolRoot, "poolRoot");
  if (!isDepinTokenInScope(token, poolRoot)) {
    throw new DepinProtocolError("token '" + token + "' is not under pool root '" + poolRoot + "'");
  }
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > MAX_DEPIN_RECIPIENTS) {
    throw new DepinProtocolError(
      "maxRecipients must be an integer between 1 and " + MAX_DEPIN_RECIPIENTS
    );
  }
  if (!senderPubKey) {
    throw new DepinProtocolError("senderPubKey is required to size the final recipient map");
  }
  const reply = await rpc.call("depingetancestorrecipients", [token, maxRecipients + 1, poolRoot]);
  const verified = verifyDepinReply({
    reply,
    method: "depingetancestorrecipients",
    token,
    poolPublicKey
  });
  const body = decodePlainReply(verified);
  return decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, network });
}
async function buildDepinMessageForPool(params) {
  const {
    rpc,
    token,
    poolRoot,
    maxRecipients,
    poolPublicKey,
    network,
    identity = null,
    ...buildParams
  } = params;
  let senderPubKey = buildParams.senderPubKey;
  let senderAddress = buildParams.senderAddress;
  if (identity !== null) {
    assertIdentityCapabilities(identity, ["signDigest"]);
    if (!network) {
      throw new DepinProtocolError("network is required for identity-based publishing");
    }
    if (typeof identity.publicKey !== "string" || identity.publicKey.length === 0) {
      throw new DepinProtocolError("identity.publicKey is required to publish a message");
    }
    const identityKey = parsePublicKey(identity.publicKey);
    if (identityKey.bytes.length !== 33) {
      throw new DepinProtocolError("identity.publicKey must be a compressed 33-byte SEC1 key");
    }
    const { payload: identityAddressHash } = await decodeP2PKHAddress(identity.address, network);
    const identityKeyHash = await hash160(identityKey.bytes);
    if (!timingSafeEqual(identityAddressHash, identityKeyHash)) {
      throw new DepinProtocolError("identity.publicKey does not correspond to identity.address");
    }
    if (buildParams.privateKey !== void 0) {
      throw new DepinProtocolError("Provide either identity or privateKey, not both");
    }
    if (senderPubKey !== void 0 && parsePublicKey(senderPubKey).pointId !== identityKey.pointId) {
      throw new DepinProtocolError("senderPubKey does not match identity.publicKey");
    }
    if (senderAddress !== void 0 && senderAddress !== identity.address) {
      throw new DepinProtocolError("senderAddress does not match identity.address");
    }
    senderPubKey = identity.publicKey;
    senderAddress = identity.address;
  }
  const resolution = await resolveDepinRecipients({
    rpc,
    token,
    poolRoot,
    maxRecipients,
    poolPublicKey,
    network,
    senderPubKey
  });
  if (identity !== null) {
    const preimage = await buildDepinPreimage({
      ...buildParams,
      network,
      token,
      senderAddress,
      senderPubKey,
      recipientPubKeys: resolution.recipientPubKeys
    });
    const signature = await identity.signDigest(preimage.messageDigest.slice(), {
      kind: "message",
      token,
      senderAddress,
      timestamp: buildParams.timestamp,
      messageType: preimage.messageTypeByte,
      encryptedPayloadHex: preimage.encryptedPayloadHex
    });
    const built2 = await assembleDepinMessage({
      token,
      senderAddress,
      timestamp: buildParams.timestamp,
      messageType: preimage.messageType,
      encryptedPayloadHex: preimage.encryptedPayloadHex
    }, signature);
    const parsed = await parseDepinMessage(built2.hex);
    const verification = await verifyDepinReceivedMessage(parsed, {
      network,
      senderPubKey
    });
    if (!verification.signatureValid) {
      throw new DepinProtocolError(
        "signDigest returned a signature that does not verify for identity.publicKey"
      );
    }
    return { ...built2, recipientCount: preimage.recipientCount, resolution };
  }
  const built = await buildDepinMessage({
    ...buildParams,
    network,
    token,
    senderAddress,
    senderPubKey,
    recipientPubKeys: resolution.recipientPubKeys
  });
  return { ...built, resolution };
}
function decodeChallengeResult(opened, expectedType) {
  if (!opened || typeof opened !== "object" || typeof opened.challenge !== "string" || !CHALLENGE_HEX.test(opened.challenge)) {
    throw new DepinProtocolError("depinchallenge reply has no valid challenge");
  }
  if (typeof opened.type === "string" && opened.type !== expectedType) {
    throw new DepinProtocolError(
      "depinchallenge reply type '" + opened.type + "' does not match requested '" + expectedType + "'"
    );
  }
  return {
    challenge: opened.challenge,
    expiresIn: typeof opened.expires_in === "number" ? opened.expires_in : null,
    type: opened.type ?? expectedType
  };
}
async function requestDepinChallenge({ rpc, identity, token, poolPublicKey, type = "receive", timestampMs, clock }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ["signMessage", "openReply"]);
  assertToken(token);
  const t = timestampMs !== void 0 ? assertTimestampMs(timestampMs) : nextTimestampMs(identity.address, clock);
  const preimage = buildDepinRequestPreimage({
    type,
    token,
    address: identity.address,
    timestampMs: t
  });
  const signature = await identity.signMessage(preimage, {
    kind: "request",
    type,
    token,
    address: identity.address,
    timestampMs: t
  });
  const reply = await rpc.call("depinchallenge", [token, identity.address, t, signature, type]);
  const verified = verifyDepinReply({
    reply,
    method: "depinchallenge",
    token,
    address: identity.address,
    challenge: "",
    poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  return { ...decodeChallengeResult(opened, type), timestampMs: t };
}
async function receiveDepinMessages(params) {
  const {
    rpc,
    identity,
    token,
    challenge,
    poolPublicKey,
    afterHash,
    limit,
    timestamp,
    network,
    resolveSenderPubKey,
    requestedToken,
    limits
  } = params;
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ["signMessage", "openReply"]);
  assertToken(token);
  assertChallenge(challenge);
  if (!network) {
    throw new DepinProtocolError("network is required ('mainnet' or 'test')");
  }
  if (afterHash !== void 0 && afterHash !== "" && (typeof afterHash !== "string" || !CHALLENGE_HEX.test(afterHash))) {
    throw new DepinProtocolError("afterHash must be empty or 64 lowercase hex chars");
  }
  if (limit !== void 0 && (!Number.isInteger(limit) || limit < 0 || limit > RECEIVE_MAX_LIMIT)) {
    throw new DepinProtocolError("limit must be an integer between 0 and " + RECEIVE_MAX_LIMIT);
  }
  if (timestamp !== void 0 && (!Number.isInteger(timestamp) || timestamp < 0)) {
    throw new DepinProtocolError("timestamp must be a non-negative integer (Unix seconds)");
  }
  const preimage = buildDepinGetPreimage({ token, address: identity.address, challenge });
  const signature = await identity.signMessage(preimage, {
    kind: "get",
    token,
    address: identity.address,
    challenge
  });
  const rpcParams = [token, identity.address, challenge, signature];
  const tail = [timestamp, afterHash, limit];
  let lastProvided = -1;
  for (let i = 0; i < tail.length; i++) if (tail[i] !== void 0) lastProvided = i;
  for (let i = 0; i <= lastProvided; i++) rpcParams.push(tail[i] === void 0 ? null : tail[i]);
  const reply = await rpc.call("depinreceivemsg", rpcParams);
  const verified = verifyDepinReply({
    reply,
    method: "depinreceivemsg",
    token,
    address: identity.address,
    challenge,
    poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  const decoded = await decodeDepinReceiveResponse(opened, {
    network,
    // openPayload hands over raw payload bytes; identity.openReply takes the
    // hex form (same as bound replies), so bridge the encoding here.
    openPayload: (payloadBytes) => identity.openReply(bytesToHex(payloadBytes)),
    requestedToken: requestedToken ?? token,
    resolveSenderPubKey,
    limits
  });
  return {
    messages: decoded.messages,
    hasMore: decoded.hasMore,
    nextChallenge: decoded.nextChallenge,
    nextExpiresIn: decoded.nextExpiresIn,
    raw: opened
  };
}
function decodeSectionsResult(opened) {
  if (!opened || typeof opened !== "object" || !Array.isArray(opened.sections)) {
    throw new DepinProtocolError("depinlistsections reply has no sections array");
  }
  for (const section of opened.sections) {
    if (!section || typeof section.name !== "string") {
      throw new DepinProtocolError("depinlistsections reply has a malformed section entry");
    }
  }
  return opened;
}
async function listDepinSectionsPublic({ rpc, poolRoot, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertToken(poolRoot, "poolRoot");
  const reply = await rpc.call("depinlistsections", []);
  const verified = verifyDepinReply({
    reply,
    method: "depinlistsections",
    token: poolRoot,
    poolPublicKey
  });
  const body = decodePlainReply(verified);
  return { sections: decodeSectionsResult(body).sections };
}
async function listDepinSectionsPrivate({ rpc, identity, scope, challenge, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ["signMessage", "openReply"]);
  assertToken(scope, "scope");
  assertChallenge(challenge);
  const preimage = buildDepinGetPreimage({ token: scope, address: identity.address, challenge });
  const signature = await identity.signMessage(preimage, {
    kind: "get",
    token: scope,
    address: identity.address,
    challenge
  });
  const reply = await rpc.call("depinlistsections", [identity.address, scope, challenge, signature]);
  const verified = verifyDepinReply({
    reply,
    method: "depinlistsections",
    token: scope,
    address: identity.address,
    challenge,
    poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  const decoded = decodeSectionsResult(opened);
  return {
    sections: decoded.sections,
    nextChallenge: typeof decoded.next_challenge === "string" ? decoded.next_challenge : null,
    nextExpiresIn: typeof decoded.next_expires_in === "number" ? decoded.next_expires_in : null
  };
}
async function clearDepinMessages({ rpc, identity, scope = "", poolRoot, challenge, poolPublicKey, mode }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ["signMessage", "openReply"]);
  assertChallenge(challenge);
  let effectiveScope;
  if (scope === "") {
    assertToken(poolRoot, "poolRoot (required when scope is empty)");
    effectiveScope = poolRoot;
  } else {
    assertToken(scope, "scope");
    effectiveScope = scope;
  }
  if (mode !== void 0 && mode !== "all" && (!Number.isInteger(mode) || mode < 0)) {
    throw new DepinProtocolError("mode must be omitted, 'all' or a non-negative integer of hours");
  }
  const preimage = buildDepinClearPreimage({
    scope: effectiveScope,
    address: identity.address,
    challenge
  });
  const signature = await identity.signMessage(preimage, {
    kind: "clear",
    scope: effectiveScope,
    address: identity.address,
    challenge
  });
  const rpcParams = [scope, identity.address, challenge, signature];
  if (mode !== void 0) rpcParams.push(mode);
  const reply = await rpc.call("depinclearmsg", rpcParams);
  const verified = verifyDepinReply({
    reply,
    method: "depinclearmsg",
    token: effectiveScope,
    address: identity.address,
    challenge,
    poolPublicKey
  });
  return openBoundReply(verified, identity.openReply);
}
function decodeSubmitResult(opened) {
  if (!opened || typeof opened !== "object" || opened.result !== "success") {
    throw new DepinProtocolError(
      "depinsubmitmsg reply did not confirm success"
    );
  }
  if (typeof opened.hash !== "string" || !CHALLENGE_HEX.test(opened.hash)) {
    throw new DepinProtocolError("depinsubmitmsg reply has no valid message hash");
  }
  return opened;
}
async function submitDepinMessage({ rpc, identity, messageHex, poolPublicKey }) {
  assertRpc(rpc);
  assertPoolKey(poolPublicKey);
  assertIdentityCapabilities(identity, ["openReply"]);
  if (typeof messageHex !== "string" || messageHex.length === 0) {
    throw new DepinProtocolError("messageHex is required");
  }
  const parsed = await parseDepinMessage(messageHex);
  if (parsed.senderAddress !== identity.address) {
    throw new DepinProtocolError(
      "message senderAddress '" + parsed.senderAddress + "' does not match the identity address '" + identity.address + "'"
    );
  }
  const envelope = await wrapMessageForServer(messageHex, poolPublicKey, identity.address);
  const reply = await rpc.call("depinsubmitmsg", [envelope]);
  const verified = verifyDepinReply({
    reply,
    method: "depinsubmitmsg",
    token: parsed.token,
    address: identity.address,
    challenge: "",
    poolPublicKey
  });
  const opened = await openBoundReply(verified, identity.openReply);
  return decodeSubmitResult(opened);
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
    decodeDepinReceiveResponse,
    decryptDepinReceivedMessage,
    validateAndDecryptDepinMessage,
    decryptDepinReceiveEncryptedPayload,
    NEURAI_MESSAGE_MAGIC,
    neuraiSignedMessageHash,
    signRecoverableMessage,
    recoverPublicKeyFromMessage,
    verifyRecoverableMessage,
    decodeWIF,
    buildDepinRequestPreimage,
    buildDepinGetPreimage,
    buildDepinClearPreimage,
    isVerifiedDepinReply,
    buildDepinReplyPreimage,
    verifyDepinReply,
    decodePlainReply,
    openBoundReply,
    decodeDepinPoolInfo,
    poolKeyFingerprint,
    createSoftwareIdentity,
    assertIdentityCapabilities,
    getDepinPoolInfo,
    decodeDepinRecipients,
    resolveDepinRecipients,
    buildDepinMessageForPool,
    requestDepinChallenge,
    decodeChallengeResult,
    receiveDepinMessages,
    listDepinSectionsPublic,
    listDepinSectionsPrivate,
    clearDepinMessages,
    submitDepinMessage,
    decodeSubmitResult,
    wrapMessageForServer,
    unwrapMessageFromServer,
    DepinError,
    DepinProtocolError,
    DepinReplyAuthenticationError,
    DepinReplyDecryptionError,
    PoolPinMismatchError,
    DepinCapabilityError,
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
      base58Encode,
      base58CheckEncode,
      base58Decode,
      base58CheckDecode,
      base64Encode,
      base64Decode,
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
