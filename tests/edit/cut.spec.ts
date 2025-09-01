import { expect, type Page, test } from '@playwright/test';
import {
  enableMode,
  mouseMoveAndClick,
  type ScreenCoordinates,
  waitForGeoman,
  waitForMapIdle,
} from '../utils/basic.ts';
import {
  type FeatureCustomData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
} from '../utils/features.ts';
import { compareGeoJsonGeometries } from '../utils/geojson.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import type { GeoJsonImportFeature, GeoJsonShapeFeature } from '@/types/geojson';
import { eachCoordinateWithPath } from '@/utils/geojson.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import type { LngLat } from '@/types';

const GEOJSON_COMPARE_PRECISION = 1; // digits after comma
const POLLIING_TIMEOUT = 10 * 1000;

async function getScreenCoordinatesForPolygon(
  page: Page,
  cuttingFeature: GeoJsonImportFeature,
): Promise<ScreenCoordinates[]> {
  const lngLats: Array<LngLat> = [];
  const screenCoords: ScreenCoordinates[] = [];

  eachCoordinateWithPath(cuttingFeature, (position) => {
    lngLats.push(position.coordinate);
  });

  for (const lngLat of lngLats) {
    const screenCoord = await getScreenCoordinatesByLngLat({ page, position: lngLat });
    if (screenCoord) {
      screenCoords.push(screenCoord);
    }
  }

  return screenCoords;
}

// Helper function to draw the cutting polygon on the map
async function drawCuttingPolygon({
  page,
  cuttingPolygonScreenCoords,
  expectedResultFeaturesCount,
}: {
  page: Page;
  cuttingPolygonScreenCoords: ScreenCoordinates[];
  expectedResultFeaturesCount: number;
}): Promise<void> {
  await mouseMoveAndClick(page, cuttingPolygonScreenCoords);
  await waitForMapIdle(page);
  await expect
    .poll(
      async () => {
        const features = await getRenderedFeaturesData({ page, temporary: false });
        return features.length;
      },
      {
        timeout: POLLIING_TIMEOUT,
        message: `Features count never reached ${expectedResultFeaturesCount}`,
      },
    )
    .toEqual(expectedResultFeaturesCount);
}

async function verifyCutResultById(
  page: Page,
  expectedGeoJsonResults: GeoJsonShapeFeature[],
): Promise<void> {
  await expect
    .poll(
      async () => {
        const features = await getRenderedFeaturesData({ page, temporary: false });
        return features.length;
      },
      {
        message: `Polling: Expected ${expectedGeoJsonResults.length} features after cut.`,
        timeout: POLLIING_TIMEOUT,
      },
    )
    .toBe(expectedGeoJsonResults.length);

  const actualFeatures: FeatureCustomData[] = await getRenderedFeaturesData({
    page,
    temporary: false,
  });
  expect(actualFeatures.length).toBe(expectedGeoJsonResults.length);

  for (const expectedFeature of expectedGeoJsonResults) {
    const expectedId = expectedFeature.id ?? expectedFeature.properties?._gmid;
    expect(
      expectedId,
      `Expected feature must have an ID. Feature: ${JSON.stringify(expectedFeature)}`,
    ).toBeDefined();

    const actualFeatureData = actualFeatures.find(
      (f) => (f.id ?? f.geoJson.properties?._gmid) === expectedId,
    );

    expect(
      actualFeatureData,
      `Feature with ID '${expectedId}' not found in actual results.` +
        `Expected: ${JSON.stringify(expectedFeature.geometry)}` +
        `Actual features: ${JSON.stringify(
          actualFeatures.map((f) => ({
            id: f.id,
            props: f.geoJson.properties,
            geom: f.geoJson.geometry,
          })),
        )}`,
    ).toBeDefined();

    if (actualFeatureData) {
      const geometriesMatch = compareGeoJsonGeometries({
        geometry1: actualFeatureData.geoJson.geometry,
        geometry2: expectedFeature.geometry,
        precision: GEOJSON_COMPARE_PRECISION,
      });

      expect(
        geometriesMatch,
        `Geometry mismatch for feature ID '${expectedId}'` +
          `Expected: ${JSON.stringify(expectedFeature.geometry, null, 2)}` +
          `Actual: ${JSON.stringify(actualFeatureData.geoJson.geometry, null, 2)}`,
      ).toBe(true);
    }
  }
}

test.describe('Geoman "edit:cut" mode - fixture based', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGeoman(page);
    await expect(page).toHaveTitle('Geoman plugin');

    const initialGeoJson = await loadGeoJson('simple-cut/initial-features');
    expect(initialGeoJson, 'Initial features should be loaded').not.toBeNull();
    if (initialGeoJson) {
      await loadGeoJsonFeatures({ page, geoJsonFeatures: initialGeoJson });
    }
    await enableMode(page, 'edit', 'cut');
  });

  test('should correctly cut features based on fixtures', async ({ page }) => {
    const cutGeoJsonFeatures = await loadGeoJson('simple-cut/cut-polygon');
    expect(cutGeoJsonFeatures, 'Cutting polygon fixture should be loaded').not.toBeNull();
    expect(cutGeoJsonFeatures?.length).toBeGreaterThan(0);
    if (!cutGeoJsonFeatures || cutGeoJsonFeatures.length === 0) {
      return;
    }

    const expectedResultGeoJson = await loadGeoJson('simple-cut/result-features');
    expect(expectedResultGeoJson, 'Result features fixture should be loaded').not.toBeNull();
    if (!expectedResultGeoJson) {
      return;
    }

    const cuttingFeature = cutGeoJsonFeatures[0] as GeoJsonImportFeature;
    expect(cuttingFeature.geometry.type).toBe('LineString');

    const cuttingPolygonScreenCoords = await getScreenCoordinatesForPolygon(page, cuttingFeature);
    await drawCuttingPolygon({
      page,
      cuttingPolygonScreenCoords,
      expectedResultFeaturesCount: expectedResultGeoJson.length,
    });

    await verifyCutResultById(page, expectedResultGeoJson as GeoJsonShapeFeature[]);
  });
});
