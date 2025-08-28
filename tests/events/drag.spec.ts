import type { LngLat } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '../utils/basic.ts';
import { checkGeomanEventResultFromCustomData, saveGeomanEventResultToCustomData } from '../utils/events.ts';
import { getRenderedFeaturesData } from '../utils/features.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import { setupGeomanTest } from '../utils/test-helpers.ts';

test.describe('Drag Events', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'common-shapes' });
  });

  test('should fire gm:dragstart, gm:drag, and gm:dragend events during drag operation', async ({ page }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    for await (const feature of features) {
      // Get the position to drag
      let position;
      if (feature.shape === 'circle') {
        position = centroid(feature.geoJson).geometry.coordinates as LngLat;
      } else {
        position = getGeoJsonFirstPoint(feature.geoJson);
      }
      expect(position, `Position for feature ${feature.id} should exist`).not.toBeNull();
      if (!position) {
        continue;
      }

      // Get screen coordinates
      const point = await getScreenCoordinatesByLngLat({ page, position });
      expect(point, `Screen coordinates for feature ${feature.id} should be calculable`).not.toBeNull();
      if (!point) {
        continue;
      }

      // Calculate target point
      const targetPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];

      // Set up event listeners
      await saveGeomanEventResultToCustomData(page, 'dragstart', 'dragstart');
      await saveGeomanEventResultToCustomData(page, 'drag', 'drag');
      await saveGeomanEventResultToCustomData(page, 'dragend', 'dragend');

      // Perform drag operation
      await dragAndDrop(page, point, targetPoint);

      await checkGeomanEventResultFromCustomData(page, 'dragstart', 'dragstart', feature);
      await checkGeomanEventResultFromCustomData(page, 'drag', 'drag', feature);
      await checkGeomanEventResultFromCustomData(page, 'dragend', 'dragend', feature);
    }
  });
});
