import type { LngLatTuple } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { isEqual } from 'lodash-es';
import {
  configurePageTimeouts,
  dragAndDrop,
  enableMode,
  type ScreenCoordinates,
  waitForGeoman,
} from '@tests/utils/basic.ts';
import {
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  waitForRenderedFeatureData,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';

const SCREEN_COORD_TOLERANCE = 3;

test.beforeEach(async ({ page }) => {
  await configurePageTimeouts(page);
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  const geoJsonFeatures = await loadGeoJson('common-shapes');
  expect(geoJsonFeatures).not.toBeNull();

  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
  }
});

test('Drag', async ({ page }) => {
  const dX = -20;
  const dY = 0;
  await enableMode(page, 'edit', 'drag');
  const features = await getRenderedFeaturesData({ page, temporary: false });

  for (const feature of features) {
    let position;
    if (feature.shape === 'circle') {
      position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
    } else {
      position = getGeoJsonFirstPoint(feature.geoJson);
    }

    expect(position).toBeTruthy();
    if (!position) {
      return;
    }

    const point = await getScreenCoordinatesByLngLat({ page, position });
    expect(point).toBeTruthy();
    if (!point) {
      return;
    }

    const newPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];
    await dragAndDrop(page, point, newPoint);

    const updatedFeature = await waitForRenderedFeatureData({
      page,
      featureId: feature.id,
      temporary: false,
    });
    expect(updatedFeature).toBeTruthy();

    if (updatedFeature) {
      let updatedPosition;
      if (feature.shape === 'circle') {
        updatedPosition = centroid(updatedFeature.geoJson).geometry.coordinates as LngLatTuple;
      } else {
        updatedPosition = getGeoJsonFirstPoint(updatedFeature.geoJson);
      }
      expect(updatedPosition).toBeTruthy();

      if (updatedPosition) {
        const updatedPoint = await getScreenCoordinatesByLngLat({
          page,
          position: updatedPosition,
        });

        expect(updatedPoint).toBeTruthy();
        if (!isEqual(updatedPoint, newPoint)) {
          console.log('Shape', feature.shape);
          console.log(`Original point: [${point}]`);
          console.log(`Expected/actual: [${newPoint}] / [${updatedPoint}]`);
        }
        expect(updatedPoint).toBeTruthy();
        if (updatedPoint) {
          expect(updatedPoint[0]).toBeGreaterThanOrEqual(newPoint[0] - SCREEN_COORD_TOLERANCE);
          expect(updatedPoint[0]).toBeLessThanOrEqual(newPoint[0] + SCREEN_COORD_TOLERANCE);
          expect(updatedPoint[1]).toBeGreaterThanOrEqual(newPoint[1] - SCREEN_COORD_TOLERANCE);
          expect(updatedPoint[1]).toBeLessThanOrEqual(newPoint[1] + SCREEN_COORD_TOLERANCE);
        }
      }
    }
  }
});
