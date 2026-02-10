import type { LngLatTuple } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect, type Page } from '@playwright/test';
import centroid from '@turf/centroid';
import {
  configurePageTimeouts,
  dragAndDrop,
  enableMode,
  waitForGeoman,
} from '@tests/utils/basic.ts';
import {
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  waitForFeatureGeoJsonUpdate,
  waitForRenderedFeatureData,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';

const SCREEN_COORD_TOLERANCE = 3;

const expectPointNearTarget = async ({
  page,
  position,
  targetPoint,
}: {
  page: Page;
  position: LngLatTuple;
  targetPoint: [number, number];
}) => {
  const screenPoint = await getScreenCoordinatesByLngLat({ page, position });
  expect(screenPoint, 'Updated screen position should be calculable').not.toBeNull();
  if (!screenPoint) {
    return;
  }

  expect(screenPoint[0]).toBeGreaterThanOrEqual(targetPoint[0] - SCREEN_COORD_TOLERANCE);
  expect(screenPoint[0]).toBeLessThanOrEqual(targetPoint[0] + SCREEN_COORD_TOLERANCE);
  expect(screenPoint[1]).toBeGreaterThanOrEqual(targetPoint[1] - SCREEN_COORD_TOLERANCE);
  expect(screenPoint[1]).toBeLessThanOrEqual(targetPoint[1] + SCREEN_COORD_TOLERANCE);
};

test.beforeEach(async ({ page }) => {
  await configurePageTimeouts(page);
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
  expect(geoJsonFeatures, 'GeoJSON features should be loaded').not.toBeNull();

  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
  }
});

test('enables body drag in change mode via controls.edit.change.settings.bodyDragEnabled', async ({
  page,
}) => {
  await page.evaluate(() => {
    const changeControl = window.geoman.options.controls.edit.change;
    if (!changeControl) {
      return;
    }
    changeControl.settings = {
      ...(changeControl.settings || {}),
      bodyDragEnabled: true,
    };
  });

  await enableMode(page, 'edit', 'change');

  const features = await getRenderedFeaturesData({ page, temporary: false });
  const polygonFeature = features.find((feature) => feature.shape === 'polygon');
  expect(polygonFeature, 'Polygon feature should exist').not.toBeUndefined();
  if (!polygonFeature) {
    return;
  }

  const initialCenter = centroid(polygonFeature.geoJson).geometry.coordinates as LngLatTuple;
  const startPoint = await getScreenCoordinatesByLngLat({ page, position: initialCenter });
  expect(startPoint, 'Initial polygon center screen point should be calculable').not.toBeNull();
  if (!startPoint) {
    return;
  }

  const targetPoint: [number, number] = [startPoint[0] + 25, startPoint[1] + 25];
  const originalGeoJson = polygonFeature.geoJson;
  await dragAndDrop(page, startPoint, targetPoint);
  await waitForFeatureGeoJsonUpdate({ feature: polygonFeature, originalGeoJson, page });

  const updatedFeature = await waitForRenderedFeatureData({
    page,
    featureId: polygonFeature.id,
    temporary: false,
  });
  expect(updatedFeature, 'Updated polygon should exist').not.toBeNull();
  if (!updatedFeature) {
    return;
  }

  const updatedCenter = centroid(updatedFeature.geoJson).geometry.coordinates as LngLatTuple;
  await expectPointNearTarget({ page, position: updatedCenter, targetPoint });
});

test('enables body drag in rotate mode via controls.edit.rotate.settings.bodyDragEnabled', async ({
  page,
}) => {
  await page.evaluate(() => {
    const rotateControl = window.geoman.options.controls.edit.rotate;
    if (!rotateControl) {
      return;
    }
    rotateControl.settings = {
      ...(rotateControl.settings || {}),
      bodyDragEnabled: true,
    };
  });

  await enableMode(page, 'edit', 'rotate');

  const features = await getRenderedFeaturesData({ page, temporary: false });
  const markerFeature = features.find((feature) => feature.shape === 'marker');
  expect(markerFeature, 'Marker feature should exist').not.toBeUndefined();
  if (!markerFeature) {
    return;
  }

  const initialLngLat = getGeoJsonFirstPoint(markerFeature.geoJson);
  expect(initialLngLat, 'Initial marker position should exist').not.toBeNull();
  if (!initialLngLat) {
    return;
  }

  const startPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
  expect(startPoint, 'Initial marker screen point should be calculable').not.toBeNull();
  if (!startPoint) {
    return;
  }

  const targetPoint: [number, number] = [startPoint[0] + 20, startPoint[1] - 20];
  const originalGeoJson = markerFeature.geoJson;
  await dragAndDrop(page, startPoint, targetPoint);
  await waitForFeatureGeoJsonUpdate({ feature: markerFeature, originalGeoJson, page });

  const updatedFeature = await waitForRenderedFeatureData({
    page,
    featureId: markerFeature.id,
    temporary: false,
  });
  expect(updatedFeature, 'Updated marker should exist').not.toBeNull();
  if (!updatedFeature) {
    return;
  }

  const updatedLngLat = getGeoJsonFirstPoint(updatedFeature.geoJson);
  expect(updatedLngLat, 'Updated marker position should exist').not.toBeNull();
  if (!updatedLngLat) {
    return;
  }

  await expectPointNearTarget({ page, position: updatedLngLat, targetPoint });
});
