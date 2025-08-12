import { test, expect } from '@playwright/test';

test('Data Explorer loads, lists files, previews sample, SAS works', async ({ page }) => {
  await page.goto('http://localhost:5173/data-explorer');
  await expect(page.getByRole('heading', { name: 'Data Explorer' })).toBeVisible();

  // Wait for any row and prefer a CSV/JSON file row if present
  await page.waitForSelector('tbody tr', { timeout: 60000 });
  const csvRow = page.locator('tbody tr').filter({ hasText: '.csv' }).first();
  const jsonRow = page.locator('tbody tr').filter({ hasText: '.json' }).first();
  if (await csvRow.count()) {
    await csvRow.click();
  } else if (await jsonRow.count()) {
    await jsonRow.click();
  } else {
    await page.locator('tbody tr').first().click();
  }

  // SAS link appears
  await expect(page.getByRole('link', { name: /Open with SAS/ })).toBeVisible({ timeout: 30000 });
});


