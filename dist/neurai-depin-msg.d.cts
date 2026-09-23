/**
 * Type definitions for @neuraiproject/neurai-depin-msg 3.0.0
 * (DePIN Messaging Protocol 2)
 */

export type Network = 'mainnet' | 'test' | 'testnet' | 'regtest';
export type MessageType = 'private' | 'group';
/** Protocol 2: the protocol-1 gateway sentinel is always 'invalid'
 *  (reason 'protocol-1-preauthenticated'). */
export type Authentication = 'signature' | 'invalid';

// ---------------------------------------------------------------------------
// Build / sign
// ---------------------------------------------------------------------------

export interface BuildDepinMessageParams {
  token: string;
  /** Legacy P2PKH address (N…/t…); witness addresses are rejected. */
  senderAddress: string;
  /** 33-byte compressed or 65-byte uncompressed public key, hex. */
  senderPubKey: string;
  /** WIF or 64-hex private key; must control senderPubKey. */
  privateKey: string;
  message: string;
  messageType: MessageType;
  /** 33- or 65-byte public keys, hex. Deduplicated by curve point. */
  recipientPubKeys: string[];
  /** Unix seconds; Core rejects timestamps more than 60 s in the future. */
  timestamp: number;
  /** Pins the senderAddress prefix; omitted = any known Neurai prefix. */
  network?: Network;
}

export interface BuildDepinMessageResult {
  hex: string;
  /** Byte-reversed hash, as displayed by Core. */
  messageHash: string;
  messageHashBytes: string;
  encryptedSize: number;
  /** Final ECIES map size, auto-included sender counted. */
  recipientCount: number;
  messageType: MessageType;
}

export function buildDepinMessage(params: BuildDepinMessageParams): Promise<BuildDepinMessageResult>;

export interface BuildDepinPreimageResult {
  encryptedPayloadHex: string;
  /** Exact 32-byte SHA256d digest that SignDigest must sign. */
  messageDigest: Uint8Array;
  messageDigestHex: string;
  messageType: MessageType;
  messageTypeByte: number;
  encryptedSize: number;
  recipientCount: number;
}

export function buildDepinPreimage(
  params: Omit<BuildDepinMessageParams, 'privateKey'>
): Promise<BuildDepinPreimageResult>;

export interface AssembleDepinMessageParams {
  token: string;
  senderAddress: string;
  encryptedPayloadHex: string;
  messageType: MessageType;
  timestamp: number;
}

export function assembleDepinMessage(
  params: AssembleDepinMessageParams,
  /** DER hex/bytes, or raw 64-byte r||s (DER-encoded automatically). */
  signature: string | Uint8Array
): Promise<Omit<BuildDepinMessageResult, 'recipientCount'>>;

// ---------------------------------------------------------------------------
// Parse / verify
// ---------------------------------------------------------------------------

export interface ParsedDepinMessage {
  token: string;
  senderAddress: string;
  timestamp: number;
  messageType: MessageType;
  messageTypeByte: number;
  encryptedPayloadHex: string;
  signatureHex: string;
  isPreAuthenticated: boolean;
  hash: string;
  hashBytes: string;
  size: number;
}

export function parseDepinMessage(
  hexOrBytes: string | Uint8Array,
  options?: { maxPayloadBytes?: number }
): Promise<ParsedDepinMessage>;

/** RPC shape returned by depinreceivemsg. */
export interface ReceivedDepinMessage {
  hash?: string;
  token: string;
  sender: string;
  timestamp: number;
  message_type: MessageType;
  encrypted_payload_hex: string;
  signature_hex: string;
}

export interface VerifyOptions {
  network: Network;
  /** Optional fast path; still bound to the sender address before use. */
  senderPubKey?: string;
  resolveSenderPubKey?: (address: string) => string | Promise<string>;
}

export interface VerifyResult {
  signatureValid: boolean;
  authentication: Authentication;
  hash: string | null;
  /** Serialization whose hash160 matches the sender address. */
  senderPubKey: string | null;
  reason: string | null;
}

export function verifyDepinReceivedMessage(
  message: ReceivedDepinMessage | ParsedDepinMessage,
  options: VerifyOptions
): Promise<VerifyResult>;

