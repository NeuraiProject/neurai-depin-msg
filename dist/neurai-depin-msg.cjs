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
  DEPIN_RPC_PROTOCOL: () => DEPIN_RPC_PROTOCOL,
  DepinCapabilityError: () => DepinCapabilityError,
  DepinError: () => DepinError,
  DepinProtocolError: () => DepinProtocolError,
  DepinReplyAuthenticationError: () => DepinReplyAuthenticationError,
  DepinReplyDecryptionError: () => DepinReplyDecryptionError,
  DepinRpcError: () => DepinRpcError,
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
  buildDepinRpcRequestPreimage: () => buildDepinRpcRequestPreimage,
  buildDepinRpcResponsePreimage: () => buildDepinRpcResponsePreimage,
  bytesToHex: () => bytesToHex,
  callDepinRpc: () => callDepinRpc,
  clearDepinMessages: () => clearDepinMessages,
  concatBytes: () => concatBytes,
  createDepinRpcRequest: () => createDepinRpcRequest,
  createSoftwareIdentity: () => createSoftwareIdentity,
  decodeChallengeResult: () => decodeChallengeResult,
  decodeDepinAddress: () => decodeDepinAddress,
  decodeDepinPoolInfo: () => decodeDepinPoolInfo,
  decodeDepinReceiveResponse: () => decodeDepinReceiveResponse,
  decodeDepinRecipientDirectory: () => decodeDepinRecipientDirectory,
  decodeDepinRecipients: () => decodeDepinRecipients,
  decodeP2PKHAddress: () => decodeP2PKHAddress,
  decodePlainReply: () => decodePlainReply,
  decodeSubmitResult: () => decodeSubmitResult,
  decodeWIF: () => decodeWIF,
  decryptDepinReceiveEncryptedPayload: () => decryptDepinReceiveEncryptedPayload,
  decryptDepinReceivedMessage: () => decryptDepinReceivedMessage,
  depinRequestBytes: () => depinRequestBytes,
  depinRequestHash: () => depinRequestHash,
  derivePublicKeyForms: () => derivePublicKeyForms,
  deserializeEciesMessage: () => deserializeEciesMessage,
  doubleSha256: () => doubleSha256,
  eciesDecrypt: () => eciesDecrypt,
  eciesEncrypt: () => eciesEncrypt,
  encodeEcdsaAddress: () => encodeEcdsaAddress,
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
  strictEcdsaCommitment: () => strictEcdsaCommitment,
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
function hexToBytes(hex2) {
  if (typeof hex2 !== "string") throw new Error("Hex must be a string");
  if (hex2.length % 2 !== 0) throw new Error("Hex must have even length");
  if (!/^[0-9a-fA-F]*$/.test(hex2)) throw new Error("Invalid hex characters");
  const bytes = new Uint8Array(hex2.length / 2);
  for (let i = 0; i < hex2.length; i += 2) {
    bytes[i / 2] = parseInt(hex2.substr(i, 2), 16);
  }
  return bytes;
}
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function normalizeHex(hex2) {
  if (typeof hex2 !== "string") return null;
  const trimmed = hex2.trim().toLowerCase();
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
var import_sha2562 = require("@noble/hashes/sha256");
var import_ripemd1602 = require("@noble/hashes/ripemd160");
var P2PKH_PREFIX = {
  mainnet: 53,
  test: 127
};
var WITNESS_ADDRESS_ERROR = "This decoder requires a Legacy P2PKH address; use decodeDepinAddress for Legacy or strict ECDSA. Generic AuthScript and PQ messaging are unsupported";
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
  throw new Error("network must be 'mainnet' or 'test' (aliases: 'testnet', 'regtest'); got: " + network);
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
      throw new Error("Address looks like a Bech32m witness address but its checksum is invalid; " + WITNESS_ADDRESS_ERROR);
    }
    throw new Error("Unsupported witness v" + witness.witnessVersion + " address ('" + witness.hrp + "1\u2026'): " + WITNESS_ADDRESS_ERROR);
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
      throw new Error("Address version byte " + version + " does not match network prefix " + expected);
    }
  } else if (addressNetwork === null) {
    throw new Error("Unknown address version byte: " + version);
  }
  return { version, payload, network: addressNetwork };
}
async function pubKeyMatchesAddress(pubKeyBytes, address, network) {
  const { type, payload } = await decodeDepinAddress(address, network);
  if (type === "ecdsa" && pubKeyBytes.length !== 33) return false;
  const keyHash = type === "ecdsa" ? strictEcdsaCommitment(pubKeyBytes) : await hash160(pubKeyBytes);
  return timingSafeEqual(keyHash, payload);
}
function convertBits(data, from, to, pad) {
  let acc = 0, bits = 0;
  const out = [], mask = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >>> from) throw new Error("Invalid witness data");
    acc = (acc << from | value) & (1 << from + to - 1) - 1;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push(acc >>> bits & mask);
    }
  }
  if (pad) {
    if (bits) out.push(acc << to - bits & mask);
  } else if (bits >= from || acc << to - bits & mask) throw new Error("Noncanonical witness padding");
  return new Uint8Array(out);
}
function strictEcdsaCommitment(publicKey) {
  if (!(publicKey instanceof Uint8Array) || publicKey.length !== 33 || ![2, 3].includes(publicKey[0])) {
    throw new Error("Strict ECDSA requires a compressed public key");
  }
  const tag = (0, import_sha2562.sha256)(new TextEncoder().encode("NeuraiAuthScript"));
  return (0, import_sha2562.sha256)(concatBytes(tag, tag, new Uint8Array([3, 2]), (0, import_ripemd1602.ripemd160)((0, import_sha2562.sha256)(publicKey)), (0, import_sha2562.sha256)(new Uint8Array([81]))));
}
function encodeEcdsaAddress(publicKey, network) {
  const hrp = normalizeNetwork(network) === "mainnet" ? "nq" : "tnq";
  const data = [3, ...convertBits(strictEcdsaCommitment(publicKey), 8, 5, true)];
  const expanded = [...hrp].map((c) => c.charCodeAt(0) >>> 5).concat(
    [0],
    [...hrp].map((c) => c.charCodeAt(0) & 31)
  );
  const mod = (bech32Polymod(expanded.concat(data, [0, 0, 0, 0, 0, 0])) ^ BECH32M_CONST) >>> 0;
  for (let i = 0; i < 6; i++) data.push(mod >>> 5 * (5 - i) & 31);
  return hrp + "1" + data.map((v) => BECH32_CHARSET[v]).join("");
}
async function decodeDepinAddress(address, network) {
  try {
    const decoded = await decodeP2PKHAddress(address, network);
    return { ...decoded, type: "legacy", recipientId: bytesToHex(decoded.payload) };
  } catch (legacyError) {
    try {
      return decodeStrictEcdsaAddress(address, network);
    } catch {
      throw legacyError;
    }
  }
}
function decodeStrictEcdsaAddress(address, network) {
  if (typeof address !== "string" || address !== address.toLowerCase() || address.length > 64)
    throw new Error("Unsupported DePIN address; use Legacy or strict ECDSA");
  const witness = inspectWitnessAddress(address);
  if (!witness || !["nq", "tnq"].includes(witness.hrp) || witness.witnessVersion !== 3 || !witness.checksumValid)
    throw new Error("Unsupported DePIN address; use Legacy or strict ECDSA");
  const hrp = witness.hrp;
  const raw = [...address.slice(hrp.length + 1)].map((c) => BECH32_CHARSET.indexOf(c));
  const expanded = [...hrp].map((c) => c.charCodeAt(0) >>> 5).concat(
    [0],
    [...hrp].map((c) => c.charCodeAt(0) & 31)
  );
  if (bech32Polymod(expanded.concat(raw)) !== BECH32M_CONST) throw new Error("Strict ECDSA requires Bech32m");
  const payload = convertBits(raw.slice(1, -6), 5, 8, false);
  if (payload.length !== 32) throw new Error("Strict ECDSA commitment must be 32 bytes");
  const net = hrp === "nq" ? "mainnet" : "test";
  if (network != null && normalizeNetwork(network) !== net) throw new Error("Address network mismatch");
  return { type: "ecdsa", payload, network: net, recipientId: "03" + bytesToHex(payload) };
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
  let ephemeralPrivKey;
  for (let attempt = 0; attempt < 128; attempt++) {
    ephemeralPrivKey = randomBytes(32);
    if (import_secp256k12.secp256k1.utils.isValidPrivateKey(ephemeralPrivKey)) break;
    if (attempt === 127) throw new Error("Random source did not produce a valid ephemeral key");
  }
  if (!(plaintext instanceof Uint8Array) || plaintext.length === 0 || plaintext.length > 4 * 1024 * 1024)
    throw new Error("Invalid ECIES plaintext budget");
  if (!Array.isArray(recipientPubKeys) || recipientPubKeys.length < 1 || recipientPubKeys.length > 50)
    throw new Error("Invalid ECIES recipient count");
  const ephemeralPubKey = import_secp256k12.secp256k1.getPublicKey(ephemeralPrivKey, true);
  const aesKey = await kdfSha256(ephemeralPrivKey, 32);
  const nonce = randomBytes(12);
  const { ciphertext, tag } = await aes256GcmEncrypt(plaintext, aesKey, nonce);
  const payload = concatBytes(nonce, ciphertext, tag);
  const recipientKeys = /* @__PURE__ */ new Map();
  for (const recipientPubKey of recipientPubKeys) {
    const descriptor = recipientPubKey && typeof recipientPubKey === "object" && !(recipientPubKey instanceof Uint8Array) ? recipientPubKey : null;
    const { bytes: keyBytes } = parsePublicKey(descriptor ? descriptor.publicKey : recipientPubKey);
    let recipientId = bytesToHex(await hash160(keyBytes));
    if (descriptor) {
      if (!await pubKeyMatchesAddress(keyBytes, descriptor.address, descriptor.network))
        throw new Error("Recipient public key does not match address");
      recipientId = (await decodeDepinAddress(descriptor.address, descriptor.network)).recipientId;
    }
    const sharedPointCompressed = import_secp256k12.secp256k1.getSharedSecret(ephemeralPrivKey, keyBytes, true);
    const sharedSecret = await sha256(sharedPointCompressed);
    const encKey = await kdfSha256(sharedSecret, 32);
    const recipientNonce = randomBytes(12);
    const { ciphertext: encryptedAESKey, tag: recipientTag } = await aes256GcmEncrypt(aesKey, encKey, recipientNonce);
    const recipientPackage = concatBytes(recipientNonce, encryptedAESKey, recipientTag);
    const keyHashHex = recipientId;
    if (recipientKeys.has(keyHashHex)) {
      throw new Error("Duplicate recipient key (same hash160): " + keyHashHex);
    }
    recipientKeys.set(keyHashHex, recipientPackage);
  }
  return { ephemeralPubKey, encryptedPayload: payload, recipientKeys };
}
function compareUint160(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}
function recipientWireId(id, version) {
  if (/^[0-9a-f]{40}$/.test(id)) return hexToBytes((version === 2 ? "00" : "") + id);
  if (version === 2 && /^03[0-9a-f]{64}$/.test(id)) return hexToBytes(id);
  throw new Error("Invalid typed recipient id");
}
function serializeEciesMessage(msg) {
  const version = [...msg.recipientKeys.keys()].some((id) => id.length === 66) ? 2 : 1;
  const entries = [...msg.recipientKeys].map(([id, pkg]) => ({ id: recipientWireId(id, version), pkg }));
  entries.sort((a, b) => compareUint160(a.id, b.id));
  const parts = version === 2 ? [new Uint8Array([0, 2])] : [];
  parts.push(serializeVector(msg.ephemeralPubKey), serializeVector(msg.encryptedPayload), writeCompactSize(entries.length));
  for (const { id, pkg } of entries) {
    parts.push(id, serializeVector(pkg));
  }
  const result = concatBytes(...parts);
  deserializeEciesMessage(result);
  return result;
}
function deserializeEciesMessage(serialized, options = {}) {
  const maxPlaintext = options.maxPlaintext ?? 4 * 1024 * 1024;
  const maxRecipients = options.maxRecipients ?? 50;
  const maxBytes = options.maxBytes ?? 82 + maxPlaintext + 94 * maxRecipients;
  if (!Number.isInteger(maxPlaintext) || maxPlaintext < 1 || maxPlaintext > 4 * 1024 * 1024 || !Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > 50 || !Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 82 + 4 * 1024 * 1024 + 94 * 50)
    throw new Error("Invalid ECIES parser limits");
  if (!(serialized instanceof Uint8Array) || serialized.length > maxBytes) throw new Error("Invalid ECIES wire budget");
  if (options.allowTrailing) throw new Error("Trailing ECIES bytes are not permitted");
  let offset = 0, version = 1;
  if (serialized[0] === 0) {
    if (serialized[1] !== 2) throw new Error("Unsupported ECIES version");
    version = 2;
    offset = 2;
  }
  const ephem = readVector(serialized, offset, 33);
  offset = ephem.offset;
  if (ephem.data.length !== 33) throw new Error("ECIES ephemeral key must be compressed");
  parsePublicKey(ephem.data);
  const payload = readVector(serialized, offset, maxPlaintext + 28);
  offset = payload.offset;
  if (payload.data.length < 29) throw new Error("ECIES payload is empty or truncated");
  const count = readCompactSize(serialized, offset);
  offset = count.offset;
  if (count.value < 1 || count.value > maxRecipients) throw new Error("Invalid ECIES recipient count");
  const recipientKeys = /* @__PURE__ */ new Map();
  let previous = null, hasStrict = false;
  for (let i = 0; i < count.value; i++) {
    const start = offset;
    const type = version === 2 ? serialized[offset++] : 0;
    if (type !== 0 && type !== 3) throw new Error("Unknown ECIES recipient type");
    const length = type === 3 ? 32 : 20;
    if (offset + length > serialized.length) throw new Error("Truncated ECIES recipient id");
    const payloadId = serialized.slice(offset, offset + length);
    offset += length;
    const wireId = serialized.slice(start, offset);
    if (previous && compareUint160(previous, wireId) >= 0) throw new Error("Duplicate or unsorted ECIES recipient ids");
    previous = wireId;
    const pkg = readVector(serialized, offset, 60);
    offset = pkg.offset;
    if (pkg.data.length !== 60) throw new Error("ECIES wrapped key must be 60 bytes");
    hasStrict ||= type === 3;
    recipientKeys.set((type === 3 ? "03" : "") + bytesToHex(payloadId), pkg.data);
  }
  if (version === 2 && !hasStrict) throw new Error("Noncanonical Legacy-only ECIES v2");
  if (offset !== serialized.length) throw new Error("ECIES trailing bytes");
  return { version, ephemeralPubKey: ephem.data, encryptedPayload: payload.data, recipientKeys };
}
async function eciesDecrypt(msg, privKeyBytes, address) {
  const forms = derivePublicKeyForms(privKeyBytes);
  let candidateIds = [
    bytesToHex(await hash160(forms.compressed)),
    bytesToHex(await hash160(forms.uncompressed)),
    "03" + bytesToHex(strictEcdsaCommitment(forms.compressed))
  ];
  if (address !== void 0) {
    const decoded = await decodeDepinAddress(address);
    const form = await pubKeyMatchesAddress(forms.compressed, address) ? forms.compressed : forms.uncompressed;
    if (!await pubKeyMatchesAddress(form, address)) throw new Error("Decryption key does not match identity address");
    candidateIds = [decoded.recipientId];
  }
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
  if (!await pubKeyMatchesAddress(senderKey.bytes, params.senderAddress, params.network))
    throw new Error("senderPubKey does not correspond to senderAddress");
  const messageType = normalizeMessageType(params.messageType);
  if (typeof params.message !== "string" || !params.message.length) throw new Error("Message is required");
  if (!params.recipientPubKeys || params.recipientPubKeys.length === 0) {
    throw new Error("At least one recipient is required");
  }
  if (!Number.isSafeInteger(params.timestamp) || params.timestamp <= 0) {
    throw new Error("Timestamp must be a positive integer");
  }
  const byIdentity = /* @__PURE__ */ new Map();
  for (const recipient of params.recipientPubKeys) {
    const descriptor = recipient && typeof recipient === "object" && !(recipient instanceof Uint8Array) ? recipient : null;
    const parsed = parsePublicKey(descriptor ? descriptor.publicKey : recipient);
    let id = bytesToHex(await hash160(parsed.bytes));
    if (descriptor) {
      if (!await pubKeyMatchesAddress(parsed.bytes, descriptor.address, params.network))
        throw new Error("Recipient public key does not match address");
      id = (await decodeDepinAddress(descriptor.address, params.network)).recipientId;
    }
    if (!byIdentity.has(id)) byIdentity.set(id, descriptor ?? parsed.bytes);
  }
  const senderId = (await decodeDepinAddress(params.senderAddress, params.network)).recipientId;
  if (!byIdentity.has(senderId)) byIdentity.set(senderId, { address: params.senderAddress, publicKey: senderKey.bytes });
  if (messageType.byte === 1 && byIdentity.size > 2) throw new Error('messageType "private" allows only one recipient plus the sender');
  if (byIdentity.size > MAX_DEPIN_RECIPIENTS) throw new Error("Final recipient map exceeds " + MAX_DEPIN_RECIPIENTS);
  const length = new TextEncoder().encode(params.message).length;
  const maximum = params.maxMessageBytes ?? MAX_DEPIN_MESSAGE_SIZE;
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > MAX_DEPIN_MESSAGE_SIZE) throw new Error("Invalid plaintext size limit");
  if (length > maximum) throw new Error("Message exceeds plaintext size limit");
  return {
    messageType,
    senderKey,
    recipientKeyBytes: Array.from(byIdentity.values())
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
  const serialized = concatBytes(buildPreimageBytes(fields), serializeVector(signature));
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
  if (!Number.isSafeInteger(params.timestamp) || params.timestamp <= 0) {
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
  const serialized = concatBytes(buildPreimageBytes(fields), serializeVector(signature));
  return {
    hex: bytesToHex(serialized),
    messageHash,
    messageHashBytes: bytesToHex(messageHashBytes),
    encryptedSize: encryptedPayload.length,
    messageType: messageType.str
  };
}
async function parseDepinMessage(hexOrBytes, options = {}) {
  const { maxPayloadBytes = 82 + MAX_DEPIN_MESSAGE_SIZE + 94 * MAX_DEPIN_RECIPIENTS } = options;
  let bytes;
  if (hexOrBytes instanceof Uint8Array) {
    bytes = hexOrBytes;
  } else {
    const norm = normalizeHex(hexOrBytes);
    if (!norm) throw new Error("Invalid message hex");
    bytes = hexToBytes(norm);
  }
  if (bytes.length > 16384) throw new Error("Message exceeds wire limit");
  let offset = 0;
  const tokenRes = readString(bytes, offset, 128);
  offset = tokenRes.offset;
  const senderRes = readString(bytes, offset, 64);
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
  const sigRes = readVector(bytes, offset, 80);
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
  if (!Number.isSafeInteger(timestamp) || timestamp <= 0) throw new Error("Message timestamp invalid");
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
  try {
    await decodeDepinAddress(norm.senderAddress, network);
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
    if (!await pubKeyMatchesAddress(parsed.bytes, norm.senderAddress, network)) {
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
      if (await pubKeyMatchesAddress(candidate, norm.senderAddress, network)) {
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
  maxPayloadBytes: 82 + MAX_DEPIN_MESSAGE_SIZE + 94 * MAX_DEPIN_RECIPIENTS
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
  const ecies = deserializeEciesMessage(norm.encryptedPayload, { maxPlaintext: MAX_DEPIN_MESSAGE_SIZE });
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
      const ecies = deserializeEciesMessage(norm.encryptedPayload, { maxPlaintext: MAX_DEPIN_MESSAGE_SIZE });
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
      deserializeEciesMessage(norm.encryptedPayload, { maxPlaintext: MAX_DEPIN_MESSAGE_SIZE });
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
    throw new Error("Response has " + rawMessages.length + " messages, above the limit of " + effLimits.maxMessages);
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
var DepinRpcError = class extends Error {
  constructor(error, context) {
    super(error.message || "DePIN RPC failed");
    this.name = "DepinRpcError";
    this.code = error.code;
    this.data = error.data ?? {};
    this.depinError = this.data.depin_error ?? null;
    this.context = context;
  }
};

// src/signmessage.js
var import_secp256k14 = require("@noble/curves/secp256k1");
var import_sha2563 = require("@noble/hashes/sha256");
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
  const hash = (0, import_sha2563.sha256)((0, import_sha2563.sha256)(payload));
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
    return { privateKey: hexToBytes(asHex), network: null, compressed: true };
  }
  const decoded = decodeWIF(privateKeyOrWif);
  return { privateKey: decoded.privateKey, network: decoded.network, compressed: decoded.compressed };
}
function neuraiSignedMessageHash(message, address) {
  if (typeof message !== "string") {
    throw new DepinProtocolError("Message to hash must be a string");
  }
  const data = concatBytes(serializeString(NEURAI_MESSAGE_MAGIC), serializeString(message));
  const original = (0, import_sha2563.sha256)((0, import_sha2563.sha256)(data));
  if (address && /^(nq|tnq)1/.test(address)) {
    const { payload } = decodeStrictEcdsaAddress(address);
    return (0, import_sha2563.sha256)(
      (0, import_sha2563.sha256)(concatBytes(serializeString("Neurai Strict AuthScript Message"), new Uint8Array([3]), payload, original))
    );
  }
  return original;
}
function signRecoverableMessage(message, privateKeyOrCompressedWif, options = {}) {
  const { privateKey, compressed } = normalizeSigningKey(privateKeyOrCompressedWif);
  const hash = neuraiSignedMessageHash(message, options.address);
  const signature = import_secp256k14.secp256k1.sign(hash, privateKey);
  if (typeof signature.recovery !== "number") {
    throw new DepinProtocolError("Signature recovery id unavailable");
  }
  const compact = signature.toCompactRawBytes();
  const header = 27 + signature.recovery + (options.compressed ?? compressed ? 4 : 0);
  const out = new Uint8Array(65);
  out[0] = header;
  out.set(compact, 1);
  return base64Encode(out);
}
function decodeRecoverableSignature(signatureBase64) {
  const bytes = base64Decode(signatureBase64);
  if (bytes.length !== 65) {
    throw new DepinProtocolError("Recoverable signature must be 65 bytes; got " + bytes.length);
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
function recoverPublicKeyFromMessage(message, signatureBase64, address) {
  const { recovery, compressed, compact } = decodeRecoverableSignature(signatureBase64);
  if (address && /^(nq|tnq)1/.test(address) && !compressed)
    throw new DepinProtocolError("Strict ECDSA signatures require a compressed key");
  const hash = neuraiSignedMessageHash(message, address);
  let point;
  try {
    const sig = import_secp256k14.secp256k1.Signature.fromCompact(compact).addRecoveryBit(recovery);
    point = sig.recoverPublicKey(hash);
  } catch (e) {
    throw new DepinProtocolError("Public key recovery failed: " + (e && e.message ? e.message : e), e);
  }
  return bytesToHex(point.toRawBytes(compressed));
}
function verifyRecoverableMessage(message, signatureBase64, expectedPublicKey, address) {
  const expected = parsePublicKey(expectedPublicKey);
  let recoveredHex;
  try {
    recoveredHex = recoverPublicKeyFromMessage(message, signatureBase64, address);
  } catch (e) {
    if (e instanceof DepinProtocolError && /recovery failed/i.test(e.message)) {
      return false;
    }
    throw e;
  }
  return parsePublicKey(recoveredHex).pointId === expected.pointId;
}

// src/depin-reply.js
var import_sha2565 = require("@noble/hashes/sha256");
var import_lossless_json = require("lossless-json");

// src/json.js
function assertNoDuplicateJsonKeys(text2) {
  const stack = [];
  for (let i = 0; i < text2.length; i++) {
    const ch = text2[i];
    if (ch === '"') {
      const start = i++;
      while (i < text2.length && text2[i] !== '"') {
        if (text2[i] === "\\") i++;
        i++;
      }
      if (i >= text2.length) throw new SyntaxError("Unterminated JSON string");
      const top = stack[stack.length - 1];
      if (top?.keys && top.expectKey) {
        const key = JSON.parse(text2.slice(start, i + 1));
        if (top.keys.has(key)) throw new SyntaxError("Duplicate JSON key");
        top.keys.add(key);
        top.expectKey = false;
      }
    } else if (ch === "{" || ch === "[") {
      if (stack.length >= 128) throw new SyntaxError("JSON nesting limit exceeded");
      stack.push(ch === "{" ? { keys: /* @__PURE__ */ new Set(), expectKey: true, close: "}" } : { close: "]" });
    } else if (ch === "}" || ch === "]") {
      if (stack.pop()?.close !== ch) throw new SyntaxError("Invalid JSON nesting");
    } else if (ch === "," && stack[stack.length - 1]?.keys) stack[stack.length - 1].expectKey = true;
  }
}

// src/rpc-codec.js
var import_sha2564 = require("@noble/hashes/sha256");
var DEPIN_RPC_PROTOCOL = 5;
var ZERO = "00".repeat(32);
var MAX_I64 = (1n << 63n) - 1n;
function fail(message) {
  throw new DepinProtocolError(message);
}
function keys(value, allowed, required = []) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("Expected object");
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail("Unknown field: " + key);
  for (const key of required) if (value[key] == null) fail("Required field: " + key);
}
function ascii(value, maximum = 128) {
  if (typeof value !== "string" || value.length > maximum || /[^\x20-\x7e]/.test(value)) fail("Invalid ASCII string");
  return value;
}
function hex(value, size, empty = false) {
  if (empty && value === "") return value;
  if (typeof value !== "string" || value.length !== size * 2 || !/^[0-9a-f]+$/.test(value)) fail("Expected fixed lowercase hex");
  return value;
}
function integer(value, minimum = 0n, maximum = MAX_I64) {
  if (typeof value !== "bigint" && !Number.isSafeInteger(value)) fail("Expected an exact integer (number or bigint)");
  const n = BigInt(value);
  if (n < minimum || n > maximum) fail("Integer outside allowed range");
  return n;
}
function number(value, width) {
  let n = BigInt(value);
  const out = new Uint8Array(width);
  for (let i = 0; i < width; i++) {
    out[i] = Number(n & 255n);
    n >>= 8n;
  }
  return out;
}
function blob(bytes) {
  return concatBytes(number(bytes.length, 4), bytes);
}
function text(value) {
  return blob(new TextEncoder().encode(value));
}
function fixed(value) {
  return hexToBytes(value);
}
function optionalInt(a, key, fallback, max = MAX_I64, min = 0n) {
  return integer(a[key] ?? fallback, min, max);
}
function depinRequestBytes(method, request) {
  const r = request;
  if (r?.protocol !== 5) fail("RPC protocol 5 required; no legacy fallback");
  let network = ZERO, pool = "", root = "", instance = ZERO, revision = ZERO;
  let token = "", address = "", nonce = "", kind = 0, args = new Uint8Array();
  if (method === "depingetmsginfo") {
    keys(r, ["protocol", "request_id", "timestamp_ms"], ["protocol", "request_id", "timestamp_ms"]);
  } else {
    const fields = [
      "protocol",
      "network",
      "pool_pubkey",
      "pool_root",
      "instance_id",
      "membership_revision",
      "request_id",
      "timestamp_ms",
      "token",
      "address",
      "challenge",
      "args",
      "signature"
    ];
    keys(r, fields, fields);
    network = hex(r.network, 32);
    pool = hex(r.pool_pubkey, 33);
    if (parsePublicKey(pool).bytes.length !== 33) fail("Pool key must be compressed");
    root = ascii(r.pool_root);
    instance = hex(r.instance_id, 32);
    revision = hex(r.membership_revision, 32);
    token = ascii(r.token);
    address = ascii(r.address, 64);
    nonce = hex(r.challenge, 32, true);
    ascii(r.signature, 128);
    const a = r.args;
    keys(a, [
      "type",
      "timestamp",
      "after_hash",
      "limit",
      "cursor",
      "from_timestamp",
      "mode",
      "hours",
      "encrypted",
      "max_results",
      "stop_at"
    ]);
    switch (method) {
      case "depinchallenge": {
        keys(a, ["type"]);
        kind = 1;
        const type = a.type ?? "receive";
        if (type !== "receive" && type !== "admin") fail("Invalid challenge type");
        args = number(type === "admin" ? 1 : 0, 1);
        break;
      }
      case "depinreceivemsg":
        keys(a, ["timestamp", "after_hash", "limit"]);
        kind = 2;
        args = concatBytes(
          number(optionalInt(a, "timestamp", 0), 8),
          blob(fixed(hex(a.after_hash ?? "", 32, true))),
          number(optionalInt(a, "limit", 0, 1000n), 8)
        );
        break;
      case "depinreceiveseq": {
        keys(a, ["cursor", "limit", "from_timestamp"]);
        kind = 2;
        const from = optionalInt(a, "from_timestamp", 0), c = a.cursor;
        let stream = ZERO, after = 0n;
        if (c != null) {
          const fields2 = ["version", "stream_id", "after_seq", "scope", "address", "from_timestamp"];
          keys(c, fields2, fields2);
          if (integer(c.version) !== 1n || c.scope !== token || c.address !== address || integer(c.from_timestamp) !== from)
            fail("Cursor identity/filter mismatch");
          stream = hex(c.stream_id, 32);
          after = integer(c.after_seq);
        }
        args = concatBytes(
          number(c != null ? 1 : 0, 1),
          fixed(stream),
          number(after, 8),
          number(optionalInt(a, "limit", 100, 1000n, 1n), 8),
          number(from, 8)
        );
        break;
      }
      case "depinclearmsg": {
        keys(a, ["mode", "hours"]);
        kind = 3;
        const mode = a.mode ?? "expired";
        if (!["expired", "all", "hours"].includes(mode)) fail("Invalid clear mode");
        if (mode !== "hours" && a.hours != null) fail("hours requires hours mode");
        if (mode === "hours" && a.hours == null) fail("hours required");
        const hours = mode === "hours" ? integer(a.hours, 0n, MAX_I64 / 3600n) : 0n;
        token ||= root;
        args = concatBytes(number(mode === "hours" ? 2 : mode === "all" ? 1 : 0, 1), number(hours, 8));
        break;
      }
      case "depinsubmitmsg":
        keys(a, ["encrypted"], ["encrypted"]);
        kind = 1;
        if (token !== "" || typeof a.encrypted !== "string" || !/^(?:[0-9a-f]{2})+$/.test(a.encrypted) || a.encrypted.length > 65888)
          fail("Invalid submit envelope");
        args = blob(fixed(a.encrypted));
        break;
      case "depingetancestorrecipients":
        keys(a, ["max_results", "stop_at"]);
        args = concatBytes(number(optionalInt(a, "max_results", 1e3, 10000n, 1n), 8), text(ascii(a.stop_at ?? root) || root));
        break;
      case "depinlistsections":
        keys(a, []);
        kind = address ? 2 : 0;
        break;
      case "depinpoolstats":
      case "depinmcpstatus":
        keys(a, []);
        break;
      default:
        fail("Unsupported DePIN RPC method");
    }
    if (kind === 0) {
      if (address || nonce || r.signature || method !== "depingetancestorrecipients" && token !== root)
        fail("Invalid public authentication fields");
    } else {
      if (!address || (kind >= 2 ? !nonce : nonce !== "")) fail("Invalid private authentication fields");
      if (method !== "depinsubmitmsg" && !isDepinTokenInScope(token, root)) fail("Token outside pool scope");
    }
  }
  hex(r.request_id, 32);
  integer(r.timestamp_ms);
  return concatBytes(
    text("Neurai/DePIN/RPC/request"),
    number(5, 2),
    text(method),
    number(kind, 1),
    fixed(network),
    blob(fixed(pool)),
    text(root),
    fixed(instance),
    fixed(revision),
    fixed(r.request_id),
    number(r.timestamp_ms, 8),
    text(token),
    text(address),
    blob(fixed(nonce)),
    blob(args)
  );
}
function depinRequestHash(method, request) {
  return bytesToHex((0, import_sha2564.sha256)(depinRequestBytes(method, request)));
}
function buildDepinRpcRequestPreimage({ method, request }) {
  return "DEPIN-RPC-REQUEST-v5|" + depinRequestHash(method, request);
}
function createDepinRpcRequest({
  method,
  context,
  token,
  address = "",
  challenge = "",
  args = {},
  requestId,
  timestampMs,
  clock = Date.now
}) {
  const request = { protocol: 5, request_id: requestId ?? bytesToHex(randomBytes(32)), timestamp_ms: timestampMs ?? clock() };
  if (method !== "depingetmsginfo") {
    if (!context) fail("A verified RPC 5 context is required");
    Object.assign(request, {
      network: context.network,
      pool_pubkey: context.pool_pubkey,
      pool_root: context.pool_root,
      instance_id: context.instance_id,
      membership_revision: context.membership_revision,
      token: token ?? context.pool_root,
      address,
      challenge,
      args,
      signature: ""
    });
  }
  depinRequestBytes(method, request);
  return request;
}
function buildDepinRpcResponsePreimage({ method, reply, requestHash }) {
  const r = reply;
  hex(r.network, 32);
  hex(r.pool_pubkey, 33);
  ascii(r.pool_root);
  hex(r.instance_id, 32);
  hex(r.membership_revision, 32);
  hex(r.membership_blockhash, 32);
  hex(requestHash, 32);
  integer(r.membership_height, -1n, 2147483647n);
  if (r.protocol !== 5 || r.body_kind !== 0 && r.body_kind !== 1) fail("Invalid RPC 5 response");
  const content = r.body_kind ? r.encrypted : r.body;
  if (typeof content !== "string" || !/^(?:[0-9a-f]{2})+$/.test(content) || content.length > 2 * (82 + 4194304 + 94 * 50))
    fail("Invalid response body budget/hex");
  const bytes = concatBytes(
    text("Neurai/DePIN/RPC/response"),
    number(5, 2),
    text(method),
    fixed(r.network),
    blob(fixed(r.pool_pubkey)),
    text(r.pool_root),
    fixed(r.instance_id),
    fixed(r.membership_revision),
    number(r.membership_height, 8),
    fixed(r.membership_blockhash),
    fixed(requestHash),
    number(r.body_kind, 1),
    blob(fixed(content))
  );
  return "DEPIN-RPC-RESPONSE-v5|" + bytesToHex((0, import_sha2564.sha256)(bytes));
}

// src/depin-reply.js
var MAX_DECODED_JSON_BYTES = 4 * 1024 * 1024;
var MAX_REPLY_HEX_CHARS = 2 * (82 + MAX_DECODED_JSON_BYTES + 94 * 50);
var VERIFIED_REPLIES = /* @__PURE__ */ new WeakSet();
function isVerifiedDepinReply(value) {
  return !!value && VERIFIED_REPLIES.has(value);
}
var MAIN_GENESIS = "00000044d33c0c0ba019be5c0249730424a69cb4c222153322f68c6104484806";
var TEST_GENESIS = "000000c710413a4265a996d30c86043aedef6a563900f1bc43fea61d5b2dc77d";
function expectedDepinNetwork(network, expectedNetworkHash) {
  if (expectedNetworkHash !== void 0) {
    if (!/^[0-9a-f]{64}$/.test(expectedNetworkHash)) throw new DepinProtocolError("Invalid expected genesis");
    return expectedNetworkHash;
  }
  if (network === "regtest") throw new DepinProtocolError("regtest requires expectedNetworkHash");
  return normalizeNetwork(network) === "mainnet" ? MAIN_GENESIS : TEST_GENESIS;
}
function poolKeyFingerprint(pubKey) {
  const hash = bytesToHex((0, import_sha2565.sha256)(hexToBytes(parsePublicKey(pubKey).pointId)));
  return hash.slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");
}
function buildDepinReplyPreimage({ method, reply, request }) {
  return buildDepinRpcResponsePreimage({ method, reply, requestHash: depinRequestHash(method, request) });
}
function verifyDepinReply({ reply, method, request, poolPublicKey, expectedNetworkHash }) {
  if (!reply || typeof reply !== "object" || Array.isArray(reply)) throw new DepinProtocolError("Invalid reply object");
  const field = reply.body_kind === 1 ? "encrypted" : "body";
  const fields = [
    "protocol",
    "network",
    "pool_pubkey",
    "pool_root",
    "instance_id",
    "membership_revision",
    "membership_height",
    "membership_blockhash",
    "request_hash",
    "body_kind",
    field,
    "poolsig"
  ];
  if (Object.keys(reply).length !== fields.length || fields.some((k) => !Object.prototype.hasOwnProperty.call(reply, k)))
    throw new DepinProtocolError("Invalid RPC 5 reply fields");
  const requestHash = depinRequestHash(method, request);
  if (reply.request_hash !== requestHash) throw new DepinReplyAuthenticationError("Reply request hash mismatch");
  const expectedKey = parsePublicKey(poolPublicKey);
  if (expectedKey.bytes.length !== 33 || reply.pool_pubkey !== bytesToHex(expectedKey.bytes))
    throw new PoolPinMismatchError("Reply poolPublicKey mismatch");
  const bootstrap = method === "depingetmsginfo";
  const bound = !bootstrap && ["depinchallenge", "depinreceivemsg", "depinreceiveseq", "depinclearmsg", "depinsubmitmsg"].includes(method) || method === "depinlistsections" && !!request.address;
  if (reply.body_kind !== (bound ? 1 : 0)) throw new DepinReplyAuthenticationError("Reply confidentiality mismatch");
  if (bootstrap) {
    if (!expectedNetworkHash || reply.network !== expectedNetworkHash) throw new PoolPinMismatchError("Reply genesis/network mismatch");
  } else {
    for (const key of ["network", "pool_pubkey", "pool_root", "instance_id"])
      if (reply[key] !== request[key]) throw new PoolPinMismatchError("Reply service identity mismatch: " + key);
  }
  if (typeof reply.poolsig !== "string" || reply.poolsig.length !== 88) throw new DepinProtocolError("Invalid poolsig length");
  const compact = base64Decode(reply.poolsig);
  if (compact.length !== 65 || compact[0] < 31 || compact[0] > 34)
    throw new DepinProtocolError("Pool signature requires a compressed compact key");
  const preimage = buildDepinReplyPreimage({ method, reply, request });
  let recovered;
  try {
    recovered = recoverPublicKeyFromMessage(preimage, reply.poolsig);
  } catch (cause) {
    throw new DepinReplyAuthenticationError("Invalid pool signature", cause);
  }
  if (recovered !== reply.pool_pubkey) throw new DepinReplyAuthenticationError("Pool signature does not verify");
  const context = Object.freeze(
    Object.fromEntries(
      ["network", "pool_pubkey", "pool_root", "instance_id", "membership_revision", "membership_height", "membership_blockhash"].map(
        (k) => [k, reply[k]]
      )
    )
  );
  const verified = Object.freeze({
    kind: bound ? "bound" : "plain",
    replyHex: reply[field],
    method,
    address: request.address ?? "",
    poolPublicKey: reply.pool_pubkey,
    context
  });
  VERIFIED_REPLIES.add(verified);
  return verified;
}
function parseJsonBytes(bytes, context) {
  if (bytes.length > MAX_DECODED_JSON_BYTES) throw new DepinProtocolError("Decoded JSON exceeds reply budget");
  try {
    const text2 = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    assertNoDuplicateJsonKeys(text2);
    const value = (0, import_lossless_json.parse)(text2, null, (s) => /^-?\d+$/.test(s) && !Number.isSafeInteger(Number(s)) ? BigInt(s) : Number(s));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Reply JSON must be an object");
    return value;
  } catch (cause) {
    throw new DepinProtocolError(context + ": invalid JSON/UTF-8", cause);
  }
}
function decodePlainReply(verified) {
  if (!isVerifiedDepinReply(verified) || verified.kind !== "plain") throw new DepinProtocolError("A verified plain reply is required");
  return parseJsonBytes(hexToBytes(verified.replyHex), verified.method);
}
async function openBoundReply(verified, opener) {
  if (!isVerifiedDepinReply(verified) || verified.kind !== "bound") throw new DepinProtocolError("A verified bound reply is required");
  const message = deserializeEciesMessage(hexToBytes(verified.replyHex));
  const recipient = await decodeDepinAddress(verified.address);
  if (message.recipientKeys.size !== 1 || !message.recipientKeys.has(recipient.recipientId))
    throw new DepinReplyDecryptionError("Reply recipient identity mismatch");
  let bytes;
  try {
    bytes = typeof opener === "function" ? await opener(verified.replyHex) : await eciesDecrypt(message, await normalizePrivateKeyTo32Bytes(opener), verified.address);
    if (typeof bytes === "string") bytes = new TextEncoder().encode(bytes);
    if (!(bytes instanceof Uint8Array)) throw new Error("Opener did not return plaintext bytes");
  } catch (cause) {
    throw new DepinReplyDecryptionError("Could not open authenticated reply", cause);
  }
  return parseJsonBytes(bytes, verified.method);
}
async function decodeDepinPoolInfo({ reply, request, trust, serviceId, network, expectedNetworkHash }) {
  if (!trust || !["pinned", "key", "tofu"].includes(trust.mode) || typeof serviceId !== "string" || !serviceId)
    throw new DepinProtocolError("Explicit service identity and trust mode required");
  const pin = trust.mode === "pinned" ? trust.pin : null;
  if (pin && pin.serviceId !== serviceId) throw new PoolPinMismatchError("Pinned service mismatch");
  const expectedGenesis = expectedDepinNetwork(network, expectedNetworkHash ?? (network === void 0 ? pin?.network : void 0));
  if (pin?.network && pin.network !== expectedGenesis) throw new PoolPinMismatchError("Pinned genesis/network mismatch");
  const poolPublicKey = pin?.poolPublicKey ?? (trust.mode === "key" ? trust.poolPublicKey : reply.pool_pubkey);
  const verified = verifyDepinReply({ reply, method: "depingetmsginfo", request, poolPublicKey, expectedNetworkHash: expectedGenesis });
  const info = decodePlainReply(verified);
  if (info.protocol !== 5 || !info.accepted_protocols?.includes(5) || info.token !== reply.pool_root || info.depinpoolpkey !== reply.pool_pubkey || info.network !== reply.network || info.instance_id !== reply.instance_id)
    throw new DepinProtocolError("Bootstrap body/identity mismatch or unsupported protocol");
  for (const key of ["membership_revision", "membership_height", "membership_blockhash"])
    if (info[key] !== reply[key]) throw new DepinProtocolError("Bootstrap membership mismatch");
  if (pin && info.token !== pin.poolRoot) throw new PoolPinMismatchError("Pinned pool root mismatch");
  if (!validateDepinSectionToken(info.token).valid || !Number.isInteger(info.maxmessagesize) || info.maxmessagesize < 1 || info.maxmessagesize > 10240)
    throw new DepinProtocolError("Invalid pool token/plaintext limit");
  if (!Number.isSafeInteger(info.server_time_ms) || !Number.isInteger(info.maxrecipients) || info.maxrecipients < 1 || info.maxrecipients > 50)
    throw new DepinProtocolError("Invalid pool limits/clock");
  if (info.depinpoolkeyaddress && !await pubKeyMatchesAddress(hexToBytes(poolPublicKey), info.depinpoolkeyaddress, network))
    throw new PoolPinMismatchError("Pool address/key mismatch");
  const context = Object.freeze({ ...verified.context, clockOffsetMs: info.server_time_ms - Date.now() });
  return {
    info,
    context,
    pin: { serviceId, poolRoot: info.token, poolPublicKey, network: expectedGenesis },
    trust: trust.mode,
    fingerprint: poolKeyFingerprint(poolPublicKey)
  };
}

// src/identity.js
var import_secp256k15 = require("@noble/curves/secp256k1");
async function createSoftwareIdentity({ privateKey, network, address, addressType = "legacy" } = {}) {
  if (!privateKey) {
    throw new DepinProtocolError("privateKey (compressed WIF or 64-hex) is required");
  }
  if (!network) {
    throw new DepinProtocolError("network is required ('mainnet' or 'test')");
  }
  const net = normalizeNetwork(network);
  const { privateKey: keyBytes, network: wifNetwork, compressed } = normalizeSigningKey(privateKey);
  if (wifNetwork !== null && wifNetwork !== net) {
    throw new DepinProtocolError("WIF network (" + wifNetwork + ") does not match the requested network (" + net + ")");
  }
  const publicKeyBytes = import_secp256k15.secp256k1.getPublicKey(keyBytes, compressed);
  const publicKey = bytesToHex(publicKeyBytes);
  const keyHash = await hash160(publicKeyBytes);
  let finalAddress;
  if (address !== void 0 && address !== null) {
    if (!await pubKeyMatchesAddress(publicKeyBytes, address, net)) {
      throw new DepinProtocolError("address does not correspond to this public key");
    }
    finalAddress = address;
  } else {
    if (!["legacy", "ecdsa"].includes(addressType)) throw new DepinProtocolError("Unsupported address type");
    finalAddress = addressType === "ecdsa" ? encodeEcdsaAddress(publicKeyBytes, net) : await base58CheckEncode(P2PKH_PREFIX[net], keyHash);
  }
  return {
    address: finalAddress,
    publicKey,
    network: net,
    signMessage: (preimage) => signRecoverableMessage(preimage, bytesToHex(keyBytes), { address: finalAddress, compressed }),
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
      const plaintext = await eciesDecrypt(message, keyBytes, finalAddress);
      if (plaintext === null) {
        throw new DepinReplyDecryptionError("envelope is not encrypted for this identity or failed authentication");
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
      throw new DepinCapabilityError("identity is missing the " + capability + " capability required by this flow");
    }
  }
}

// src/depin-client.js
function buildDepinRequestPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function buildDepinGetPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function buildDepinClearPreimage(params) {
  return buildDepinRpcRequestPreimage(params);
}
function frozenCopy(value) {
  if (value === null || typeof value !== "object") return value;
  return Object.freeze(
    Array.isArray(value) ? value.map(frozenCopy) : Object.fromEntries(Object.entries(value).map(([key, item]) => [key, frozenCopy(item)]))
  );
}
function assertRpc(rpc) {
  if (typeof rpc?.call !== "function") throw new DepinProtocolError("rpc.call is required");
}
async function getDepinPoolInfo({ rpc, serviceId, trust, network, expectedNetworkHash, timestampMs, requestId }) {
  assertRpc(rpc);
  const request = createDepinRpcRequest({ method: "depingetmsginfo", timestampMs, requestId });
  const reply = await rpc.call("depingetmsginfo", [frozenCopy(request)]);
  return decodeDepinPoolInfo({ reply, request, trust, serviceId, network, expectedNetworkHash });
}
async function callDepinRpc({ rpc, context, method, identity, token, address, challenge = "", args = {}, timestampMs, requestId }) {
  assertRpc(rpc);
  if (!context) throw new DepinProtocolError("Verified pool context is required for RPC 5");
  const privateCall = ["depinchallenge", "depinreceivemsg", "depinreceiveseq", "depinclearmsg", "depinsubmitmsg"].includes(method) || method === "depinlistsections" && !!identity;
  if (privateCall) assertIdentityCapabilities(identity, ["signMessage", "openReply"]);
  const request = createDepinRpcRequest({
    method,
    context,
    token,
    address: privateCall ? identity.address : address ?? "",
    challenge,
    args,
    timestampMs: timestampMs ?? Date.now() + (context.clockOffsetMs ?? 0),
    requestId
  });
  if (privateCall) {
    const preimage = buildDepinRpcRequestPreimage({ method, request });
    request.signature = await identity.signMessage(preimage, {
      kind: "rpc",
      method,
      request: frozenCopy(request),
      requestHash: depinRequestHash(method, request)
    });
    const recovered = recoverPublicKeyFromMessage(preimage, request.signature, identity.address);
    if (!await pubKeyMatchesAddress(parsePublicKey(recovered).bytes, identity.address))
      throw new DepinProtocolError("signMessage returned a signature for another address/domain");
  }
  const reply = await rpc.call(method, [frozenCopy(request)]);
  const verified = verifyDepinReply({ reply, method, request, poolPublicKey: context.pool_pubkey });
  const servedContext = Object.freeze({ ...verified.context, clockOffsetMs: context.clockOffsetMs ?? 0 });
  const body = privateCall ? await openBoundReply(verified, identity.openReply) : decodePlainReply(verified);
  if (body?.error) throw new DepinRpcError(body.error, servedContext);
  return { body, context: servedContext, membershipChanged: servedContext.membership_revision !== context.membership_revision };
}
async function decodeDepinRecipientDirectory(body, { token, poolRoot, network, requireComplete = true }) {
  if (!body || body.token !== token || body.stop_at !== poolRoot || typeof body.truncated !== "boolean" || requireComplete && body.truncated || !Array.isArray(body.recipients) || !Array.isArray(body.ancestors) || body.ancestors[0] !== token || body.recipients.length > 1e4)
    throw new DepinProtocolError("Recipient directory is incomplete or has a different scope");
  if (body.returned != null && body.returned !== body.recipients.length) throw new DepinProtocolError("Recipient count mismatch");
  const recipients = /* @__PURE__ */ new Map();
  for (const entry of body.recipients) {
    if (typeof entry?.address !== "string" || typeof entry?.pubkey !== "string") throw new DepinProtocolError("Malformed recipient");
    const key = parsePublicKey(entry.pubkey);
    if (!await pubKeyMatchesAddress(key.bytes, entry.address, network))
      throw new DepinProtocolError("Recipient pubkey does not match its address");
    const id = (await decodeDepinAddress(entry.address, network)).recipientId;
    if (!recipients.has(id)) recipients.set(id, { address: entry.address, publicKey: bytesToHex(key.bytes) });
  }
  return [...recipients.values()];
}
async function decodeDepinRecipients(body, { token, poolRoot, maxRecipients, senderPubKey, senderAddress, network, selectedAddresses }) {
  if (!Number.isInteger(maxRecipients) || maxRecipients < 1 || maxRecipients > 50) throw new DepinProtocolError("Invalid recipient budget");
  if (selectedAddresses !== void 0 && (!Array.isArray(selectedAddresses) || !selectedAddresses.length || selectedAddresses.length > maxRecipients || selectedAddresses.some((a) => typeof a !== "string")))
    throw new DepinProtocolError("Invalid selected addresses");
  const available = await decodeDepinRecipientDirectory(body, {
    token,
    poolRoot,
    network,
    requireComplete: selectedAddresses === void 0
  });
  const selected = selectedAddresses === void 0 ? available : selectedAddresses.map((address) => {
    const entry = available.find((r) => r.address === address);
    if (!entry) throw new DepinProtocolError("Selected address is not an eligible recipient: " + address);
    return entry;
  });
  const recipients = /* @__PURE__ */ new Map();
  for (const entry of selected) recipients.set((await decodeDepinAddress(entry.address, network)).recipientId, entry);
  if (!senderAddress) throw new DepinProtocolError("senderAddress is required to preserve exact recipient identity");
  if (!await pubKeyMatchesAddress(parsePublicKey(senderPubKey).bytes, senderAddress, network))
    throw new DepinProtocolError("Sender key/address mismatch");
  const senderId = (await decodeDepinAddress(senderAddress, network)).recipientId;
  const senderIncludedInHolders = recipients.has(senderId);
  const finalCount = recipients.size + (senderIncludedInHolders ? 0 : 1);
  if (finalCount > maxRecipients) throw new DepinProtocolError("Final recipient map exceeds pool limit");
  return {
    recipients: [...recipients.values()],
    recipientPubKeys: [...recipients.values()],
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
  if (!Number.isInteger(params.maxRecipients) || params.maxRecipients < 1 || params.maxRecipients > 50)
    throw new DepinProtocolError("Invalid pool recipient limit");
  const { body, context, membershipChanged } = await callDepinRpc({
    ...params,
    method: "depingetancestorrecipients",
    args: {
      max_results: params.selectedAddresses ? 1e4 : params.maxRecipients + 1,
      stop_at: params.poolRoot ?? params.context?.pool_root
    }
  });
  const resolution = await decodeDepinRecipients(body, params);
  return { ...resolution, body, context, membershipChanged };
}
async function buildDepinMessageForPool(params) {
  const { identity, rpc, context, ...buildParams } = params;
  let senderPubKey = params.senderPubKey, senderAddress = params.senderAddress;
  if (identity) {
    assertIdentityCapabilities(identity, ["signDigest"]);
    if (params.privateKey !== void 0) throw new DepinProtocolError("Provide identity or privateKey, not both");
    if (senderAddress && senderAddress !== identity.address) throw new DepinProtocolError("Sender identity mismatch");
    senderAddress = identity.address;
    senderPubKey = identity.publicKey;
    if (!await pubKeyMatchesAddress(parsePublicKey(senderPubKey).bytes, senderAddress, params.network))
      throw new DepinProtocolError("Identity key/address mismatch");
  }
  const resolution = await resolveDepinRecipients({ ...params, senderPubKey, senderAddress });
  const fields = { ...buildParams, senderPubKey, senderAddress, recipientPubKeys: resolution.recipientPubKeys };
  let built;
  if (identity) {
    const preimage = await buildDepinPreimage(fields);
    const signature = await identity.signDigest(preimage.messageDigest.slice(), {
      kind: "message",
      token: params.token,
      senderAddress,
      timestamp: params.timestamp,
      messageType: preimage.messageTypeByte,
      encryptedPayloadHex: preimage.encryptedPayloadHex
    });
    built = await assembleDepinMessage({ ...fields, encryptedPayloadHex: preimage.encryptedPayloadHex }, signature);
    const verification = await verifyDepinReceivedMessage(await parseDepinMessage(built.hex), { network: params.network, senderPubKey });
    if (!verification.signatureValid) throw new DepinProtocolError("signDigest returned an invalid message signature");
    built.recipientCount = preimage.recipientCount;
  } else built = await buildDepinMessage(fields);
  return { ...built, resolution, context: resolution.context };
}
function decodeChallengeResult(body, type) {
  if (!/^[0-9a-f]{64}$/.test(body?.challenge) || body.type !== type || !Number.isInteger(body.expires_in) || body.expires_in <= 0)
    throw new DepinProtocolError("Invalid challenge reply");
  return { challenge: body.challenge, expiresIn: body.expires_in, type };
}
async function requestDepinChallenge(params) {
  const type = params.type ?? "receive";
  const { body, context } = await callDepinRpc({ ...params, method: "depinchallenge", args: { type } });
  return { ...decodeChallengeResult(body, type), context };
}
async function receiveDepinMessages(params) {
  const sequence = params.mode !== "timestamp";
  const method = sequence ? "depinreceiveseq" : "depinreceivemsg";
  const args = sequence ? {
    cursor: params.cursor ?? null,
    limit: params.limit ?? 100,
    from_timestamp: params.fromTimestamp ?? params.cursor?.from_timestamp ?? 0
  } : { timestamp: params.timestamp ?? 0, after_hash: params.afterHash ?? "", limit: params.limit ?? 100 };
  const { body, context, membershipChanged } = await callDepinRpc({ ...params, method, args });
  if (sequence) {
    if (!body.cursor || typeof body.has_more !== "boolean") throw new DepinProtocolError("Sequence reply missing cursor");
    depinRequestBytes(
      method,
      createDepinRpcRequest({ ...params, method, context, address: params.identity.address, args: { ...args, cursor: body.cursor } })
    );
    if (params.cursor && (body.cursor.stream_id !== params.cursor.stream_id || BigInt(body.cursor.after_seq) < BigInt(params.cursor.after_seq)))
      throw new DepinProtocolError("Sequence cursor changed stream or regressed");
    let previous = BigInt(params.cursor?.after_seq ?? 0);
    for (const item of body.messages ?? []) {
      if (typeof item.sequence !== "bigint" && !Number.isSafeInteger(item.sequence) || BigInt(item.sequence) <= previous || BigInt(item.sequence) > BigInt(body.cursor.after_seq))
        throw new DepinProtocolError("Invalid message admission sequence");
      previous = BigInt(item.sequence);
    }
  }
  const decoded = await decodeDepinReceiveResponse(body, {
    network: params.network,
    openPayload: (bytes) => params.identity.openReply(bytesToHex(bytes)),
    requestedToken: params.requestedToken ?? params.token,
    resolveSenderPubKey: params.resolveSenderPubKey,
    limits: params.limits
  });
  return { ...decoded, cursor: sequence ? Object.freeze({ ...body.cursor }) : null, context, membershipChanged, raw: body };
}
async function listDepinSectionsPublic(params) {
  const result = await callDepinRpc({ ...params, method: "depinlistsections" });
  if (!Array.isArray(result.body?.sections)) throw new DepinProtocolError("Invalid section list");
  return { ...result.body, context: result.context };
}
async function listDepinSectionsPrivate(params) {
  const result = await callDepinRpc({ ...params, token: params.scope, method: "depinlistsections" });
  if (!Array.isArray(result.body?.sections)) throw new DepinProtocolError("Invalid section list");
  return {
    ...result.body,
    nextChallenge: result.body.next_challenge ?? null,
    nextExpiresIn: result.body.next_expires_in ?? null,
    context: result.context
  };
}
async function clearDepinMessages(params) {
  const args = typeof params.mode === "number" || typeof params.mode === "bigint" ? { mode: "hours", hours: params.mode } : { mode: params.mode ?? "expired" };
  const result = await callDepinRpc({ ...params, token: params.scope || params.context?.pool_root, method: "depinclearmsg", args });
  return { ...result.body, context: result.context };
}
function decodeSubmitResult(body) {
  if (body?.result !== "success" || !/^[0-9a-f]{64}$/.test(body.hash)) throw new DepinProtocolError("Submit did not confirm success");
  return body;
}
async function submitDepinMessage(params) {
  assertIdentityCapabilities(params.identity, ["signMessage", "openReply"]);
  const parsed = await parseDepinMessage(params.messageHex);
  if (parsed.senderAddress !== params.identity.address) throw new DepinProtocolError("Message sender identity mismatch");
  const envelope = await wrapMessageForServer(params.messageHex, params.context?.pool_pubkey, params.identity.address);
  const { body, context } = await callDepinRpc({ ...params, token: "", method: "depinsubmitmsg", args: { encrypted: envelope.encrypted } });
  return { ...decodeSubmitResult(body), context };
}

// src/index.js
if (typeof globalThis !== "undefined") {
  globalThis.neuraiDepinMsg = {
    pubKeyMatchesAddress,
    decodeDepinAddress,
    encodeEcdsaAddress,
    strictEcdsaCommitment,
    DEPIN_RPC_PROTOCOL,
    depinRequestBytes,
    depinRequestHash,
    createDepinRpcRequest,
    buildDepinRpcRequestPreimage,
    buildDepinRpcResponsePreimage,
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
    callDepinRpc,
    getDepinPoolInfo,
    decodeDepinRecipientDirectory,
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
    DepinRpcError,
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
      decodeDepinAddress,
      encodeEcdsaAddress,
      strictEcdsaCommitment,
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
