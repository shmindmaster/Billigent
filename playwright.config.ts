import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// Derive baseURL: prefer explicit env, fallback to Vite dev and backend proxy scenario if set up later.
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [ ['list'], ['html', { outputFolder: 'test-results/html-report', open: 'never' }] ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  // Start frontend dev server automatically for local + CI runs.
  webServer: [
    {
      command: 'pnpm --filter frontend dev',
      cwd: 'apps/frontend',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    // Backend (only if needed for API routes during tests)
    {
      command: 'pnpm --filter @billigent/backend dev',
      cwd: 'apps/backend',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
});
