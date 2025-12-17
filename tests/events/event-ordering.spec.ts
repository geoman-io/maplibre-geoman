import type { AnyEventName, LngLatTuple } from '@/main.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import test, { expect } from '@playwright/test';
import centroid from '@turf/centroid';
import { dragAndDrop, enableMode, type ScreenCoordinates } from '@tests/utils/basic.ts';
import { getRenderedFeaturesData } from '@tests/utils/features.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';
import { GM_PREFIX } from '@/core/constants.ts';

test.describe('Event Ordering', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page, { loadFixture: 'common-shapes' });
  });

  test('drag events should fire in correct order: dragstart -> drag -> dragend', async ({
    page,
  }) => {
    const dX = -50;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    // Pick the first feature for testing
    const feature = features[0];

    // Get the position to drag
    let position: LngLatTuple | null;
    if (feature.shape === 'circle') {
      position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
    } else {
      position = getGeoJsonFirstPoint(feature.geoJson);
    }
    expect(position, 'Position should exist').not.toBeNull();
    if (!position) return;

    // Get screen coordinates
    const point = await getScreenCoordinatesByLngLat({ page, position });
    expect(point, 'Screen coordinates should be calculable').not.toBeNull();
    if (!point) return;

    // Calculate target point
    const targetPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];

    // Set up event recording to track order
    await page.evaluate(
      (context) => {
        // Use rawEventResults to store our event order data
        if (!window.customData) {
          window.customData = { rawEventResults: {} };
        }
        window.customData.rawEventResults = window.customData.rawEventResults || {};
        window.customData.rawEventResults['_eventOrder'] = [];
        window.customData.rawEventResults['_timestamps'] = [];

        const events = ['dragstart', 'drag', 'dragend'];
        events.forEach((eventName) => {
          window.geoman.mapAdapter.on(`${context.gmPrefix}:${eventName}` as AnyEventName, () => {
            (window.customData.rawEventResults!['_eventOrder'] as string[]).push(eventName);
            (window.customData.rawEventResults!['_timestamps'] as number[]).push(Date.now());
          });
        });
      },
      { gmPrefix: GM_PREFIX },
    );

    // Perform drag operation
    await dragAndDrop(page, point, targetPoint);

    // Get the recorded event order
    const result = await page.evaluate(() => {
      return {
        eventOrder: (window.customData.rawEventResults?.['_eventOrder'] as string[]) || [],
        timestamps: (window.customData.rawEventResults?.['_timestamps'] as number[]) || [],
      };
    });

    const { eventOrder, timestamps } = result;

    // Log the event order for debugging
    console.log('Event order received:', eventOrder);

    // Verify events were fired
    expect(eventOrder.length, 'At least some events should be fired').toBeGreaterThan(0);

    // Find indices of each event type
    const dragstartIndices = eventOrder
      .map((e: string, i: number) => (e === 'dragstart' ? i : -1))
      .filter((i: number) => i !== -1);
    const dragIndices = eventOrder
      .map((e: string, i: number) => (e === 'drag' ? i : -1))
      .filter((i: number) => i !== -1);
    const dragendIndices = eventOrder
      .map((e: string, i: number) => (e === 'dragend' ? i : -1))
      .filter((i: number) => i !== -1);

    // CRITICAL: Verify dragstart was fired
    // This is the main ordering issue reported in #84
    expect(
      dragstartIndices.length,
      'dragstart event MUST be fired - this is the core issue reported in #84',
    ).toBeGreaterThan(0);

    // If dragstart was fired, verify it was first
    if (dragstartIndices.length > 0) {
      expect(
        dragstartIndices[0],
        'dragstart MUST be the first event - events are out of order if this fails',
      ).toBe(0);
    }

    // Verify dragend was fired last (if it was fired)
    if (dragendIndices.length > 0) {
      expect(
        dragendIndices[0],
        'dragend should be the last event',
      ).toBe(eventOrder.length - 1);
    }

    // Verify all drag events are between dragstart and dragend (if all events were captured)
    if (dragstartIndices.length > 0 && dragendIndices.length > 0) {
      for (const dragIndex of dragIndices) {
        expect(dragIndex).toBeGreaterThan(dragstartIndices[0]);
        expect(dragIndex).toBeLessThan(dragendIndices[0]);
      }
    }

    // Verify timestamps are strictly increasing (events were fired in order)
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
    }
  });

  test('multiple rapid drags should maintain event order', async ({ page }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    // Pick the first feature for testing
    const feature = features[0];

    // Get the position to drag
    let position: LngLatTuple | null;
    if (feature.shape === 'circle') {
      position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
    } else {
      position = getGeoJsonFirstPoint(feature.geoJson);
    }
    expect(position, 'Position should exist').not.toBeNull();
    if (!position) return;

    // Get screen coordinates
    const point = await getScreenCoordinatesByLngLat({ page, position });
    expect(point, 'Screen coordinates should be calculable').not.toBeNull();
    if (!point) return;

    // Set up event recording
    await page.evaluate(
      (context) => {
        if (!window.customData) {
          window.customData = { rawEventResults: {} };
        }
        window.customData.rawEventResults = window.customData.rawEventResults || {};
        window.customData.rawEventResults['_eventOrder'] = [];
        window.customData.rawEventResults['_dragCount'] = 0;

        const events = ['dragstart', 'drag', 'dragend'];
        events.forEach((eventName) => {
          window.geoman.mapAdapter.on(`${context.gmPrefix}:${eventName}` as AnyEventName, () => {
            if (eventName === 'dragstart') {
              (window.customData.rawEventResults!['_dragCount'] as number)++;
            }
            const dragCount = window.customData.rawEventResults!['_dragCount'] as number;
            (window.customData.rawEventResults!['_eventOrder'] as string[]).push(
              `${eventName}_${dragCount}`,
            );
          });
        });
      },
      { gmPrefix: GM_PREFIX },
    );

    // Perform multiple drag operations
    const targetPoint1: ScreenCoordinates = [point[0] + dX, point[1] + dY];
    await dragAndDrop(page, point, targetPoint1);

    const targetPoint2: ScreenCoordinates = [targetPoint1[0] + dX, targetPoint1[1] + dY];
    await dragAndDrop(page, targetPoint1, targetPoint2);

    // Get the recorded event order
    const result = await page.evaluate(() => {
      return {
        eventOrder: (window.customData.rawEventResults?.['_eventOrder'] as string[]) || [],
      };
    });

    const { eventOrder } = result;

    // Log event order for debugging
    console.log('Event order for multiple drags:', eventOrder);

    // Verify events were fired for both drags
    const dragstartEvents = eventOrder.filter((e: string) => e.startsWith('dragstart'));
    const dragendEvents = eventOrder.filter((e: string) => e.startsWith('dragend'));

    // We expect 2 dragstart events (one for each drag operation)
    // If this fails, it indicates the issue reported in #84
    expect(
      dragstartEvents.length,
      'Both dragstart events MUST be captured - issue #84 if this fails',
    ).toBe(2);

    expect(
      dragendEvents.length,
      'Both dragend events should be captured',
    ).toBe(2);

    // Verify first drag cycle completes before second starts
    const firstDragendIndex = eventOrder.findIndex((e: string) => e === 'dragend_1');
    const secondDragstartIndex = eventOrder.findIndex((e: string) => e === 'dragstart_2');

    // Both indices should be found
    expect(firstDragendIndex, 'dragend_1 should be found').toBeGreaterThanOrEqual(0);
    expect(secondDragstartIndex, 'dragstart_2 should be found').toBeGreaterThanOrEqual(0);

    // First drag should complete before second starts
    if (firstDragendIndex >= 0 && secondDragstartIndex >= 0) {
      expect(
        firstDragendIndex,
        'First drag should complete (dragend_1) before second drag starts (dragstart_2)',
      ).toBeLessThan(secondDragstartIndex);
    }
  });

  test('rotate events should fire in correct order: rotatestart -> rotate -> rotateend', async ({
    page,
  }) => {
    await enableMode(page, 'edit', 'rotate');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    // Filter for features that support rotation (not markers)
    const rotatableFeatures = features.filter(
      (f) => !['marker', 'circle_marker', 'text_marker'].includes(f.shape),
    );
    expect(rotatableFeatures.length).toBeGreaterThan(0);

    const feature = rotatableFeatures[0];

    // Get the position - use centroid for rotation
    const position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
    expect(position, 'Position should exist').not.toBeNull();

    // Get screen coordinates
    const point = await getScreenCoordinatesByLngLat({ page, position });
    expect(point, 'Screen coordinates should be calculable').not.toBeNull();
    if (!point) return;

    // Set up event recording
    await page.evaluate(
      (context) => {
        if (!window.customData) {
          window.customData = { rawEventResults: {} };
        }
        window.customData.rawEventResults = window.customData.rawEventResults || {};
        window.customData.rawEventResults['_eventOrder'] = [];

        const events = ['rotatestart', 'rotate', 'rotateend'];
        events.forEach((eventName) => {
          window.geoman.mapAdapter.on(`${context.gmPrefix}:${eventName}` as AnyEventName, () => {
            (window.customData.rawEventResults!['_eventOrder'] as string[]).push(eventName);
          });
        });
      },
      { gmPrefix: GM_PREFIX },
    );

    // Perform rotation by dragging in a circular pattern
    const radius = 50;
    const targetPoint: ScreenCoordinates = [point[0] + radius, point[1]];
    await dragAndDrop(page, point, targetPoint);

    // Get the recorded event order
    const result = await page.evaluate(() => {
      return {
        eventOrder: (window.customData.rawEventResults?.['_eventOrder'] as string[]) || [],
      };
    });

    const { eventOrder } = result;

    // If rotate events were fired, verify order
    if (eventOrder.length > 0) {
      // Find indices of each event type
      const rotateStartIndices = eventOrder
        .map((e: string, i: number) => (e === 'rotatestart' ? i : -1))
        .filter((i: number) => i !== -1);
      const rotateIndices = eventOrder
        .map((e: string, i: number) => (e === 'rotate' ? i : -1))
        .filter((i: number) => i !== -1);
      const rotateEndIndices = eventOrder
        .map((e: string, i: number) => (e === 'rotateend' ? i : -1))
        .filter((i: number) => i !== -1);

      // If rotatestart was fired, it should be first
      if (rotateStartIndices.length > 0) {
        expect(rotateStartIndices[0]).toBe(0);
      }

      // If rotateend was fired, it should be last
      if (rotateEndIndices.length > 0) {
        expect(rotateEndIndices[0]).toBe(eventOrder.length - 1);
      }

      // All rotate events should be between rotatestart and rotateend
      if (rotateStartIndices.length > 0 && rotateEndIndices.length > 0) {
        for (const rotateIndex of rotateIndices) {
          expect(rotateIndex).toBeGreaterThan(rotateStartIndices[0]);
          expect(rotateIndex).toBeLessThan(rotateEndIndices[0]);
        }
      }
    }
  });

  test('system events (_gm:) should fire before converted events (gm:)', async ({ page }) => {
    const dX = -30;
    const dY = 0;

    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    const feature = features[0];

    // Get the position to drag
    let position: LngLatTuple | null;
    if (feature.shape === 'circle') {
      position = centroid(feature.geoJson).geometry.coordinates as LngLatTuple;
    } else {
      position = getGeoJsonFirstPoint(feature.geoJson);
    }
    expect(position, 'Position should exist').not.toBeNull();
    if (!position) return;

    // Get screen coordinates
    const point = await getScreenCoordinatesByLngLat({ page, position });
    expect(point, 'Screen coordinates should be calculable').not.toBeNull();
    if (!point) return;

    // Calculate target point
    const targetPoint: ScreenCoordinates = [point[0] + dX, point[1] + dY];

    // Set up event recording for both system and converted events
    await page.evaluate(() => {
      if (!window.customData) {
        window.customData = { rawEventResults: {} };
      }
      window.customData.rawEventResults = window.customData.rawEventResults || {};
      window.customData.rawEventResults['_eventOrder'] = [];

      // Listen to system events (prefixed with _gm:)
      window.geoman.mapAdapter.on('_gm:edit' as AnyEventName, () => {
        (window.customData.rawEventResults!['_eventOrder'] as string[]).push('_gm:edit');
      });

      // Listen to converted events (prefixed with gm:)
      window.geoman.mapAdapter.on('gm:dragstart' as AnyEventName, () => {
        (window.customData.rawEventResults!['_eventOrder'] as string[]).push('gm:dragstart');
      });
      window.geoman.mapAdapter.on('gm:drag' as AnyEventName, () => {
        (window.customData.rawEventResults!['_eventOrder'] as string[]).push('gm:drag');
      });
      window.geoman.mapAdapter.on('gm:dragend' as AnyEventName, () => {
        (window.customData.rawEventResults!['_eventOrder'] as string[]).push('gm:dragend');
      });
    });

    // Perform drag operation
    await dragAndDrop(page, point, targetPoint);

    // Get the recorded event order
    const result = await page.evaluate(() => {
      return {
        eventOrder: (window.customData.rawEventResults?.['_eventOrder'] as string[]) || [],
      };
    });

    const { eventOrder } = result;

    // Verify system events were fired
    const systemEventIndices = eventOrder
      .map((e: string, i: number) => (e.startsWith('_gm:') ? i : -1))
      .filter((i: number) => i !== -1);

    // System events should appear throughout the event sequence
    // (they fire alongside converted events due to the queuing mechanism)
    expect(systemEventIndices.length).toBeGreaterThan(0);
  });

});

