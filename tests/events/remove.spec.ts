import type { FeatureId, FeatureRemovedFwdEvent } from '@/types/index.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import { enableMode, mouseMoveAndClick } from '@tests/utils/basic.ts';
import {
  getGeomanEventResultById,
  saveGeomanEventResultToCustomData,
  saveGeomanFeatureEventResultToCustomData,
} from '@tests/utils/events.ts';
import {
  getRenderedFeaturesData,
  waitForFeatureRemoval,
  type FeatureCustomData,
} from '@tests/utils/features.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';

test.describe('`gm:remove` Event', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
  });

  const isNotGroupedFeature = (feature: FeatureCustomData) =>
    typeof feature.geoJson.properties.__gm_group === 'undefined';

  test('should fire for each shape type on deletion', async ({ page }) => {
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    await enableMode(page, 'edit', 'delete');

    for (const feature of features.filter(isNotGroupedFeature)) {
      // Set up the event listener
      const resultId = await saveGeomanEventResultToCustomData(page, 'remove');

      // Find a point to click
      const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
      expect(initialLngLat, `Initial LngLat for feature ${feature.id} should exist`).not.toBeNull();
      if (!initialLngLat) {
        continue;
      }

      // Convert to screen coordinates
      const clickPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
      expect(
        clickPoint,
        `Screen coordinates for feature ${feature.id} should be calculable`,
      ).not.toBeNull();
      if (!clickPoint) {
        continue;
      }

      // Simulate the deletion
      await mouseMoveAndClick(page, clickPoint);

      const event = (await getGeomanEventResultById(page, resultId)) as
        | FeatureRemovedFwdEvent
        | undefined;
      expect(event, 'Retrieved event result must be defined').toBeDefined();
      if (event) {
        expect(event.shape, `Shape should be ${feature.shape}`).toBe(feature.shape);
        expect(event.feature.id, `Id should be ${feature.id}`).toBe(feature.id);
      }

      // Verify the feature is gone from the data store
      await waitForFeatureRemoval({ page, featureId: feature.id, temporary: false });
    }
  });

  const isFeatureOfGroup1 = (feature: FeatureCustomData) =>
    feature.geoJson.properties.__gm_group === 'group-1';

  // actually one-shape-of-each-type doesn't have group feature but I think test is ready (@lhapaipai)
  test.skip('should fire for each grouped feature on deletion', async ({ page }) => {
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    await enableMode(page, 'edit', 'delete');

    const group1Features = features.filter(isFeatureOfGroup1);
    const firstFeature = group1Features[0];

    // Find a point to click
    const initialLngLat = getGeoJsonFirstPoint(firstFeature.geoJson);
    expect(
      initialLngLat,
      `Initial LngLat for feature ${firstFeature.id} should exist`,
    ).not.toBeNull();
    if (!initialLngLat) {
      return;
    }

    // Convert to screen coordinates
    const clickPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
    expect(
      clickPoint,
      `Screen coordinates for feature ${firstFeature.id} should be calculable`,
    ).not.toBeNull();
    if (!clickPoint) {
      return;
    }

    const resultIdsByFeature: Map<FeatureId, string> = new Map();

    for (const feature of group1Features) {
      // Set up the event listener
      resultIdsByFeature.set(
        feature.id,
        await saveGeomanFeatureEventResultToCustomData(page, 'remove', feature.id),
      );
    }

    // Simulate the deletion
    await mouseMoveAndClick(page, clickPoint);

    for await (const feature of group1Features) {
      const resultId = resultIdsByFeature.get(feature.id);
      expect(resultId).toBeDefined();
      if (!resultId) {
        return;
      }

      const event = (await getGeomanEventResultById(page, resultId)) as
        | FeatureRemovedFwdEvent
        | undefined;
      expect(event, 'Retrieved event result must be defined').toBeDefined();
      if (event) {
        expect(event.shape, `Shape should be ${feature.shape}`).toBe(feature.shape);
        expect(event.feature.id, `Id should be ${feature.id}`).toBe(feature.id);
      }

      // Verify the feature is gone from the data store
      await waitForFeatureRemoval({ page, featureId: feature.id, temporary: false });
    }
  });
});
