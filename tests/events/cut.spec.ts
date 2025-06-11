import test, { expect, type Page } from '@playwright/test';
import { setupGeomanTest } from '../utils/test-helpers.ts';
import { enableMode, mouseMoveAndClick, type ScreenCoordinates, waitForMapIdle } from '../utils/basic.ts';
import { getRenderedFeaturesData } from '../utils/features.ts';
import { loadGeoJson } from '../utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import type { GeoJsonImportFeature } from '@/types/geojson';
import type { LngLat } from '@/main.ts';
import { eachCoordinateWithPath } from '@/utils/geojson.ts';

// Helper function to get screen coordinates for a polygon
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

test.describe('Cut Operation', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'simple-cut/initial-features' });
  });

  test('should correctly cut features', async ({ page }) => {
    // Load the cutting polygon from fixture
    const cutGeoJsonFeatures = await loadGeoJson('simple-cut/cut-polygon');
    expect(cutGeoJsonFeatures, 'Cutting polygon fixture should be loaded').not.toBeNull();
    expect(cutGeoJsonFeatures?.length).toBeGreaterThan(0);
    if (!cutGeoJsonFeatures || cutGeoJsonFeatures.length === 0) {
      return;
    }

    // Get the cutting polygon coordinates
    const cuttingFeature = cutGeoJsonFeatures[0] as GeoJsonImportFeature;
    expect(cuttingFeature.geometry.type).toBe('LineString');

    // Convert to screen coordinates
    const cuttingPolygonScreenCoords = await getScreenCoordinatesForPolygon(page, cuttingFeature);
    expect(cuttingPolygonScreenCoords.length).toBeGreaterThan(0);

    // Enable cut mode
    await enableMode(page, 'edit', 'cut');

    // Load the expected result features to know how many features to expect after the cut
    const expectedResultGeoJson = await loadGeoJson('simple-cut/result-features');
    expect(expectedResultGeoJson, 'Result features fixture should be loaded').not.toBeNull();
    if (!expectedResultGeoJson) {
      return;
    }

    // Get initial features count
    const initialFeatures = await getRenderedFeaturesData({ page, temporary: false });
    const initialFeaturesCount = initialFeatures.length;

    // Perform the cut operation
    await mouseMoveAndClick(page, cuttingPolygonScreenCoords);
    await waitForMapIdle(page);

    // Wait for the expected number of features after the cut
    const POLLING_TIMEOUT = 10 * 1000;
    await expect.poll(
      async () => {
        const features = await getRenderedFeaturesData({ page, temporary: false });
        return features.length;
      },
      { timeout: POLLING_TIMEOUT, message: `Features count never reached ${expectedResultGeoJson.length}` },
    ).toEqual(expectedResultGeoJson.length);

    // Verify that the number of features has changed
    const finalFeatures = await getRenderedFeaturesData({ page, temporary: false });
    expect(finalFeatures.length).not.toEqual(initialFeaturesCount);
    expect(finalFeatures.length).toEqual(expectedResultGeoJson.length);
  });
});