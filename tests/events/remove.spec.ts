import test, { expect } from '@playwright/test';
import { setupGeomanTest } from '../utils/test-helpers.ts';
import { enableMode, mouseMoveAndClick } from '../utils/basic.ts';
import { getRenderedFeaturesData, waitForFeatureRemoval } from '../utils/features.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import { getScreenCoordinatesByLngLat } from '../utils/shapes.ts';
import { getGeomanEventPromise } from '../utils/events.ts';

test.describe('`gm:remove` Event', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
  });

  test('should fire for each shape type on deletion', async ({ page }) => {
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    await enableMode(page, 'edit', 'delete');

    for (const feature of features) {
      // Set up the event listener
      const eventPromise = getGeomanEventPromise(page, 'remove');

      // Find a point to click
      const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
      expect(initialLngLat, `Initial LngLat for feature ${feature.id} should exist`).not.toBeNull();
      if (!initialLngLat) {
        continue;
      }

      // Convert to screen coordinates
      const clickPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
      expect(clickPoint, `Screen coordinates for feature ${feature.id} should be calculable`).not.toBeNull();
      if (!clickPoint) {
        continue;
      }

      // Simulate the deletion
      await mouseMoveAndClick(page, clickPoint);

      // Wait for the event to fire and verify its payload
      const removeEvent = await eventPromise;
      expect(removeEvent.shape).toBe(feature.shape);
      expect(removeEvent.featureId).toBe(feature.id);

      // Verify the feature is gone from the data store
      await waitForFeatureRemoval({ page, featureId: feature.id, temporary: false });
    }
  });
});
