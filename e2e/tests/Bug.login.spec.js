const { test, expect } = require('@playwright/test');

test('Bug check: invalid login should show an error and block access', async ({ page }) => {
  await page.goto('http://okidokidev.overleap.lk');
  await page.waitForLoadState('domcontentloaded');

  // Use invalid credentials to verify error handling behavior.
  await page.getByRole('textbox', { name: /email or username/i }).fill('invalid-user@example.com');
  await page.getByRole('textbox', { name: /^password$/i }).fill('wrong-password-123');
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Stay on sign-in page when login fails.
  await expect(page.getByRole('heading', { name: /^sign in$/i })).toBeVisible({ timeout: 30_000 });

  // Strict check: require exact message so mismatches show as clear bug failures in report.
  const expectedErrorText = 'Invalid username or password';
  const strictError = page.getByText(expectedErrorText, { exact: true });

  await expect(
    strictError,
    `BUG: expected exact error message "${expectedErrorText}" after invalid login`,
  ).toBeVisible({ timeout: 30_000 });


});


