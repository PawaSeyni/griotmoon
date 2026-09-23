// P3-3: the build's type check must actually check. tsconfig.json is a solution file
// ("files": [] plus references), so plain `tsc` compiles nothing and always passes;
// only `tsc -b` follows the references into tsconfig.app.json and tsconfig.node.json.
// Until 23 September 2026 the build ran plain `tsc`, so no type error ever failed a deploy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const root = JSON.parse(readFileSync('tsconfig.json', 'utf8'));

test('build and typecheck run tsc in build mode', () => {
  assert.match(pkg.scripts.build, /^tsc -b(\s|$)/, 'build must start with `tsc -b`');
  assert.equal(pkg.scripts.typecheck, 'tsc -b');
});

test('no script runs a bare `tsc`, which is a no-op against this solution tsconfig', () => {
  const isSolution = Array.isArray(root.files) && root.files.length === 0 && root.references?.length;
  assert.ok(isSolution, 'tsconfig.json shape changed: revisit this test');
  for (const [name, cmd] of Object.entries(pkg.scripts)) {
    assert.ok(!/(^|&&\s*)tsc(\s*&&|\s*$)/.test(cmd), `script "${name}" runs a bare tsc: ${cmd}`);
  }
});
