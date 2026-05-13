import { test, expect } from '@playwright/test';

const OKIDOKI_EMAIL = process.env.OKIDOKI_EMAIL;
const OKIDOKI_PASSWORD = process.env.OKIDOKI_PASSWORD;

test.describe('Oki-Doki Login Functionality', () => {
  test.skip(
    !OKIDOKI_EMAIL || !OKIDOKI_PASSWORD,
    'Set OKIDOKI_EMAIL and OKIDOKI_PASSWORD to run this test',
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('http://okidokidev.overleap.lk');

    // Login (Sign In page: labeled fields + Continue)
    await page.getByRole('textbox', { name: /email or username/i }).fill(OKIDOKI_EMAIL);
    await page.getByRole('textbox', { name: /^password$/i }).fill(OKIDOKI_PASSWORD);
    await page.getByRole('button', { name: /^continue$/i }).click();

    await page.waitForLoadState('networkidle');
//gtt

  });


  test('Verify user can create a job with basic details', async ({ page }) => {

    for (let  i= 1; i <= 10; i++) {

      console.log(`Creating Job #${i}`);

      await page.goto('http://okidokidev.overleap.lk/jobs/jobCreationview');

      // Click Create Job
      await page.getByRole('button', { name: 'Create Job' }).click();

      // Wait modal
      const basicModal = page.locator('#job_details_modal_Basic_Details');
      await expect(basicModal).toBeVisible();

      // ===== CUSTOMER =====
      await basicModal.locator('#customerName .react-select__control').click();
      await page.locator('.react-select__option', { hasText: 'CARGILLS RETAIL (PRIVATE) LIMITED' }).click();

      // ===== SHIPPER =====
      await basicModal.locator('#shipperPlant .react-select__control').click();
      await page.locator('.react-select__option', { hasText: 'CARGILLS - CPU' }).click();

      // ===== REQUEST FOR =====
      await basicModal.locator('#requestCreatingFor .react-select__control').click();
      await page.locator('.react-select__option', { hasText: 'IsuriS-CARGILLS' }).click();

      // NEXT
      await basicModal.getByRole('button', { name: 'Next' }).click();

      // ===== MAIN FORM =====
      const modal = page.locator('#kt_modal_1');
      await expect(modal).toBeVisible();

      // Contact details
      await modal.locator('input[name="contactPerson"]').fill(`John Doe ${i}`);
      await modal.locator('input[name="contactNumber"]').fill(`7112345${i}`);

      // Shipment Type
      await modal.getByText('Shipment Type').locator('..').locator('.react-select__control').click();
      await page.locator('.react-select__option', { hasText: 'OTHER' }).click();

      // Consignment Type
      await modal.getByText('Consignment Type').locator('..').locator('.react-select__control').click();
      await page.locator('.react-select__option', { hasText: 'FMCG' }).click();

      // CBM
      await modal.locator('input[name="cbm"]').fill(`${34 + i}`);

      // Vehicle Type
      await modal.getByText('Vehicle Type').locator('..').locator('.react-select__control').click();
      await page.locator('.react-select__option', { hasText: "10.5' - FLAT PACK" }).click();

      // ===== PICKUP =====
      await modal.locator('#pickupLocation .react-select__control').click();

      const [pickupResponse] = await Promise.all([
        page.waitForResponse(res =>
          res.url().includes('location-gps-okidoki-location-code') && res.status() === 200
        ),
        page.locator('.react-select__option', { hasText: 'CFC ARAWWALA 1569' }).click()
      ]);

      // ===== DATE HANDLING =====
      const now = new Date();
      const format = (d) => d.toISOString().slice(0, 16);

      await modal.locator('input[name="arrivalTime"]').fill(format(now));

      const dispatch = new Date();
      dispatch.setDate(dispatch.getDate() + 1);
      await modal.locator('input[name="dispatchTime"]').fill(format(dispatch));

      // ===== DELIVERY =====
      await modal.getByText('Delivery Location').locator('..').locator('.react-select__control').click();

      await Promise.all([
        page.waitForResponse(res =>
          res.url().includes('location-gps-okidoki-location-code') && res.status() === 200
        ),
        page.locator('.react-select__option', { hasText: 'CFC ARAWWALA 1569' }).click()
      ]);

      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 5);
      await modal.locator('input[name="deliveryTime"]').fill(format(delivery));

      // ===== SAVE =====
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(modal).not.toBeVisible();

      // ===== VERIFY =====
      await expect(page.getByText('Job View')).toBeVisible();

      // ===== SELECT FIRST ROW =====
      const firstRow = page.locator('table tbody tr').first();
      await firstRow.locator('input[type="checkbox"]').check();

      // ===== ACCEPT =====
      await page.getByRole('button', { name: 'Accept' }).click();

      await expect(page.getByText('Are you sure you want to accept this request?')).toBeVisible();

      await page.locator('.btn-success').click();

      await expect(page.getByText('Successfully updated')).toBeVisible();
    }
  });
});