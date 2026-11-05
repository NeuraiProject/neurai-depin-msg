var neuraiDepinMsg = (() => {
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
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

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
    ripemd160: () => ripemd1603,
    serializeEciesMessage: () => serializeEciesMessage,
    sha256: () => sha2563,
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

  // node_modules/@noble/hashes/esm/crypto.js
  var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

  // node_modules/@noble/hashes/esm/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function rotl(word, shift) {
    return word << shift | word >>> 32 - shift >>> 0;
  }
  var hasHexBuiltin = /* @__PURE__ */ (() => (
    // @ts-ignore
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
  ))();
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex2(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex2 = "";
    for (let i = 0; i < bytes.length; i++) {
      hex2 += hexes[bytes[i]];
    }
    return hex2;
  }
  var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes2(hex2) {
    if (typeof hex2 !== "string")
      throw new Error("hex string expected, got " + typeof hex2);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex2);
    const hl = hex2.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex2.charCodeAt(hi));
      const n2 = asciiToBase16(hex2.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex2[hi] + hex2[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function concatBytes2(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  var Hash = class {
  };
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function randomBytes(bytesLength = 32) {
    if (crypto2 && typeof crypto2.getRandomValues === "function") {
      return crypto2.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto2 && typeof crypto2.randomBytes === "function") {
      return Uint8Array.from(crypto2.randomBytes(bytesLength));
    }
    throw new Error("crypto.getRandomValues must be defined");
  }

  // node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      data = toBytes(data);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);

  // node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends HashMD {
    constructor(outputLen = 32) {
      super(64, outputLen, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());

  // node_modules/@noble/hashes/esm/sha256.js
  var sha2562 = sha256;

  // node_modules/@noble/hashes/esm/legacy.js
  var Rho160 = /* @__PURE__ */ Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]);
  var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
  var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
  var idxLR = /* @__PURE__ */ (() => {
    const L = [Id160];
    const R = [Pi160];
    const res = [L, R];
    for (let i = 0; i < 4; i++)
      for (let j of res)
        j.push(j[i].map((k) => Rho160[k]));
    return res;
  })();
  var idxL = /* @__PURE__ */ (() => idxLR[0])();
  var idxR = /* @__PURE__ */ (() => idxLR[1])();
  var shifts160 = /* @__PURE__ */ [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
  ].map((i) => Uint8Array.from(i));
  var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var Kl160 = /* @__PURE__ */ Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]);
  var Kr160 = /* @__PURE__ */ Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function ripemd_f(group, x, y, z) {
    if (group === 0)
      return x ^ y ^ z;
    if (group === 1)
      return x & y | ~x & z;
    if (group === 2)
      return (x | ~y) ^ z;
    if (group === 3)
      return x & z | y & ~z;
    return x ^ (y | ~z);
  }
  var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
  var RIPEMD160 = class extends HashMD {
    constructor() {
      super(64, 20, 8, true);
      this.h0 = 1732584193 | 0;
      this.h1 = 4023233417 | 0;
      this.h2 = 2562383102 | 0;
      this.h3 = 271733878 | 0;
      this.h4 = 3285377520 | 0;
    }
    get() {
      const { h0, h1, h2, h3, h4 } = this;
      return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
      this.h0 = h0 | 0;
      this.h1 = h1 | 0;
      this.h2 = h2 | 0;
      this.h3 = h3 | 0;
      this.h4 = h4 | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        BUF_160[i] = view.getUint32(offset, true);
      let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
      for (let group = 0; group < 5; group++) {
        const rGroup = 4 - group;
        const hbl = Kl160[group], hbr = Kr160[group];
        const rl = idxL[group], rr = idxR[group];
        const sl = shiftsL160[group], sr = shiftsR160[group];
        for (let i = 0; i < 16; i++) {
          const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
          al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
        }
        for (let i = 0; i < 16; i++) {
          const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
          ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
        }
      }
      this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
    }
    roundClean() {
      clean(BUF_160);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0);
    }
  };
  var ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());

  // node_modules/@noble/hashes/esm/ripemd160.js
  var ripemd1602 = ripemd160;

  // src/hash.js
  async function sha2563(data) {
    return sha2562(data);
  }
  async function doubleSha256(data) {
    return sha2562(sha2562(data));
  }
  function ripemd1603(data) {
    return ripemd1602(data);
  }
  async function hash160(data) {
    return ripemd1602(sha2562(data));
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
      const hash = sha2562(concatBytes(sharedSecret, counterBytes));
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
    const tag = sha2562(new TextEncoder().encode("NeuraiAuthScript"));
    return sha2562(concatBytes(tag, tag, new Uint8Array([3, 2]), ripemd1602(sha2562(publicKey)), sha2562(new Uint8Array([81]))));
  }
  function encodeEcdsaAddress(publicKey, network) {
    const hrp = normalizeNetwork(network) === "mainnet" ? "nq" : "tnq";
    const data = [3, ...convertBits(strictEcdsaCommitment(publicKey), 8, 5, true)];
    const expanded = [...hrp].map((c) => c.charCodeAt(0) >>> 5).concat(
      [0],
      [...hrp].map((c) => c.charCodeAt(0) & 31)
    );
    const mod2 = (bech32Polymod(expanded.concat(data, [0, 0, 0, 0, 0, 0])) ^ BECH32M_CONST) >>> 0;
    for (let i = 0; i < 6; i++) data.push(mod2 >>> 5 * (5 - i) & 31);
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

  // node_modules/@noble/hashes/esm/hmac.js
  var HMAC = class extends Hash {
    constructor(hash, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      ahash(hash);
      const key = toBytes(_key);
      this.iHash = hash.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      clean(pad);
    }
    update(buf) {
      aexists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists(this);
      abytes(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
  hmac.create = (hash, key) => new HMAC(hash, key);

  // node_modules/@noble/curves/esm/utils.js
  var _0n = /* @__PURE__ */ BigInt(0);
  var _1n = /* @__PURE__ */ BigInt(1);
  function _abool2(value, title = "") {
    if (typeof value !== "boolean") {
      const prefix = title && `"${title}"`;
      throw new Error(prefix + "expected boolean, got type=" + typeof value);
    }
    return value;
  }
  function _abytes2(value, length, title = "") {
    const bytes = isBytes(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
    }
    return value;
  }
  function numberToHexUnpadded(num) {
    const hex2 = num.toString(16);
    return hex2.length & 1 ? "0" + hex2 : hex2;
  }
  function hexToNumber(hex2) {
    if (typeof hex2 !== "string")
      throw new Error("hex string expected, got " + typeof hex2);
    return hex2 === "" ? _0n : BigInt("0x" + hex2);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex2(bytes));
  }
  function bytesToNumberLE(bytes) {
    abytes(bytes);
    return hexToNumber(bytesToHex2(Uint8Array.from(bytes).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function ensureBytes(title, hex2, expectedLength) {
    let res;
    if (typeof hex2 === "string") {
      try {
        res = hexToBytes2(hex2);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes(hex2)) {
      res = Uint8Array.from(hex2);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  var bitMask = (n) => (_1n << BigInt(n)) - _1n;
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    const u8n = (len) => new Uint8Array(len);
    const u8of = (byte) => Uint8Array.of(byte);
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n(0)) => {
      k = h(u8of(0), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8of(1), seed);
      v = h();
    };
    const gen = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes2(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  function _validateObject(object, fields, optFields = {}) {
    if (!object || typeof object !== "object")
      throw new Error("expected valid options object");
    function checkField(fieldName, expectedType, isOpt) {
      const val = object[fieldName];
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
    Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
  }
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }

  // node_modules/@noble/curves/esm/abstract/modular.js
  var _0n2 = BigInt(0);
  var _1n2 = BigInt(1);
  var _2n = /* @__PURE__ */ BigInt(2);
  var _3n = /* @__PURE__ */ BigInt(3);
  var _4n = /* @__PURE__ */ BigInt(4);
  var _5n = /* @__PURE__ */ BigInt(5);
  var _7n = /* @__PURE__ */ BigInt(7);
  var _8n = /* @__PURE__ */ BigInt(8);
  var _9n = /* @__PURE__ */ BigInt(9);
  var _16n = /* @__PURE__ */ BigInt(16);
  function mod(a, b) {
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n2) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number2, modulo) {
    if (number2 === _0n2)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n2)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number2, modulo);
    let b = modulo;
    let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function assertIsSquare(Fp, root, n) {
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function sqrt3mod4(Fp, n) {
    const p1div4 = (Fp.ORDER + _1n2) / _4n;
    const root = Fp.pow(n, p1div4);
    assertIsSquare(Fp, root, n);
    return root;
  }
  function sqrt5mod8(Fp, n) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n2 = Fp.mul(n, _2n);
    const v = Fp.pow(n2, p5div8);
    const nv = Fp.mul(n, v);
    const i = Fp.mul(Fp.mul(nv, _2n), v);
    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
    assertIsSquare(Fp, root, n);
    return root;
  }
  function sqrt9mod16(P) {
    const Fp_ = Field(P);
    const tn = tonelliShanks(P);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P + _7n) / _16n;
    return (Fp, n) => {
      let tv1 = Fp.pow(n, c4);
      let tv2 = Fp.mul(tv1, c1);
      const tv3 = Fp.mul(tv1, c2);
      const tv4 = Fp.mul(tv1, c3);
      const e1 = Fp.eql(Fp.sqr(tv2), n);
      const e2 = Fp.eql(Fp.sqr(tv3), n);
      tv1 = Fp.cmov(tv1, tv2, e1);
      tv2 = Fp.cmov(tv4, tv3, e2);
      const e3 = Fp.eql(Fp.sqr(tv2), n);
      const root = Fp.cmov(tv1, tv2, e3);
      assertIsSquare(Fp, root, n);
      return root;
    };
  }
  function tonelliShanks(P) {
    if (P < _3n)
      throw new Error("sqrt is not defined for small field");
    let Q = P - _1n2;
    let S = 0;
    while (Q % _2n === _0n2) {
      Q /= _2n;
      S++;
    }
    let Z = _2n;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q);
    const Q1div2 = (Q + _1n2) / _2n;
    return function tonelliSlow(Fp, n) {
      if (Fp.is0(n))
        return n;
      if (FpLegendre(Fp, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = Fp.mul(Fp.ONE, cc);
      let t = Fp.pow(n, Q);
      let R = Fp.pow(n, Q1div2);
      while (!Fp.eql(t, Fp.ONE)) {
        if (Fp.is0(t))
          return Fp.ZERO;
        let i = 1;
        let t_tmp = Fp.sqr(t);
        while (!Fp.eql(t_tmp, Fp.ONE)) {
          i++;
          t_tmp = Fp.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M - i - 1);
        const b = Fp.pow(c, exponent);
        M = i;
        c = Fp.sqr(b);
        t = Fp.mul(t, c);
        R = Fp.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    if (P % _16n === _9n)
      return sqrt9mod16(P);
    return tonelliShanks(P);
  }
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "number",
      BITS: "number"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    _validateObject(field, opts);
    return field;
  }
  function FpPow(Fp, num, power) {
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return Fp.ONE;
    if (power === _1n2)
      return num;
    let p = Fp.ONE;
    let d = num;
    while (power > _0n2) {
      if (power & _1n2)
        p = Fp.mul(p, d);
      d = Fp.sqr(d);
      power >>= _1n2;
    }
    return p;
  }
  function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num, i) => {
      if (Fp.is0(num))
        return acc;
      inverted[i] = acc;
      return Fp.mul(acc, num);
    }, Fp.ONE);
    const invertedAcc = Fp.inv(multipliedAcc);
    nums.reduceRight((acc, num, i) => {
      if (Fp.is0(num))
        return acc;
      inverted[i] = Fp.mul(acc, inverted[i]);
      return Fp.mul(acc, num);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp, n) {
    const p1mod2 = (Fp.ORDER - _1n2) / _2n;
    const powered = Fp.pow(n, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLenOrOpts, isLE2 = false, opts = {}) {
    if (ORDER <= _0n2)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    let _sqrt = void 0;
    let modFromBytes = false;
    let allowedLengths = void 0;
    if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
      if (opts.sqrt || isLE2)
        throw new Error("cannot specify opts in two arguments");
      const _opts = bitLenOrOpts;
      if (_opts.BITS)
        _nbitLength = _opts.BITS;
      if (_opts.sqrt)
        _sqrt = _opts.sqrt;
      if (typeof _opts.isLE === "boolean")
        isLE2 = _opts.isLE;
      if (typeof _opts.modFromBytes === "boolean")
        modFromBytes = _opts.modFromBytes;
      allowedLengths = _opts.allowedLengths;
    } else {
      if (typeof bitLenOrOpts === "number")
        _nbitLength = bitLenOrOpts;
      if (opts.sqrt)
        _sqrt = opts.sqrt;
    }
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      isLE: isLE2,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n2,
      ONE: _1n2,
      allowedLengths,
      create: (num) => mod(num, ORDER),
      isValid: (num) => {
        if (typeof num !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num);
        return _0n2 <= num && num < ORDER;
      },
      is0: (num) => num === _0n2,
      // is valid and invertible
      isValidNot0: (num) => !f.is0(num) && f.isValid(num),
      isOdd: (num) => (num & _1n2) === _1n2,
      neg: (num) => mod(-num, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num) => mod(num * num, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num, power) => FpPow(f, num, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num) => num * num,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num) => invert(num, ORDER),
      sqrt: _sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f, n);
      }),
      toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
      fromBytes: (bytes, skipValidation = true) => {
        if (allowedLengths) {
          if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
            throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
          }
          const padded = new Uint8Array(BYTES);
          padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
          bytes = padded;
        }
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
        if (modFromBytes)
          scalar = mod(scalar, ORDER);
        if (!skipValidation) {
          if (!f.isValid(scalar))
            throw new Error("invalid field element: outside of range 0..ORDER");
        }
        return scalar;
      },
      // TODO: we don't need it here, move out to separate fn
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov: (a, b, c) => c ? b : a
    });
    return Object.freeze(f);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num, fieldOrder - _1n2) + _1n2;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }

  // node_modules/@noble/curves/esm/abstract/curve.js
  var _0n3 = BigInt(0);
  var _1n3 = BigInt(1);
  function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function normalizeZ(c, points) {
    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n3;
    }
    const offsetStart = window * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function assert0(n) {
    if (n !== _0n3)
      throw new Error("invalid wNAF");
  }
  var wNAF = class {
    // Parametrized with a given Point class (not individual point)
    constructor(Point, bits) {
      this.BASE = Point.BASE;
      this.ZERO = Point.ZERO;
      this.Fn = Point.Fn;
      this.bits = bits;
    }
    // non-const time multiplication ladder
    _unsafeLadder(elm, n, p = this.ZERO) {
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    }
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param point Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(point, W) {
      const { windows, windowSize } = calcWOpts(W, this.bits);
      const points = [];
      let p = point;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    }
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * More compact implementation:
     * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      if (!this.Fn.isValid(n))
        throw new Error("invalid scalar");
      let p = this.ZERO;
      let f = this.BASE;
      const wo = calcWOpts(W, this.bits);
      for (let window = 0; window < wo.windows; window++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          f = f.add(negateCt(isNegF, precomputes[offsetF]));
        } else {
          p = p.add(negateCt(isNeg, precomputes[offset]));
        }
      }
      assert0(n);
      return { p, f };
    }
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
      const wo = calcWOpts(W, this.bits);
      for (let window = 0; window < wo.windows; window++) {
        if (n === _0n3)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      assert0(n);
      return acc;
    }
    getPrecomputes(W, point, transform) {
      let comp = pointPrecomputes.get(point);
      if (!comp) {
        comp = this.precomputeWindow(point, W);
        if (W !== 1) {
          if (typeof transform === "function")
            comp = transform(comp);
          pointPrecomputes.set(point, comp);
        }
      }
      return comp;
    }
    cached(point, scalar, transform) {
      const W = getW(point);
      return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
    }
    unsafe(point, scalar, transform, prev) {
      const W = getW(point);
      if (W === 1)
        return this._unsafeLadder(point, scalar, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
    }
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    createCache(P, W) {
      validateW(W, this.bits);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
    hasCache(elm) {
      return getW(elm) !== 1;
    }
  };
  function mulEndoUnsafe(Point, point, k1, k2) {
    let acc = point;
    let p1 = Point.ZERO;
    let p2 = Point.ZERO;
    while (k1 > _0n3 || k2 > _0n3) {
      if (k1 & _1n3)
        p1 = p1.add(acc);
      if (k2 & _1n3)
        p2 = p2.add(acc);
      acc = acc.double();
      k1 >>= _1n3;
      k2 >>= _1n3;
    }
    return { p1, p2 };
  }
  function pippenger(c, fieldN, points, scalars) {
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c.ZERO;
    const wbits = bitLen(BigInt(plength));
    let windowSize = 1;
    if (wbits > 12)
      windowSize = wbits - 3;
    else if (wbits > 4)
      windowSize = wbits - 2;
    else if (wbits > 0)
      windowSize = 2;
    const MASK = bitMask(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j = 0; j < slength; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & MASK);
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero;
      for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function createField(order, field, isLE2) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE: isLE2 });
    }
  }
  function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    for (const p of ["p", "n", "h"]) {
      const val = CURVE[p];
      if (!(typeof val === "bigint" && val > _0n3))
        throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b];
    for (const p of params) {
      if (!Fp.isValid(CURVE[p]))
        throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp, Fn };
  }

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n2) / den;
  function _splitEndoScalar(k, basis, n) {
    const [[a1, b1], [a2, b2]] = basis;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = k - c1 * a1 - c2 * a2;
    let k2 = -c1 * b1 - c2 * b2;
    const k1neg = k1 < _0n4;
    const k2neg = k2 < _0n4;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k2 = -k2;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
    if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function validateSigFormat(format) {
    if (!["compact", "recovered", "der"].includes(format))
      throw new Error('Signature format must be "compact", "recovered", or "der"');
    return format;
  }
  function validateSigOpts(opts, def) {
    const optsn = {};
    for (let optName of Object.keys(def)) {
      optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
    }
    _abool2(optsn.lowS, "lowS");
    _abool2(optsn.prehash, "prehash");
    if (optsn.format !== void 0)
      validateSigFormat(optsn.format);
    return optsn;
  }
  var DERErr = class extends Error {
    constructor(m = "") {
      super(m);
    }
  };
  var DER = {
    // asn.1 DER encoding utils
    Err: DERErr,
    // Basic building block is TLV (Tag-Length-Value)
    _tlv: {
      encode: (tag, data) => {
        const { Err: E } = DER;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length & 1)
          throw new E("tlv.encode: unpadded data");
        const dataLen = data.length / 2;
        const len = numberToHexUnpadded(dataLen);
        if (len.length / 2 & 128)
          throw new E("tlv.encode: long form length too big");
        const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
        const t = numberToHexUnpadded(tag);
        return t + lenLen + len + data;
      },
      // v - value, l - left bytes (unparsed)
      decode(tag, data) {
        const { Err: E } = DER;
        let pos = 0;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length < 2 || data[pos++] !== tag)
          throw new E("tlv.decode: wrong tlv");
        const first = data[pos++];
        const isLong = !!(first & 128);
        let length = 0;
        if (!isLong)
          length = first;
        else {
          const lenLen = first & 127;
          if (!lenLen)
            throw new E("tlv.decode(long): indefinite length not supported");
          if (lenLen > 4)
            throw new E("tlv.decode(long): byte length is too big");
          const lengthBytes = data.subarray(pos, pos + lenLen);
          if (lengthBytes.length !== lenLen)
            throw new E("tlv.decode: length bytes not complete");
          if (lengthBytes[0] === 0)
            throw new E("tlv.decode(long): zero leftmost byte");
          for (const b of lengthBytes)
            length = length << 8 | b;
          pos += lenLen;
          if (length < 128)
            throw new E("tlv.decode(long): not minimal encoding");
        }
        const v = data.subarray(pos, pos + length);
        if (v.length !== length)
          throw new E("tlv.decode: wrong value length");
        return { v, l: data.subarray(pos + length) };
      }
    },
    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
    // since we always use positive integers here. It must always be empty:
    // - add zero byte if exists
    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
    _int: {
      encode(num) {
        const { Err: E } = DER;
        if (num < _0n4)
          throw new E("integer: negative integers are not allowed");
        let hex2 = numberToHexUnpadded(num);
        if (Number.parseInt(hex2[0], 16) & 8)
          hex2 = "00" + hex2;
        if (hex2.length & 1)
          throw new E("unexpected DER parsing assertion: unpadded hex");
        return hex2;
      },
      decode(data) {
        const { Err: E } = DER;
        if (data[0] & 128)
          throw new E("invalid signature integer: negative");
        if (data[0] === 0 && !(data[1] & 128))
          throw new E("invalid signature integer: unnecessary leading zero");
        return bytesToNumberBE(data);
      }
    },
    toSig(hex2) {
      const { Err: E, _int: int, _tlv: tlv } = DER;
      const data = ensureBytes("signature", hex2);
      const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
      if (seqLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
      const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
      if (sLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      return { r: int.decode(rBytes), s: int.decode(sBytes) };
    },
    hexFromSig(sig) {
      const { _tlv: tlv, _int: int } = DER;
      const rs = tlv.encode(2, int.encode(sig.r));
      const ss = tlv.encode(2, int.encode(sig.s));
      const seq = rs + ss;
      return tlv.encode(48, seq);
    }
  };
  var _0n4 = BigInt(0);
  var _1n4 = BigInt(1);
  var _2n2 = BigInt(2);
  var _3n2 = BigInt(3);
  var _4n2 = BigInt(4);
  function _normFnElement(Fn, key) {
    const { BYTES: expected } = Fn;
    let num;
    if (typeof key === "bigint") {
      num = key;
    } else {
      let bytes = ensureBytes("private key", key);
      try {
        num = Fn.fromBytes(bytes);
      } catch (error) {
        throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
      }
    }
    if (!Fn.isValidNot0(num))
      throw new Error("invalid private key: out of range [1..N-1]");
    return num;
  }
  function weierstrassN(params, extraOpts = {}) {
    const validated = _createCurveFields("weierstrass", params, extraOpts);
    const { Fp, Fn } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    _validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
      wrapPrivateKey: "boolean"
    });
    const { endo } = extraOpts;
    if (endo) {
      if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const lengths = getWLengths(Fp, Fn);
    function assertCompressionIsSupported() {
      if (!Fp.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes(_c, point, isCompressed) {
      const { x, y } = point.toAffine();
      const bx = Fp.toBytes(x);
      _abool2(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp.isOdd(y);
        return concatBytes2(pprefix(hasEvenY), bx);
      } else {
        return concatBytes2(Uint8Array.of(4), bx, Fp.toBytes(y));
      }
    }
    function pointFromBytes(bytes) {
      _abytes2(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (length === comp && (head === 2 || head === 3)) {
        const x = Fp.fromBytes(tail);
        if (!Fp.isValid(x))
          throw new Error("bad point: is not on curve, wrong x");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp.sqrt(y2);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const isYOdd = Fp.isOdd(y);
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp.neg(y);
        return { x, y };
      } else if (length === uncomp && head === 4) {
        const L = Fp.BYTES;
        const x = Fp.fromBytes(tail.subarray(0, L));
        const y = Fp.fromBytes(tail.subarray(L, L * 2));
        if (!isValidXY(x, y))
          throw new Error("bad point: is not on curve");
        return { x, y };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = extraOpts.toBytes || pointToBytes;
    const decodePoint = extraOpts.fromBytes || pointFromBytes;
    function weierstrassEquation(x) {
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
    }
    function isValidXY(x, y) {
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      return Fp.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
    if (Fp.is0(Fp.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp.isValid(n) || banZero && Fp.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("ProjectivePoint expected");
    }
    function splitEndoScalarN(k) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k, endo.basises, Fn.ORDER);
    }
    const toAffineMemo = memoized((p, iz) => {
      const { X, Y, Z } = p;
      if (Fp.eql(Z, Fp.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(Z);
      const x = Fp.mul(X, iz);
      const y = Fp.mul(Y, iz);
      const zz = Fp.mul(Z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
      k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
      k1p = negateCt(k1neg, k1p);
      k2p = negateCt(k2neg, k2p);
      return k1p.add(k2p);
    }
    class Point {
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      constructor(X, Y, Z) {
        this.X = acoord("x", X);
        this.Y = acoord("y", Y, true);
        this.Z = acoord("z", Z);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point)
          throw new Error("projective point not allowed");
        if (Fp.is0(x) && Fp.is0(y))
          return Point.ZERO;
        return new Point(x, y, Fp.ONE);
      }
      static fromBytes(bytes) {
        const P = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
        P.assertValidity();
        return P;
      }
      static fromHex(hex2) {
        return Point.fromBytes(ensureBytes("pointHex", hex2));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       *
       * @param windowSize
       * @param isLazy true will defer table computation until the first multiplication
       * @returns
       */
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_3n2);
        return this;
      }
      // TODO: return `this`
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (!Fp.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp.isOdd(y);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new Point(this.X, Fp.neg(this.Y), this.Z);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE;
        const b3 = Fp.mul(b, _3n2);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE.a;
        const b3 = Fp.mul(CURVE.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2 } = extraOpts;
        if (!Fn.isValidNot0(scalar))
          throw new Error("invalid scalar: out of range");
        let point, fake;
        const mul3 = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
          const { p: k1p, f: k1f } = mul3(k1);
          const { p: k2p, f: k2f } = mul3(k2);
          fake = k1f.add(k2f);
          point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
        } else {
          const { p, f } = mul3(scalar);
          point = p;
          fake = f;
        }
        return normalizeZ(Point, [point, fake])[0];
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2 } = extraOpts;
        const p = this;
        if (!Fn.isValid(sc))
          throw new Error("invalid scalar: out of range");
        if (sc === _0n4 || p.is0())
          return Point.ZERO;
        if (sc === _1n4)
          return p;
        if (wnaf.hasCache(this))
          return this.multiply(sc);
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
          const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
          return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
        } else {
          return wnaf.unsafe(p, sc);
        }
      }
      multiplyAndAddUnsafe(Q, a, b) {
        const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
        return sum.is0() ? void 0 : sum;
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        const { isTorsionFree } = extraOpts;
        if (cofactor === _1n4)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        return wnaf.unsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        const { clearCofactor } = extraOpts;
        if (cofactor === _1n4)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      toBytes(isCompressed = true) {
        _abool2(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex2(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
      // TODO: remove
      get px() {
        return this.X;
      }
      get py() {
        return this.X;
      }
      get pz() {
        return this.Z;
      }
      toRawBytes(isCompressed = true) {
        return this.toBytes(isCompressed);
      }
      _setWindowSize(windowSize) {
        this.precompute(windowSize);
      }
      static normalizeZ(points) {
        return normalizeZ(Point, points);
      }
      static msm(points, scalars) {
        return pippenger(Point, Fn, points, scalars);
      }
      static fromPrivateKey(privateKey) {
        return Point.BASE.multiply(_normFnElement(Fn, privateKey));
      }
    }
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    Point.Fp = Fp;
    Point.Fn = Fn;
    const bits = Fn.BITS;
    const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
    Point.BASE.precompute(8);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function getWLengths(Fp, Fn) {
    return {
      secretKey: Fn.BYTES,
      publicKey: 1 + Fp.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * Fn.BYTES
    };
  }
  function ecdh(Point, ecdhOpts = {}) {
    const { Fn } = Point;
    const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
    const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
    function isValidSecretKey(secretKey) {
      try {
        return !!_normFnElement(Fn, secretKey);
      } catch (error) {
        return false;
      }
    }
    function isValidPublicKey(publicKey, isCompressed) {
      const { publicKey: comp, publicKeyUncompressed } = lengths;
      try {
        const l = publicKey.length;
        if (isCompressed === true && l !== comp)
          return false;
        if (isCompressed === false && l !== publicKeyUncompressed)
          return false;
        return !!Point.fromBytes(publicKey);
      } catch (error) {
        return false;
      }
    }
    function randomSecretKey(seed = randomBytes_(lengths.seed)) {
      return mapHashToField(_abytes2(seed, lengths.seed, "seed"), Fn.ORDER);
    }
    function getPublicKey(secretKey, isCompressed = true) {
      return Point.BASE.multiply(_normFnElement(Fn, secretKey)).toBytes(isCompressed);
    }
    function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    }
    function isProbPub(item) {
      if (typeof item === "bigint")
        return false;
      if (item instanceof Point)
        return true;
      const { secretKey, publicKey, publicKeyUncompressed } = lengths;
      if (Fn.allowedLengths || secretKey === publicKey)
        return void 0;
      const l = ensureBytes("key", item).length;
      return l === publicKey || l === publicKeyUncompressed;
    }
    function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
      if (isProbPub(secretKeyA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicKeyB) === false)
        throw new Error("second arg must be public key");
      const s = _normFnElement(Fn, secretKeyA);
      const b = Point.fromHex(publicKeyB);
      return b.multiply(s).toBytes(isCompressed);
    }
    const utils = {
      isValidSecretKey,
      isValidPublicKey,
      randomSecretKey,
      // TODO: remove
      isValidPrivateKey: isValidSecretKey,
      randomPrivateKey: randomSecretKey,
      normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
      precompute(windowSize = 8, point = Point.BASE) {
        return point.precompute(windowSize, false);
      }
    };
    return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
  }
  function ecdsa(Point, hash, ecdsaOpts = {}) {
    ahash(hash);
    _validateObject(ecdsaOpts, {}, {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function"
    });
    const randomBytes3 = ecdsaOpts.randomBytes || randomBytes;
    const hmac2 = ecdsaOpts.hmac || ((key, ...msgs) => hmac(hash, key, concatBytes2(...msgs)));
    const { Fp, Fn } = Point;
    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
    const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
    const defaultSigOpts = {
      prehash: false,
      lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : false,
      format: void 0,
      //'compact' as ECDSASigFormat,
      extraEntropy: false
    };
    const defaultSigOpts_format = "compact";
    function isBiggerThanHalfOrder(number2) {
      const HALF = CURVE_ORDER >> _1n4;
      return number2 > HALF;
    }
    function validateRS(title, num) {
      if (!Fn.isValidNot0(num))
        throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
      return num;
    }
    function validateSigLength(bytes, format) {
      validateSigFormat(format);
      const size = lengths.signature;
      const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
      return _abytes2(bytes, sizer, `${format} signature`);
    }
    class Signature {
      constructor(r, s, recovery) {
        this.r = validateRS("r", r);
        this.s = validateRS("s", s);
        if (recovery != null)
          this.recovery = recovery;
        Object.freeze(this);
      }
      static fromBytes(bytes, format = defaultSigOpts_format) {
        validateSigLength(bytes, format);
        let recid;
        if (format === "der") {
          const { r: r2, s: s2 } = DER.toSig(_abytes2(bytes));
          return new Signature(r2, s2);
        }
        if (format === "recovered") {
          recid = bytes[0];
          format = "compact";
          bytes = bytes.subarray(1);
        }
        const L = Fn.BYTES;
        const r = bytes.subarray(0, L);
        const s = bytes.subarray(L, L * 2);
        return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
      }
      static fromHex(hex2, format) {
        return this.fromBytes(hexToBytes2(hex2), format);
      }
      addRecoveryBit(recovery) {
        return new Signature(this.r, this.s, recovery);
      }
      recoverPublicKey(messageHash) {
        const FIELD_ORDER = Fp.ORDER;
        const { r, s, recovery: rec } = this;
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const hasCofactor = CURVE_ORDER * _2n2 < FIELD_ORDER;
        if (hasCofactor && rec > 1)
          throw new Error("recovery id is ambiguous for h>1 curve");
        const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
        if (!Fp.isValid(radj))
          throw new Error("recovery id 2 or 3 invalid");
        const x = Fp.toBytes(radj);
        const R = Point.fromBytes(concatBytes2(pprefix((rec & 1) === 0), x));
        const ir = Fn.inv(radj);
        const h = bits2int_modN(ensureBytes("msgHash", messageHash));
        const u1 = Fn.create(-h * ir);
        const u2 = Fn.create(s * ir);
        const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
        if (Q.is0())
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      toBytes(format = defaultSigOpts_format) {
        validateSigFormat(format);
        if (format === "der")
          return hexToBytes2(DER.hexFromSig(this));
        const r = Fn.toBytes(this.r);
        const s = Fn.toBytes(this.s);
        if (format === "recovered") {
          if (this.recovery == null)
            throw new Error("recovery bit must be present");
          return concatBytes2(Uint8Array.of(this.recovery), r, s);
        }
        return concatBytes2(r, s);
      }
      toHex(format) {
        return bytesToHex2(this.toBytes(format));
      }
      // TODO: remove
      assertValidity() {
      }
      static fromCompact(hex2) {
        return Signature.fromBytes(ensureBytes("sig", hex2), "compact");
      }
      static fromDER(hex2) {
        return Signature.fromBytes(ensureBytes("sig", hex2), "der");
      }
      normalizeS() {
        return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
      }
      toDERRawBytes() {
        return this.toBytes("der");
      }
      toDERHex() {
        return bytesToHex2(this.toBytes("der"));
      }
      toCompactRawBytes() {
        return this.toBytes("compact");
      }
      toCompactHex() {
        return bytesToHex2(this.toBytes("compact"));
      }
    }
    const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - fnBits;
      return delta > 0 ? num >> BigInt(delta) : num;
    };
    const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
      return Fn.create(bits2int(bytes));
    };
    const ORDER_MASK = bitMask(fnBits);
    function int2octets(num) {
      aInRange("num < 2^" + fnBits, num, _0n4, ORDER_MASK);
      return Fn.toBytes(num);
    }
    function validateMsgAndHash(message, prehash) {
      _abytes2(message, void 0, "message");
      return prehash ? _abytes2(hash(message), void 0, "prehashed message") : message;
    }
    function prepSig(message, privateKey, opts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      const h1int = bits2int_modN(message);
      const d = _normFnElement(Fn, privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (extraEntropy != null && extraEntropy !== false) {
        const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
        seedArgs.push(ensureBytes("extraEntropy", e));
      }
      const seed = concatBytes2(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!Fn.isValidNot0(k))
          return;
        const ik = Fn.inv(k);
        const q = Point.BASE.multiply(k).toAffine();
        const r = Fn.create(q.x);
        if (r === _0n4)
          return;
        const s = Fn.create(ik * Fn.create(m + r * d));
        if (s === _0n4)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = Fn.neg(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, recovery);
      }
      return { seed, k2sig };
    }
    function sign(message, secretKey, opts = {}) {
      message = ensureBytes("message", message);
      const { seed, k2sig } = prepSig(message, secretKey, opts);
      const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac2);
      const sig = drbg(seed, k2sig);
      return sig;
    }
    function tryParsingSig(sg) {
      let sig = void 0;
      const isHex2 = typeof sg === "string" || isBytes(sg);
      const isObj = !isHex2 && sg !== null && typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint";
      if (!isHex2 && !isObj)
        throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      if (isObj) {
        sig = new Signature(sg.r, sg.s);
      } else if (isHex2) {
        try {
          sig = Signature.fromBytes(ensureBytes("sig", sg), "der");
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!sig) {
          try {
            sig = Signature.fromBytes(ensureBytes("sig", sg), "compact");
          } catch (error) {
            return false;
          }
        }
      }
      if (!sig)
        return false;
      return sig;
    }
    function verify(signature, message, publicKey, opts = {}) {
      const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
      publicKey = ensureBytes("publicKey", publicKey);
      message = validateMsgAndHash(ensureBytes("message", message), prehash);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      const sig = format === void 0 ? tryParsingSig(signature) : Signature.fromBytes(ensureBytes("sig", signature), format);
      if (sig === false)
        return false;
      try {
        const P = Point.fromBytes(publicKey);
        if (lowS && sig.hasHighS())
          return false;
        const { r, s } = sig;
        const h = bits2int_modN(message);
        const is = Fn.inv(s);
        const u1 = Fn.create(h * is);
        const u2 = Fn.create(r * is);
        const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
        if (R.is0())
          return false;
        const v = Fn.create(R.x);
        return v === r;
      } catch (e) {
        return false;
      }
    }
    function recoverPublicKey(signature, message, opts = {}) {
      const { prehash } = validateSigOpts(opts, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
    }
    return Object.freeze({
      keygen,
      getPublicKey,
      getSharedSecret,
      utils,
      lengths,
      Point,
      sign,
      verify,
      recoverPublicKey,
      Signature,
      hash
    });
  }
  function _weierstrass_legacy_opts_to_new(c) {
    const CURVE = {
      a: c.a,
      b: c.b,
      p: c.Fp.ORDER,
      n: c.n,
      h: c.h,
      Gx: c.Gx,
      Gy: c.Gy
    };
    const Fp = c.Fp;
    let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
    const Fn = Field(CURVE.n, {
      BITS: c.nBitLength,
      allowedLengths,
      modFromBytes: c.wrapPrivateKey
    });
    const curveOpts = {
      Fp,
      Fn,
      allowInfinityPoint: c.allowInfinityPoint,
      endo: c.endo,
      isTorsionFree: c.isTorsionFree,
      clearCofactor: c.clearCofactor,
      fromBytes: c.fromBytes,
      toBytes: c.toBytes
    };
    return { CURVE, curveOpts };
  }
  function _ecdsa_legacy_opts_to_new(c) {
    const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
    const ecdsaOpts = {
      hmac: c.hmac,
      randomBytes: c.randomBytes,
      lowS: c.lowS,
      bits2int: c.bits2int,
      bits2int_modN: c.bits2int_modN
    };
    return { CURVE, curveOpts, hash: c.hash, ecdsaOpts };
  }
  function _ecdsa_new_output_to_legacy(c, _ecdsa) {
    const Point = _ecdsa.Point;
    return Object.assign({}, _ecdsa, {
      ProjectivePoint: Point,
      CURVE: Object.assign({}, c, nLength(Point.Fn.ORDER, Point.Fn.BITS))
    });
  }
  function weierstrass(c) {
    const { CURVE, curveOpts, hash, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
    const Point = weierstrassN(CURVE, curveOpts);
    const signs = ecdsa(Point, hash, ecdsaOpts);
    return _ecdsa_new_output_to_legacy(c, signs);
  }

  // node_modules/@noble/curves/esm/_shortw_utils.js
  function createCurve(curveDef, defHash) {
    const create = (hash) => weierstrass({ ...curveDef, hash });
    return { ...create(defHash), create };
  }

  // node_modules/@noble/curves/esm/secp256k1.js
  var secp256k1_CURVE = {
    p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h: BigInt(1),
    a: BigInt(0),
    b: BigInt(7),
    Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
    Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
  };
  var secp256k1_ENDO = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    basises: [
      [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
      [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
    ]
  };
  var _2n3 = /* @__PURE__ */ BigInt(2);
  function sqrtMod(y) {
    const P = secp256k1_CURVE.p;
    const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n3, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n3, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n3, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
  var secp256k1 = createCurve({ ...secp256k1_CURVE, Fp: Fpk1, lowS: true, endo: secp256k1_ENDO }, sha256);

  // src/keys.js
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
      point = secp256k1.ProjectivePoint.fromHex(bytes);
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
      compressed: secp256k1.getPublicKey(privKeyBytes, true),
      uncompressed: secp256k1.getPublicKey(privKeyBytes, false)
    };
  }
  function privateKeyMatchesPublicKey(privKeyBytes, pubKeyHexOrBytes) {
    const parsed = parsePublicKey(pubKeyHexOrBytes);
    const derived = bytesToHex(secp256k1.getPublicKey(privKeyBytes, true));
    return parsed.pointId === derived;
  }

  // node_modules/@noble/ciphers/esm/utils.js
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abool(b) {
    if (typeof b !== "boolean")
      throw new Error(`boolean expected, not ${b}`);
  }
  function abytes2(b, ...lengths) {
    if (!isBytes2(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function aexists2(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput2(out, instance) {
    abytes2(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function u8(arr) {
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean2(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView2(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  function utf8ToBytes2(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes2(data) {
    if (typeof data === "string")
      data = utf8ToBytes2(data);
    else if (isBytes2(data))
      data = copyBytes(data);
    else
      throw new Error("Uint8Array expected, got " + typeof data);
    return data;
  }
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
    function wrappedCipher(key, ...args) {
      abytes2(key);
      if (!isLE)
        throw new Error("Non little-endian hardware is not yet supported");
      if (params.nonceLength !== void 0) {
        const nonce = args[0];
        if (!nonce)
          throw new Error("nonce / iv required");
        if (params.varSizeNonce)
          abytes2(nonce);
        else
          abytes2(nonce, params.nonceLength);
      }
      const tagl = params.tagLength;
      if (tagl && args[1] !== void 0) {
        abytes2(args[1]);
      }
      const cipher = constructor(key, ...args);
      const checkOutput = (fnLength, output) => {
        if (output !== void 0) {
          if (fnLength !== 2)
            throw new Error("cipher output not supported");
          abytes2(output);
        }
      };
      let called = false;
      const wrCipher = {
        encrypt(data, output) {
          if (called)
            throw new Error("cannot encrypt() twice with same key + nonce");
          called = true;
          abytes2(data);
          checkOutput(cipher.encrypt.length, output);
          return cipher.encrypt(data, output);
        },
        decrypt(data, output) {
          abytes2(data);
          if (tagl && data.length < tagl)
            throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
          checkOutput(cipher.decrypt.length, output);
          return cipher.decrypt(data, output);
        }
      };
      return wrCipher;
    }
    Object.assign(wrappedCipher, params);
    return wrappedCipher;
  };
  function getOutput(expectedLength, out, onlyAligned = true) {
    if (out === void 0)
      return new Uint8Array(expectedLength);
    if (out.length !== expectedLength)
      throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
    if (onlyAligned && !isAligned32(out))
      throw new Error("invalid output, must be aligned");
    return out;
  }
  function setBigUint642(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  function u64Lengths(dataLength, aadLength, isLE2) {
    abool(isLE2);
    const num = new Uint8Array(16);
    const view = createView2(num);
    setBigUint642(view, 0, BigInt(aadLength), isLE2);
    setBigUint642(view, 8, BigInt(dataLength), isLE2);
    return num;
  }
  function isAligned32(bytes) {
    return bytes.byteOffset % 4 === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }

  // node_modules/@noble/ciphers/esm/_polyval.js
  var BLOCK_SIZE = 16;
  var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
  var ZEROS32 = u32(ZEROS16);
  var POLY = 225;
  var mul2 = (s0, s1, s2, s3) => {
    const hiBit = s3 & 1;
    return {
      s3: s2 << 31 | s3 >>> 1,
      s2: s1 << 31 | s2 >>> 1,
      s1: s0 << 31 | s1 >>> 1,
      s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
      // reduce % poly
    };
  };
  var swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
  function _toGHASHKey(k) {
    k.reverse();
    const hiBit = k[15] & 1;
    let carry = 0;
    for (let i = 0; i < k.length; i++) {
      const t = k[i];
      k[i] = t >>> 1 | carry;
      carry = (t & 1) << 7;
    }
    k[0] ^= -hiBit & 225;
    return k;
  }
  var estimateWindow = (bytes) => {
    if (bytes > 64 * 1024)
      return 8;
    if (bytes > 1024)
      return 4;
    return 2;
  };
  var GHASH = class {
    // We select bits per window adaptively based on expectedLength
    constructor(key, expectedLength) {
      this.blockLen = BLOCK_SIZE;
      this.outputLen = BLOCK_SIZE;
      this.s0 = 0;
      this.s1 = 0;
      this.s2 = 0;
      this.s3 = 0;
      this.finished = false;
      key = toBytes2(key);
      abytes2(key, 16);
      const kView = createView2(key);
      let k0 = kView.getUint32(0, false);
      let k1 = kView.getUint32(4, false);
      let k2 = kView.getUint32(8, false);
      let k3 = kView.getUint32(12, false);
      const doubles = [];
      for (let i = 0; i < 128; i++) {
        doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
        ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
      }
      const W = estimateWindow(expectedLength || 1024);
      if (![1, 2, 4, 8].includes(W))
        throw new Error("ghash: invalid window size, expected 2, 4 or 8");
      this.W = W;
      const bits = 128;
      const windows = bits / W;
      const windowSize = this.windowSize = 2 ** W;
      const items = [];
      for (let w = 0; w < windows; w++) {
        for (let byte = 0; byte < windowSize; byte++) {
          let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
          for (let j = 0; j < W; j++) {
            const bit = byte >>> W - j - 1 & 1;
            if (!bit)
              continue;
            const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
            s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
          }
          items.push({ s0, s1, s2, s3 });
        }
      }
      this.t = items;
    }
    _updateBlock(s0, s1, s2, s3) {
      s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
      const { W, t, windowSize } = this;
      let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
      const mask = (1 << W) - 1;
      let w = 0;
      for (const num of [s0, s1, s2, s3]) {
        for (let bytePos = 0; bytePos < 4; bytePos++) {
          const byte = num >>> 8 * bytePos & 255;
          for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
            const bit = byte >>> W * bitPos & mask;
            const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
            o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
            w += 1;
          }
        }
      }
      this.s0 = o0;
      this.s1 = o1;
      this.s2 = o2;
      this.s3 = o3;
    }
    update(data) {
      aexists2(this);
      data = toBytes2(data);
      abytes2(data);
      const b32 = u32(data);
      const blocks = Math.floor(data.length / BLOCK_SIZE);
      const left = data.length % BLOCK_SIZE;
      for (let i = 0; i < blocks; i++) {
        this._updateBlock(b32[i * 4 + 0], b32[i * 4 + 1], b32[i * 4 + 2], b32[i * 4 + 3]);
      }
      if (left) {
        ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
        this._updateBlock(ZEROS32[0], ZEROS32[1], ZEROS32[2], ZEROS32[3]);
        clean2(ZEROS32);
      }
      return this;
    }
    destroy() {
      const { t } = this;
      for (const elm of t) {
        elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
      }
    }
    digestInto(out) {
      aexists2(this);
      aoutput2(out, this);
      this.finished = true;
      const { s0, s1, s2, s3 } = this;
      const o32 = u32(out);
      o32[0] = s0;
      o32[1] = s1;
      o32[2] = s2;
      o32[3] = s3;
      return out;
    }
    digest() {
      const res = new Uint8Array(BLOCK_SIZE);
      this.digestInto(res);
      this.destroy();
      return res;
    }
  };
  var Polyval = class extends GHASH {
    constructor(key, expectedLength) {
      key = toBytes2(key);
      abytes2(key);
      const ghKey = _toGHASHKey(copyBytes(key));
      super(ghKey, expectedLength);
      clean2(ghKey);
    }
    update(data) {
      data = toBytes2(data);
      aexists2(this);
      const b32 = u32(data);
      const left = data.length % BLOCK_SIZE;
      const blocks = Math.floor(data.length / BLOCK_SIZE);
      for (let i = 0; i < blocks; i++) {
        this._updateBlock(swapLE(b32[i * 4 + 3]), swapLE(b32[i * 4 + 2]), swapLE(b32[i * 4 + 1]), swapLE(b32[i * 4 + 0]));
      }
      if (left) {
        ZEROS16.set(data.subarray(blocks * BLOCK_SIZE));
        this._updateBlock(swapLE(ZEROS32[3]), swapLE(ZEROS32[2]), swapLE(ZEROS32[1]), swapLE(ZEROS32[0]));
        clean2(ZEROS32);
      }
      return this;
    }
    digestInto(out) {
      aexists2(this);
      aoutput2(out, this);
      this.finished = true;
      const { s0, s1, s2, s3 } = this;
      const o32 = u32(out);
      o32[0] = s0;
      o32[1] = s1;
      o32[2] = s2;
      o32[3] = s3;
      return out.reverse();
    }
  };
  function wrapConstructorWithKey(hashCons) {
    const hashC = (msg, key) => hashCons(key, msg.length).update(toBytes2(msg)).digest();
    const tmp = hashCons(new Uint8Array(16), 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (key, expectedLength) => hashCons(key, expectedLength);
    return hashC;
  }
  var ghash = wrapConstructorWithKey((key, expectedLength) => new GHASH(key, expectedLength));
  var polyval = wrapConstructorWithKey((key, expectedLength) => new Polyval(key, expectedLength));

  // node_modules/@noble/ciphers/esm/aes.js
  var BLOCK_SIZE2 = 16;
  var BLOCK_SIZE32 = 4;
  var EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE2);
  var POLY2 = 283;
  function mul22(n) {
    return n << 1 ^ POLY2 & -(n >> 7);
  }
  function mul(a, b) {
    let res = 0;
    for (; b > 0; b >>= 1) {
      res ^= a & -(b & 1);
      a = mul22(a);
    }
    return res;
  }
  var sbox = /* @__PURE__ */ (() => {
    const t = new Uint8Array(256);
    for (let i = 0, x = 1; i < 256; i++, x ^= mul22(x))
      t[i] = x;
    const box = new Uint8Array(256);
    box[0] = 99;
    for (let i = 0; i < 255; i++) {
      let x = t[255 - i];
      x |= x << 8;
      box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
    }
    clean2(t);
    return box;
  })();
  var rotr32_8 = (n) => n << 24 | n >>> 8;
  var rotl32_8 = (n) => n << 8 | n >>> 24;
  function genTtable(sbox2, fn) {
    if (sbox2.length !== 256)
      throw new Error("Wrong sbox length");
    const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
    const T1 = T0.map(rotl32_8);
    const T2 = T1.map(rotl32_8);
    const T3 = T2.map(rotl32_8);
    const T01 = new Uint32Array(256 * 256);
    const T23 = new Uint32Array(256 * 256);
    const sbox22 = new Uint16Array(256 * 256);
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        const idx = i * 256 + j;
        T01[idx] = T0[i] ^ T1[j];
        T23[idx] = T2[i] ^ T3[j];
        sbox22[idx] = sbox2[i] << 8 | sbox2[j];
      }
    }
    return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
  }
  var tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
  var xPowers = /* @__PURE__ */ (() => {
    const p = new Uint8Array(16);
    for (let i = 0, x = 1; i < 16; i++, x = mul22(x))
      p[i] = x;
    return p;
  })();
  function expandKeyLE(key) {
    abytes2(key);
    const len = key.length;
    if (![16, 24, 32].includes(len))
      throw new Error("aes: invalid key size, should be 16, 24 or 32, got " + len);
    const { sbox2 } = tableEncoding;
    const toClean = [];
    if (!isAligned32(key))
      toClean.push(key = copyBytes(key));
    const k32 = u32(key);
    const Nk = k32.length;
    const subByte = (n) => applySbox(sbox2, n, n, n, n);
    const xk = new Uint32Array(len + 28);
    xk.set(k32);
    for (let i = Nk; i < xk.length; i++) {
      let t = xk[i - 1];
      if (i % Nk === 0)
        t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
      else if (Nk > 6 && i % Nk === 4)
        t = subByte(t);
      xk[i] = xk[i - Nk] ^ t;
    }
    clean2(...toClean);
    return xk;
  }
  function apply0123(T01, T23, s0, s1, s2, s3) {
    return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
  }
  function applySbox(sbox2, s0, s1, s2, s3) {
    return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
  }
  function encrypt(xk, s0, s1, s2, s3) {
    const { sbox2, T01, T23 } = tableEncoding;
    let k = 0;
    s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
    const rounds = xk.length / 4 - 2;
    for (let i = 0; i < rounds; i++) {
      const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
      const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
      const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
      const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
      s0 = t02, s1 = t12, s2 = t22, s3 = t32;
    }
    const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
    const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
    const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
    const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
    return { s0: t0, s1: t1, s2: t2, s3: t3 };
  }
  function ctr32(xk, isLE2, nonce, src, dst) {
    abytes2(nonce, BLOCK_SIZE2);
    abytes2(src);
    dst = getOutput(src.length, dst);
    const ctr = nonce;
    const c32 = u32(ctr);
    const view = createView2(ctr);
    const src32 = u32(src);
    const dst32 = u32(dst);
    const ctrPos = isLE2 ? 0 : 12;
    const srcLen = src.length;
    let ctrNum = view.getUint32(ctrPos, isLE2);
    let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
    for (let i = 0; i + 4 <= src32.length; i += 4) {
      dst32[i + 0] = src32[i + 0] ^ s0;
      dst32[i + 1] = src32[i + 1] ^ s1;
      dst32[i + 2] = src32[i + 2] ^ s2;
      dst32[i + 3] = src32[i + 3] ^ s3;
      ctrNum = ctrNum + 1 >>> 0;
      view.setUint32(ctrPos, ctrNum, isLE2);
      ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
    }
    const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
    if (start < srcLen) {
      const b32 = new Uint32Array([s0, s1, s2, s3]);
      const buf = u8(b32);
      for (let i = start, pos = 0; i < srcLen; i++, pos++)
        dst[i] = src[i] ^ buf[pos];
      clean2(b32);
    }
    return dst;
  }
  function computeTag(fn, isLE2, key, data, AAD) {
    const aadLength = AAD ? AAD.length : 0;
    const h = fn.create(key, data.length + aadLength);
    if (AAD)
      h.update(AAD);
    const num = u64Lengths(8 * data.length, 8 * aadLength, isLE2);
    h.update(data);
    h.update(num);
    const res = h.digest();
    clean2(num);
    return res;
  }
  var gcm = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16, varSizeNonce: true }, function aesgcm(key, nonce, AAD) {
    if (nonce.length < 8)
      throw new Error("aes/gcm: invalid nonce length");
    const tagLength = 16;
    function _computeTag(authKey, tagMask, data) {
      const tag = computeTag(ghash, false, authKey, data, AAD);
      for (let i = 0; i < tagMask.length; i++)
        tag[i] ^= tagMask[i];
      return tag;
    }
    function deriveKeys() {
      const xk = expandKeyLE(key);
      const authKey = EMPTY_BLOCK.slice();
      const counter = EMPTY_BLOCK.slice();
      ctr32(xk, false, counter, counter, authKey);
      if (nonce.length === 12) {
        counter.set(nonce);
      } else {
        const nonceLen = EMPTY_BLOCK.slice();
        const view = createView2(nonceLen);
        setBigUint642(view, 8, BigInt(nonce.length * 8), false);
        const g = ghash.create(authKey).update(nonce).update(nonceLen);
        g.digestInto(counter);
        g.destroy();
      }
      const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
      return { xk, authKey, counter, tagMask };
    }
    return {
      encrypt(plaintext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const out = new Uint8Array(plaintext.length + tagLength);
        const toClean = [xk, authKey, counter, tagMask];
        if (!isAligned32(plaintext))
          toClean.push(plaintext = copyBytes(plaintext));
        ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
        const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
        toClean.push(tag);
        out.set(tag, plaintext.length);
        clean2(...toClean);
        return out;
      },
      decrypt(ciphertext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const toClean = [xk, authKey, tagMask, counter];
        if (!isAligned32(ciphertext))
          toClean.push(ciphertext = copyBytes(ciphertext));
        const data = ciphertext.subarray(0, -tagLength);
        const passedTag = ciphertext.subarray(-tagLength);
        const tag = _computeTag(authKey, tagMask, data);
        toClean.push(tag);
        if (!equalBytes(tag, passedTag))
          throw new Error("aes/gcm: invalid ghash tag");
        const out = ctr32(xk, false, counter, data);
        clean2(...toClean);
        return out;
      }
    };
  });

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
  function randomBytes2(length) {
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
    const out = gcm(key, nonce).encrypt(plaintext);
    return { ciphertext: out.slice(0, -16), tag: out.slice(-16) };
  }
  async function aes256GcmDecrypt(ciphertext, key, nonce, tag) {
    if (key.length !== 32) throw new Error("Key must be 32 bytes");
    if (nonce.length !== 12) throw new Error("Nonce must be 12 bytes");
    if (tag.length !== 16) throw new Error("Tag must be 16 bytes");
    return gcm(key, nonce).decrypt(concatBytes(ciphertext, tag));
  }
  async function eciesEncrypt(plaintext, recipientPubKeys) {
    let ephemeralPrivKey;
    for (let attempt = 0; attempt < 128; attempt++) {
      ephemeralPrivKey = randomBytes2(32);
      if (secp256k1.utils.isValidPrivateKey(ephemeralPrivKey)) break;
      if (attempt === 127) throw new Error("Random source did not produce a valid ephemeral key");
    }
    if (!(plaintext instanceof Uint8Array) || plaintext.length === 0 || plaintext.length > 4 * 1024 * 1024)
      throw new Error("Invalid ECIES plaintext budget");
    if (!Array.isArray(recipientPubKeys) || recipientPubKeys.length < 1 || recipientPubKeys.length > 50)
      throw new Error("Invalid ECIES recipient count");
    const ephemeralPubKey = secp256k1.getPublicKey(ephemeralPrivKey, true);
    const aesKey = await kdfSha256(ephemeralPrivKey, 32);
    const nonce = randomBytes2(12);
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
      const sharedPointCompressed = secp256k1.getSharedSecret(ephemeralPrivKey, keyBytes, true);
      const sharedSecret = await sha2563(sharedPointCompressed);
      const encKey = await kdfSha256(sharedSecret, 32);
      const recipientNonce = randomBytes2(12);
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
    const sharedPointCompressed = secp256k1.getSharedSecret(privKeyBytes, msg.ephemeralPubKey, true);
    const sharedSecret = await sha2563(sharedPointCompressed);
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
    const signature = secp256k1.sign(messageHashBytes, privateKey).toDERRawBytes();
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
      signature = secp256k1.Signature.fromCompact(signature).toDERRawBytes();
    } else {
      try {
        secp256k1.Signature.fromDER(signature);
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
      sig = secp256k1.Signature.fromDER(norm.signature);
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
      if (secp256k1.verify(sig, hashBytes, parsed.bytes, { lowS: false })) {
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
    const hash = sha2562(sha2562(payload));
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
    const original = sha2562(sha2562(data));
    if (address && /^(nq|tnq)1/.test(address)) {
      const { payload } = decodeStrictEcdsaAddress(address);
      return sha2562(
        sha2562(concatBytes(serializeString("Neurai Strict AuthScript Message"), new Uint8Array([3]), payload, original))
      );
    }
    return original;
  }
  function signRecoverableMessage(message, privateKeyOrCompressedWif, options = {}) {
    const { privateKey, compressed } = normalizeSigningKey(privateKeyOrCompressedWif);
    const hash = neuraiSignedMessageHash(message, options.address);
    const signature = secp256k1.sign(hash, privateKey);
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
      const sig = secp256k1.Signature.fromCompact(compact).addRecoveryBit(recovery);
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

  // node_modules/lossless-json/lib/esm/utils.js
  function isInteger(value) {
    return INTEGER_REGEX.test(value);
  }
  var INTEGER_REGEX = /^-?[0-9]+$/;
  function isNumber(value) {
    return NUMBER_REGEX.test(value);
  }
  var NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  function isSafeNumber(value, config2) {
    if (isInteger(value)) {
      return Number.isSafeInteger(Number.parseInt(value, 10));
    }
    const num = Number.parseFloat(value);
    if (Number.isInteger(num) && !Number.isSafeInteger(num)) {
      return false;
    }
    const parsed = String(num);
    if (value === parsed) {
      return true;
    }
    const valueDigits = extractSignificantDigits(value);
    const parsedDigits = extractSignificantDigits(parsed);
    if (valueDigits === parsedDigits) {
      return true;
    }
    if (config2?.approx === true) {
      const requiredDigits = 14;
      if (parsedDigits.length >= requiredDigits && valueDigits.startsWith(parsedDigits.substring(0, requiredDigits))) {
        return true;
      }
    }
    return false;
  }
  var UnsafeNumberReason = /* @__PURE__ */ (function(UnsafeNumberReason2) {
    UnsafeNumberReason2["underflow"] = "underflow";
    UnsafeNumberReason2["overflow"] = "overflow";
    UnsafeNumberReason2["truncate_integer"] = "truncate_integer";
    UnsafeNumberReason2["truncate_float"] = "truncate_float";
    return UnsafeNumberReason2;
  })({});
  function getUnsafeNumberReason(value) {
    if (isSafeNumber(value, {
      approx: false
    })) {
      return void 0;
    }
    if (isInteger(value)) {
      return UnsafeNumberReason.truncate_integer;
    }
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) {
      return UnsafeNumberReason.overflow;
    }
    if (num === 0) {
      return UnsafeNumberReason.underflow;
    }
    return UnsafeNumberReason.truncate_float;
  }
  function extractSignificantDigits(value) {
    const {
      start,
      end
    } = getSignificantDigitRange(value);
    const digits = value.substring(start, end);
    const dot = digits.indexOf(".");
    if (dot === -1) {
      return digits;
    }
    return digits.substring(0, dot) + digits.substring(dot + 1);
  }
  function getSignificantDigitRange(value) {
    let start = 0;
    if (value[0] === "-") {
      start++;
    }
    while (value[start] === "0" || value[start] === ".") {
      start++;
    }
    let end = value.lastIndexOf("e");
    if (end === -1) {
      end = value.lastIndexOf("E");
    }
    if (end === -1) {
      end = value.length;
    }
    while ((value[end - 1] === "0" || value[end - 1] === ".") && end > start) {
      end--;
    }
    return {
      start,
      end
    };
  }

  // node_modules/lossless-json/lib/esm/LosslessNumber.js
  var losslessNumberMarker = /* @__PURE__ */ Symbol.for("lossless-json.LosslessNumber");
  var LosslessNumber = class {
    // numeric value as string
    value;
    /**
     * @deprecated Use the isLosslessNumber(value) function instead.
     *
     * Ordinary objects may also have an isLosslessNumber property, so this
     * field cannot reliably identify lossless numbers.
     */
    isLosslessNumber = true;
    get [losslessNumberMarker]() {
      return true;
    }
    constructor(value) {
      if (!isNumber(value)) {
        throw new Error(`Invalid number (value: "${value}")`);
      }
      this.value = value;
    }
    /**
     * Get the value of the LosslessNumber as number or bigint.
     *
     * - a number is returned for safe numbers and decimal values that only lose some insignificant digits
     * - a bigint is returned for big integer numbers
     * - an Error is thrown for values that will overflow or underflow
     *
     * Note that you can implement your own strategy for conversion by just getting the value as string
     * via .toString(), and using util functions like isInteger, isSafeNumber, getUnsafeNumberReason,
     * and toSafeNumberOrThrow to convert it to a numeric value.
     */
    valueOf() {
      const unsafeReason = getUnsafeNumberReason(this.value);
      if (unsafeReason === void 0 || unsafeReason === UnsafeNumberReason.truncate_float) {
        return Number.parseFloat(this.value);
      }
      if (isInteger(this.value)) {
        return BigInt(this.value);
      }
      throw new Error(`Cannot safely convert to number: the value '${this.value}' would ${unsafeReason} and become ${Number.parseFloat(this.value)}`);
    }
    /**
     * Get the value of the LosslessNumber as string.
     */
    toString() {
      return this.value;
    }
    // Note: we do NOT implement a .toJSON() method, and you should not implement
    // or use that, it cannot safely turn the numeric value in the string into
    // stringified JSON since it has to be parsed into a number first.
  };
  function isLosslessNumber(value) {
    return value !== null && typeof value === "object" && value[losslessNumberMarker] === true;
  }

  // node_modules/lossless-json/lib/esm/numberParsers.js
  function parseLosslessNumber(value) {
    return new LosslessNumber(value);
  }

  // node_modules/lossless-json/lib/esm/revive.js
  function revive(json, reviver) {
    return reviveValue({
      "": json
    }, "", json, reviver);
  }
  function reviveValue(context, key, value, reviver) {
    if (Array.isArray(value)) {
      return reviver.call(context, key, reviveArray(value, reviver));
    }
    if (value && typeof value === "object" && !isLosslessNumber(value)) {
      return reviver.call(context, key, reviveObject(value, reviver));
    }
    return reviver.call(context, key, value);
  }
  function reviveObject(object, reviver) {
    for (const key of Object.keys(object)) {
      const value = reviveValue(object, key, object[key], reviver);
      if (value !== void 0) {
        object[key] = value;
      } else {
        delete object[key];
      }
    }
    return object;
  }
  function reviveArray(array, reviver) {
    for (let i = 0; i < array.length; i++) {
      const value = reviveValue(array, String(i), array[i], reviver);
      if (value === void 0) {
        delete array[i];
      } else {
        array[i] = value;
      }
    }
    return array;
  }

  // node_modules/lossless-json/lib/esm/parse.js
  function parse(text2, reviver, options) {
    const optionsObj = typeof options === "function" ? {
      parseNumber: options
    } : options;
    const parseNumber = optionsObj?.parseNumber ?? parseLosslessNumber;
    const onDuplicateKey = optionsObj?.onDuplicateKey ?? throwDuplicateKey;
    let i = 0;
    const value = parseValue();
    expectValue(value);
    expectEndOfInput();
    return reviver ? revive(value, reviver) : value;
    function parseObject() {
      if (text2.charCodeAt(i) === codeOpeningBrace) {
        i++;
        skipWhitespace();
        const object = {};
        let initial = true;
        while (i < text2.length && text2.charCodeAt(i) !== codeClosingBrace) {
          if (!initial) {
            eatComma();
            skipWhitespace();
          } else {
            initial = false;
          }
          const start = i;
          const key = parseString();
          if (key === void 0) {
            throwObjectKeyExpected();
            return;
          }
          skipWhitespace();
          eatColon();
          const value2 = parseValue();
          if (value2 === void 0) {
            throwObjectValueExpected();
            return;
          }
          if (Object.prototype.hasOwnProperty.call(object, key) && !isDeepEqual(value2, object[key])) {
            const returnedValue = onDuplicateKey({
              key,
              position: start + 1,
              oldValue: object[key],
              newValue: value2
            });
            if (returnedValue !== void 0) {
              setObjectKey(object, key, returnedValue);
            }
          } else {
            setObjectKey(object, key, value2);
          }
        }
        if (text2.charCodeAt(i) !== codeClosingBrace) {
          throwObjectKeyOrEndExpected();
        }
        i++;
        return object;
      }
    }
    function parseArray() {
      if (text2.charCodeAt(i) === codeOpeningBracket) {
        i++;
        skipWhitespace();
        const array = [];
        let initial = true;
        while (i < text2.length && text2.charCodeAt(i) !== codeClosingBracket) {
          if (!initial) {
            eatComma();
          } else {
            initial = false;
          }
          const value2 = parseValue();
          expectArrayItem(value2);
          array.push(value2);
        }
        if (text2.charCodeAt(i) !== codeClosingBracket) {
          throwArrayItemOrEndExpected();
        }
        i++;
        return array;
      }
    }
    function parseValue() {
      skipWhitespace();
      const value2 = parseString() ?? parseNumeric() ?? parseObject() ?? parseArray() ?? parseKeyword("true", true) ?? parseKeyword("false", false) ?? parseKeyword("null", null);
      skipWhitespace();
      return value2;
    }
    function parseKeyword(name, value2) {
      if (text2.slice(i, i + name.length) === name) {
        i += name.length;
        return value2;
      }
    }
    function skipWhitespace() {
      while (isWhitespace(text2.charCodeAt(i))) {
        i++;
      }
    }
    function parseString() {
      if (text2.charCodeAt(i) === codeDoubleQuote) {
        i++;
        let result = "";
        while (i < text2.length && text2.charCodeAt(i) !== codeDoubleQuote) {
          if (text2.charCodeAt(i) === codeBackslash) {
            const char = text2[i + 1];
            const escapeChar = escapeCharacters[char];
            if (escapeChar !== void 0) {
              result += escapeChar;
              i++;
            } else if (char === "u") {
              if (isHex(text2.charCodeAt(i + 2)) && isHex(text2.charCodeAt(i + 3)) && isHex(text2.charCodeAt(i + 4)) && isHex(text2.charCodeAt(i + 5))) {
                result += String.fromCharCode(Number.parseInt(text2.slice(i + 2, i + 6), 16));
                i += 5;
              } else {
                throwInvalidUnicodeCharacter(i);
              }
            } else {
              throwInvalidEscapeCharacter(i);
            }
          } else {
            if (isValidStringCharacter(text2.charCodeAt(i))) {
              result += text2[i];
            } else {
              throwInvalidCharacter(text2[i]);
            }
          }
          i++;
        }
        expectEndOfString();
        i++;
        return result;
      }
    }
    function parseNumeric() {
      const start = i;
      if (text2.charCodeAt(i) === codeMinus) {
        i++;
        expectDigit(start);
      }
      if (text2.charCodeAt(i) === codeZero) {
        i++;
      } else if (isNonZeroDigit(text2.charCodeAt(i))) {
        i++;
        while (isDigit(text2.charCodeAt(i))) {
          i++;
        }
      } else {
        return void 0;
      }
      if (text2.charCodeAt(i) === codeDot) {
        i++;
        expectDigit(start);
        while (isDigit(text2.charCodeAt(i))) {
          i++;
        }
      }
      if (text2.charCodeAt(i) === codeLowercaseE || text2.charCodeAt(i) === codeUppercaseE) {
        i++;
        if (text2.charCodeAt(i) === codeMinus || text2.charCodeAt(i) === codePlus) {
          i++;
        }
        expectDigit(start);
        while (isDigit(text2.charCodeAt(i))) {
          i++;
        }
      }
      if (i > start) {
        return parseNumber(text2.slice(start, i));
      }
    }
    function eatComma() {
      if (text2.charCodeAt(i) !== codeComma) {
        throw new SyntaxError(`Comma ',' expected after value ${gotAt()}`);
      }
      i++;
    }
    function eatColon() {
      if (text2.charCodeAt(i) !== codeColon) {
        throw new SyntaxError(`Colon ':' expected after property name ${gotAt()}`);
      }
      i++;
    }
    function expectValue(value2) {
      if (value2 === void 0) {
        throw new SyntaxError(`JSON value expected ${gotAt()}`);
      }
    }
    function expectArrayItem(value2) {
      if (value2 === void 0) {
        throw new SyntaxError(`Array item expected ${gotAt()}`);
      }
    }
    function expectEndOfInput() {
      if (i < text2.length) {
        throw new SyntaxError(`Expected end of input ${gotAt()}`);
      }
    }
    function expectDigit(start) {
      if (!isDigit(text2.charCodeAt(i))) {
        const numSoFar = text2.slice(start, i);
        throw new SyntaxError(`Invalid number '${numSoFar}', expecting a digit ${gotAt()}`);
      }
    }
    function expectEndOfString() {
      if (text2.charCodeAt(i) !== codeDoubleQuote) {
        throw new SyntaxError(`End of string '"' expected ${gotAt()}`);
      }
    }
    function throwObjectKeyExpected() {
      throw new SyntaxError(`Quoted object key expected ${gotAt()}`);
    }
    function throwDuplicateKey({
      key,
      position
    }) {
      throw new SyntaxError(`Duplicate key '${key}' encountered at position ${position}`);
    }
    function throwObjectKeyOrEndExpected() {
      throw new SyntaxError(`Quoted object key or end of object '}' expected ${gotAt()}`);
    }
    function throwArrayItemOrEndExpected() {
      throw new SyntaxError(`Array item or end of array ']' expected ${gotAt()}`);
    }
    function throwInvalidCharacter(char) {
      throw new SyntaxError(`Invalid character '${char}' ${pos()}`);
    }
    function throwInvalidEscapeCharacter(start) {
      const chars = text2.slice(start, start + 2);
      throw new SyntaxError(`Invalid escape character '${chars}' ${pos()}`);
    }
    function throwObjectValueExpected() {
      throw new SyntaxError(`Object value expected after ':' ${pos()}`);
    }
    function throwInvalidUnicodeCharacter(start) {
      const chars = text2.slice(start, start + 6);
      throw new SyntaxError(`Invalid unicode character '${chars}' ${pos()}`);
    }
    function pos() {
      return `at position ${i}`;
    }
    function got() {
      return i < text2.length ? `but got '${text2[i]}'` : "but reached end of input";
    }
    function gotAt() {
      return `${got()} ${pos()}`;
    }
  }
  function setObjectKey(object, key, value) {
    if (key === "__proto__") {
      Object.defineProperty(object, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    } else {
      object[key] = value;
    }
  }
  function isWhitespace(code) {
    return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
  }
  function isHex(code) {
    return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
  }
  function isDigit(code) {
    return code >= codeZero && code <= codeNine;
  }
  function isNonZeroDigit(code) {
    return code >= codeOne && code <= codeNine;
  }
  function isValidStringCharacter(code) {
    return code >= 32 && code <= 1114111;
  }
  function isDeepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => isDeepEqual(item, b[index]));
    }
    if (isObject(a) && isObject(b)) {
      const keys2 = [.../* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)])];
      return keys2.every((key) => isDeepEqual(a[key], b[key]));
    }
    return false;
  }
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  var escapeCharacters = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	"
    // note that \u is handled separately in parseString()
  };
  var codeBackslash = 92;
  var codeOpeningBrace = 123;
  var codeClosingBrace = 125;
  var codeOpeningBracket = 91;
  var codeClosingBracket = 93;
  var codeSpace = 32;
  var codeNewline = 10;
  var codeTab = 9;
  var codeReturn = 13;
  var codeDoubleQuote = 34;
  var codePlus = 43;
  var codeMinus = 45;
  var codeZero = 48;
  var codeOne = 49;
  var codeNine = 57;
  var codeComma = 44;
  var codeDot = 46;
  var codeColon = 58;
  var codeUppercaseA = 65;
  var codeLowercaseA = 97;
  var codeUppercaseE = 69;
  var codeLowercaseE = 101;
  var codeUppercaseF = 70;
  var codeLowercaseF = 102;

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
    return bytesToHex(sha2562(depinRequestBytes(method, request)));
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
    const request = { protocol: 5, request_id: requestId ?? bytesToHex(randomBytes2(32)), timestamp_ms: timestampMs ?? clock() };
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
    return "DEPIN-RPC-RESPONSE-v5|" + bytesToHex(sha2562(bytes));
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
    const hash = bytesToHex(sha2562(hexToBytes(parsePublicKey(pubKey).pointId)));
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
      const value = parse(text2, null, (s) => /^-?\d+$/.test(s) && !Number.isSafeInteger(Number(s)) ? BigInt(s) : Number(s));
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
    const publicKeyBytes = secp256k1.getPublicKey(keyBytes, compressed);
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
        return secp256k1.sign(digest, keyBytes).toDERRawBytes();
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
        sha256: sha2563,
        doubleSha256,
        ripemd160: ripemd1603,
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
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/ciphers/esm/utils.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/
