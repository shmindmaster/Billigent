import { defineConfig, devices } from '@playwright/test';

/**
 * Billigent CDI Platform - Comprehensive E2E Testing Configuration
 * 
 * This configuration covers:
 * - Visual regression testing
 * - Accessibility compliance (HIPAA/WCAG)
 * - Azure services integration testing
 * - CDI workflow end-to-end testing
 * - Performance and security validation
 */
export default defineConfig({
  // Test directory and patterns
  testDir: './tests',
  testMatch: [
    '**/e2e/**/*.spec.ts',
    '**/accessibility/**/*.spec.ts', 
    '**/integration/**/*.spec.ts',
    '**/visual/**/*.spec.ts'
  ],

  // Timeouts
  timeout: 60000, // 60s for complex Azure AI operations
  expect: {
    timeout: 10000 // 10s for assertions
  },

  // Test execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit-results.xml' }]
  ],

  // Global settings
  use: {
    // Base URL for testing
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173',
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // HIPAA compliance - secure headers
    extraHTTPHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  },

  // Browser projects for cross-browser testing
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // HIPAA compliance - disable potentially insecure features
        ignoreHTTPSErrors: false,
        bypassCSP: false
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile testing for responsive design
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Accessibility-focused testing project
    {
      name: 'accessibility',
      testMatch: '**/accessibility/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // High contrast for accessibility testing
        colorScheme: 'dark',
        // Screen reader simulation
        reducedMotion: 'reduce'
      }
    },

    // Visual regression testing
    {
      name: 'visual-regression',
      testMatch: '**/visual/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // Consistent visual testing environment
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false,
        viewport: { width: 1280, height: 720 }
      }
    },

    // Integration testing with Azure services
    {
      name: 'azure-integration',
      testMatch: '**/integration/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // Extended timeout for Azure operations
        timeout: 120000
      }
    }
  ],

  // Local dev server
  webServer: process.env.CI ? undefined : {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
      // Test-specific Azure configurations
      AZURE_OPENAI_MODEL: 'gpt-5-mini',
      AZURE_OPENAI_REASONING_MODEL: 'o3-mini',
      AZURE_OPENAI_EMBEDDING_MODEL: 'text-embedding-3-large'
    }
  },

  // Global test setup and teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts')
});
