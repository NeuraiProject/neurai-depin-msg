#!/usr/bin/env python3
"""Run the real RPC 5 SDK against two disposable Core regtest wallets.

Requires NEURAI_SOURCE, NODE_BINARY and the built SDK. Only the test framework
creates/stops nodes. Private fixture data travels over pipes, never to logs.
"""
import json
import os
from pathlib import Path
import subprocess
import sys

sys.path.insert(0, str(Path(os.environ['NEURAI_SOURCE']) / 'test/functional'))
from feature_depin_ecdsa import DepinECDSATest, TOKEN
from test_framework.depin import pool_address
from test_framework.util import sync_blocks


class SDKTest(DepinECDSATest):
    def run_test(self):
        self.clients()
        self.primary.generate(432)
        sync_blocks(self.nodes)
        alice, bob = self.primary.getnewaddress(), self.primary.getnewaddress()
        carlos, marta, outsider = [self.secondary.getnewaddress() for _ in range(3)]
        for address, wallet in [(alice, self.primary), (bob, self.primary),
                                (carlos, self.secondary), (marta, self.secondary),
                                (outsider, self.secondary)]:
            self.reveal(address, wallet)
        alias = pool_address(self.primary.getpubkey(carlos)['pubkey'])
        self.reveal(alias, self.secondary)
        self.primary.issue(TOKEN, 100, alice)
        self.mine()
        self.primary.transfer(TOKEN + '!', 1, alice)
        self.mine()
        for address in (bob, carlos, marta):
            self.primary.transferfromaddress(TOKEN, alice, 10, address, '', 0, '', alice)
            self.mine()

        fixture = {
            'url': self.nodes[0].url + '/wallet/primary',
            'strictUrl': self.nodes[1].url + '/wallet/secondary',
            'genesis': self.primary.getblockhash(0),
            'poolKey': self.legacy_client.bootstrap()[1]['depinpoolpkey'],
            'token': TOKEN,
            'identities': {
                name: {'address': address, 'privateKey': wallet.dumpprivkey(address)}
                for name, address, wallet in [('alice', alice, self.primary), ('bob', bob, self.primary),
                    ('carlos', carlos, self.secondary), ('marta', marta, self.secondary),
                    ('alias', alias, self.secondary), ('outsider', outsider, self.secondary)]
            },
        }
        script = Path(__file__).with_name('rpc5-core.mjs')
        proc = subprocess.Popen([os.environ['NODE_BINARY'], str(script)], stdin=subprocess.PIPE,
                                stdout=subprocess.PIPE, text=True)

        def stage(name, **extra):
            proc.stdin.write(json.dumps({'stage': name, **extra}) + '\n')
            proc.stdin.flush()
            line = proc.stdout.readline()
            if not line:
                raise AssertionError('SDK integration process exited unexpectedly')
            result = json.loads(line)
            assert result.get('ok'), result
            self.log.info('SDK integration: %s', result['stage'])

        try:
            stage('initial', fixture=fixture)
            self.primary.freezedepin(TOKEN, marta, alice)
            freeze = self.mine()
            stage('frozen')
            self.primary.invalidateblock(freeze)
            stage('reorg')
            self.primary.reconsiderblock(freeze)
            self.primary.transferfromaddress(TOKEN, alice, 1, alias, '', 0, '', alice)
            self.mine()
            stage('alias')
            self.restart_relay()
            stage('restart', url=self.nodes[0].url + '/wallet/primary')
            self.restart_node(0, [arg for arg in self.depin_args if arg != '-depinpoolpersist=1'] + ['-depinpoolpersist=0'])
            self.clients()
            stage('stream-reset', url=self.nodes[0].url + '/wallet/primary')
        finally:
            proc.stdin.close()
            try:
                code = proc.wait(timeout=20)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait()
                raise
            assert code == 0, 'SDK integration process failed'


if __name__ == '__main__':
    SDKTest().main()
