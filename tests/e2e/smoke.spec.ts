import { test, expect } from '@playwright/test';

// Basic smoke covering dashboard and navigation to cases
// Uses role-based locators for a11y resilience

test.describe('Smoke: Dashboard and Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Point to Vite dev server (5173)
    await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173');
  });

  test('dashboard loads KPIs and work queue without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/Billigent/i);

    // Header welcome - derives from AuthContext default user
    await expect(page.getByRole('heading', { name: /welcome, jennifer smith/i })).toBeVisible();

    // Stats grid tiles (labels)
    await expect(page.getByText('Net Revenue Identified')).toBeVisible();
    await expect(page.getByText('Appeal Overturn Rate')).toBeVisible();
    await expect(page.getByText('Query Agreement Rate')).toBeVisible();
    await expect(page.getByText('Avg Processing Time')).toBeVisible();

    // Work queue cards
    await expect(page.getByText('New Pre-Bill Cases')).toBeVisible();
    await expect(page.getByText('Denials Awaiting Review')).toBeVisible();
    await expect(page.getByText('High Priority Cases')).toBeVisible();
    await expect(page.getByText('Overdue Queries')).toBeVisible();

    // Bottom status bar indicators
    await expect(page.getByText(/AI Engine:/)).toBeVisible();
  });

  test('navigate to Case Management and load table', async ({ page }) => {
    // Open main nav: the Layout should contain a link to Cases
    const casesLink = page.getByRole('link', { name: /cases/i });
    await expect(casesLink).toBeVisible();
    await casesLink.click();

    // Page header
    await expect(page.getByRole('heading', { name: /case management/i })).toBeVisible();

    // Filters present
    await expect(page.getByRole('combobox', { name: /status/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /priority/i })).toBeVisible();

    // Data table renders (may be empty depending on DB); assert table landmark exists
    await expect(page.getByRole('table')).toBeVisible();
  });
});
