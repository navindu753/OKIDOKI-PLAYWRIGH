test('Invalid Login Test', async ({ page }) => {

    await page.goto('https://example.com/login');
  
    await page.fill('#username', 'Heshani');
    await page.fill('#password', 'wrongpass');
  
    await page.click('#loginBtn');
    

  
    // Check error message
    await expect(page.locator('#errorMsg')).toBeVisible();
  
  });