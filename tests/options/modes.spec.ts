import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman, waitForMapIdle, enableMode, disableMode } from '@tests/utils/basic.ts';
import type { ModeName } from '@/types';

test.describe('GmOptions - Mode Management', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test.describe('enableMode', () => {
    test('should enable draw mode', async () => {
      await enableMode(page, 'draw', 'marker');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });

      expect(isEnabled).toBe(true);
    });

    test('should enable edit mode', async () => {
      await enableMode(page, 'edit', 'drag');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('edit', 'drag');
      });

      expect(isEnabled).toBe(true);
    });

    test('should enable helper mode', async () => {
      await enableMode(page, 'helper', 'snapping');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('helper', 'snapping');
      });

      expect(isEnabled).toBe(true);
    });

    test('should not re-enable already enabled mode', async () => {
      await enableMode(page, 'draw', 'marker');

      // Try to enable again
      await page.evaluate(() => {
        window.geoman.options.enableMode('draw', 'marker');
      });

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });

      expect(isEnabled).toBe(true);
    });
  });

  test.describe('disableMode', () => {
    test('should disable draw mode', async () => {
      await enableMode(page, 'draw', 'marker');
      await disableMode(page, 'draw', 'marker');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });

      expect(isEnabled).toBe(false);
    });

    test('should disable edit mode', async () => {
      await enableMode(page, 'edit', 'drag');
      await disableMode(page, 'edit', 'drag');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('edit', 'drag');
      });

      expect(isEnabled).toBe(false);
    });

    test('should disable helper mode', async () => {
      await enableMode(page, 'helper', 'snapping');
      await disableMode(page, 'helper', 'snapping');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('helper', 'snapping');
      });

      expect(isEnabled).toBe(false);
    });

    test('should handle disabling non-enabled mode gracefully', async () => {
      // Try to disable mode that's not enabled
      const isEnabledBefore = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledBefore).toBe(false);

      await page.evaluate(() => {
        window.geoman.options.disableMode('draw', 'marker');
      });

      const isEnabledAfter = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledAfter).toBe(false);
    });
  });

  test.describe('toggleMode', () => {
    test('should toggle mode from off to on', async () => {
      const isEnabledBefore = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledBefore).toBe(false);

      await page.evaluate(() => {
        window.geoman.options.toggleMode('draw', 'marker');
      });
      await waitForMapIdle(page);

      const isEnabledAfter = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabledAfter).toBe(true);
    });

    test('should toggle mode from on to off', async () => {
      await enableMode(page, 'draw', 'marker');

      await page.evaluate(() => {
        window.geoman.options.toggleMode('draw', 'marker');
      });
      await waitForMapIdle(page);

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabled).toBe(false);
    });
  });

  test.describe('isModeEnabled', () => {
    test('should return false for non-enabled mode', async () => {
      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabled).toBe(false);
    });

    test('should return true for enabled mode', async () => {
      await enableMode(page, 'draw', 'marker');

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });
      expect(isEnabled).toBe(true);
    });
  });

  test.describe('isModeAvailable', () => {
    test('should return true for available draw modes', async () => {
      const drawModes = ['marker', 'circle_marker', 'text_marker', 'line', 'polygon', 'rectangle', 'circle', 'ellipse'];

      for (const mode of drawModes) {
        const isAvailable = await page.evaluate((modeName) => {
          return window.geoman.options.isModeAvailable('draw', modeName as ModeName);
        }, mode);

        expect(isAvailable, `Draw mode ${mode} should be available`).toBe(true);
      }
    });

    test('should return true for available edit modes', async () => {
      const editModes = ['drag', 'change', 'rotate', 'cut', 'delete'];

      for (const mode of editModes) {
        const isAvailable = await page.evaluate((modeName) => {
          return window.geoman.options.isModeAvailable('edit', modeName as ModeName);
        }, mode);

        expect(isAvailable, `Edit mode ${mode} should be available`).toBe(true);
      }
    });

    test('should return true for available helper modes', async () => {
      const helperModes = ['snapping', 'shape_markers'];

      for (const mode of helperModes) {
        const isAvailable = await page.evaluate((modeName) => {
          return window.geoman.options.isModeAvailable('helper', modeName as ModeName);
        }, mode);

        expect(isAvailable, `Helper mode ${mode} should be available`).toBe(true);
      }
    });

    test('should return false for non-existent mode', async () => {
      const isAvailable = await page.evaluate(() => {
        return window.geoman.options.isModeAvailable('draw', 'nonexistent' as ModeName);
      });
      expect(isAvailable).toBe(false);
    });
  });

  test.describe('getControlOptions', () => {
    test('should return control options for valid mode', async () => {
      const options = await page.evaluate(() => {
        const opts = window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'marker',
        });
        return opts ? { active: opts.active, uiEnabled: opts.uiEnabled } : null;
      });

      expect(options).not.toBeNull();
      expect(options).toHaveProperty('active');
      expect(options).toHaveProperty('uiEnabled');
    });

    test('should return null for invalid mode', async () => {
      const options = await page.evaluate(() => {
        return window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'nonexistent' as ModeName,
        });
      });

      expect(options).toBeNull();
    });
  });

  test.describe('Multiple modes', () => {
    test('should allow multiple helper modes to be enabled simultaneously', async () => {
      await enableMode(page, 'helper', 'snapping');
      await enableMode(page, 'helper', 'shape_markers');

      const results = await page.evaluate(() => {
        return {
          snapping: window.geoman.options.isModeEnabled('helper', 'snapping'),
          shape_markers: window.geoman.options.isModeEnabled('helper', 'shape_markers'),
        };
      });

      expect(results.snapping).toBe(true);
      expect(results.shape_markers).toBe(true);
    });

    test('edit mode can be enabled independently', async () => {
      await enableMode(page, 'edit', 'drag');

      const isDragEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('edit', 'drag');
      });

      expect(isDragEnabled).toBe(true);
    });

    test('draw mode can be enabled independently', async () => {
      await enableMode(page, 'draw', 'marker');

      const isMarkerEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('draw', 'marker');
      });

      expect(isMarkerEnabled).toBe(true);
    });
  });

  test.describe('Mode switching', () => {
    test('should switch between draw modes', async () => {
      await enableMode(page, 'draw', 'marker');
      expect(await page.evaluate(() => window.geoman.options.isModeEnabled('draw', 'marker'))).toBe(true);

      await disableMode(page, 'draw', 'marker');
      await enableMode(page, 'draw', 'line');

      const results = await page.evaluate(() => ({
        marker: window.geoman.options.isModeEnabled('draw', 'marker'),
        line: window.geoman.options.isModeEnabled('draw', 'line'),
      }));

      expect(results.marker).toBe(false);
      expect(results.line).toBe(true);
    });
  });

  test.describe('Control options state', () => {
    test('should update control active state when mode is enabled', async () => {
      const optionsBefore = await page.evaluate(() => {
        const opts = window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'marker',
        });
        return opts?.active;
      });
      expect(optionsBefore).toBe(false);

      await enableMode(page, 'draw', 'marker');

      const optionsAfter = await page.evaluate(() => {
        const opts = window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'marker',
        });
        return opts?.active;
      });
      expect(optionsAfter).toBe(true);
    });

    test('should update control active state when mode is disabled', async () => {
      await enableMode(page, 'draw', 'marker');

      const optionsBefore = await page.evaluate(() => {
        const opts = window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'marker',
        });
        return opts?.active;
      });
      expect(optionsBefore).toBe(true);

      await disableMode(page, 'draw', 'marker');

      const optionsAfter = await page.evaluate(() => {
        const opts = window.geoman.options.getControlOptions({
          modeType: 'draw',
          modeName: 'marker',
        });
        return opts?.active;
      });
      expect(optionsAfter).toBe(false);
    });
  });
});
