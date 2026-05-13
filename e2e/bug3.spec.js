const { test, expect } = require('@playwright/test');

test('BUG3: invalid login should show exact error message', async ({ page }) => {
  await page.goto('http://okidokidev.overleap.lk');
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('textbox', { name: /email or username/i }).fill('invalid-user@example.com');
  await page.getByRole('textbox', { name: /^password$/i }).fill('wrong-password-123');
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(page.getByRole('heading', { name: /^sign in$/i })).toBeVisible({ timeout: 30_000 });

  const expectedErrorText = 'Invalid username or password';
  await expect(
    page.getByText(expectedErrorText, { exact: true }),
    `BUG: expected exact error message "${expectedErrorText}" after invalid login`,
  ).toBeVisible({ timeout: 30_000 });
});
