# Changelog

## 4.0.0

- Migrate every messaging operation to RPC 5 with complete request signatures and response binding to the local request hash, chain, pool, instance and membership revision.
- Support exact Legacy and strict ECDSA identities, address-aware message authentication and typed ECIES 2 recipients.
- Default reads to admission sequences with exact BigInt cursors; expose verified membership errors and context for challenge renewal.
- Add explicit recipient subsets and a separately verified directory for recipient pickers.
- Correct ECIES map ordering and reject malformed/noncanonical frames. Older noncanonical SDK group frames require migration; canonical Legacy history remains supported.
- Keep software/private-key operations local and provide structured RPC 5 signing contexts for external signers. Old hardware firmware requires a separate update.