// ---------------------------------------------------------------------------
// Non-custodial reception
// ---------------------------------------------------------------------------

export interface ReceiveLimits {
  maxMessages?: number;
  maxPayloadBytes?: number;
}

export interface ValidateAndDecryptOptions extends VerifyOptions {
  privateKey?: string | null;
  /** External ECIES opener (hardware): receives the raw payload bytes and
   *  returns plaintext, or null when the key is not among the recipients. */
  openPayload?: ((payloadBytes: Uint8Array) => Promise<Uint8Array | string | null> | Uint8Array | string | null) | null;
  requestedToken?: string | null;
  limits?: ReceiveLimits;
}

export interface ValidatedDepinMessage {
  ok: boolean;
  reason: string | null;
  hash: string | null;
  message: { token: string; sender: string; timestamp: number; messageType: MessageType } | null;
  signatureValid: boolean;
  authentication: Authentication;
  senderPubKey: string | null;
  /** null when this key is not among the recipients (not an error). */
  plaintext: string | null;
}

export function validateAndDecryptDepinMessage(
  message: ReceivedDepinMessage,
  options: ValidateAndDecryptOptions
): Promise<ValidatedDepinMessage>;

export interface DecodedReceiveResponse {
  messages: ValidatedDepinMessage[];
  hasMore: boolean | null;
  wasEncrypted: boolean;
  /** Protocol-2 challenge chaining (300 s), when the reply carries it. */
  nextChallenge: string | null;
  nextExpiresIn: number | null;
}

export function decodeDepinReceiveResponse(
  rpcResult: unknown,
  options: ValidateAndDecryptOptions
): Promise<DecodedReceiveResponse>;

export function decryptDepinReceivedMessage(
  message: ReceivedDepinMessage,
  privateKey: string
): Promise<{ plaintext: string | null }>;

export function decryptDepinReceiveEncryptedPayload(
  encryptedPayloadHex: string,
  recipientPrivateKey: string
): Promise<string | null>;

// ---------------------------------------------------------------------------
// Recipient resolution / assisted send (network injected)
// ---------------------------------------------------------------------------

export interface DepinRpc {
  call(method: string, params: unknown[]): Promise<unknown>;
}

export interface ResolveDepinRecipientsParams {
  token: string;
  poolRoot: string;
  /** Pool limit, 1..50. Applied to the final map, sender included. */
  maxRecipients: number;
  senderPubKey: string;
  rpc: DepinRpc;
  /** Pinned pool key: the reply envelope is verified against it BEFORE the
   *  recipients are interpreted. */
  poolPublicKey: string;
  network?: Network;
}

export interface DepinRecipientsResolution {
  /**
   * Deduplicated holder keys, hex, as returned by the node. Includes the
   * sender's revealed key when the sender is itself a holder
   * (senderIncludedInHolders); buildDepinMessage auto-includes it otherwise.
   */
  recipientPubKeys: string[];
  /** Final ECIES map size, sender included. */
  recipientCount: number;
  senderIncludedInHolders: boolean;
  ancestors: string[];
  maxRecipients: number;
  skipped: {
    noPubKey: number | null;
    noPubKeyComplete: boolean | null;
    restricted: number | null;
    restrictedComplete: boolean | null;
  };
}

export function resolveDepinRecipients(
  params: ResolveDepinRecipientsParams
): Promise<DepinRecipientsResolution>;

export function buildDepinMessageForPool(
  params: ResolveDepinRecipientsParams & Omit<BuildDepinMessageParams, 'recipientPubKeys'>
): Promise<BuildDepinMessageResult & { resolution: DepinRecipientsResolution }>;

/** Non-custodial overload: recipient encryption stays local and the identity
 * signs the exact digest returned by buildDepinPreimage. */
export function buildDepinMessageForPool(
  params: Omit<ResolveDepinRecipientsParams, 'senderPubKey'> &
    Omit<BuildDepinMessageParams,
      'recipientPubKeys' | 'privateKey' | 'senderAddress' | 'senderPubKey'> & {
      identity: SenderIdentity;
      network: Network;
      senderAddress?: never;
      senderPubKey?: never;
      privateKey?: never;
    }
): Promise<BuildDepinMessageResult & { resolution: DepinRecipientsResolution }>;

