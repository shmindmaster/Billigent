import { test, expect } from '@playwright/test';

// Basic smoke test for Data Explorer page

test.describe('Data Explorer', () => {
  test('loads and shows list + can refresh', async ({ page }) => {
    await page.goto('http://localhost:5173/data-explorer');

    // Title
    await expect(page.getByRole('heading', { name: 'Data Explorer' })).toBeVisible();

    // Filter input
    const filter = page.getByLabel('Filter by path');
    await expect(filter).toBeVisible();

    // List exists
    await expect(page.getByRole('list')).toBeVisible();

    // Try refresh button
    await page.getByRole('button', { name: 'Refresh data' }).click();

    // If items exist, clicking one should show details panel labels
    const items = page.locator('ul[role="list"] li');
    const count = await items.count();
    if (count > 0) {
      await items.first().click();
      await expect(page.getByText('Content Type')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
    }
  });
});
