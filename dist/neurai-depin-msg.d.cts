/**
 * Type definitions for @neuraiproject/neurai-depin-msg 4.0.0
 * (DePIN Messaging Protocol 5)
 */

export type Network = 'mainnet' | 'test' | 'testnet' | 'regtest';
export type MessageType = 'private' | 'group';
/** Protocol 5: the protocol-1 gateway sentinel is always 'invalid'
 *  (reason 'protocol-1-preauthenticated'). */
export type Authentication = 'signature' | 'invalid';

// ---------------------------------------------------------------------------
// Build / sign
// ---------------------------------------------------------------------------

export interface BuildDepinMessageParams {
  token: string;
  /** Canonical Legacy P2PKH or strict ECDSA v3 address. */
  senderAddress: string;
  /** 33-byte compressed or 65-byte uncompressed public key, hex. */
  senderPubKey: string;
  /** WIF or 64-hex private key; must control senderPubKey. */
  privateKey: string;
  maxMessageBytes?: number;
  message: string;
  messageType: MessageType;
  /** Use typed recipients for strict ECDSA; raw keys select Legacy identities. */
  recipientPubKeys: Array<string | Recipient>;
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

export function buildDepinPreimage(params: Omit<BuildDepinMessageParams, 'privateKey'>): Promise<BuildDepinPreimageResult>;

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
  signature: string | Uint8Array,
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

export function parseDepinMessage(hexOrBytes: string | Uint8Array, options?: { maxPayloadBytes?: number }): Promise<ParsedDepinMessage>;

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
  options: VerifyOptions,
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
  options: ValidateAndDecryptOptions,
): Promise<ValidatedDepinMessage>;

export interface DecodedReceiveResponse {
  messages: ValidatedDepinMessage[];
  hasMore: boolean | null;
  wasEncrypted: boolean;
  /** Protocol-5 challenge chaining (300 s), when the reply carries it. */
  nextChallenge: string | null;
  nextExpiresIn: number | null;
}

export function decodeDepinReceiveResponse(rpcResult: unknown, options: ValidateAndDecryptOptions): Promise<DecodedReceiveResponse>;

export function decryptDepinReceivedMessage(message: ReceivedDepinMessage, privateKey: string): Promise<{ plaintext: string | null }>;

export function decryptDepinReceiveEncryptedPayload(encryptedPayloadHex: string, recipientPrivateKey: string): Promise<string | null>;

// ---------------------------------------------------------------------------
// Recipient resolution / assisted send (network injected)
// ---------------------------------------------------------------------------

export interface DepinRpc {
  call(method: string, params: unknown[]): Promise<unknown>;
}

export interface ResolveDepinRecipientsParams {
  /** Optional exact subset; unlisted addresses always fail. Sender is still included. */
  selectedAddresses?: string[];
  token: string;
  poolRoot: string;
  /** Pool limit, 1..50. Applied to the final map, sender included. */
  maxRecipients: number;
  senderPubKey: string;
  senderAddress: string;
  context: DepinRpcContext;
  rpc: DepinRpc;
  /** Pinned pool key: the reply envelope is verified against it BEFORE the
   *  recipients are interpreted. */
  poolPublicKey?: string;
  network?: Network;
}

export interface DecodedDepinRecipients {
  /**
   * Exact holder identities, as returned by the node. Includes the
   * sender's revealed key when the sender is itself a holder
   * (senderIncludedInHolders); buildDepinMessage auto-includes it otherwise.
   */
  recipientPubKeys: Array<string | Recipient>;
  /** Final ECIES map size, sender included. */
  recipientCount: number;
  senderIncludedInHolders: boolean;
  ancestors: string[];
  maxRecipients: number;
  recipients: Recipient[];
  skipped: {
    noPubKey: number | null;
    noPubKeyComplete: boolean | null;
    restricted: number | null;
    restrictedComplete: boolean | null;
  };
}

