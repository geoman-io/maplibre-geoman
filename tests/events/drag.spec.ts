import type {
  FeatureEditEndFwdEvent,
  FeatureEditStartFwdEvent,
  FeatureId,
  FeatureUpdatedFwdEvent,
  LngLatTuple,
} from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '@tests/utils/basic.ts';
import {
  getGeomanEventResultById,
  saveGeomanEventResultToCustomData,
  saveGeomanFeatureEventResultToCustomData,
} from '@tests/utils/events.ts';
import { getRenderedFeaturesData, type FeatureCustomData } from '@tests/utils/features.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';

test.describe('Drag Events', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'common-shapes' });
  });

  const isNotGroupedFeature = (feature: FeatureCustomData) =>
    typeof feature.geoJson.properties.__gm_group === 'undefined';

  test('should fire gm:dragstart, gm:drag, and gm:dragend events during drag operation', async ({
    page,
  }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    for await (const feature of features.filter(isNotGroupedFeature)) {
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
      const dragStartResultId = await saveGeomanEventResultToCustomData(page, 'dragstart');
      const dragResultId = await saveGeomanEventResultToCustomData(page, 'drag');
      const dragEndResultId = await saveGeomanEventResultToCustomData(page, 'dragend');

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

  const isFeatureOfGroup1 = (feature: FeatureCustomData) =>
    feature.geoJson.properties.__gm_group === 'group-1';

  test('should fire gm:dragstart, gm:drag, and gm:dragend events for all grouped features', async ({
    page,
  }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    const group1Features = features.filter(isFeatureOfGroup1);
    const firstFeature = group1Features[0];

    const firstFeaturePosition = getGeoJsonFirstPoint(firstFeature.geoJson);

    expect(firstFeaturePosition).toBeTruthy();
    if (!firstFeaturePosition) {
      return;
    }

    const firstFeaturePoint = await getScreenCoordinatesByLngLat({
      page,
      position: firstFeaturePosition,
    });

    if (!firstFeaturePoint) {
      return;
    }

    const firstFeatureTargetPoint: ScreenCoordinates = [
      firstFeaturePoint[0] + dX,
      firstFeaturePoint[1] + dY,
    ];

    const resultIdsByFeature: Map<
      FeatureId,
      {
        dragStartId: string;
        dragId: string;
        dragEndId: string;
      }
    > = new Map();

    for await (const feature of group1Features) {
      // Set up event listeners
      resultIdsByFeature.set(feature.id, {
        dragStartId: await saveGeomanFeatureEventResultToCustomData(page, 'dragstart', feature.id),
        dragId: await saveGeomanFeatureEventResultToCustomData(page, 'drag', feature.id),
        dragEndId: await saveGeomanFeatureEventResultToCustomData(page, 'dragend', feature.id),
      });
    }

    // Perform drag operation
    await dragAndDrop(page, firstFeaturePoint, firstFeatureTargetPoint);

    for await (const feature of group1Features) {
      const resultIds = resultIdsByFeature.get(feature.id);
      expect(resultIds).toBeDefined();
      if (!resultIds) {
        return;
      }
      const { dragStartId, dragId, dragEndId } = resultIds;

      const dragStartEvent = (await getGeomanEventResultById(page, dragStartId)) as
        | FeatureEditStartFwdEvent
        | undefined;
      expect(dragStartEvent, 'Retrieved event result must be defined').toBeDefined();
      if (dragStartEvent) {
        expect(dragStartEvent.feature, 'Event feature must be defined').toBeDefined();
      }

      const dragEvent = (await getGeomanEventResultById(page, dragId)) as
        | FeatureUpdatedFwdEvent
        | undefined;
      expect(dragEvent, 'Retrieved event result must be defined').toBeDefined();
      if (dragEvent) {
        expect(dragEvent.feature, 'Event feature must be defined').toBeDefined();
        expect(dragEvent.shape, `Shape should be ${feature.shape}`).toEqual(feature.shape);
        expect(dragEvent.originalFeature, 'Event feature must be defined').toBeDefined();
      }

      const dragEndEvent = (await getGeomanEventResultById(page, dragEndId)) as
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
