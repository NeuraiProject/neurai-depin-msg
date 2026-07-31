/**
 * DePIN token names and hierarchical scope.
 *
 * Mirrors Core's rules (assets_fromscript.cpp):
 *   root:   ^&[A-Z0-9._]{3,}$
 *   sub:    ^&[A-Z0-9._]+(/[A-Z0-9._]+)*$ with every '/'-separated part at
 *           least 3 characters long (the first part counts its leading '&').
 * DePIN assets currently exist on testnet/regtest, where the maximum asset
 * name length is 121 (mainnet would be 31).
 */

const DEPIN_ROOT_RE = /^&[A-Z0-9._]{3,}$/;
const DEPIN_SUB_RE = /^&[A-Z0-9._]+\/[A-Z0-9._/]+$/;

const MAX_DEPIN_TOKEN_LENGTH = 121;

/**
 * Local, syntactic validation of a DePIN root or section token.
 * Returns { valid, error, parts } — parts is the '/'-split when valid.
 */
function validateDepinSectionToken(token, options = {}) {
  const { maxLength = MAX_DEPIN_TOKEN_LENGTH } = options;

  if (typeof token !== 'string' || token.length === 0) {
    return { valid: false, error: 'Token is required', parts: null };
  }
  if (token.length > maxLength) {
    return { valid: false, error: 'Token exceeds maximum length of ' + maxLength, parts: null };
  }
  if (token[0] !== '&') {
    return { valid: false, error: "DePIN token must start with '&'", parts: null };
  }

  if (token.includes('/')) {
    if (!DEPIN_SUB_RE.test(token)) {
      return { valid: false, error: 'Invalid DePIN section token characters', parts: null };
    }
    const parts = token.split('/');
    for (const part of parts) {
      // Core: every part must be >= 3 chars ('&' counts in the first part)
      if (part.length < 3) {
        return { valid: false, error: 'Each token part must be at least 3 characters', parts: null };
      }
    }
    return { valid: true, error: null, parts };
  }

  if (!DEPIN_ROOT_RE.test(token)) {
    return { valid: false, error: 'Invalid DePIN root token (need &, then 3+ of A-Z 0-9 . _)', parts: null };
  }
  return { valid: true, error: null, parts: [token] };
}

/**
 * True when messageToken is requestedRootOrSection itself or one of its
 * descendants. Component-wise: '&TEST' never matches '&TESTING'.
 * Both tokens must be syntactically valid.
 */
function isDepinTokenInScope(messageToken, requestedRootOrSection) {
  const msg = validateDepinSectionToken(messageToken);
  const scope = validateDepinSectionToken(requestedRootOrSection);
  if (!msg.valid || !scope.valid) return false;

  return messageToken === requestedRootOrSection ||
    messageToken.startsWith(requestedRootOrSection + '/');
}

/**
 * Returns the token and each of its ancestors (token first), stopping at
 * `stopAt` inclusive when given. Throws when stopAt is not the token or one
 * of its ancestors.
 */
function getDepinTokenAncestors(token, stopAt) {
  const v = validateDepinSectionToken(token);
  if (!v.valid) throw new Error(v.error);

  const ancestors = [];
  let current = token;
  for (;;) {
    ancestors.push(current);
    if (stopAt !== undefined && stopAt !== null && current === stopAt) return ancestors;
    const idx = current.lastIndexOf('/');
    if (idx === -1) break;
    current = current.slice(0, idx);
  }

  if (stopAt !== undefined && stopAt !== null) {
    throw new Error("stop_at '" + stopAt + "' is not '" + token + "' or one of its ancestors");
  }
  return ancestors;
}

export {
  MAX_DEPIN_TOKEN_LENGTH,
  validateDepinSectionToken,
  isDepinTokenInScope,
  getDepinTokenAncestors
};
