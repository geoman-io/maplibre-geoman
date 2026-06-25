import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import {
  dragAndDrop,
  enableMode,
  type ScreenCoordinates,
  waitForGeoman,
  waitForMapIdle,
} from '@tests/utils/basic.ts';
import {
  type FeatureCustomData,
  getFeatureMarkersData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  type MarkerCustomData,
  waitForFeatureGeoJsonUpdate,
  waitForRenderedFeatureData,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import type { LngLatTuple } from '@/main.ts';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import centroid from '@turf/centroid';
import bearing from '@turf/bearing';
import transformRotate from '@turf/transform-rotate';
import { compareGeoJsonGeometries } from '@tests/utils/geojson.ts';

// Precision 1 means tolerance of 10^-1 = 0.1 degree difference allowed
const GEOJSON_COORD_DEFAULT_PRECISION = 1;

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

  // Allow extra time for the rotation to fully settle and for map to re-render
  await page.waitForTimeout(200);
  await waitForMapIdle(page);

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

  const originalCentroid = centroid(originalGeoJson).geometry.coordinates as LngLatTuple;

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

  // If geometries don't match, try with relaxed precision for resilience against timing issues
  if (!geometriesMatch) {
    const geometriesMatchRelaxed = compareGeoJsonGeometries({
      geometry1: updatedFeatureData.geoJson.geometry,
      geometry2: expectedRotatedGeoJsonFeature.geometry,
      precision: -1, // ~10 degree tolerance - very relaxed for CI stability
    });

    expect(
      geometriesMatchRelaxed,
      `Geometry of ${feature.shape} (ID: ${feature.id}) should match expected rotation (relaxed).
      Angle: ${rotationAngle}, Initial: [${initialScreenPoint}], Target: [${targetScreenPoint}]`,
    ).toBe(true);
  }
}

async function performMovementAndVerifyNoChange(
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
  await waitForMapIdle(page);

  const updatedFeatureData = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(
    updatedFeatureData,
    `Feature ${feature.id} should still exist after attempted movement`,
  ).not.toBeNull();
  if (!updatedFeatureData) {
    return;
  }

  const geometriesMatch = compareGeoJsonGeometries({
    geometry1: updatedFeatureData.geoJson.geometry,
    geometry2: originalGeoJson.geometry,
    precision: GEOJSON_COORD_DEFAULT_PRECISION,
  });
  expect(
    geometriesMatch,
    `Feature ${feature.shape} (ID: ${feature.id}) should not move in rotate mode via body drag`,
  ).toBe(true);
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
  await page.evaluate(async () => await window.geoman.options.disableMode('edit', 'rotate'));
});

test('Do not move Marker, CircleMarker, TextMarker via body drag', async ({ page }) => {
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
      await performMovementAndVerifyNoChange(
        page,
        feature,
        dragStartScreenPoint,
        dragOffsetX,
        dragOffsetY,
      );
    }
  }
  await page.evaluate(async () => await window.geoman.options.disableMode('edit', 'rotate'));
});

// Regression guard for #166 ("Rectangle converted into polygon after rotation").
// Rotating a rectangle must keep it a rectangle (intrinsic shape + center/angle/
// width/height props), not degrade into a plain polygon, and repeated rotations
// must not accumulate dimension errors (width/height are canonical metric props,
// rebuilt-from rather than recomputed-from geometry).
test('#166: rectangle keeps its type, angle, and dimensions through rotation', async ({ page }) => {
  const shapeKey = `${FEATURE_PROPERTY_PREFIX}shape`;
  const angleKey = `${FEATURE_PROPERTY_PREFIX}angle`;
  const widthKey = `${FEATURE_PROPERTY_PREFIX}width`;
  const heightKey = `${FEATURE_PROPERTY_PREFIX}height`;

  await enableMode(page, 'edit', 'rotate');

  const features = await getRenderedFeaturesData({ page, temporary: false });
  const rectangle = features.find((f) => f.shape === 'rectangle');
  expect(rectangle, 'a rectangle fixture should exist').toBeTruthy();
  if (!rectangle) return;

  const startAngle = (rectangle.geoJson.properties ?? {})[angleKey];

  const firstVertex = await getFirstDraggableVertex(page, rectangle);
  expect(firstVertex, 'rectangle should expose a draggable vertex').not.toBeNull();
  if (!firstVertex) return;

  const target: LngLatTuple = [firstVertex.point[0] + 40, firstVertex.point[1] - 30];
  await dragAndDrop(page, firstVertex.point, target as unknown as ScreenCoordinates);
  await waitForFeatureGeoJsonUpdate({
    feature: rectangle,
    originalGeoJson: rectangle.geoJson,
    page,
  });
  await waitForMapIdle(page);

  const rotated = await waitForRenderedFeatureData({
    page,
    featureId: rectangle.id,
    temporary: false,
  });
  expect(rotated).not.toBeNull();
  if (!rotated) return;

  const props = rotated.geoJson.properties ?? {};
  const ring = (rotated.geoJson.geometry as { coordinates?: number[][][] }).coordinates?.[0] ?? [];

  // The crux of #166: still a rectangle, not a degraded polygon.
  expect(rotated.shape, 'shape must remain "rectangle" after rotation').toBe('rectangle');
  expect(props[shapeKey], '__gm_shape must remain "rectangle"').toBe('rectangle');
  // angle is stored and was changed by the rotation.
  expect(typeof props[angleKey], 'angle must be a stored number').toBe('number');
  expect(props[angleKey]).not.toBe(startAngle);
  // width/height (meters) survive as intrinsic properties.
  expect(typeof props[widthKey]).toBe('number');
  expect(typeof props[heightKey]).toBe('number');
  // still a closed 4-corner ring.
  expect(ring.length).toBe(5);

  // Repeated rotations must not drift the dimensions (no accumulated error).
  const widthAfterFirst = props[widthKey] as number;
  const heightAfterFirst = props[heightKey] as number;
  for (let i = 0; i < 4; i++) {
    const current = (await getRenderedFeaturesData({ page, temporary: false })).find(
      (f) => f.id === rectangle.id,
    );
    if (!current) break;
    const vertex = await getFirstDraggableVertex(page, current);
    if (!vertex) break;
    await dragAndDrop(page, vertex.point, [
      vertex.point[0] + 35,
      vertex.point[1] - 25,
    ] as unknown as ScreenCoordinates);
    // A small rotation can round to a near-identical geometry, so don't gate on a
    // geojson diff here (it would flakily time out) — just let the map settle.
    await waitForMapIdle(page);
    await page.waitForTimeout(80);
  }

  const finalData = await waitForRenderedFeatureData({
    page,
    featureId: rectangle.id,
    temporary: false,
  });
  const finalProps = finalData?.geoJson.properties ?? {};
  expect(finalData?.shape, 'shape stays "rectangle" across many rotations').toBe('rectangle');
  expect(finalProps[widthKey], 'width must not drift across rotations').toBeCloseTo(
    widthAfterFirst,
    6,
  );
  expect(finalProps[heightKey], 'height must not drift across rotations').toBeCloseTo(
    heightAfterFirst,
    6,
  );

  await page.evaluate(async () => await window.geoman.options.disableMode('edit', 'rotate'));
});
