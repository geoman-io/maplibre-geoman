import test, { expect } from '@playwright/test';
import { loadGeoJsonFeatures } from 'tests/utils/features.ts';
import { enableMode, waitForGeoman } from '../utils/basic.ts';
import { loadGeoJson } from '../utils/fixtures.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  const geoJsonFeatures = await loadGeoJson('common-shapes');
  expect(geoJsonFeatures).not.toBeNull();

  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
  }
});

test('Dummy test', async ({ page }) => {
  await enableMode(page, 'edit', 'drag');
});
