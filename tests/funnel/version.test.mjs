// P3-1: deploy provenance. dist/version.json is how a live check tells a deploy that
// shipped from one Netlify silently skipped, so the stamp must be correct and a build
// that cannot name its commit must fail rather than ship unprovenanced.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SCRIPT = path.resolve('scripts/gen-version.mjs');
const SHA = 'a'.repeat(40);

// Run from an empty temp dir (not a git checkout), so only COMMIT_REF can supply a SHA.
function run(env, withDist = true) {
  const dir = mkdtempSync(path.join(tmpdir(), 'gm-version-'));
  if (withDist) mkdirSync(path.join(dir, 'dist'));
  const r = spawnSync(process.execPath, [SCRIPT], {
    cwd: dir,
    env: { PATH: process.env.PATH, ...env },
    encoding: 'utf8',
  });
  return { ...r, dir };
}

test('writes commit, short commit, branch and context', () => {
  const r = run({ COMMIT_REF: SHA, BRANCH: 'main', CONTEXT: 'production', DEPLOY_ID: 'd1' });
  assert.equal(r.status, 0, r.stderr);
  const v = JSON.parse(readFileSync(path.join(r.dir, 'dist/version.json'), 'utf8'));
  assert.equal(v.commit, SHA);
  assert.equal(v.shortCommit, SHA.slice(0, 7));
  assert.equal(v.branch, 'main');
  assert.equal(v.context, 'production');
  assert.equal(v.deployId, 'd1');
  assert.ok(!Number.isNaN(Date.parse(v.builtAt)));
});

test('context defaults to "local" off Netlify, so a laptop build is never mistaken for production', () => {
  const r = run({ COMMIT_REF: SHA });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(readFileSync(path.join(r.dir, 'dist/version.json'), 'utf8')).context, 'local');
});

test('refuses to build without a valid commit SHA', () => {
  const r = run({ COMMIT_REF: 'not-a-sha' });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /could not resolve a commit SHA/);
});

test('refuses to run before vite build (no dist/)', () => {
  const r = run({ COMMIT_REF: SHA }, false);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /does not exist/);
});
