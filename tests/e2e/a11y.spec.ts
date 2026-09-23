// Automated accessibility gate (parity plan P3-2), ported from Story Time with Eva.
// Scans representative routes in English and French and fails on any SERIOUS or CRITICAL
// axe violation. Moderate and minor findings are attached to the report, not blocking, so
// the gate stays honest about what it enforces.
import { test, expect } from './_app';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/books', name: 'catalog' },
  { path: '/books/ubuntu-we-are-together', name: 'book page' },
  { path: '/activities', name: 'activities' },
  { path: '/resources', name: 'resources' },
  { path: '/resources/make-reading-time-magical', name: 'resource article' },
  { path: '/about', name: 'about' },
  { path: '/faq', name: 'faq' },
  { path: '/profile', name: 'reading profile' },
  { path: '/search?q=ubuntu', name: 'search results' },
  { path: '/free/parents-guide', name: 'landing page' },
];

for (const prefix of ['', '/fr']) {
  for (const r of ROUTES) {
    test(`a11y ${prefix || '/en'} ${r.name}: no serious or critical violations`, async ({ page }) => {
      await page.goto(`${prefix}${r.path}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1').first()).toBeAttached();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      const describe = (v: (typeof results.violations)[number]) =>
        `${v.id} (${v.impact}): ${v.help}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`;
      const lesser = results.violations.filter((v) => !blocking.includes(v));
      if (lesser.length) test.info().annotations.push({ type: 'a11y-minor', description: lesser.map(describe).join('\n') });
      expect(blocking.map(describe), 'serious/critical axe violations').toEqual([]);
    });
  }
}
