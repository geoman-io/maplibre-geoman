import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import {
  dragAndDrop,
  enableMode,
  type ScreenCoordinates,
  waitForGeoman,
  waitForMapIdle,
} from '../utils/basic.ts';
import {
  type FeatureCustomData,
  getFeatureMarkersData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  type MarkerCustomData,
  waitForFeatureGeoJsonUpdate,
  waitForRenderedFeatureData,
} from '../utils/features.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import type { LngLat } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import centroid from '@turf/centroid';
import bearing from '@turf/bearing';
import transformRotate from '@turf/transform-rotate';
import { compareGeoJsonGeometries } from '../utils/geojson.ts';

const GEOJSON_COORD_DEFAULT_PRECISION = 1;
const SCREEN_COORD_TOLERANCE = 3;

async function getFirstDraggableVertex(
  page: Page,
  feature: FeatureCustomData,
): Promise<MarkerCustomData | null> {
  const markers = await getFeatureMarkersData({
    page,
    featureId: feature.id,
    temporary: false,
    allowedTypes: ['vertex'],
  });
  return markers.length > 0 ? markers[0] : null;
}

async function performRotationAndVerify(
  page: Page,
  feature: FeatureCustomData,
  vertexMarker: MarkerCustomData,
  dragOffsetX: number,
  dragOffsetY: number,
) {
  const originalGeoJson = feature.geoJson;
  const initialScreenPoint = vertexMarker.point;
  const targetScreenPoint: ScreenCoordinates = [
    initialScreenPoint[0] + dragOffsetX,
    initialScreenPoint[1] + dragOffsetY,
  ];

  await dragAndDrop(page, initialScreenPoint, targetScreenPoint);
  await waitForFeatureGeoJsonUpdate({ feature, originalGeoJson, page });

  const updatedFeatureData = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(
    updatedFeatureData,
    `Feature ${feature.id} should be updated after rotation`,
  ).not.toBeNull();
  if (!updatedFeatureData) {
    return;
  }

  const originalCentroid = centroid(originalGeoJson).geometry.coordinates as LngLat;

  const { initialVertexLngLat, targetVertexLngLat } = await page.evaluate(
    (coords) => {
      return {
        initialVertexLngLat: window.geoman.mapAdapter.unproject(coords.initialScreenPoint),
        targetVertexLngLat: window.geoman.mapAdapter.unproject(coords.targetScreenPoint),
      };
    },
    { initialScreenPoint, targetScreenPoint },
  );

  const angleStart = bearing(originalCentroid, initialVertexLngLat);
  const angleEnd = bearing(originalCentroid, targetVertexLngLat);
  const rotationAngle = angleEnd - angleStart;

  const expectedRotatedGeoJsonFeature = transformRotate(originalGeoJson, rotationAngle, {
    pivot: originalCentroid,
    mutate: false,
  });

  const geometriesMatch = compareGeoJsonGeometries({
    geometry1: updatedFeatureData.geoJson.geometry,
    geometry2: expectedRotatedGeoJsonFeature.geometry,
    precision: GEOJSON_COORD_DEFAULT_PRECISION,
  });
  expect(
    geometriesMatch,
    `Geometry of ${feature.shape} (ID: ${feature.id}) should match expected rotation. 
    Angle: ${rotationAngle}, Precision: ${GEOJSON_COORD_DEFAULT_PRECISION}`,
  ).toBe(true);
}

