/**
 * DePIN only works with Legacy P2PKH addresses (node: depinchallenge.cpp,
 * depinmsgpool.cpp). neurai-key 5 witness addresses — generic AuthScript v1
 * (nc1p…/tnc1p…), post-quantum v2 (pq1z…/tpq1z…) and ECDSA v3 (nq1r…/tnq1r…)
 * — must fail with an explicit error, while Base58 P2PKH addresses that merely
 * start like a Bech32 HRP ('NQ1…', 'tNc1…') must keep decoding.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeP2PKHAddress, pubKeyMatchesAddress, createSoftwareIdentity,
  buildDepinMessage, verifyDepinReceivedMessage,
  base58CheckEncode, hexToBytes
} from '../src/index.js';
import { keypair } from './helpers.mjs';

const WITNESS_ADDRESSES = [
  // [address, witness version, network]
  ['tnc1p83wfxfypfr3tqpwakdgmk5r0pwpsemq5ngdsx7gef8yc84pndfmqqd6m25', 1, 'test'],
  ['nc1p3y7kpr5qvg8czeqgw2kzg4w9msc7yw39h4z0qdvp3etwf7qzreksj3ypsd', 1, 'mainnet'],
  ['tpq1z4xrgwmgmhr3ezrkk5aa0ez3xdztvm9jzrmgu4uxz6vm8l9lgv4zs3xdctv', 2, 'test'],
  ['pq1zuu4w8s5cmp7m5jgjd06szmnv7ta2esg4znnag5sdyhydja6pgezqsh4e35', 2, 'mainnet'],
  ['tnq1r0c9zl485wv7wcfutxfyv8k2ltpfk5hdyp3s7g4chlphx8d2m6npqwxvjya', 3, 'test'],
  ['nq1rp2ggnqzc6tuflpvl8y546y47k267q8044kzc5p4t63h6ygry0trqsdg6zs', 3, 'mainnet'],
  // Pre-neurai-key-5 v1 form (nq/tnq + v1), now invalid on the node too.
  ['tnq1pdsj0aztvgwv3rwgml360stpyp228zrggyga6n4sdenmetm6wv3tqzddk95', 1, 'test']
];

const WITNESS_ERROR = /DePIN requires a Legacy P2PKH address \(neurai-key network 'xna-legacy' \/ 'xna-legacy-test'\); witness addresses \(nc1…, pq1…, nq1…\) are not accepted by the node/;

for (const [address, version, network] of WITNESS_ADDRESSES) {
  test('witness v' + version + ' address ' + address.slice(0, 5) + '… is rejected with a clear error', async () => {
    const expected = new RegExp('^Unsupported witness v' + version + ' address');
    await assert.rejects(decodeP2PKHAddress(address), { message: expected });
    await assert.rejects(decodeP2PKHAddress(address), WITNESS_ERROR);
    await assert.rejects(decodeP2PKHAddress(address, network), WITNESS_ERROR);
  });
}

test('upper-case Bech32m witness addresses are rejected the same way', async () => {
  const upper = 'TNQ1R0C9ZL485WV7WCFUTXFYV8K2LTPFK5HDYP3S7G4CHLPHX8D2M6NPQWXVJYA';
  await assert.rejects(decodeP2PKHAddress(upper), { message: /^Unsupported witness v3 address/ });
  await assert.rejects(decodeP2PKHAddress(upper), WITNESS_ERROR);
});

test('a witness address with a broken checksum still points to Legacy P2PKH', async () => {
  const typo = 'tnq1r0c9zl485wv7wcfutxfyv8k2ltpfk5hdyp3s7g4chlphx8d2m6npqwxvjyq';
  await assert.rejects(decodeP2PKHAddress(typo), /checksum is invalid/);
  await assert.rejects(decodeP2PKHAddress(typo), WITNESS_ERROR);
});

test('Base58 P2PKH addresses that start like a Bech32 HRP keep decoding', async () => {
  const mainnet = await decodeP2PKHAddress('NQ1EZZUfHwE4ntRyqW5LAFCcDZjLKxvGyH');
  assert.equal(mainnet.version, 53);
  assert.equal(mainnet.network, 'mainnet');
  assert.equal(mainnet.payload.length, 20);
  assert.equal(await base58CheckEncode(53, mainnet.payload), 'NQ1EZZUfHwE4ntRyqW5LAFCcDZjLKxvGyH');

  const test = await decodeP2PKHAddress('tNc1F3aqhmGhKipLWa9U4tuoLh9yyP1ZXP', 'regtest');
  assert.equal(test.version, 127);
  assert.equal(test.network, 'test');
  assert.equal(await base58CheckEncode(127, test.payload), 'tNc1F3aqhmGhKipLWa9U4tuoLh9yyP1ZXP');
});

test('non-witness garbage keeps the original Base58 errors', async () => {
  // A mistyped Base58 look-alike is not reported as a witness address.
  await assert.rejects(decodeP2PKHAddress('NQ1EZZUfHwE4ntRyqW5LAFCcDZjLKxvGyX'), /Base58Check: checksum mismatch/);
  // Bech32 of another chain: not a Neurai witness HRP.
  await assert.rejects(
    decodeP2PKHAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'),
    /Invalid Base58 character/
  );
});

test('identity, build and verify paths surface the witness error', async () => {
  const k = keypair('11'.repeat(32));
  const witness = 'tnq1r0c9zl485wv7wcfutxfyv8k2ltpfk5hdyp3s7g4chlphx8d2m6npqwxvjya';

  await assert.rejects(pubKeyMatchesAddress(hexToBytes(k.pub), witness, 'test'), WITNESS_ERROR);

  await assert.rejects(
    createSoftwareIdentity({ privateKey: k.privHex, network: 'test', address: witness }),
    WITNESS_ERROR
  );

  await assert.rejects(
    buildDepinMessage({
      token: '&NEWS', senderAddress: witness, senderPubKey: k.pub, privateKey: k.privHex,
      message: 'hi', messageType: 'group', recipientPubKeys: [k.pub],
      timestamp: 1700000000, network: 'test'
    }),
    WITNESS_ERROR
  );

  const result = await verifyDepinReceivedMessage({
    token: '&NEWS', sender: witness, timestamp: 1700000000, messageType: 'group',
    encryptedPayloadHex: '00', signatureHex: '3006020101020101'
  }, { network: 'test' });
  assert.equal(result.signatureValid, false);
  assert.match(result.reason, /^sender address invalid: Unsupported witness v3 address/);
});
