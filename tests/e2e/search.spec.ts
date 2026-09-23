// Site search against the built site (parity plan P3-2), adapted from Story Time with Eva.
// Griot Moon's search covers books and activities, with no type filters.
import { test, expect } from './_app';

test('a query finds a matching book and shows a result count', async ({ page }) => {
  await page.goto('/search?q=ubuntu');
  await expect(page.getByText(/\d+ results?/)).toBeVisible();
  await expect(page.locator('a[href^="/books/ubuntu-we-are-together"]').first()).toBeVisible();
});

test('French search runs in French and its links stay in the French tree', async ({ page }) => {
  await page.goto('/fr/search?q=ubuntu');
  await expect(page.getByText(/\d+ résultats?/)).toBeVisible();
  await expect(page.locator('a[href^="/fr/books/ubuntu-we-are-together"]').first()).toBeVisible();
});

test('empty query shows the prompt; a no-match query says so', async ({ page }) => {
  await page.goto('/search');
  await expect(page.getByText('Type to search across all books and activities.')).toBeVisible();
  await page.getByRole('searchbox').fill('zzzzqqq');
  await expect(page.getByText('No matches. Try another word.')).toBeVisible();
});

test('typing a query updates the URL, so a search can be shared', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox').fill('lion');
  await expect(page).toHaveURL(/\?q=lion/);
});