/** Pure decoder for an already verified/decoded recipients body. */
export function decodeDepinRecipients(
  body: unknown,
  params: Omit<ResolveDepinRecipientsParams, 'rpc' | 'poolPublicKey'>
): Promise<DepinRecipientsResolution>;

// ---------------------------------------------------------------------------
// Transport privacy wrapper
// ---------------------------------------------------------------------------

export function wrapMessageForServer(
  messageHex: string,
  serverPubKeyHex: string,
  senderAddress: string
): Promise<{ sender: string; encrypted: string }>;

export function unwrapMessageFromServer(
  encryptedHex: string,
  recipientPrivateKey: string,
  options?: { parseJson?: boolean }
): Promise<string | unknown | null>;

// ---------------------------------------------------------------------------
// Tokens / scope
// ---------------------------------------------------------------------------

export function validateDepinSectionToken(
  token: string,
  options?: { maxLength?: number }
): { valid: boolean; error: string | null; parts: string[] | null };

export function isDepinTokenInScope(messageToken: string, requestedRootOrSection: string): boolean;

export function getDepinTokenAncestors(token: string, stopAt?: string): string[];

// ---------------------------------------------------------------------------
// Keys / addresses
// ---------------------------------------------------------------------------

export function isWIF(str: string): boolean;
export function wifToHex(wif: string): Promise<string>;
export function normalizePrivateKeyTo32Bytes(wifOrHex: string): Promise<Uint8Array>;
export function parsePublicKey(pubKey: string | Uint8Array): { bytes: Uint8Array; pointId: string };
export function derivePublicKeyForms(privKeyBytes: Uint8Array): {
  compressed: Uint8Array;
  uncompressed: Uint8Array;
};
export function privateKeyMatchesPublicKey(
  privKeyBytes: Uint8Array,
  pubKey: string | Uint8Array
): boolean;
/**
 * Decodes a Legacy Base58 P2PKH address (the only address type DePIN
 * supports). Bech32m witness addresses — nc1…/tnc1… (AuthScript v1),
 * pq1…/tpq1… (PQ v2), nq1…/tnq1… (ECDSA v3) — are rejected with an explicit
 * "DePIN requires a Legacy P2PKH address" error.
 */
export function decodeP2PKHAddress(
  address: string,
  network?: Network | null
): Promise<{ version: number; payload: Uint8Array; network: 'mainnet' | 'test' | null }>;
export function pubKeyMatchesAddress(
  pubKeyBytes: Uint8Array,
  address: string,
  network?: Network
): Promise<boolean>;
export function normalizeNetwork(network: Network): 'mainnet' | 'test';
export const P2PKH_PREFIX: { mainnet: number; test: number };

// ---------------------------------------------------------------------------
// Byte / hash utilities
// ---------------------------------------------------------------------------

export function hexToBytes(hex: string): Uint8Array;
export function bytesToHex(bytes: Uint8Array): string;
export function normalizeHex(hex: string): string | null;
export function concatBytes(...arrays: Uint8Array[]): Uint8Array;
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean;
export function sha256(data: Uint8Array): Promise<Uint8Array>;
export function doubleSha256(data: Uint8Array): Promise<Uint8Array>;
export function ripemd160(data: Uint8Array): Uint8Array;
export function hash160(data: Uint8Array): Promise<Uint8Array>;
export function kdfSha256(sharedSecret: Uint8Array, outputLen: number): Promise<Uint8Array>;
export function base58Encode(bytes: Uint8Array): string;
export function base58CheckEncode(version: number, payload: Uint8Array): Promise<string>;
export function base58Decode(str: string): Uint8Array;
export function base58CheckDecode(str: string): Promise<{ version: number; payload: Uint8Array }>;

// ---------------------------------------------------------------------------
// ECIES primitives
// ---------------------------------------------------------------------------

export interface EciesMessage {
  ephemeralPubKey: Uint8Array;
  encryptedPayload: Uint8Array;
  recipientKeys: Map<string, Uint8Array>;
}

