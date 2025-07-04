import test, { expect } from '@playwright/test';
import { setupGeomanTest } from '../utils/test-helpers.ts';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '../utils/basic.ts';
import { getFeatureMarkersData, getRenderedFeaturesData } from '../utils/features.ts';
import { getGeomanEventPromise } from '../utils/events.ts';

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
        const rotateStartPromise = getGeomanEventPromise(page, 'rotatestart');
        const rotatePromise = getGeomanEventPromise(page, 'rotate');
        const rotateEndPromise = getGeomanEventPromise(page, 'rotateend');

        // Perform rotation operation
        await dragAndDrop(page, initialScreenPoint, targetScreenPoint);

        const [
          rotateStartEvent,
          rotateEvent,
          rotateEndEvent
        ] = await Promise.all([ rotateStartPromise, rotatePromise, rotateEndPromise ]);

        // Verify rotatestart event
        expect(rotateStartEvent.shape, `Shape in rotatestart event for ${feature.id} should match`).toBe(feature.shape);
        expect(rotateStartEvent.feature, `Feature in rotatestart event for ${feature.id} should exist`).toBeTruthy();

        // Verify rotate event
        expect(
          rotateEvent.feature || rotateEvent.features,
          `Feature or features in rotate event for ${feature.id} should exist`,
        ).toBeTruthy();
        if (rotateEvent.shape) {
          expect(rotateEvent.shape, `Shape in rotate event for ${feature.id} should match`).toBe(feature.shape);
        }

        // Verify rotateend event
        expect(rotateEndEvent.shape, `Shape in rotateend event for ${feature.id} should exist`).toBeTruthy();
        expect(rotateEndEvent.feature, `Feature in rotateend event for ${feature.id} should exist`).toBeTruthy();
      }
    }
  });
});
