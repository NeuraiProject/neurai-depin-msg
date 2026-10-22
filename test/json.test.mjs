import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertNoDuplicateJsonKeys } from '../src/json.js';
test('rejects duplicate keys including equal values and escaped names', () => {
  for (const text of ['{"a":1,"a":1}', '{"a":1,"a":2}', '{"a":1,"\\u0061":1}', '{"x":[{"a":1,"a":1}]}'])
    assert.throws(() => assertNoDuplicateJsonKeys(text), SyntaxError);
  for (const text of ['{"a":1,"b":{"a":1}}', '[{"a":1},{"a":1}]', '{"a":"\\\"{}[]:,,","b":2}'])
    assert.doesNotThrow(() => assertNoDuplicateJsonKeys(text));
  assert.throws(() => assertNoDuplicateJsonKeys('['.repeat(129) + '0' + ']'.repeat(129)), /nesting/);
});