export function eciesEncrypt(
  plaintext: Uint8Array,
  recipientPubKeys: Array<string | Uint8Array>
): Promise<EciesMessage>;
export function serializeEciesMessage(msg: EciesMessage): Uint8Array;
export function deserializeEciesMessage(
  serialized: Uint8Array,
  options?: { allowTrailing?: boolean }
): EciesMessage;
export function eciesDecrypt(msg: EciesMessage, privKeyBytes: Uint8Array): Promise<Uint8Array | null>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MAX_DEPIN_RECIPIENTS: number;
export const MAX_DEPIN_MESSAGE_SIZE: number;
export const DEPIN_RECEIVE_MAX_LIMIT: number;
export const MAX_DEPIN_TOKEN_LENGTH: number;

/** Test-only deterministic RNG hook. Never call in production. */
export function _setDepinTestRng(fn: ((len: number) => Uint8Array) | null): void;

// ---------------------------------------------------------------------------
// Protocol 2 — errors (stable codes)
// ---------------------------------------------------------------------------

export class DepinError extends Error {
  code: string;
  cause?: unknown;
}
/** Malformed shape, encoding, limits or invariant violations. */
export class DepinProtocolError extends DepinError { code: 'DEPIN_PROTOCOL'; }
/** poolsig invalid, or key/address inconsistent with the reply. */
export class DepinReplyAuthenticationError extends DepinError { code: 'DEPIN_REPLY_AUTH'; }
/** An authenticated reply that cannot be opened/decrypted. */
export class DepinReplyDecryptionError extends DepinError { code: 'DEPIN_REPLY_DECRYPT'; }
/** Service identity, pool root or pool key differ from the recorded pin. */
export class PoolPinMismatchError extends DepinError { code: 'DEPIN_PIN_MISMATCH'; }
/** A flow was invoked without a required signing/opening capability. */
export class DepinCapabilityError extends DepinError { code: 'DEPIN_CAPABILITY'; }

// ---------------------------------------------------------------------------
// Protocol 2 — signmessage-compatible recoverable signatures (spec 3.3)
// ---------------------------------------------------------------------------

export const NEURAI_MESSAGE_MAGIC: string;

export function base64Encode(bytes: Uint8Array): string;
export function base64Decode(str: string): Uint8Array;

/** Decodes a WIF keeping network and compression flag. */
export function decodeWIF(wif: string): {
  privateKey: Uint8Array;
  compressed: boolean;
  network: 'mainnet' | 'test';
};

export function neuraiSignedMessageHash(message: string): Uint8Array;
/** Deterministic (RFC 6979, low-s). Rejects uncompressed WIFs. */
export function signRecoverableMessage(
  message: string,
  privateKeyOrCompressedWif: string
): string;
export function recoverPublicKeyFromMessage(message: string, signatureBase64: string): string;
/** Throws for malformed input; false for a valid signature by another key. */
export function verifyRecoverableMessage(
  message: string,
  signatureBase64: string,
  expectedPublicKey: string | Uint8Array
): boolean;

/** DEPIN-REQ|type|token|address|ms (spec 7.1). */
export function buildDepinRequestPreimage(params: {
  type?: 'receive' | 'admin';
  token: string;
  address: string;
  timestampMs: number;
}): string;
/** DEPIN-GET|token|address|challenge (spec 7.2). */
export function buildDepinGetPreimage(params: {
  token: string;
  address: string;
  challenge: string;
}): string;
/** DEPIN-CLEAR|scope|address|challenge (spec 7.2). */
export function buildDepinClearPreimage(params: {
  scope: string;
  address: string;
  challenge: string;
}): string;

// ---------------------------------------------------------------------------
// Protocol 2 — reply envelopes, pin and TOFU (spec 6.2-6.4)
// ---------------------------------------------------------------------------

export interface PlainDepinReply { body: string; poolsig: string; }
export interface BoundDepinReply { encrypted: string; poolsig: string; }

declare const VERIFIED_REPLY: unique symbol;
/** Branded by verifyDepinReply; cannot be fabricated by callers. */
export interface VerifiedDepinReply {
  readonly [VERIFIED_REPLY]: true;
  readonly kind: 'plain' | 'bound';
  readonly replyHex: string;
  readonly method: string;
  readonly token: string;
  readonly address: string;
  readonly challenge: string;
  readonly poolPublicKey: string;
}

