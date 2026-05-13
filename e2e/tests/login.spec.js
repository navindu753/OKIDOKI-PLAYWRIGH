const { test, expect } = require('@playwright/test');

test('OkiDoki sign-in form loads and accepts input', async ({ page }) => {
  await page.goto('http://okidokidev.overleap.lk');
  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByRole('heading', { name: /^sign in$/i })).toBeVisible();

  await page.getByRole('textbox', { name: /email or username/i }).fill('smoke-check@example.com');
  await page.getByRole('textbox', { name: /^password$/i }).fill('not-a-real-password');
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Invalid login should keep the user on the sign-in experience (heading still present)
  await expect(page.getByRole('heading', { name: /^sign in$/i })).toBeVisible({ timeout: 30_000 });
});


test('OkiDoki login succeeds with env credentials', async ({ page }) => {
  test.skip(
    !process.env.OKIDOKI_EMAIL || !process.env.OKIDOKI_PASSWORD,
    'Set OKIDOKI_EMAIL and OKIDOKI_PASSWORD to run this test',
  );

  await page.goto('http://okidokidev.overleap.lk');
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('textbox', { name: /email or username/i }).fill(process.env.OKIDOKI_EMAIL);
  await page.getByRole('textbox', { name: /^password$/i }).fill(process.env.OKIDOKI_PASSWORD);
  await page.getByRole('button', { name: /^continue$/i }).click();

  await expect(page.getByRole('heading', { name: /^sign in$/i })).toBeHidden({ timeout: 60_000 });
});
