import test, { expect } from '@playwright/test';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { configurePageTimeouts, enableMode, waitForGeoman } from '../utils/basic.ts';
import { getRenderedFeaturesData, loadGeoJsonFeatures } from '../utils/features.ts';

test.beforeEach(async ({ page }) => {
  await configurePageTimeouts(page);
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');
  page.on('console', (msg) => {
    console.log(`[Console ${msg.type()}] ${msg.text()}`);
  });

  // Load test features with one having disableEdit set to true
  const geoJsonFeatures = await loadGeoJson('disable-edit');
  expect(geoJsonFeatures).not.toBeNull();
  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
  }
});

test('Feature with disableEdit has correct editDisabled property', async ({ page }) => {
  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features).toHaveLength(2);

  // Test that the editDisabled property is correctly set
  const result = await page.evaluate(() => {
    const geoman = window.geoman;

    const disabledFeatureData = geoman.features.get(geoman.features.defaultSourceName, 1);
    const editableFeatureData = geoman.features.get(geoman.features.defaultSourceName, 2);

    if (!disabledFeatureData || !editableFeatureData) {
      return { error: 'Features not found' };
    }

    return {
      disabledEditDisabled: disabledFeatureData.getShapeProperty('disableEdit'),
      editableEditDisabled: editableFeatureData.getShapeProperty('disableEdit'),
      disabledFeature: disabledFeatureData,
    };
  });

  expect(result.disabledEditDisabled).toBe(true);
  expect(result.editableEditDisabled).toBe(undefined);
});

test('Feature with disableEdit does not show edit markers', async ({ page }) => {
  await enableMode(page, 'edit', 'change');

  // Check that edit markers are not added for the disabled feature
  const markersCount = await page.evaluate(() => {
    const geoman = window.geoman;
    const disabledFeature = geoman.features.get(geoman.features.defaultSourceName, 1);
    const editableFeature = geoman.features.get(geoman.features.defaultSourceName, 2);

    return {
      disabledFeatureMarkers: disabledFeature ? disabledFeature.markers.size : 0,
      editableFeatureMarkers: editableFeature ? editableFeature.markers.size : 0,
    };
  });

  expect(markersCount.disabledFeatureMarkers).toBe(0); // no markers for disabled feature
  expect(markersCount.editableFeatureMarkers).toBeGreaterThan(0); // markers for editable feature
});
