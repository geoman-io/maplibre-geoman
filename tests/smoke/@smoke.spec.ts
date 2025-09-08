import test, { expect } from '@playwright/test';
import { waitForGeoman } from '@tests/utils/basic.ts';

test('Check is geoman awailable', async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');
});
