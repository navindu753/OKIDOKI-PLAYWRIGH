const { test, expect } = require('@playwright/test');

test.skip('Simple Login Test', async ({ page }) => {

  // 1. Open website
  await page.goto('https://example.com/login');

  // 2. Enter username
  await page.fill('#username', 'testuser');

  // 3. Enter password
  await page.fill('#password', '123456');

  // 4. Click login button
  await page.click('#loginBtn');

  // 5. Verify success message
  await expect(page.locator('#welcomeMsg')).toBeVisible();

});