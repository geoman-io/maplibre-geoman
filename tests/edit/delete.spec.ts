import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect, type Page } from '@playwright/test';
import { enableMode, mouseMoveAndClick, waitForGeoman, waitForMapIdle } from '../utils/basic.ts';
import {
  type FeatureCustomData,
  getRenderedFeatureData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  waitForFeatureRemoval,
} from '../utils/features.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';

const performDeleteAndVerify = async (page: Page, feature: FeatureCustomData) => {
  const featureId = feature.id;

  const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
  expect(initialLngLat, `Initial LngLat for feature ${featureId} should exist`).not.toBeNull();
  if (!initialLngLat) {
    return;
  }

  const clickPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
  expect(clickPoint, `Screen coordinates for feature ${featureId} should be calculable`).not.toBeNull();

  if (!clickPoint) {
    return;
  }

  await mouseMoveAndClick(page, clickPoint);
  await waitForFeatureRemoval({ page, featureId, temporary: false });

  const featuresData = await getRenderedFeaturesData({
    page,
    temporary: false,
  });
  expect(
    featuresData.find((item) => item.id === featureId),
    `Feature ${featureId} should not exist after deletion.`,
  ).toBeUndefined();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
  expect(geoJsonFeatures, 'GeoJSON features should be loaded').not.toBeNull();

  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
  }
});

test('should correctly \'delete\' each shape type', async ({ page }) => {
  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features.length).toBeGreaterThan(0);

  await enableMode(page, 'edit', 'delete');
  await waitForMapIdle(page);

  for (const feature of features) {
    const featureData = await getRenderedFeatureData({
      page,
      featureId: feature.id,
      temporary: false,
    });

    expect(
      featureData,
      `Feature ${feature.id} expected to exist before deletion attempt.`,
    ).toBeTruthy();

    if (!featureData) {
      continue;
    }
    await performDeleteAndVerify(page, feature);
  }

  await page.evaluate(() => window.geoman.options.disableMode('edit', 'delete'));
  await waitForMapIdle(page);
});
