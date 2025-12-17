import type { LngLatTuple } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
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
  type FeatureCustomData,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { isEqual } from 'lodash-es';

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

const isNotGroupedFeature = (feature: FeatureCustomData) =>
  typeof feature.geoJson.properties.__gm_group === 'undefined';

test('Drag', async ({ page }) => {
  const dX = -20;
  const dY = 0;
  await enableMode(page, 'edit', 'drag');
  const features = await getRenderedFeaturesData({ page, temporary: false });

  for await (const feature of features.filter(isNotGroupedFeature)) {
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
          expect(updatedPoint).toEqual(newPoint);
        }
      }
    }
  }
});

const isFeatureOfGroup1 = (feature: FeatureCustomData) =>
  feature.geoJson.properties.__gm_group === 'group-1';

function isPointEqual(point1: number[] | null, point2: number[], tolerance = 1): boolean {
  if (!point1 || point1.length !== 2 || point2.length !== 2) {
    return false;
  }
  const dx = Math.abs(point1[0] - point2[0]);
  const dy = Math.abs(point1[1] - point2[1]);
  return dx <= tolerance && dy <= tolerance;
}

test('Drag Grouped', async ({ page }) => {
  const dX = -20;
  const dY = 0;
  await enableMode(page, 'edit', 'drag');
  const features = await getRenderedFeaturesData({ page, temporary: false });

  const group1Features = features.filter(isFeatureOfGroup1);
  const firstFeature = group1Features[0];

  const firstFeaturePosition = getGeoJsonFirstPoint(firstFeature.geoJson);

  expect(firstFeaturePosition).toBeTruthy();
  if (!firstFeaturePosition) {
    return;
  }

  const firstFeaturePoint = await getScreenCoordinatesByLngLat({
    page,
    position: firstFeaturePosition,
  });

  if (!firstFeaturePoint) {
    return;
  }

  const firstFeatureNewPoint: ScreenCoordinates = [
    firstFeaturePoint[0] + dX,
    firstFeaturePoint[1] + dY,
  ];
  await dragAndDrop(page, firstFeaturePoint, firstFeatureNewPoint);

  for await (const feature of group1Features) {
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
    if (!point) {
      return;
    }

    const newPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];

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
        if (!isPointEqual(updatedPoint, newPoint)) {
          console.log('Shape', feature.shape);
          console.log(`Original point: [${point}]`);
          console.log(`Expected/actual: [${newPoint}] / [${updatedPoint}]`);
        }
        expect(isPointEqual(updatedPoint, newPoint)).toBe(true);
      }
    }
  }
});
