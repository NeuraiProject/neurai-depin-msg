import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateDepinSectionToken, isDepinTokenInScope, getDepinTokenAncestors
} from '../src/index.js';

test('valid tokens (mirrors Core name rules)', () => {
  for (const t of [
    '&NEWS', '&TEST', '&A.B_C1', '&NEWS/GENERAL', '&NEWS/GENERAL/SPORT',
    '&AB/CDE' // first '/'-part counts its '&': "&AB" is 3 chars, Core accepts it
  ]) {
    const r = validateDepinSectionToken(t);
    assert.equal(r.valid, true, t + ': ' + r.error);
  }
});

test('invalid tokens', () => {
  for (const t of [
    '', 'NEWS', '&ab', '&AB', '&A', '&NEWS/', '&NEWS//X', '&NEWS/GE', '&NE WS',
    '&news/GENERAL', '/NEWS', '&NEWS/general', '&' + 'A'.repeat(125)
  ]) {
    const r = validateDepinSectionToken(t);
    assert.equal(r.valid, false, t + ' should be invalid');
  }
});

test('scope is component-wise', () => {
  assert.equal(isDepinTokenInScope('&NEWS', '&NEWS'), true);
  assert.equal(isDepinTokenInScope('&NEWS/GENERAL', '&NEWS'), true);
  assert.equal(isDepinTokenInScope('&NEWS/GENERAL/SPORT', '&NEWS/GENERAL'), true);
  // never the parent, a sibling, or a prefix-confusable name
  assert.equal(isDepinTokenInScope('&NEWS', '&NEWS/GENERAL'), false);
  assert.equal(isDepinTokenInScope('&NEWS/OTHER', '&NEWS/GENERAL'), false);
  assert.equal(isDepinTokenInScope('&NEWSY', '&NEWS'), false);
  assert.equal(isDepinTokenInScope('&TESTING', '&TEST'), false);
  // invalid tokens are never in scope
  assert.equal(isDepinTokenInScope('&no', '&NEWS'), false);
});

test('ancestors with stop_at', () => {
  assert.deepEqual(
    getDepinTokenAncestors('&NEWS/GENERAL/SPORT'),
    ['&NEWS/GENERAL/SPORT', '&NEWS/GENERAL', '&NEWS']
  );
  assert.deepEqual(
    getDepinTokenAncestors('&NEWS/GENERAL/SPORT', '&NEWS/GENERAL'),
    ['&NEWS/GENERAL/SPORT', '&NEWS/GENERAL']
  );
  assert.throws(() => getDepinTokenAncestors('&NEWS/GENERAL', '&OTHER'), /not/);
});
