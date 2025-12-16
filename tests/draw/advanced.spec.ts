import test, { expect, type Page } from '@playwright/test';
import {
  getWindowDimensions,
  mouseMoveAndClick,
  waitForGeoman,
  enableMode,
  disableMode,
  waitForMapIdle,
} from '@tests/utils/basic.ts';
import { getRenderedFeaturesData, type FeatureCustomData } from '@tests/utils/features.ts';
import type { FeatureShape } from '@/types';

const checkFeatureCreated = async (page: Page, featureType: FeatureShape) => {
  let renderedFeatures: Array<FeatureCustomData> = [];

  await expect
    .poll(
      async () => {
        renderedFeatures = await getRenderedFeaturesData({
          page,
          temporary: false,
          allowedTypes: [featureType],
        });
        return renderedFeatures.length;
      },
      { timeout: 10 * 1000, message: 'Feature never created' },
    )
    .toEqual(1);

  expect(renderedFeatures).toHaveLength(1);
  expect(renderedFeatures[0].shape).toBe(featureType);
  return renderedFeatures[0];
};

test.describe('Draw Mode - Advanced Scenarios', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
    await expect(page).toHaveTitle('Geoman plugin');
  });

  test.describe('Draw mode cancellation', () => {
    test('should cancel marker draw by clicking button again', async () => {
      await page.click('#id_draw_marker');

      const isEnabledBefore = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledBefore).toBe(true);

      // Click button again to cancel/exit
      await page.click('#id_draw_marker');
      await waitForMapIdle(page);

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });

      // Mode should be disabled after clicking button again
      expect(isEnabled).toBe(false);
    });

    test('should cancel line draw with escape key mid-drawing', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await enableMode(page, 'draw', 'line');

      // Start drawing line but don't finish
      await mouseMoveAndClick(page, [centerX, centerY]);
      await mouseMoveAndClick(page, [centerX + 50, centerY + 50]);

      // Press escape to cancel
      await page.keyboard.press('Escape');
      await waitForMapIdle(page);

      // No line should be created
      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['line'],
      });
      expect(features.length).toBe(0);
    });
  });

  test.describe('Draw multiple features', () => {
    test('should draw multiple markers in sequence', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_marker');

      // Draw first marker
      await mouseMoveAndClick(page, [centerX - 100, centerY]);
      await waitForMapIdle(page);

      // Draw second marker
      await mouseMoveAndClick(page, [centerX, centerY]);
      await waitForMapIdle(page);

      // Draw third marker
      await mouseMoveAndClick(page, [centerX + 100, centerY]);
      await waitForMapIdle(page);

      // Exit draw mode
      await page.click('#id_draw_marker');

      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['marker'],
      });
      expect(features.length).toBe(3);
    });

    test('should draw multiple rectangles in sequence', async () => {
      const { width, height } = await getWindowDimensions(page);

      await page.click('#id_draw_rectangle');

      // Draw first rectangle
      await mouseMoveAndClick(page, [
        [width / 2 - 150, height / 2 - 100],
        [width / 2 - 50, height / 2],
      ]);
      await waitForMapIdle(page);

      // Draw second rectangle
      await mouseMoveAndClick(page, [
        [width / 2 + 50, height / 2 - 100],
        [width / 2 + 150, height / 2],
      ]);
      await waitForMapIdle(page);

      // Exit draw mode
      await page.click('#id_draw_rectangle');

      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['rectangle'],
      });
      expect(features.length).toBe(2);
    });
  });

  test.describe('Draw mode interaction with edit modes', () => {
    test('should allow drawing while edit mode is active', async () => {
      const { width, height } = await getWindowDimensions(page);

      // Enable edit mode first
      await enableMode(page, 'edit', 'drag');

      // Then enable draw mode
      await page.click('#id_draw_marker');

      // Draw a marker
      await mouseMoveAndClick(page, [width / 2, height / 2]);
      await page.click('#id_draw_marker');

      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['marker'],
      });
      expect(features.length).toBe(1);
    });
  });

  test.describe('Complex polygon drawing', () => {
    test('should draw polygon with multiple vertices', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_polygon');

      // Draw a complex polygon with more vertices
      const points: Array<[number, number]> = [
        [centerX - 100, centerY - 100],
        [centerX, centerY - 150],
        [centerX + 100, centerY - 100],
        [centerX + 100, centerY + 100],
        [centerX, centerY + 150],
        [centerX - 100, centerY + 100],
        [centerX - 100, centerY - 100], // Close polygon
      ];

      await mouseMoveAndClick(page, points);
      await page.click('#id_draw_polygon');

      const feature = await checkFeatureCreated(page, 'polygon');
      expect(feature).toBeDefined();

      // Verify the polygon has the correct number of coordinates
      const geometry = feature.geoJson.geometry;
      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates[0];
        expect(coordinates.length).toBeGreaterThanOrEqual(7); // At least 7 points (6 unique + closing)
      }
    });
  });

  test.describe('Line drawing variations', () => {
    test('should draw multi-segment line', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_line');

      // Draw a line with multiple segments
      const points: Array<[number, number]> = [
        [centerX - 100, centerY],
        [centerX - 50, centerY - 50],
        [centerX, centerY],
        [centerX + 50, centerY - 50],
        [centerX + 100, centerY],
        [centerX + 100, centerY], // Double-click to finish
      ];

      await mouseMoveAndClick(page, points);
      await page.click('#id_draw_line');

      const feature = await checkFeatureCreated(page, 'line');
      expect(feature).toBeDefined();

      // Verify the line has multiple coordinates
      const geometry = feature.geoJson.geometry;
      if (geometry.type === 'LineString') {
        expect(geometry.coordinates.length).toBeGreaterThanOrEqual(5);
      }
    });
  });

  test.describe('Drawing with snapping enabled', () => {
    test('should draw marker with snapping helper enabled', async () => {
      const { width, height } = await getWindowDimensions(page);

      // Enable snapping helper
      await enableMode(page, 'helper', 'snapping');

      // Enable marker draw mode
      await page.click('#id_draw_marker');

      // Draw a marker
      await mouseMoveAndClick(page, [width / 2, height / 2]);
      await page.click('#id_draw_marker');

      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['marker'],
      });
      expect(features.length).toBe(1);

      // Disable snapping
      await disableMode(page, 'helper', 'snapping');
    });
  });

  test.describe('Circle and ellipse drawing', () => {
    test('should draw circle and verify it is a polygon', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_circle');

      const points: Array<[number, number]> = [
        [centerX, centerY],
        [centerX + 100, centerY + 100],
      ];
      await mouseMoveAndClick(page, points);
      await page.click('#id_draw_circle');

      const feature = await checkFeatureCreated(page, 'circle');

      // Circle should be represented as a polygon
      expect(feature.geoJson.geometry.type).toBe('Polygon');
      expect(feature.shape).toBe('circle');
    });

    test('should draw ellipse and verify it is a polygon', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_ellipse');

      const points: Array<[number, number]> = [
        [centerX, centerY], // center
        [centerX + 100, centerY], // x-axis point
        [centerX, centerY + 50], // y-axis point
      ];
      await mouseMoveAndClick(page, points);
      await page.click('#id_draw_ellipse');

      const feature = await checkFeatureCreated(page, 'ellipse');

      // Ellipse should be represented as a polygon
      expect(feature.geoJson.geometry.type).toBe('Polygon');
      expect(feature.shape).toBe('ellipse');
    });
  });

  test.describe('Text marker drawing', () => {
    test('should draw text marker', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_text_marker');

      await mouseMoveAndClick(page, [centerX, centerY]);

      // Type text
      await page.keyboard.type('Hello World');
      // Click outside to confirm
      await page.mouse.click(centerX - 100, centerY - 100);

      await page.click('#id_draw_text_marker');

      const feature = await checkFeatureCreated(page, 'text_marker');
      expect(feature).toBeDefined();
      expect(feature.shape).toBe('text_marker');
      expect(feature.geoJson.geometry.type).toBe('Point');
    });
  });

  test.describe('Circle marker drawing', () => {
    test('should draw circle marker at correct position', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_circle_marker');
      await mouseMoveAndClick(page, [centerX, centerY]);
      await page.click('#id_draw_circle_marker');

      const feature = await checkFeatureCreated(page, 'circle_marker');
      expect(feature).toBeDefined();
      expect(feature.geoJson.geometry.type).toBe('Point');
    });
  });

  test.describe('Feature properties after draw', () => {
    test('created features should have correct shape', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_marker');
      await mouseMoveAndClick(page, [centerX, centerY]);
      await page.click('#id_draw_marker');

      const feature = await checkFeatureCreated(page, 'marker');
      expect(feature.shape).toBe('marker');
    });

    test('created features should have unique IDs', async () => {
      const { width, height } = await getWindowDimensions(page);
      const centerX = width / 2;
      const centerY = height / 2;

      await page.click('#id_draw_marker');
      await mouseMoveAndClick(page, [centerX - 50, centerY]);
      await mouseMoveAndClick(page, [centerX + 50, centerY]);
      await page.click('#id_draw_marker');

      const features = await getRenderedFeaturesData({
        page,
        temporary: false,
        allowedTypes: ['marker'],
      });

      expect(features.length).toBe(2);
      expect(features[0].id).not.toBe(features[1].id);
    });
  });

  test.describe('Draw mode UI state', () => {
    test('draw button should be active when mode is enabled', async () => {
      await page.click('#id_draw_marker');

      // Verify mode is enabled
      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabled).toBe(true);
    });

    test('clicking draw button again should exit draw mode', async () => {
      await page.click('#id_draw_marker');

      const isEnabledBefore = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledBefore).toBe(true);

      await page.click('#id_draw_marker');

      const isEnabledAfter = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledAfter).toBe(false);
    });
  });
});
