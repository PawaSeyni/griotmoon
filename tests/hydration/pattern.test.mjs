// The hydration gate (scripts/check-hydration.mjs) is only as good as its error
// pattern: if React's wording drifts or the regex is loosened, the check passes
// every page while hydration quietly fails. Pin what it must and must not match.
// The end-to-end proof (a real mismatch failing the build) is in the PR that
// added the check; this keeps the matcher itself from regressing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isHydrationError } from '../../scripts/lib/hydration.mjs';

const decoder = n =>
  `Minified React error #${n}; visit https://reactjs.org/docs/error-decoder.html?invariant=${n} for the full message`;

test('flags the production hydration errors', () => {
  for (const n of [418, 421, 422, 423, 425]) assert.ok(isHydrationError(decoder(n)), `#${n}`);
});

test('flags the development wordings', () => {
  assert.ok(isHydrationError('Hydration failed because the initial UI does not match what was rendered on the server.'));
  assert.ok(isHydrationError('Warning: Text content did not match. Server: "a" Client: "b"'));
});

test('ignores unrelated React and browser errors', () => {
  for (const msg of [
    decoder(185), // maximum update depth
    decoder(4180), // a different number that merely starts with 418
    'Failed to load resource: net::ERR_FAILED',
    'TypeError: Cannot read properties of undefined',
  ]) {
    assert.ok(!isHydrationError(msg), msg);
  }
});
