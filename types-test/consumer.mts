// ESM consumer (.mts is ESM whatever package.json#type says), compiled by
// `npm run test:types` against the package (index.d.ts) the way an ESM
// application imports it, with skipLibCheck: false. scripts/test-package.mjs
// compiles a fuller NodeNext consumer against the packed tarball.
import {
  createSoftwareIdentity,
  decodeP2PKHAddress,
  signRecoverableMessage,
  verifyRecoverableMessage,
  type DepinRpc,
  type SenderIdentity,
} from '@neuraiproject/neurai-depin-msg';

export const rpc: DepinRpc = { call: async () => ({}) };
export const identity: Promise<SenderIdentity> = createSoftwareIdentity({ privateKey: '11'.repeat(32), network: 'test' });
export const signature: string = signRecoverableMessage('probe', '11'.repeat(32));
export const verify = verifyRecoverableMessage;
export const decode = decodeP2PKHAddress;
