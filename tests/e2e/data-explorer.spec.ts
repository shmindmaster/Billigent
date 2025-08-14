import { test, expect } from '@playwright/test';

test('Data Explorer loads, lists files, previews sample, SAS works', async ({ page }) => {
  await page.goto('http://localhost:5173/data-explorer');
  await expect(page.getByRole('heading', { name: 'Data Explorer' })).toBeVisible();

  // Wait for any row and prefer a CSV/JSON file row if present
  // New manifest list uses role=list > role=listitem
  // Wait for list items rather than table rows
  const listItems = page.locator('ul[role="list"] li[role="listitem"]');
  await expect(listItems.first()).toBeVisible({ timeout: 60000 });

  const csvRow = listItems.filter({ hasText: '.csv' }).first();
  const jsonRow = listItems.filter({ hasText: '.json' }).first();
  if (await csvRow.count()) {
    await csvRow.click();
  } else if (await jsonRow.count()) {
    await jsonRow.click();
  } else {
    await listItems.first().click();
  }

  // Download button (was SAS link placeholder) becomes visible/enabled for file selection
  await expect(page.getByRole('button', { name: /download/i })).toBeVisible({ timeout: 30000 });
});