export function isVerifiedDepinReply(value: unknown): value is VerifiedDepinReply;

export function buildDepinReplyPreimage(params: {
  method: string;
  token?: string;
  address?: string;
  challenge?: string;
  replyHex: string;
}): string;

/** Verifies poolsig over the reply hex EXACTLY as received. Throws
 *  DepinReplyAuthenticationError when it does not recover to the key. */
export function verifyDepinReply(params: {
  reply: unknown;
  method: string;
  token?: string;
  address?: string;
  challenge?: string;
  poolPublicKey: string | Uint8Array;
}): VerifiedDepinReply;

export function decodePlainReply(verifiedReply: VerifiedDepinReply): Record<string, unknown>;

export type OpenReply = (
  encryptedHex: string
) => Promise<Uint8Array | string> | Uint8Array | string;

export function openBoundReply(
  verifiedReply: VerifiedDepinReply,
  opener: string | OpenReply
): Promise<Record<string, unknown>>;

export interface PoolPin {
  serviceId: string;
  poolRoot: string;
  poolPublicKey: string;
}

export type PoolTrust =
  | { mode: 'pinned'; pin: PoolPin }
  | { mode: 'key'; poolPublicKey: string }
  | { mode: 'tofu' };

export interface DepinPoolInfoResult {
  info: Record<string, unknown> & {
    token: string;
    maxrecipients: number;
    protocol: number;
    depinpoolpkey: string;
    depinpoolkeyaddress?: string;
  };
  /** What the application should persist. TOFU returns it as OBSERVED. */
  pin: PoolPin;
  trust: 'pinned' | 'key' | 'tofu';
  fingerprint: string;
}

export function decodeDepinPoolInfo(params: {
  reply: unknown;
  trust: PoolTrust;
  serviceId: string;
  network?: Network;
}): Promise<DepinPoolInfoResult>;

export function poolKeyFingerprint(pubKey: string | Uint8Array): string;

// ---------------------------------------------------------------------------
// Protocol 2 — identities and capabilities
// ---------------------------------------------------------------------------

/**
 * Structured description of an authentication preimage (3.1.0). Passed to
 * `signMessage` alongside the preimage so a hardware signer can REBUILD and
 * validate what it is about to sign instead of trusting an opaque string:
 * feeding it back to buildDepinRequest/Get/ClearPreimage reproduces the
 * preimage exactly. It never replaces the preimage — the signature must cover
 * the string the flow built.
 */
export type DepinAuthSigningContext =
  | {
      kind: 'request';
      type: 'receive' | 'admin';
      token: string;
      address: string;
      timestampMs: number;
    }
  | {
      kind: 'get';
      token: string;
      address: string;
      challenge: string;
    }
  | {
      kind: 'clear';
      /** RESOLVED scope: the pool root when the caller passed ''. */
      scope: string;
      address: string;
      challenge: string;
    };

/**
 * Fields the CDepinMessage digest was built from (3.1.0), so an external
 * signer can recompute it: SHA256d(ser_string(token) ‖ ser_string(sender) ‖
 * LE64(timestamp) ‖ messageType ‖ ser_vector(encryptedPayload)).
 */
export interface DepinMessageSigningContext {
  kind: 'message';
  token: string;
  senderAddress: string;
  timestamp: number;
  /** 0x01 private, 0x02 group. */
  messageType: number;
  encryptedPayloadHex: string;
}

/** The context parameter is additive: one-argument signers keep working. */
export type SignMessage = (
  preimage: string,
  context?: DepinAuthSigningContext
) => Promise<string> | string;
export type SignDigest = (
  digest: Uint8Array,
  context?: DepinMessageSigningContext
) => Promise<Uint8Array | string> | Uint8Array | string;

export interface HolderIdentity {
  /**
   * Legacy P2PKH address (N…/t…). DePIN on the node only works with P2PKH:
   * with neurai-key 5 derive it with 'xna-legacy' / 'xna-legacy-test' (not
   * 'xna', which is ECDSA witness v3). Witness addresses (nc1…, pq1…, nq1…)
   * are rejected.
   */
  address: string;
  signMessage: SignMessage;
  openReply: OpenReply;
}

