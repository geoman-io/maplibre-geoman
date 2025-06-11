import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import { disableMode, enableMode } from '../utils/basic.ts';
import { getGeomanEventPromise } from '../utils/events.ts';
import {
  type FeatureCustomData,
  getFeatureMarkersData,
  getRenderedFeaturesData,
  performDragAndVerify,
  type MarkerCustomData,
} from '../utils/features.ts';
import { setupGeomanTest } from '../utils/test-helpers.ts';
import { pointBasedGeometryType } from '../types.ts';


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
    const eventHandlerPromise = getGeomanEventPromise(
      page,
      pointBasedGeometryType.includes(feature.geoJson.geometry.type) ? 'dragend' : 'editend',
    );
    const vertexMarker = await getDraggableVertexForShape(page, feature);

    await performDragAndVerify(page, feature, dX, dY, {
      vertexMarker: vertexMarker || undefined,
    });

    const result = await eventHandlerPromise;
    expect(result.feature || result.features, `Feature data should be present for ${feature.shape}`).toBe(true);
    if (result.shape) {
      expect(result.shape, `Shape should match for ${feature.shape}`).toBe(feature.shape);
    }
  }

  // Disable mode to reset state
  await disableMode(page, 'edit', 'change');
});
