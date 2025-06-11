import type { LngLat } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { isEqual } from 'lodash-es';
import { configurePageTimeouts, dragAndDrop, enableMode, type ScreenCoordinates, waitForGeoman } from '../utils/basic.ts';
import { getRenderedFeaturesData, loadGeoJsonFeatures, waitForRenderedFeatureData } from '../utils/features.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';


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

  for await (const feature of features) {
    let position;
    if (feature.shape === 'circle') {
      position = centroid(feature.geoJson).geometry.coordinates as LngLat;
    } else {
      position = getGeoJsonFirstPoint(feature.geoJson);
    }

    expect(position).toBeTruthy();
    if (!position) {
      return;
    }

    const point = await getScreenCoordinatesByLngLat({ page, position });

    if (point) {
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
          updatedPosition = (
            centroid(updatedFeature.geoJson).geometry.coordinates as LngLat
          );
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
          expect(updatedPoint).toEqual(newPoint);
        }
      }
    }
  }
});
