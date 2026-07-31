/**
 * Type definitions for @neuraiproject/neurai-depin-msg 2.3.0
 */

export type Network = 'mainnet' | 'test' | 'testnet' | 'regtest';
export type MessageType = 'private' | 'group';
export type Authentication = 'signature' | 'gateway-preauthenticated' | 'invalid';
export type PreAuthenticatedPolicy = 'reject' | 'trust-gateway';

// ---------------------------------------------------------------------------
// Build / sign
// ---------------------------------------------------------------------------

export interface BuildDepinMessageParams {
  token: string;
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

export function isPreAuthenticatedSentinel(signatureBytes: Uint8Array): boolean;

// ---------------------------------------------------------------------------
// Non-custodial reception
// ---------------------------------------------------------------------------

export interface ReceiveLimits {
  maxMessages?: number;
  maxPayloadBytes?: number;
}

export interface ValidateAndDecryptOptions extends VerifyOptions {
  privateKey?: string | null;
  requestedToken?: string | null;
  limits?: ReceiveLimits;
  preAuthenticatedPolicy?: PreAuthenticatedPolicy;
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

export interface DepinTransport {
  request(host: string, port: number, payload: string): Promise<string>;
}

export interface ResolveDepinRecipientsParams {
  token: string;
  poolRoot: string;
  /** Pool limit, 1..50. Applied to the final map, sender included. */
  maxRecipients: number;
  senderPubKey: string;
  rpc: DepinRpc;
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

export interface DepinPoolInfo {
  token: string;
  port: number;
  cipher: string;
  /** Reported limit clamped to Core's absolute maximum of 50. */
  maxRecipients: number;
  maxMessageSize: number;
  messageExpiryHours: number;
  maxPoolSizeMB: number;
  messageCount: number;
  memoryUsage: number;
  oldestMessage: string;
  newestMessage: string;
  poolPubKey: string | null;
  raw: string;
}

export function parseDepinPoolInfo(raw: string): DepinPoolInfo;

export function getRemoteDepinPoolInfo(params: {
  host: string;
  port: number;
  transport: DepinTransport;
}): Promise<DepinPoolInfo>;

export function buildDepinMessageForRemotePool(
  params: { host: string; port: number; transport: DepinTransport; rpc: DepinRpc } &
    Omit<BuildDepinMessageParams, 'recipientPubKeys'>
): Promise<BuildDepinMessageResult & {
  resolution: DepinRecipientsResolution;
  poolInfo: DepinPoolInfo;
}>;

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
