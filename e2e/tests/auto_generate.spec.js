const { test, expect } = require('@playwright/test');

/** Replace with real credentials (or load from env) for your app. */
const TEST_EMAIL = process.env.TEST_EMAIL ?? 'user@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'your-password';

test('login: email, password, and dashboard visibility', async ({ page }) => {
  // 1. Open login page
  await page.goto('https://example.com/login');

  // 2. Enter email
  await page.locator('input[type="email"], input[name="email"]').first().fill(TEST_EMAIL);

  // 3. Enter password
  await page.locator('input[type="password"], input[name="password"]').fill(TEST_PASSWORD);

  // 4. Click login button
  await page.getByRole('button', { name: /log\s*in|login/i }).click();

  // 5. Verify dashboard is visible
  await expect(
    page.getByRole('heading', { name: /dashboard/i }).or(page.getByTestId('dashboard'))
  ).toBeVisible();
});