export interface DepinRecipientsResolution extends DecodedDepinRecipients {
  context: DepinRpcContext;
  body: Record<string, unknown>;
  membershipChanged: boolean;
}

export function resolveDepinRecipients(params: ResolveDepinRecipientsParams): Promise<DepinRecipientsResolution>;

export function buildDepinMessageForPool(
  params: ResolveDepinRecipientsParams & Omit<BuildDepinMessageParams, 'recipientPubKeys'>,
): Promise<BuildDepinMessageResult & { resolution: DepinRecipientsResolution; context: DepinRpcContext }>;

/** Non-custodial overload: recipient encryption stays local and the identity
 * signs the exact digest returned by buildDepinPreimage. */
export function buildDepinMessageForPool(
  params: Omit<ResolveDepinRecipientsParams, 'senderPubKey' | 'senderAddress'> &
    Omit<BuildDepinMessageParams, 'recipientPubKeys' | 'privateKey' | 'senderAddress' | 'senderPubKey'> & {
      identity: SenderIdentity;
      network: Network;
      senderAddress?: never;
      senderPubKey?: never;
      privateKey?: never;
    },
): Promise<BuildDepinMessageResult & { resolution: DepinRecipientsResolution; context: DepinRpcContext }>;

/** Pure decoder for an already verified/decoded recipients body. */
export function decodeDepinRecipientDirectory(
  body: unknown,
  params: { token: string; poolRoot: string; network?: Network; requireComplete?: boolean },
): Promise<Recipient[]>;
export function decodeDepinRecipients(
  body: unknown,
  params: Omit<ResolveDepinRecipientsParams, 'rpc' | 'poolPublicKey' | 'context'>,
): Promise<DecodedDepinRecipients>;

// ---------------------------------------------------------------------------
// Transport privacy wrapper
// ---------------------------------------------------------------------------

export function wrapMessageForServer(
  messageHex: string,
  serverPubKeyHex: string,
  senderAddress: string,
): Promise<{ sender: string; encrypted: string }>;

export function unwrapMessageFromServer(
  encryptedHex: string,
  recipientPrivateKey: string,
  options?: { parseJson?: boolean },
): Promise<string | unknown | null>;

// ---------------------------------------------------------------------------
// Tokens / scope
// ---------------------------------------------------------------------------

