import test, { expect, type Page } from '@playwright/test';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';
import { enableMode } from '@tests/utils/basic.ts';
import { getRenderedFeaturesData, getMarkerPointerLngLat } from '@tests/utils/features.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { eachCoordinateWithPath, eachSegmentWithPath } from '@/utils/geojson.ts';
import type { LngLatTuple } from '@/types';
import type { Feature } from 'geojson';
import type { LineBasedGeometry } from '@/types/geojson.ts';

test.describe('Snapping Helper', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
    await enableMode(page, 'helper', 'snapping');
    // Enable a draw mode to activate the marker pointer for snapping
    await enableMode(page, 'draw', 'marker');
  });

  test('should snap to vertices of all shape types', async () => {
    // Define a small offset to move the mouse near (but not exactly at) the target vertex
    const offset = 5;

    // Get all rendered features
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    // Iterate through each feature
    for (const feature of features) {
      // Extract all vertices from the feature using eachCoordinateWithPath
      const coordinates: Array<{ coordinate: LngLatTuple; path: Array<string | number> }> = [];

      eachCoordinateWithPath(feature.geoJson, (position) => {
        coordinates.push({ coordinate: position.coordinate, path: position.path });
      });

      // Test each vertex
      for (const { coordinate } of coordinates) {
        // Skip invalid coordinates
        if (
          !coordinate ||
          !Array.isArray(coordinate) ||
          coordinate.length !== 2 ||
          typeof coordinate[0] !== 'number' ||
          typeof coordinate[1] !== 'number' ||
          isNaN(coordinate[0]) ||
          isNaN(coordinate[1])
        ) {
          continue;
        }

        // Get screen coordinates of the vertex
        const vertexPoint = await getScreenCoordinatesByLngLat({ page, position: coordinate });
        if (!vertexPoint) {
          continue;
        }

        // Move mouse near the vertex (not exactly at it)
        await page.mouse.move(vertexPoint[0] + offset, vertexPoint[1] + offset);

        // Get the snapped cursor position
        const snappedLngLat = await getMarkerPointerLngLat(page);
        if (!snappedLngLat) {
          continue;
        }

        // Instead of using toBeCloseTo with a fixed precision, use a custom comparison with a tolerance
        const tolerance = 0.2; // Allow for a difference of up to 0.2 in coordinates

        const lngDiff = Math.abs(snappedLngLat[0] - coordinate[0]);
        const latDiff = Math.abs(snappedLngLat[1] - coordinate[1]);

        expect(lngDiff).toBeLessThan(tolerance);
        expect(latDiff).toBeLessThan(tolerance);
      }
    }
  });
  test('should snap to edges of line-based shapes', async () => {
    // Define the line-based shapes to test
    const lineBasedShapes = ['line', 'polygon', 'rectangle', 'circle'];

    // Get all rendered features and filter to include only line-based shapes
    const allFeatures = await getRenderedFeaturesData({ page, temporary: false });
    const features = allFeatures.filter((feature) => lineBasedShapes.includes(feature.shape));
    expect(features.length).toBeGreaterThan(0);

    // Iterate through each feature
    for (const feature of features) {
      // Extract all segments from the feature using eachSegmentWithPath
      const segments: Array<{ start: LngLatTuple; end: LngLatTuple }> = [];

      eachSegmentWithPath(feature.geoJson, (segment) => {
        segments.push({
          start: segment.start.coordinate,
          end: segment.end.coordinate,
        });
      });

      // Test each segment
      for (const segment of segments) {
        // Skip invalid segments
        if (
          !segment.start ||
          !segment.end ||
          !Array.isArray(segment.start) ||
          !Array.isArray(segment.end) ||
          segment.start.length !== 2 ||
          segment.end.length !== 2 ||
          typeof segment.start[0] !== 'number' ||
          typeof segment.start[1] !== 'number' ||
          typeof segment.end[0] !== 'number' ||
          typeof segment.end[1] !== 'number' ||
          isNaN(segment.start[0]) ||
          isNaN(segment.start[1]) ||
          isNaN(segment.end[0]) ||
          isNaN(segment.end[1])
        ) {
          continue;
        }

        // Calculate the midpoint of the segment
        const midLng = (segment.start[0] + segment.end[0]) / 2;
        const midLat = (segment.start[1] + segment.end[1]) / 2;
        const midpoint = [midLng, midLat] as LngLatTuple;

        // Get screen coordinates of the midpoint
        const midpointScreen = await getScreenCoordinatesByLngLat({ page, position: midpoint });
        if (!midpointScreen) {
          continue;
        }

        // Move mouse to the midpoint
        await page.mouse.move(midpointScreen[0], midpointScreen[1]);

        // Get the snapped cursor position
        const snappedLngLat = await getMarkerPointerLngLat(page);
        if (!snappedLngLat) {
          continue;
        }

        // Calculate the expected snap point using the same logic as the helper
        const expectedSnapPoint = await page.evaluate(
          ({ featureGeoJson, mouseLngLat }) => {
            // Type assertion to ensure the feature is treated as a LineBasedGeometry
            return window.geoman.mapAdapter.getEuclideanNearestLngLat(
              featureGeoJson as Feature<LineBasedGeometry>, // Cast to the expected type
              mouseLngLat,
            );
          },
          { featureGeoJson: feature.geoJson, mouseLngLat: midpoint },
        );

        if (!expectedSnapPoint) {
          continue;
        }

        // Instead of using toBeCloseTo with a fixed precision, use a custom comparison with a tolerance
        const tolerance = 0.1; // Allow for a difference of up to 0.1 in coordinates

        const lngDiff = Math.abs(snappedLngLat[0] - expectedSnapPoint[0]);
        const latDiff = Math.abs(snappedLngLat[1] - expectedSnapPoint[1]);

        expect(lngDiff).toBeLessThan(tolerance);
        expect(latDiff).toBeLessThan(tolerance);
      }
    }
  });
});
