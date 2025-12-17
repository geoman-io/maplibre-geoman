import type {
  FeatureEditEndFwdEvent,
  FeatureEditStartFwdEvent,
  FeatureUpdatedFwdEvent,
  LngLatTuple,
} from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '@tests/utils/basic.ts';
import {
  getGeomanEventResultById,
  saveGeomanFeatureEventResultToCustomData,
} from '@tests/utils/events.ts';
import { getRenderedFeaturesData } from '@tests/utils/features.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';

test.describe('Drag Events', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'common-shapes' });
  });

  test('should fire gm:dragstart, gm:drag, and gm:dragend events during drag operation', async ({
    page,
  }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    for await (const feature of features) {
      // Get the position to drag
      let position;
      if (feature.shape === 'circle') {
        position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
      } else {
        position = getGeoJsonFirstPoint(feature.geoJson);
      }
      expect(position, `Position for feature ${feature.id} should exist`).not.toBeNull();
      if (!position) {
        continue;
      }

      // Get screen coordinates
      const point = await getScreenCoordinatesByLngLat({ page, position });
      expect(
        point,
        `Screen coordinates for feature ${feature.id} should be calculable`,
      ).not.toBeNull();
      if (!point) {
        continue;
      }

      // Calculate target point
      const targetPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];

      // Set up event listeners
      const dragStartResultId = await saveGeomanFeatureEventResultToCustomData(
        page,
        'dragstart',
        feature.id,
      );
      const dragResultId = await saveGeomanFeatureEventResultToCustomData(page, 'drag', feature.id);
      const dragEndResultId = await saveGeomanFeatureEventResultToCustomData(
        page,
        'dragend',
        feature.id,
      );

      // Perform drag operation
      await dragAndDrop(page, point, targetPoint);

      const dragStartEvent = (await getGeomanEventResultById(page, dragStartResultId)) as
        | FeatureEditStartFwdEvent
        | undefined;
      expect(dragStartEvent, 'Retrieved event result must be defined').toBeDefined();
      if (dragStartEvent) {
        expect(dragStartEvent.feature, 'Event feature must be defined').toBeDefined();
      }

      const dragEvent = (await getGeomanEventResultById(page, dragResultId)) as
        | FeatureUpdatedFwdEvent
        | undefined;
      expect(dragEvent, 'Retrieved event result must be defined').toBeDefined();
      if (dragEvent) {
        expect(dragEvent.feature, 'Event feature must be defined').toBeDefined();
        expect(dragEvent.shape, `Shape should be ${feature.shape}`).toEqual(feature.shape);
        expect(dragEvent.originalFeature, 'Event feature must be defined').toBeDefined();
      }

      const dragEndEvent = (await getGeomanEventResultById(page, dragEndResultId)) as
        | FeatureEditEndFwdEvent
        | undefined;
      expect(dragEndEvent, 'Retrieved event result must be defined').toBeDefined();
      if (dragEndEvent) {
        expect(dragEndEvent.feature, 'Event feature must be defined').toBeDefined();
        expect(dragEndEvent.shape, `Shape should be ${feature.shape}`).toEqual(feature.shape);
      }
    }
  });
});
