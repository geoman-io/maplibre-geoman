import type { Page } from '@playwright/test';
import test, { expect } from '@playwright/test';
import { pointBasedGeometryType } from '../types.ts';
import { disableMode, enableMode } from '../utils/basic.ts';
import { checkGeomanEventResultFromCustomData, saveGeomanEventResultToCustomData } from '../utils/events.ts';
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
    const eventName = pointBasedGeometryType.includes(feature.geoJson.geometry.type) ? 'dragend' : 'editend';
    await saveGeomanEventResultToCustomData(page, eventName, eventName);

    const vertexMarker = await getDraggableVertexForShape(page, feature);

    await performDragAndVerify(page, feature, dX, dY, {
      vertexMarker: vertexMarker || undefined,
    });

    await checkGeomanEventResultFromCustomData(page, eventName, eventName, feature);
  }

  // Disable mode to reset state
  await disableMode(page, 'edit', 'change');
});
