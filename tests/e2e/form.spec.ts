// Signup form against the built site (parity plan P3-2), ported from Story Time with Eva.
// The subscribe function is stubbed with page.route: nothing real is written. Guards the
// failure mode P2-1 removed: a success screen shown while the signup was lost.
import { test, expect } from './_app';
import { type Page } from '@playwright/test';

const SUBSCRIBE = '**/.netlify/functions/subscribe';

// Record analytics events into window.__ev instead of sending them anywhere.
async function recordEvents(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __ev: { e: string; props?: Record<string, unknown> }[]; plausible: unknown };
    w.__ev = [];
    w.plausible = (e: string, o?: { props?: Record<string, unknown> }) => w.__ev.push({ e, props: o?.props });
  });
  await page.route(/plausible\.io/, (r) => r.abort());
}

async function fillAndSubmit(page: Page) {
  await page.fill('#email-signup input[name="name"]', 'Test Person');
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
}

test('request body carries email, name, language, magnet and all UTMs', async ({ page }) => {
  let body: Record<string, unknown> | null = null;
  await page.route(SUBSCRIBE, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/free/parents-guide?utm_source=pinterest&utm_medium=paid_social&utm_campaign=parents-guide_en&utm_content=P-001');
  await fillAndSubmit(page);
  await expect(page.locator('#email-signup [role="status"]')).toBeVisible();
  expect(body).toMatchObject({
    email: 'e2e@example.com',
    name: 'Test Person',
    language: 'en',
    lead_magnet: 'parents-guide',
    utm_source: 'pinterest',
    utm_medium: 'paid_social',
    utm_campaign: 'parents-guide_en',
    utm_content: 'P-001',
  });
});

test('a French landing page posts language fr and shows French success copy', async ({ page }) => {
  let body: Record<string, unknown> | null = null;
  await page.route(SUBSCRIBE, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/fr/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('#email-signup [role="status"]')).toContainText('Vous êtes inscrit');
  expect(body).toMatchObject({ language: 'fr', lead_magnet: 'bedtime-routine' });
});

// Failure paths must fail VISIBLY: no success screen without a confirmed backend ok.
for (const [name, handler] of [
  ['HTTP 500', (r: import('@playwright/test').Route) => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' })],
  ['HTTP 200 with { ok:false }', (r: import('@playwright/test').Route) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: false }) })],
  ['network abort', (r: import('@playwright/test').Route) => r.abort()],
] as const) {
  test(`${name} shows the error state, not success`, async ({ page }) => {
    await page.route(SUBSCRIBE, handler);
    await page.goto('/free/bedtime-routine');
    await fillAndSubmit(page);
    await expect(page.locator('#email-signup [role="alert"]')).toBeVisible();
    await expect(page.locator('#email-signup [role="status"]')).toHaveCount(0);
  });
}

test('a failed signup never fires Lead Created; a successful one fires it exactly once', async ({ page }) => {
  await recordEvents(page);
  let ok = false;
  await page.route(SUBSCRIBE, (r) =>
    r.fulfill({ status: ok ? 200 : 500, contentType: 'application/json', body: JSON.stringify({ ok }) }),
  );
  await page.goto('/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('#email-signup [role="alert"]')).toBeVisible();
  let events = await page.evaluate(() => (window as unknown as { __ev: { e: string }[] }).__ev.map((x) => x.e));
  expect(events).toContain('Form Start');
  expect(events).not.toContain('Lead Created');

  ok = true;
  await page.click('#email-signup button[type="submit"]');
  await expect(page.locator('#email-signup [role="status"]')).toBeVisible();
  events = await page.evaluate(() => (window as unknown as { __ev: { e: string }[] }).__ev.map((x) => x.e));
  expect(events.filter((e) => e === 'Lead Created')).toHaveLength(1);
});
