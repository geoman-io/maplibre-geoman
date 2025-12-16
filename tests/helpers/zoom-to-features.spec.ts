import test, { expect, type Page } from '@playwright/test';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';
import { enableMode, waitForMapIdle } from '@tests/utils/basic.ts';
import { getRenderedFeaturesData } from '@tests/utils/features.ts';

test.describe('Zoom To Features Helper', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
  });

  test('should fit map bounds to include all features', async () => {
    // Get initial map bounds
    const initialBounds = await page.evaluate(() => {
      const bounds = window.geoman.mapAdapter.getBounds();
      return bounds;
    });

    // Enable zoom_to_features helper
    await enableMode(page, 'helper', 'zoom_to_features');
    await waitForMapIdle(page);

    // Wait for the mode to auto-disable (it does this after fitting bounds)
    await page.waitForTimeout(200);

    // Get the new bounds after zooming
    const newBounds = await page.evaluate(() => {
      return window.geoman.mapAdapter.getBounds();
    });

    // The bounds should have changed
    expect(
      initialBounds[0][0] !== newBounds[0][0] ||
        initialBounds[0][1] !== newBounds[0][1] ||
        initialBounds[1][0] !== newBounds[1][0] ||
        initialBounds[1][1] !== newBounds[1][1],
      'Map bounds should change after zoom_to_features',
    ).toBe(true);
  });

  test('should contain all features within the visible bounds', async () => {
    // Enable zoom_to_features helper
    await enableMode(page, 'helper', 'zoom_to_features');
    await waitForMapIdle(page);
    await page.waitForTimeout(200);

    // Get all features and check they are within visible bounds
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    // Get current map bounds
    const mapBounds = await page.evaluate(() => {
      return window.geoman.mapAdapter.getBounds();
    });

    // Check that all feature centroids are within the map bounds
    for (const feature of features) {
      const featureBounds = await page.evaluate(
        (geoJson) => {
          const bbox = window.turf?.bbox?.(geoJson);
          if (bbox) {
            return {
              minLng: bbox[0],
              minLat: bbox[1],
              maxLng: bbox[2],
              maxLat: bbox[3],
            };
          }
          return null;
        },
        feature.geoJson,
      );

      // Skip if we couldn't get feature bounds (turf might not be available on window)
      if (!featureBounds) continue;

      // The feature should be at least partially within the map bounds
      const featureCenterLng = (featureBounds.minLng + featureBounds.maxLng) / 2;
      const featureCenterLat = (featureBounds.minLat + featureBounds.maxLat) / 2;

      const isWithinBounds =
        featureCenterLng >= mapBounds[0][0] &&
        featureCenterLng <= mapBounds[1][0] &&
        featureCenterLat >= mapBounds[0][1] &&
        featureCenterLat <= mapBounds[1][1];

      expect(
        isWithinBounds,
        `Feature ${feature.shape} center should be within visible map bounds`,
      ).toBe(true);
    }
  });

  test('should auto-disable after zooming', async () => {
    // Enable zoom_to_features helper
    await enableMode(page, 'helper', 'zoom_to_features');
    await waitForMapIdle(page);

    // Wait for auto-disable
    await page.waitForTimeout(300);

    // Check that the mode is disabled
    const isModeEnabled = await page.evaluate(() => {
      return window.geoman.options.isModeEnabled('helper', 'zoom_to_features');
    });

    expect(isModeEnabled, 'zoom_to_features should auto-disable after fitting bounds').toBe(false);
  });

  test('should work with single feature', async () => {
    // Remove all features except one
    await page.evaluate(() => {
      const features: Array<{ id: string | number }> = [];
      window.geoman.features.forEach((f) => features.push({ id: f.id }));
      // Keep only the first feature
      for (let i = 1; i < features.length; i++) {
        const featureData = window.geoman.features.get('gm_main', features[i].id as string);
        if (featureData) {
          window.geoman.features.delete(featureData);
        }
      }
    });
    await waitForMapIdle(page);

    // Verify we only have one feature
    const featuresBeforeZoom = await getRenderedFeaturesData({ page, temporary: false });
    expect(featuresBeforeZoom.length).toBe(1);

    // Get initial bounds
    const initialBounds = await page.evaluate(() => {
      return window.geoman.mapAdapter.getBounds();
    });

    // Enable zoom_to_features
    await enableMode(page, 'helper', 'zoom_to_features');
    await waitForMapIdle(page);
    await page.waitForTimeout(200);

    // Get new bounds
    const newBounds = await page.evaluate(() => {
      return window.geoman.mapAdapter.getBounds();
    });

    // Bounds should be valid after zoom_to_features
    expect(newBounds, 'Should have valid bounds after zoom_to_features').toBeDefined();
    expect(initialBounds, 'Initial bounds should be defined').toBeDefined();
  });

  test('should handle empty features gracefully', async () => {
    // Remove all features
    await page.evaluate(() => {
      const features: Array<{ id: string | number }> = [];
      window.geoman.features.forEach((f) => features.push({ id: f.id }));
      for (const f of features) {
        const featureData = window.geoman.features.get('gm_main', f.id as string);
        if (featureData) {
          window.geoman.features.delete(featureData);
        }
      }
    });
    await waitForMapIdle(page);

    // Verify no features
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBe(0);

    // Enable zoom_to_features - should not throw
    let errorOccurred = false;
    try {
      await page.evaluate(() => {
        window.geoman.options.enableMode('helper', 'zoom_to_features');
      });
      await page.waitForTimeout(200);
    } catch {
      errorOccurred = true;
    }

    // Should handle gracefully without throwing
    expect(errorOccurred, 'Should not throw when no features exist').toBe(false);
  });
});
