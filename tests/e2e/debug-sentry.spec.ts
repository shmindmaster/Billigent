import { test, expect } from '@playwright/test';

// Triggers backend synthetic error route to verify Sentry ingestion.
// Does not assert on Sentry itself (out-of-band), only that server responds with 500.

test.describe('Sentry synthetic error', () => {
  test('hit /debug-sentry returns 500', async ({ request }) => {
    const res = await request.get('http://localhost:3001/debug-sentry');
    expect(res.status()).toBe(500);
  });
});