export interface SenderIdentity extends HolderIdentity {
  /** SEC1 compressed, 33 bytes, hex lowercase. */
  publicKey: string;
  signDigest: SignDigest;
}

export function createSoftwareIdentity(params: {
  privateKey: string;
  network: Network;
  /** Optional Legacy P2PKH address to bind; derived from the key when omitted. */
  address?: string;
}): Promise<SenderIdentity & { network: 'mainnet' | 'test' }>;

export function assertIdentityCapabilities(
  identity: unknown,
  capabilities: Array<'signMessage' | 'signDigest' | 'openReply'>
): void;

// ---------------------------------------------------------------------------
// Protocol 2 — client flows (network injected)
// ---------------------------------------------------------------------------

export function getDepinPoolInfo(params: {
  rpc: DepinRpc;
  serviceId: string;
  trust: PoolTrust;
  network?: Network;
}): Promise<DepinPoolInfoResult>;

export interface ChallengeResult {
  challenge: string;
  expiresIn: number | null;
  type: 'receive' | 'admin';
  timestampMs: number;
}

export function requestDepinChallenge(params: {
  rpc: DepinRpc;
  identity: HolderIdentity;
  token: string;
  poolPublicKey: string | Uint8Array;
  type?: 'receive' | 'admin';
  timestampMs?: number;
  clock?: () => number;
}): Promise<ChallengeResult>;

export function decodeChallengeResult(
  opened: unknown,
  expectedType: 'receive' | 'admin'
): Omit<ChallengeResult, 'timestampMs'>;

export interface ReceiveMessagesResult {
  messages: ValidatedDepinMessage[];
  hasMore: boolean | null;
  nextChallenge: string | null;
  nextExpiresIn: number | null;
  raw: Record<string, unknown>;
}

export function receiveDepinMessages(params: {
  rpc: DepinRpc;
  identity: HolderIdentity;
  token: string;
  challenge: string;
  poolPublicKey: string | Uint8Array;
  network: Network;
  afterHash?: string;
  limit?: number;
  /** Unix seconds; the node filters timestamp >= (timestamp - 1). */
  timestamp?: number;
  requestedToken?: string;
  resolveSenderPubKey?: (address: string) => string | Promise<string>;
  limits?: ReceiveLimits;
}): Promise<ReceiveMessagesResult>;

export interface DepinSection {
  name: string;
  label?: string;
  depth?: number;
  access?: string;
  messages?: number;
  [key: string]: unknown;
}

export function listDepinSectionsPublic(params: {
  rpc: DepinRpc;
  poolRoot: string;
  poolPublicKey: string | Uint8Array;
}): Promise<{ sections: DepinSection[] }>;

export function listDepinSectionsPrivate(params: {
  rpc: DepinRpc;
  identity: HolderIdentity;
  scope: string;
  challenge: string;
  poolPublicKey: string | Uint8Array;
}): Promise<{
  sections: DepinSection[];
  nextChallenge: string | null;
  nextExpiresIn: number | null;
}>;

/** scope '' purges the whole pool: the preimage and the reply verification
 *  use poolRoot even though the RPC receives ''. */
export function clearDepinMessages(params: {
  rpc: DepinRpc;
  identity: HolderIdentity;
  scope?: string;
  poolRoot: string;
  challenge: string;
  poolPublicKey: string | Uint8Array;
  mode?: 'all' | number;
}): Promise<Record<string, unknown>>;

export function submitDepinMessage(params: {
  rpc: DepinRpc;
  identity: HolderIdentity;
  messageHex: string;
  poolPublicKey: string | Uint8Array;
}): Promise<Record<string, unknown> & { result: 'success'; hash: string }>;

export function decodeSubmitResult(
  opened: unknown
): Record<string, unknown> & { result: 'success'; hash: string };

// Only the declarations marked `export` are public. Without this, a
// declaration file exports every top-level declaration, and the brand symbol
// VERIFIED_REPLY (not exported at runtime) was typed as an importable value.
export {};