export function validateDepinSectionToken(
  token: string,
  options?: { maxLength?: number },
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
export function privateKeyMatchesPublicKey(privKeyBytes: Uint8Array, pubKey: string | Uint8Array): boolean;
/**
 * Decodes a Legacy Base58 P2PKH address. Use decodeDepinAddress for both families. Bech32m witness addresses — nc1…/tnc1… (AuthScript v1),
 * pq1…/tpq1… (PQ v2), nq1…/tnq1… (ECDSA v3) — are rejected with an explicit
 * "DePIN requires a Legacy P2PKH address" error.
 */
export function decodeP2PKHAddress(
  address: string,
  network?: Network | null,
): Promise<{ version: number; payload: Uint8Array; network: 'mainnet' | 'test' | null }>;
export function decodeDepinAddress(
  address: string,
  network?: Network | null,
): Promise<{ type: 'legacy' | 'ecdsa'; payload: Uint8Array; network: 'mainnet' | 'test'; recipientId: string }>;
export function encodeEcdsaAddress(publicKey: Uint8Array, network: Network): string;
export function strictEcdsaCommitment(publicKey: Uint8Array): Uint8Array;
export function pubKeyMatchesAddress(pubKeyBytes: Uint8Array, address: string, network?: Network): Promise<boolean>;
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

export interface Recipient {
  address: string;
  publicKey: string | Uint8Array;
  network?: Network;
}
export interface EciesMessage {
  version?: 1 | 2;
  ephemeralPubKey: Uint8Array;
  encryptedPayload: Uint8Array;
  recipientKeys: Map<string, Uint8Array>;
}

export function eciesEncrypt(plaintext: Uint8Array, recipientPubKeys: Array<string | Uint8Array | Recipient>): Promise<EciesMessage>;
export function serializeEciesMessage(msg: EciesMessage): Uint8Array;
export function deserializeEciesMessage(
  serialized: Uint8Array,
  options?: { maxBytes?: number; maxRecipients?: number; maxPlaintext?: number },
): EciesMessage;
export function eciesDecrypt(msg: EciesMessage, privKeyBytes: Uint8Array, address?: string): Promise<Uint8Array | null>;

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
// Protocol 5 — errors (stable codes)
// ---------------------------------------------------------------------------

export class DepinError extends Error {
  code: string;
  cause?: unknown;
}
/** Malformed shape, encoding, limits or invariant violations. */
export class DepinProtocolError extends DepinError {
  code: 'DEPIN_PROTOCOL';
}
/** poolsig invalid, or key/address inconsistent with the reply. */
export class DepinReplyAuthenticationError extends DepinError {
  code: 'DEPIN_REPLY_AUTH';
}
/** An authenticated reply that cannot be opened/decrypted. */
export class DepinReplyDecryptionError extends DepinError {
  code: 'DEPIN_REPLY_DECRYPT';
}
/** Service identity, pool root or pool key differ from the recorded pin. */
export class PoolPinMismatchError extends DepinError {
  code: 'DEPIN_PIN_MISMATCH';
}
/** A flow was invoked without a required signing/opening capability. */
export class DepinCapabilityError extends DepinError {
  code: 'DEPIN_CAPABILITY';
}

// ---------------------------------------------------------------------------
// Protocol 5 — signmessage-compatible recoverable signatures (spec 3.3)
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

export function neuraiSignedMessageHash(message: string, address?: string): Uint8Array;
export function signRecoverableMessage(message: string, privateKey: string, options?: { address?: string; compressed?: boolean }): string;
export function recoverPublicKeyFromMessage(message: string, signatureBase64: string, address?: string): string;
export function verifyRecoverableMessage(
  message: string,
  signatureBase64: string,
  expectedPublicKey: string | Uint8Array,
  address?: string,
): boolean;

export const DEPIN_RPC_PROTOCOL: 5;
export interface DepinBootstrapRequest {
  protocol: 5;
  request_id: string;
  timestamp_ms: number | bigint;
}
export interface DepinRpcContext {
  network: string;
  pool_pubkey: string;
  pool_root: string;
  instance_id: string;
  membership_revision: string;
  membership_height: number;
  membership_blockhash: string;
  clockOffsetMs?: number;
}
export interface DepinRpcRequest extends DepinBootstrapRequest {
  network: string;
  pool_pubkey: string;
  pool_root: string;
  instance_id: string;
  membership_revision: string;
  token: string;
  address: string;
  challenge: string;
  args: Record<string, unknown>;
  signature: string;
}
export interface DepinSequenceCursor {
  version: 1;
  stream_id: string;
  after_seq: number | bigint;
  scope: string;
  address: string;
  from_timestamp: number | bigint;
}
export interface CreateDepinRpcRequestParams {
  method: string;
  context?: DepinRpcContext;
  token?: string;
  address?: string;
  challenge?: string;
  args?: Record<string, unknown>;
  timestampMs?: number | bigint;
  requestId?: string;
  clock?: () => number;
}
export function createDepinRpcRequest(params: CreateDepinRpcRequestParams): DepinRpcRequest | DepinBootstrapRequest;
export function depinRequestBytes(method: string, request: DepinBootstrapRequest | DepinRpcRequest): Uint8Array;
export function depinRequestHash(method: string, request: DepinBootstrapRequest | DepinRpcRequest): string;
export function buildDepinRpcRequestPreimage(params: { method: string; request: DepinBootstrapRequest | DepinRpcRequest }): string;
/** Compatibility names use the full RPC 5 request. Old DEPIN-REQ/GET/CLEAR fields are rejected. */
export const buildDepinRequestPreimage: typeof buildDepinRpcRequestPreimage;
export const buildDepinGetPreimage: typeof buildDepinRpcRequestPreimage;
export const buildDepinClearPreimage: typeof buildDepinRpcRequestPreimage;
export interface DepinReplyFields extends Omit<DepinRpcContext, 'clockOffsetMs'> {
  protocol: 5;
  request_hash: string;
  body_kind: 0 | 1;
  poolsig: string;
}
export interface PlainDepinReply extends DepinReplyFields {
  body_kind: 0;
  body: string;
}
export interface BoundDepinReply extends DepinReplyFields {
  body_kind: 1;
  encrypted: string;
}
export function buildDepinRpcResponsePreimage(params: {
  method: string;
  reply: PlainDepinReply | BoundDepinReply;
  requestHash: string;
}): string;
declare const VERIFIED_REPLY: unique symbol;
export interface VerifiedDepinReply {
  readonly [VERIFIED_REPLY]: true;
  readonly kind: 'plain' | 'bound';
  readonly replyHex: string;
  readonly method: string;
  readonly address: string;
  readonly poolPublicKey: string;
  readonly context: DepinRpcContext;
}
export function isVerifiedDepinReply(value: unknown): value is VerifiedDepinReply;
export function buildDepinReplyPreimage(params: {
  method: string;
  reply: PlainDepinReply | BoundDepinReply;
  request: DepinBootstrapRequest | DepinRpcRequest;
}): string;
export function verifyDepinReply(params: {
  reply: unknown;
  method: string;
  request: DepinBootstrapRequest | DepinRpcRequest;
  poolPublicKey: string | Uint8Array;
  expectedNetworkHash?: string;
}): VerifiedDepinReply;
export function decodePlainReply(reply: VerifiedDepinReply): Record<string, unknown>;
export type OpenReply = (encryptedHex: string) => Promise<Uint8Array | string> | Uint8Array | string;
export function openBoundReply(reply: VerifiedDepinReply, opener: string | OpenReply): Promise<Record<string, unknown>>;
export interface PoolPin {
  serviceId: string;
  poolRoot: string;
  poolPublicKey: string;
  network?: string;
}
export type PoolTrust = { mode: 'pinned'; pin: PoolPin } | { mode: 'key'; poolPublicKey: string } | { mode: 'tofu' };
export interface DepinPoolInfoResult {
  info: Record<string, unknown> & {
    enabled: boolean;
    token: string;
    maxrecipients: number;
    maxmessagesize: number;
    protocol: 5;
    depinpoolpkey: string;
    depinpoolkeyaddress?: string;
    server_time_ms: number;
  };
  pin: PoolPin;
  context: DepinRpcContext;
  trust: 'pinned' | 'key' | 'tofu';
  fingerprint: string;
}
export interface DepinPoolInfoParams {
  rpc: DepinRpc;
  serviceId: string;
  trust: PoolTrust;
  network?: Network;
  expectedNetworkHash?: string;
  timestampMs?: number;
  requestId?: string;
}
export function getDepinPoolInfo(params: DepinPoolInfoParams): Promise<DepinPoolInfoResult>;
export function decodeDepinPoolInfo(
  params: Omit<DepinPoolInfoParams, 'rpc'> & { reply: unknown; request: DepinBootstrapRequest },
): Promise<DepinPoolInfoResult>;
export function poolKeyFingerprint(publicKey: string | Uint8Array): string;
export interface DepinAuthSigningContext {
  kind: 'rpc';
  method: string;
  request: DepinRpcRequest;
  requestHash: string;
}
export interface DepinMessageSigningContext {
  kind: 'message';
  token: string;
  senderAddress: string;
  timestamp: number;
  messageType: number;
  encryptedPayloadHex: string;
}
export type SignMessage = (preimage: string, context?: DepinAuthSigningContext) => Promise<string> | string;
export type SignDigest = (digest: Uint8Array, context?: DepinMessageSigningContext) => Promise<Uint8Array | string> | Uint8Array | string;
export interface HolderIdentity {
  address: string;
  signMessage: SignMessage;
  openReply: OpenReply;
}
export interface SenderIdentity extends HolderIdentity {
  publicKey: string;
  signDigest: SignDigest;
}
export function createSoftwareIdentity(params: {
  privateKey: string;
  network: Network;
  address?: string;
  addressType?: 'legacy' | 'ecdsa';
}): Promise<SenderIdentity & { network: 'mainnet' | 'test' }>;
export function assertIdentityCapabilities(identity: unknown, capabilities: Array<'signMessage' | 'signDigest' | 'openReply'>): void;
export interface DepinCallParams {
  rpc: DepinRpc;
  context: DepinRpcContext;
  method: string;
  identity?: HolderIdentity;
  token?: string;
  address?: string;
  challenge?: string;
  args?: Record<string, unknown>;
  timestampMs?: number | bigint;
  requestId?: string;
}
export function callDepinRpc(
  params: DepinCallParams,
): Promise<{ body: Record<string, unknown>; context: DepinRpcContext; membershipChanged: boolean }>;
export class DepinRpcError extends Error {
  code: number;
  data: Record<string, unknown>;
  depinError: string | null;
  context: DepinRpcContext;
}
export interface ChallengeResult {
  challenge: string;
  expiresIn: number;
  type: 'receive' | 'admin';
  context: DepinRpcContext;
}
export function requestDepinChallenge(
  params: Omit<DepinCallParams, 'method' | 'identity'> & { identity: HolderIdentity; token: string; type?: 'receive' | 'admin' },
): Promise<ChallengeResult>;
export function decodeChallengeResult(body: unknown, type: 'receive' | 'admin'): Omit<ChallengeResult, 'context'>;
export interface ReceiveMessagesResult extends DecodedReceiveResponse {
  cursor: DepinSequenceCursor | null;
  context: DepinRpcContext;
  membershipChanged: boolean;
  raw: Record<string, unknown>;
}
export function receiveDepinMessages(
  params: Omit<DepinCallParams, 'method' | 'identity'> & {
    identity: HolderIdentity;
    token: string;
    challenge: string;
    network: Network;
    mode?: 'sequence' | 'timestamp';
    cursor?: DepinSequenceCursor | null;
    fromTimestamp?: number | bigint;
    afterHash?: string;
    timestamp?: number;
    limit?: number;
    requestedToken?: string;
    resolveSenderPubKey?: (address: string) => string | Promise<string>;
    limits?: ReceiveLimits;
  },
): Promise<ReceiveMessagesResult>;
export interface DepinSection {
  name: string;
  label?: string;
  depth?: number;
  access?: string;
  messages?: number;
  [key: string]: unknown;
}
export function listDepinSectionsPublic(
  params: Omit<DepinCallParams, 'method'>,
): Promise<{ sections: DepinSection[]; context: DepinRpcContext }>;
export function listDepinSectionsPrivate(
  params: Omit<DepinCallParams, 'method'> & { scope: string; identity: HolderIdentity; challenge: string },
): Promise<{ sections: DepinSection[]; nextChallenge: string | null; nextExpiresIn: number | null; context: DepinRpcContext }>;
export function clearDepinMessages(
  params: Omit<DepinCallParams, 'method'> & {
    identity: HolderIdentity;
    challenge: string;
    scope?: string;
    mode?: 'expired' | 'all' | number | bigint;
  },
): Promise<Record<string, unknown> & { context: DepinRpcContext }>;
export function submitDepinMessage(
  params: Omit<DepinCallParams, 'method'> & { identity: HolderIdentity; messageHex: string },
): Promise<Record<string, unknown> & { result: 'success'; hash: string; context: DepinRpcContext }>;
export function decodeSubmitResult(body: unknown): Record<string, unknown> & { result: 'success'; hash: string };
export {};
