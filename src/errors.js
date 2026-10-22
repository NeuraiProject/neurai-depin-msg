/**
 * Stable error taxonomy for DePIN Protocol 2 (plan v2 §2.6).
 *
 * Every class carries a stable `code` for programmatic branching and keeps
 * the original failure in `cause` when one exists. Messages never include
 * private keys, decrypted challenges, full signatures or private payloads.
 */

class DepinError extends Error {
  constructor(message, code, cause) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}

/** Malformed shape, encoding, limits or invariant violations. */
class DepinProtocolError extends DepinError {
  constructor(message, cause) {
    super(message, 'DEPIN_PROTOCOL', cause);
  }
}

/** `poolsig` invalid, or key/address inconsistent with the reply. */
class DepinReplyAuthenticationError extends DepinError {
  constructor(message, cause) {
    super(message, 'DEPIN_REPLY_AUTH', cause);
  }
}

/** An authenticated reply that cannot be opened/decrypted. */
class DepinReplyDecryptionError extends DepinError {
  constructor(message, cause) {
    super(message, 'DEPIN_REPLY_DECRYPT', cause);
  }
}

/** Service identity, pool root or pool key differ from the recorded pin. */
class PoolPinMismatchError extends DepinError {
  constructor(message, cause) {
    super(message, 'DEPIN_PIN_MISMATCH', cause);
  }
}

/** A flow was invoked without a required signing/opening capability. */
class DepinCapabilityError extends DepinError {
  constructor(message, cause) {
    super(message, 'DEPIN_CAPABILITY', cause);
  }
}

/** Error carried inside a verified (and, for private calls, decrypted) reply. */
class DepinRpcError extends Error {
  constructor(error, context) {
    super(error.message || 'DePIN RPC failed');
    this.name = 'DepinRpcError';
    this.code = error.code;
    this.data = error.data ?? {};
    this.depinError = this.data.depin_error ?? null;
    this.context = context;
  }
}

export {
  DepinRpcError,
  DepinError,
  DepinProtocolError,
  DepinReplyAuthenticationError,
  DepinReplyDecryptionError,
  PoolPinMismatchError,
  DepinCapabilityError,
};
