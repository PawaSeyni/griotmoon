import { defineConfig, devices } from '@playwright/test';

// End-to-end suite (parity plan P3-2), ported from Story Time with Eva. Runs against the
// BUILT site (dist/) served by `vite preview`, so run `npm run build` first. The subscribe
// endpoint is stubbed with page.route in the specs; nothing real is written, and Plausible
// is never contacted. Eva's live-production "smoke" project is not ported: Griot Moon has
// `npm run verify:deploy` for the live check.
//
// Locally this uses the installed Google Chrome (channel 'chrome'), so no browser download
// is needed; CI installs Playwright's Chromium (`npx playwright install --with-deps chromium`).
const LOCAL = 'http://localhost:4173';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: LOCAL,
    ...devices['Desktop Chrome'],
    ...(process.env.CI ? {} : { channel: 'chrome' }),
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: LOCAL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
