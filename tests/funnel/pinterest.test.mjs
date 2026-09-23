// Pinterest Conversions API (parity plan P2-4), ported from Eva. Server-side only (no
// browser pintrk): the signup event fires, it NEVER carries a raw email, and it is gated
// on BOTH a token and an explicit ad account (no default, so never Eva's account).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildSignupEvent, hashEmail, sendSignupConversion } from '../../netlify/functions/_pinterest.mjs';

const RAW_EMAIL = 'Jane.Secret@Example.com';
const EXPECTED_HASH = createHash('sha256').update('jane.secret@example.com').digest('hex');

test('hashEmail normalises (trim + lowercase) before hashing', () => {
  assert.equal(hashEmail('  Jane.Secret@Example.com '), EXPECTED_HASH);
  assert.equal(hashEmail('jane.secret@example.com'), EXPECTED_HASH);
});

test('4.5b — buildSignupEvent produces a signup event carrying the magnet', () => {
  const ev = buildSignupEvent({ email: RAW_EMAIL, leadMagnet: 'parents-guide', eventId: 'id-1', eventTime: 1000 });
  assert.equal(ev.event_name, 'signup');
  assert.equal(ev.action_source, 'web');
  assert.equal(ev.custom_data.content_category, 'parents-guide');
  assert.deepEqual(ev.custom_data.content_ids, ['parents-guide']);
  assert.deepEqual(ev.user_data.em, [EXPECTED_HASH]);
});

test('4.5d — the event carries ONLY the hashed email: no raw email, no IP, no UA', () => {
  const ev = buildSignupEvent({ email: RAW_EMAIL, leadMagnet: 'bedtime-routine', eventId: 'id-2', eventTime: 2000 });
  // user_data must contain exactly `em` and nothing else (no IP / UA identifiers).
  assert.deepEqual(Object.keys(ev.user_data), ['em']);
  assert.equal(ev.user_data.client_ip_address, undefined);
  assert.equal(ev.user_data.client_user_agent, undefined);
  const blob = JSON.stringify(ev).toLowerCase();
  assert.ok(!blob.includes('jane.secret@example.com'), 'raw email leaked');
  assert.ok(!blob.includes('jane secret'), 'name leaked');
  assert.ok(blob.includes(EXPECTED_HASH), 'hashed em missing');
});

test('sendSignupConversion is skipped (never sent) when no token is configured', async () => {
  const prev = process.env.PINTEREST_CONVERSIONS_TOKEN;
  delete process.env.PINTEREST_CONVERSIONS_TOKEN;
  let called = false;
  const res = await sendSignupConversion(
    { email: RAW_EMAIL, leadMagnet: 'parents-guide' },
    { fetchImpl: async () => { called = true; return { ok: true, json: async () => ({}) }; } }
  );
  if (prev !== undefined) process.env.PINTEREST_CONVERSIONS_TOKEN = prev;
  assert.equal(res.skipped, true);
  assert.equal(called, false, 'must not call Pinterest without a token');
});

test('sendSignupConversion POSTs a bearer-authed signup with the hashed email only', async () => {
  const prev = process.env.PINTEREST_CONVERSIONS_TOKEN;
  process.env.PINTEREST_CONVERSIONS_TOKEN = 'test-token';
  process.env.PINTEREST_AD_ACCOUNT_ID = '1234567890';
  let captured = null;
  const res = await sendSignupConversion(
    { email: RAW_EMAIL, leadMagnet: 'parents-guide' },
    {
      fetchImpl: async (url, opts) => {
        captured = { url, opts };
        return { ok: true, status: 200, json: async () => ({ num_events_received: 1 }) };
      },
      now: () => 5_000_000,
      uuid: () => 'evt-123',
    }
  );
  if (prev !== undefined) process.env.PINTEREST_CONVERSIONS_TOKEN = prev;
  else delete process.env.PINTEREST_CONVERSIONS_TOKEN;

  assert.equal(res.ok, true);
  assert.match(captured.url, /\/v5\/ad_accounts\/1234567890\/events$/);
  assert.equal(captured.opts.headers.Authorization, 'Bearer test-token');
  const sent = JSON.parse(captured.opts.body);
  assert.equal(sent.data[0].event_name, 'signup');
  assert.equal(sent.data[0].event_time, 5000); // ms → s
  assert.deepEqual(sent.data[0].user_data.em, [EXPECTED_HASH]);
  // hashed email ONLY — no IP / UA in the request body
  assert.deepEqual(Object.keys(sent.data[0].user_data), ['em']);
  const bodyLc = captured.opts.body.toLowerCase();
  assert.ok(!bodyLc.includes('jane.secret@example.com'), 'raw email in request body');
  assert.ok(!bodyLc.includes('client_ip_address'), 'IP field in request body');
  assert.ok(!bodyLc.includes('client_user_agent'), 'UA field in request body');
});

test('sendSignupConversion is skipped when the ad account is unset: there is no default account', async () => {
  const prevT = process.env.PINTEREST_CONVERSIONS_TOKEN;
  const prevA = process.env.PINTEREST_AD_ACCOUNT_ID;
  process.env.PINTEREST_CONVERSIONS_TOKEN = 'test-token';
  delete process.env.PINTEREST_AD_ACCOUNT_ID;
  let called = false;
  const res = await sendSignupConversion(
    { email: RAW_EMAIL, leadMagnet: 'parents-guide' },
    { fetchImpl: async () => { called = true; return { ok: true, json: async () => ({}) }; } }
  );
  if (prevT !== undefined) process.env.PINTEREST_CONVERSIONS_TOKEN = prevT; else delete process.env.PINTEREST_CONVERSIONS_TOKEN;
  if (prevA !== undefined) process.env.PINTEREST_AD_ACCOUNT_ID = prevA;
  assert.equal(res.skipped, true);
  assert.equal(called, false, 'must not call Pinterest without an explicit ad account');
});

test('the source URL is griotmoon.com and no Eva identifier is present', () => {
  const ev = buildSignupEvent({ email: RAW_EMAIL, leadMagnet: 'parents-guide', eventId: 'id-3', eventTime: 3000 });
  assert.equal(ev.event_source_url, 'https://griotmoon.com/');
  assert.ok(!JSON.stringify(ev).includes('storytimewitheva'));
});
