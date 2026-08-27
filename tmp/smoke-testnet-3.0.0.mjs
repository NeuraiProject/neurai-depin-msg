/**
 * Testnet smoke for neurai-depin-msg 3.0.0 (plan v2 §6.4), against the public
 * DePIN proxy. Opt-in (no embedded secrets); read-only, plain (unauthenticated)
 * calls only — bootstrap TOFU and public sections. In TOFU it prints the
 * observed serviceId, pin and fingerprint for approval/comparison; it never
 * persists a pin. Connectivity failure is an operational incident.
 *
 * Run: node tmp/smoke-testnet-3.0.0.mjs
 */
import {
  getDepinPoolInfo, listDepinSectionsPublic
} from '../src/index.js';

const URL = process.env.DEPIN_RPC_URL || 'https://rpc-testnet-depin.neurai.org/rpc';
const SERVICE = URL;
const TIMEOUT_MS = 20000;
const RETRIES = 3;

let failures = 0;
function check(name, cond, detail = '') {
  if (!cond) failures += 1;
  console.log(`[${cond ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
}

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label}: timeout after ${TIMEOUT_MS}ms`)), TIMEOUT_MS))
  ]);
}

const rpc = {
  call: async (method, params) => {
    let lastErr;
    for (let i = 1; i <= RETRIES; i++) {
      try {
        const res = await withTimeout(fetch(URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: i, method, params })
        }), method);
        const json = await res.json();
        if (json.error) {
          const e = new Error(json.error.message || 'RPC error');
          e.code = json.error.code;
          throw e;
        }
        return json.result;
      } catch (e) {
        lastErr = e;
        console.log(`[RETRY ${i}/${RETRIES}] ${method}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 2000 * i));
      }
    }
    throw lastErr;
  }
};

try {
  const boot = await getDepinPoolInfo({ rpc, serviceId: SERVICE, trust: { mode: 'tofu' }, network: 'test' });
  console.log(`proxy: ${URL}`);
  console.log(`  observed serviceId : ${boot.pin.serviceId}`);
  console.log(`  observed pool root : ${boot.pin.poolRoot}`);
  console.log(`  observed pool key  : ${boot.pin.poolPublicKey}`);
  console.log(`  fingerprint        : ${boot.fingerprint}`);
  check('depingetmsginfo poolsig authenticates (TOFU self-consistency)', boot.trust === 'tofu');
  check('protocol === 2', boot.info.protocol === 2, String(boot.info.protocol));
  check('pool announces a maxrecipients', Number.isInteger(boot.info.maxrecipients));

  const sections = await listDepinSectionsPublic({
    rpc, poolRoot: boot.pin.poolRoot, poolPublicKey: boot.pin.poolPublicKey
  });
  check('depinlistsections (public) verifies and returns an array',
    Array.isArray(sections.sections), `${sections.sections.length} sections`);

  console.log(failures === 0 ? '\nTESTNET SMOKE: ALL CHECKS PASSED' : `\nTESTNET SMOKE: ${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
} catch (e) {
  console.error(`\nTESTNET SMOKE: OPERATIONAL FAILURE — ${e.message}`);
  console.error('Connectivity/service incident (not a code regression). Needs maintainer sign-off before publishing.');
  process.exit(2);
}
