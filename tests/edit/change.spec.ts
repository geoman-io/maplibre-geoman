import { getCoordinateByPath, getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import {
  type FeatureCustomData,
  getFeatureMarkersData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  type MarkerCustomData,
  waitForFeatureGeoJsonUpdate,
  waitForRenderedFeatureData,
} from 'tests/utils/features.ts';
import { configurePageTimeouts, dragAndDrop, enableMode, waitForGeoman } from '../utils/basic.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';

const TOLERANCE = 2;

const getDraggableVertexForShape = async (
  page: Page,
  feature: FeatureCustomData,
): Promise<MarkerCustomData | null> => {
  const markers = await getFeatureMarkersData({
    page,
    featureId: feature.id,
    temporary: false, // Markers are on the main source after enabling edit mode
    allowedTypes: ['vertex'],
  });
  return markers.length > 0 ? markers[0] : null;
};

const performDragAndVerifyVertex = async (
  page: Page,
  feature: FeatureCustomData,
  vertexMarker: MarkerCustomData,
  offsetX: number,
  offsetY: number,
) => {
  expect(vertexMarker.path, `Vertex marker for ${feature.shape} must have a path`).toBeDefined();

  if (!vertexMarker.path) {
    return;
  }

  const originalGeoJson = feature.geoJson;
  const initialPoint = vertexMarker.point;
  const targetPoint: [number, number] = [initialPoint[0] + offsetX, initialPoint[1] + offsetY];

  await dragAndDrop(page, initialPoint, targetPoint);
  await waitForFeatureGeoJsonUpdate({ feature, originalGeoJson, page });

  const updatedFeature = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(updatedFeature, `Feature ${feature.id} should be updated`).not.toBeNull();

  if (updatedFeature) {
    const updatedLngLat = getCoordinateByPath(updatedFeature.geoJson, vertexMarker.path);
    expect(
      updatedLngLat,
      `Updated LngLat for path ${vertexMarker.path.join('.')} should exist`,
    ).not.toBeNull();

    if (updatedLngLat) {
      const newScreenPos = await getScreenCoordinatesByLngLat({ page, position: updatedLngLat });
      expect(newScreenPos, 'New screen position should be calculable').not.toBeNull();

      if (newScreenPos) {
        expect(newScreenPos[0]).toBeGreaterThanOrEqual(targetPoint[0] - TOLERANCE);
        expect(newScreenPos[0]).toBeLessThanOrEqual(targetPoint[0] + TOLERANCE);
        expect(newScreenPos[1]).toBeGreaterThanOrEqual(targetPoint[1] - TOLERANCE);
        expect(newScreenPos[1]).toBeLessThanOrEqual(targetPoint[1] + TOLERANCE);
      }
    }
  }
};

const performDragAndVerifyFeatureBody = async (
  page: Page,
  feature: FeatureCustomData,
  offsetX: number,
  offsetY: number,
) => {
  const originalGeoJson = feature.geoJson;
  const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
  expect(initialLngLat, `Initial LngLat for feature ${feature.id} should exist`).not.toBeNull();
  if (!initialLngLat) return;

  const initialPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
  expect(
    initialPoint,
    `Initial screen point for feature ${feature.id} should exist`,
  ).not.toBeNull();
  if (!initialPoint) return;

  const targetPoint: [number, number] = [initialPoint[0] + offsetX, initialPoint[1] + offsetY];

  await dragAndDrop(page, initialPoint, targetPoint);
  await waitForFeatureGeoJsonUpdate({ feature, originalGeoJson, page });

  const updatedFeature = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(updatedFeature, `Feature ${feature.id} should be updated after body drag`).not.toBeNull();

  if (updatedFeature) {
    const newLngLat = getGeoJsonFirstPoint(updatedFeature.geoJson);
    expect(newLngLat, `New LngLat for feature ${feature.id} should exist`).not.toBeNull();

    if (newLngLat) {
      const newScreenPos = await getScreenCoordinatesByLngLat({ page, position: newLngLat });
      expect(
        newScreenPos,
        'New screen position after body drag should be calculable',
      ).not.toBeNull();

      if (newScreenPos) {
        expect(newScreenPos[0]).toBeGreaterThanOrEqual(targetPoint[0] - TOLERANCE);
        expect(newScreenPos[0]).toBeLessThanOrEqual(targetPoint[0] + TOLERANCE);
        expect(newScreenPos[1]).toBeGreaterThanOrEqual(targetPoint[1] - TOLERANCE);
        expect(newScreenPos[1]).toBeLessThanOrEqual(targetPoint[1] + TOLERANCE);
      }
    }
  }
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

test('Change/Drag each shape type', async ({ page }) => {
  const dX = 20;
  const dY = 20;

  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features.length).toBeGreaterThan(0);

  await enableMode(page, 'edit', 'change');

  for (const feature of features) {
    const vertexMarker = await getDraggableVertexForShape(page, feature);

    if (vertexMarker) {
      await performDragAndVerifyVertex(page, feature, vertexMarker, dX, dY);
    } else {
      await performDragAndVerifyFeatureBody(page, feature, dX, dY);
    }
  }

  // Disable mode to reset state for the next feature
  await page.evaluate(() => window.geoman.options.disableMode('edit', 'change'));
});
