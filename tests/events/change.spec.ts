import type { FeatureEditEndFwdEvent } from '@/types/index.ts';
import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import { pointBasedGeometryType } from '../types.ts';
import { disableMode, enableMode } from '../utils/basic.ts';
import { getGeomanEventResultById, saveGeomanEventResultToCustomData } from '../utils/events.ts';
import {
  type FeatureCustomData,
  getFeatureMarkersData,
  getRenderedFeaturesData,
  type MarkerCustomData,
  performDragAndVerify,
} from '../utils/features.ts';
import { setupGeomanTest } from '../utils/test-helpers.ts';

const getDraggableVertexForShape = async (
  page: Page,
  feature: FeatureCustomData,
): Promise<MarkerCustomData | null> => {
  const markers = await getFeatureMarkersData({
    page,
    featureId: feature.id,
    temporary: false, // Markers are on the main source after enabling edit mode
    allowedTypes: ['vertex'],
  });
  return markers.length > 0 ? markers[0] : null;
};

test.beforeEach(async ({ page }) => {
  await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
});

test('Change events for all shape types', async ({ page }) => {
  const dX = 20;
  const dY = 20;

  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features.length).toBeGreaterThan(0);

  await enableMode(page, 'edit', 'change');

  for (const feature of features) {
    // Set up event listener for this feature
    const eventName = pointBasedGeometryType.includes(feature.geoJson.geometry.type)
      ? 'dragend'
      : 'editend';
    const resultId = await saveGeomanEventResultToCustomData(page, eventName);

    const vertexMarker = await getDraggableVertexForShape(page, feature);

    await performDragAndVerify(page, feature, dX, dY, {
      vertexMarker: vertexMarker || undefined,
    });

    const event = (await getGeomanEventResultById(page, resultId)) as
      | FeatureEditEndFwdEvent
      | undefined;
    expect(event, 'Retrieved event result must be defined').toBeDefined();
    if (event) {
      expect(event.shape, `Shape should be ${feature.shape}`).toBe(feature.shape);
      expect(event.feature, `Feature should be defined`).toBeDefined();
    }
  }

  // Disable mode to reset state
  await disableMode(page, 'edit', 'change');
});
