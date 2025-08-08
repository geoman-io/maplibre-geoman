import test, { expect } from '@playwright/test';
import { setupGeomanTest } from '../utils/test-helpers.ts';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '../utils/basic.ts';
import { getRenderedFeaturesData } from '../utils/features.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import { getGeomanEventPromise } from '../utils/events.ts';
import centroid from '@turf/centroid';
import type { LngLat } from '@/main.ts';

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
      const dragStartPromise = getGeomanEventPromise(page, 'dragstart');
      const dragPromise = getGeomanEventPromise(page, 'drag');
      const dragEndPromise = getGeomanEventPromise(page, 'dragend');

      // Perform drag operation
      await dragAndDrop(page, point, targetPoint);

      const [
        dragStartEvent,
        dragEvent,
        dragEndEvent,
      ] = await Promise.all([dragStartPromise, dragPromise, dragEndPromise]);

      // Verify dragstart event
      expect(dragStartEvent.shape, `Shape in dragstart event for ${feature.id} should match`).toBe(feature.shape);
      expect(dragStartEvent.feature, `Feature in dragstart event for ${feature.id} should exist`).toBeTruthy();

      // Verify drag event
      if (feature.shape === 'marker' || feature.shape === 'circle_marker' || feature.shape === 'text_marker') {
        // Point-based shapes have feature property
        expect(dragEvent.feature, `Feature in drag event for ${feature.id} should exist`).toBeTruthy();
      } else {
        // Other shapes have either feature or features property
        expect(
          dragEvent.feature || dragEvent.features,
          `Feature or features in drag event for ${feature.id} should exist`,
        ).toBeTruthy();
      }

      // Verify dragend event
      expect(dragEndEvent.shape, `Shape in dragend event for ${feature.id} should match`).toBe(feature.shape);
      expect(dragEndEvent.feature, `Feature in dragend event for ${feature.id} should exist`).toBeTruthy();
    }
  });
});
