import { test, expect } from '@playwright/test';

test('Data Explorer loads, lists files, previews sample, SAS works', async ({ page }) => {
  await page.goto('http://localhost:5173/data-explorer');
  await expect(page.getByRole('heading', { name: 'Data Explorer' })).toBeVisible();

  // Wait for manifest rows
  await page.waitForSelector('tbody tr');

  // Click first row
  const firstRow = (await page.$$('tbody tr'))[0];
  await firstRow.click();

  // Preview panel shows up
  await expect(page.getByText('Preview')).toBeVisible();

  // SAS link appears
  const sas = page.getByRole('link', { name: /Open with SAS/ });
  await expect(sas).toBeVisible();
});