async function performMovementAndVerify(
  page: Page,
  feature: FeatureCustomData,
  dragStartScreenPoint: ScreenCoordinates,
  dragOffsetX: number,
  dragOffsetY: number,
) {
  const originalGeoJson = feature.geoJson;
  const targetScreenPoint: ScreenCoordinates = [
    dragStartScreenPoint[0] + dragOffsetX,
    dragStartScreenPoint[1] + dragOffsetY,
  ];

  await dragAndDrop(page, dragStartScreenPoint, targetScreenPoint);
  await waitForFeatureGeoJsonUpdate({ feature, originalGeoJson, page });

  const updatedFeatureData = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(
    updatedFeatureData,
    `Feature ${feature.id} should be updated after movement`,
  ).not.toBeNull();
  if (!updatedFeatureData) {
    return;
  }

  let referenceLngLat: LngLat | null;
  if (updatedFeatureData.geoJson.geometry.type === 'Point') {
    referenceLngLat = updatedFeatureData.geoJson.geometry.coordinates as LngLat;
  } else if (
    updatedFeatureData.shape === 'circle' ||
    updatedFeatureData.shape === 'polygon' ||
    updatedFeatureData.shape === 'rectangle'
  ) {
    referenceLngLat = centroid(updatedFeatureData.geoJson).geometry.coordinates as LngLat;
  } else {
    referenceLngLat = getGeoJsonFirstPoint(updatedFeatureData.geoJson);
  }
  expect(
    referenceLngLat,
    `Reference LngLat for ${feature.shape} (ID: ${feature.id}) should exist`,
  ).not.toBeNull();
  if (!referenceLngLat) {
    return;
  }

  const newScreenPos = await getScreenCoordinatesByLngLat({ page, position: referenceLngLat });
  expect(
    newScreenPos,
    `New screen position for ${feature.shape} (ID: ${feature.id}) should be calculable`,
  ).not.toBeNull();

  if (newScreenPos) {
    expect(newScreenPos[0]).toBeGreaterThanOrEqual(targetScreenPoint[0] - SCREEN_COORD_TOLERANCE);
    expect(newScreenPos[0]).toBeLessThanOrEqual(targetScreenPoint[0] + SCREEN_COORD_TOLERANCE);
    expect(newScreenPos[1]).toBeGreaterThanOrEqual(targetScreenPoint[1] - SCREEN_COORD_TOLERANCE);
    expect(newScreenPos[1]).toBeLessThanOrEqual(targetScreenPoint[1] + SCREEN_COORD_TOLERANCE);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
  expect(geoJsonFeatures, 'GeoJSON features should be loaded').not.toBeNull();

  if (geoJsonFeatures) {
    await loadGeoJsonFeatures({ page, geoJsonFeatures });
    await waitForMapIdle(page);
  }
});

test('Rotate Polygon, Line, Rectangle, Circle via vertex drag', async ({ page }) => {
  const dragOffsetX = 40;
  const dragOffsetY = -30;
  // const rotatableShapes = ['polygon', 'line', 'rectangle', 'circle'];
  const rotatableShapes = ['polygon', 'line', 'rectangle'];

  await enableMode(page, 'edit', 'rotate');

  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features.length).toBeGreaterThan(0);

  for (const feature of features) {
    if (rotatableShapes.includes(feature.shape)) {
      const vertexMarker = await getFirstDraggableVertex(page, feature);
      expect(
        vertexMarker,
        `Vertex marker should be found for ${feature.shape} (ID: ${feature.id})`,
      ).not.toBeNull();
      if (vertexMarker) {
        await performRotationAndVerify(page, feature, vertexMarker, dragOffsetX, dragOffsetY);
      }
    }
  }
  await page.evaluate(() => window.geoman.options.disableMode('edit', 'rotate'));
});

test('Move Marker, CircleMarker, TextMarker via body drag', async ({ page }) => {
  const dragOffsetX = -25;
  const dragOffsetY = 35;
  const pointBasedShapes = ['marker', 'circle_marker', 'text_marker'];

  await enableMode(page, 'edit', 'rotate');

  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features.length).toBeGreaterThan(0);

  for (const feature of features) {
    if (pointBasedShapes.includes(feature.shape)) {
      const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
      expect(
        initialLngLat,
        `Initial LngLat for ${feature.shape} (ID: ${feature.id}) should exist`,
      ).not.toBeNull();
      if (!initialLngLat) {
        continue;
      }

      const dragStartScreenPoint = await getScreenCoordinatesByLngLat({
        page,
        position: initialLngLat,
      });
      expect(
        dragStartScreenPoint,
        `Drag start screen point for ${feature.shape} (ID: ${feature.id}) should exist`,
      ).not.toBeNull();

      if (!dragStartScreenPoint) {
        continue;
      }
      await performMovementAndVerify(page, feature, dragStartScreenPoint, dragOffsetX, dragOffsetY);
    }
  }
  await page.evaluate(() => window.geoman.options.disableMode('edit', 'rotate'));
});