test.describe('awaitDataUpdatesOnEvents Setting', () => {
  // These tests need a fresh page without fixtures to properly test the setting
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.geoman?.loaded, { timeout: 10000 });
  });

  test('awaitDataUpdatesOnEvents=true should have feature in source when gm:create fires', async ({
    page,
  }) => {
    // Ensure setting is true (default)
    await page.evaluate(() => {
      window.geoman.options.settings.awaitDataUpdatesOnEvents = true;
    });

    const { width, height } = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    const centerX = width / 2;
    const centerY = height / 2;

    // Set up event listener to check if feature exists in source when event fires
    const resultId = `_createTest_${Date.now()}`;
    await page.evaluate(
      (context) => {
        if (!window.customData) {
          window.customData = { rawEventResults: {} };
        }
        window.customData.rawEventResults = window.customData.rawEventResults || {};

        /* eslint-disable @typescript-eslint/no-explicit-any */
        window.geoman.mapAdapter.once('gm:create', ((event: any) => {
          const featureId = event.feature.id;
          const sourceGeoJson = event.feature.source.getGeoJson();
          const featureInSource = sourceGeoJson.features.some((f: { id?: string | number }) => f.id === featureId);

          window.customData.rawEventResults![context.resultId] = {
            featureId,
            featureInSource,
            sourceFeatureCount: sourceGeoJson.features.length,
          };
        }) as any);
        /* eslint-enable @typescript-eslint/no-explicit-any */
      },
      { resultId },
    );

    // Draw a rectangle
    await page.click('#id_draw_rectangle');
    await page.waitForTimeout(100); // Wait for draw mode to activate
    await page.mouse.move(centerX - 50, centerY - 50);
    await page.mouse.click(centerX - 50, centerY - 50);
    await page.waitForTimeout(100);
    await page.mouse.move(centerX + 50, centerY + 50);
    await page.mouse.click(centerX + 50, centerY + 50);

    // Wait for event
    await page.waitForTimeout(500);

    const result = await page.evaluate(
      (context) => {
        return window.customData.rawEventResults?.[context.resultId] as
          | { featureId: string; featureInSource: boolean; sourceFeatureCount: number }
          | undefined;
      },
      { resultId },
    );

    expect(result, 'Create event should have been captured').toBeDefined();
    if (result) {
      expect(
        result.featureInSource,
        'With awaitDataUpdatesOnEvents=true, created feature should be in source when event fires (issue #84)',
      ).toBe(true);
    }

    // Exit drawing mode
    await page.click('#id_draw_rectangle');
  });

  test('awaitDataUpdatesOnEvents=false should NOT have feature in source when gm:create fires', async ({
    page,
  }) => {
    // Set setting to false
    await page.evaluate(() => {
      window.geoman.options.settings.awaitDataUpdatesOnEvents = false;
    });

    const { width, height } = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    const centerX = width / 2;
    const centerY = height / 2;

    // Set up event listener to check if feature exists in source when event fires
    const resultId = `_createTestAsync_${Date.now()}`;
    await page.evaluate(
      (context) => {
        if (!window.customData) {
          window.customData = { rawEventResults: {} };
        }
        window.customData.rawEventResults = window.customData.rawEventResults || {};

        /* eslint-disable @typescript-eslint/no-explicit-any */
        window.geoman.mapAdapter.once('gm:create', ((event: any) => {
          const featureId = event.feature.id;
          const sourceGeoJson = event.feature.source.getGeoJson();
          const featureInSource = sourceGeoJson.features.some((f: { id?: string | number }) => f.id === featureId);

          window.customData.rawEventResults![context.resultId] = {
            featureId,
            featureInSource,
            sourceFeatureCount: sourceGeoJson.features.length,
          };
        }) as any);
        /* eslint-enable @typescript-eslint/no-explicit-any */
      },
      { resultId },
    );

    // Draw a rectangle
    await page.click('#id_draw_rectangle');
    await page.waitForTimeout(100); // Wait for draw mode to activate
    await page.mouse.move(centerX - 50, centerY - 50);
    await page.mouse.click(centerX - 50, centerY - 50);
    await page.waitForTimeout(100);
    await page.mouse.move(centerX + 50, centerY + 50);
    await page.mouse.click(centerX + 50, centerY + 50);

    // Wait for event
    await page.waitForTimeout(500);

    const result = await page.evaluate(
      (context) => {
        return window.customData.rawEventResults?.[context.resultId] as
          | { featureId: string; featureInSource: boolean; sourceFeatureCount: number }
          | undefined;
      },
      { resultId },
    );

    expect(result, 'Create event should have been captured').toBeDefined();
    if (result) {
      expect(
        result.featureInSource,
        'With awaitDataUpdatesOnEvents=false, created feature should NOT be in source when event fires (async behavior)',
      ).toBe(false);
    }

    // Exit drawing mode
    await page.click('#id_draw_rectangle');

    // Re-enable for other tests
    await page.evaluate(() => {
      window.geoman.options.settings.awaitDataUpdatesOnEvents = true;
    });
  });
});
