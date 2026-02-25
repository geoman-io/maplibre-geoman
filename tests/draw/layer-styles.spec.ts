import test, { expect } from '@playwright/test';
import { getWindowDimensions, waitForGeoman } from '@tests/utils/basic.ts';

test.describe('Draw Mode - Layer Styles', () => {
  test('marker draw preview should respect gm_temporary icon-opacity', async ({ page }) => {
    await page.goto('/');
    await waitForGeoman(page);

    // Destroy and recreate Geoman with custom temporary marker opacity
    await page.evaluate(async () => {
      const mapInstance = window.mapInstance;
      await window.geoman.destroy({ removeSources: true });

      // Create new Geoman with custom temporary marker opacity
      const GeomanClass = window.GeomanClass;
      window.geoman = new GeomanClass(mapInstance, {
        layerStyles: {
          marker: {
            gm_temporary: [
              {
                type: 'symbol',
                layout: {
                  'icon-image': 'default-marker',
                  'icon-size': 0.18,
                  'icon-allow-overlap': true,
                  'icon-anchor': 'bottom',
                },
                paint: {
                  'icon-opacity': 0.5,
                },
              },
            ],
          },
        },
      });
    });

    await waitForGeoman(page);

    // Get window center
    const { width, height } = await getWindowDimensions(page);
    const centerX = width / 2;
    const centerY = height / 2;

    // Enable marker draw mode
    await page.evaluate(async () => {
      await window.geoman.enableMode('draw', 'marker');
    });

    // Move mouse to trigger the marker pointer to appear
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(100);

    // Check the marker-wrapper element has the correct opacity
    const markerOpacity = await page.evaluate(() => {
      const markerWrapper = document.querySelector('.marker-wrapper');
      if (!markerWrapper) return null;

      const svg = markerWrapper.querySelector('svg');
      if (!svg) return null;

      return svg.style.opacity;
    });

    expect(markerOpacity).toBe('0.5');
  });

  test('marker draw preview should respect gm_temporary icon-size', async ({ page }) => {
    await page.goto('/');
    await waitForGeoman(page);

    // Destroy and recreate Geoman with custom temporary marker size
    await page.evaluate(async () => {
      const mapInstance = window.mapInstance;
      await window.geoman.destroy({ removeSources: true });

      // Create new Geoman with larger icon-size (0.36 = 2x default of 0.18)
      const GeomanClass = window.GeomanClass;
      const gm = new GeomanClass(mapInstance, {
        layerStyles: {
          marker: {
            gm_temporary: [
              {
                type: 'symbol',
                layout: {
                  'icon-image': 'default-marker',
                  'icon-size': 0.36, // 2x the default 0.18
                  'icon-allow-overlap': true,
                  'icon-anchor': 'bottom',
                },
              },
            ],
          },
        },
      });

      window.geoman = gm;
    });

    await waitForGeoman(page);

    // Get window center
    const { width, height } = await getWindowDimensions(page);
    const centerX = width / 2;
    const centerY = height / 2;

    // Enable marker draw mode
    await page.evaluate(async () => {
      await window.geoman.enableMode('draw', 'marker');
    });

    // Move mouse to trigger the marker pointer to appear
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(100);

    // Check the marker-wrapper element has the correct size (72px = 36px * 2)
    const markerSize = await page.evaluate(() => {
      const markerWrapper = document.querySelector('.marker-wrapper');
      if (!markerWrapper) return null;

      const svg = markerWrapper.querySelector('svg');
      if (!svg) return null;

      return {
        width: svg.style.width,
        height: svg.style.height,
      };
    });

    expect(markerSize).toEqual({ width: '72px', height: '72px' });
  });
});
