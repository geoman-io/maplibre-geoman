import test, { expect } from '@playwright/test';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '../utils/basic.ts';
import { checkGeomanEventResultFromCustomData, saveGeomanEventResultToCustomData } from '../utils/events.ts';
import { getFeatureMarkersData, getRenderedFeaturesData } from '../utils/features.ts';
import { setupGeomanTest } from '../utils/test-helpers.ts';

test.describe('Rotate Events', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
  });

  test('should fire gm:rotatestart, gm:rotate, and gm:rotateend events during rotation operation', async ({ page }) => {
    const dragOffsetX = 40;
    const dragOffsetY = -30;
    const rotatableShapes = ['polygon', 'line', 'rectangle'];

    await enableMode(page, 'edit', 'rotate');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    for (const feature of features) {
      if (rotatableShapes.includes(feature.shape)) {
        // Get a vertex marker to drag for rotation
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        expect(markers.length, `Vertex markers should exist for ${feature.shape}`).toBeGreaterThan(0);
        if (markers.length === 0) {
          continue;
        }

        const vertexMarker = markers[0];
        const initialScreenPoint = vertexMarker.point;
        const targetScreenPoint: ScreenCoordinates = [
          initialScreenPoint[0] + dragOffsetX,
          initialScreenPoint[1] + dragOffsetY,
        ];

        // Set up event listeners
        await saveGeomanEventResultToCustomData(page, 'rotatestart', 'rotatestart');
        await saveGeomanEventResultToCustomData(page, 'rotate', 'rotate');
        await saveGeomanEventResultToCustomData(page, 'rotateend', 'rotateend');

        // Perform rotation operation
        await dragAndDrop(page, initialScreenPoint, targetScreenPoint);

        await checkGeomanEventResultFromCustomData(page, 'rotatestart', 'rotatestart', feature);
        await checkGeomanEventResultFromCustomData(page, 'rotate', 'rotate', feature);
        await checkGeomanEventResultFromCustomData(page, 'rotateend', 'rotateend', feature);
      }
    }
  });
});
