import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman, waitForMapIdle } from '@tests/utils/basic.ts';
import type { GeoJsonImportFeature } from '@/types';

test.describe('Lifecycle - Destroy and Reinit', () => {
  // Run tests serially to avoid interference between tests that destroy/reinit Geoman
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test.describe('destroy() cleanup', () => {
    test('should properly destroy Geoman instance', async () => {
      const result = await page.evaluate(async () => {
        const geoman = window.geoman;
        const mapInstance = geoman.mapAdapter.getMapInstance();

        // Verify Geoman is attached to map
        const hasGmBefore = 'gm' in mapInstance;

        // Destroy
        await geoman.destroy();

        // Verify Geoman is detached from map
        const hasGmAfter = 'gm' in mapInstance;
        const isDestroyed = geoman.destroyed;

        return { hasGmBefore, hasGmAfter, isDestroyed };
      });

      expect(result.hasGmBefore).toBe(true);
      expect(result.hasGmAfter).toBe(false);
      expect(result.isDestroyed).toBe(true);
    });

    test('should remove sources when removeSources: true', async () => {
      // First add some features
      const markerFeature: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await waitForMapIdle(page);

      const result = await page.evaluate(async () => {
        const geoman = window.geoman;
        const mapInstance = window.mapInstance;

        // Check sources exist before destroy
        const hasMainSourceBefore = !!mapInstance.getSource('gm_main');
        const hasTemporarySourceBefore = !!mapInstance.getSource('gm_temporary');

        // Destroy with removeSources: true
        await geoman.destroy({ removeSources: true });

        // Check sources after destroy
        const hasMainSourceAfter = !!mapInstance.getSource('gm_main');
        const hasTemporarySourceAfter = !!mapInstance.getSource('gm_temporary');

        return {
          hasMainSourceBefore,
          hasTemporarySourceBefore,
          hasMainSourceAfter,
          hasTemporarySourceAfter,
        };
      });

      expect(result.hasMainSourceBefore).toBe(true);
      expect(result.hasTemporarySourceBefore).toBe(true);
      expect(result.hasMainSourceAfter).toBe(false);
      expect(result.hasTemporarySourceAfter).toBe(false);
    });

    test('should preserve sources when removeSources: false', async () => {
      // First add some features
      const markerFeature: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await waitForMapIdle(page);

      const result = await page.evaluate(async () => {
        const geoman = window.geoman;
        const mapInstance = window.mapInstance;

        // Check sources exist before destroy
        const hasMainSourceBefore = !!mapInstance.getSource('gm_main');

        // Destroy with removeSources: false (default)
        await geoman.destroy({ removeSources: false });

        // Check sources after destroy
        const hasMainSourceAfter = !!mapInstance.getSource('gm_main');

        return {
          hasMainSourceBefore,
          hasMainSourceAfter,
        };
      });

      expect(result.hasMainSourceBefore).toBe(true);
      expect(result.hasMainSourceAfter).toBe(true);
    });

    test('should default to removeSources: false', async () => {
      // First add some features
      const markerFeature: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await waitForMapIdle(page);

      const result = await page.evaluate(async () => {
        const geoman = window.geoman;
        const mapInstance = window.mapInstance;

        // Check sources exist before destroy
        const hasMainSourceBefore = !!mapInstance.getSource('gm_main');

        // Destroy without options (should default to removeSources: false)
        await geoman.destroy();

        // Check sources after destroy
        const hasMainSourceAfter = !!mapInstance.getSource('gm_main');

        return {
          hasMainSourceBefore,
          hasMainSourceAfter,
        };
      });

      expect(result.hasMainSourceBefore).toBe(true);
      expect(result.hasMainSourceAfter).toBe(true);
    });
  });

  test.describe('reinit after destroy', () => {
    test('should reinit without errors after destroy with removeSources: true', async () => {
      // Add a feature first
      const markerFeature: GeoJsonImportFeature = {
        id: 'test-marker',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await waitForMapIdle(page);

      // Destroy and reinit
      await page.evaluate(async () => {
        const mapInstance = window.mapInstance;

        // Destroy with removeSources
        await window.geoman.destroy({ removeSources: true });

        // Reinit using the exposed GeomanClass
        const newGeoman = new window.GeomanClass(mapInstance, {});
        window.geoman = newGeoman;
      });

      // Wait for the new Geoman instance to load
      await waitForGeoman(page);

      const result = await page.evaluate(() => {
        const mapInstance = window.mapInstance;
        return {
          loaded: window.geoman.loaded,
          destroyed: window.geoman.destroyed,
          hasMainSource: !!mapInstance.getSource('gm_main'),
        };
      });

      expect(result.loaded).toBe(true);
      expect(result.destroyed).toBe(false);
      expect(result.hasMainSource).toBe(true);
    });

    test('should reinit without errors after destroy with removeSources: false', async () => {
      // Add a feature first
      const markerFeature: GeoJsonImportFeature = {
        id: 'persistent-marker',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await waitForMapIdle(page);

      // Destroy and reinit
      await page.evaluate(async () => {
        const mapInstance = window.mapInstance;

        // Destroy without removing sources
        await window.geoman.destroy({ removeSources: false });

        // Reinit using the exposed GeomanClass
        const newGeoman = new window.GeomanClass(mapInstance, {});
        window.geoman = newGeoman;
      });

      // Wait for the new Geoman instance to load
      await waitForGeoman(page);

      const result = await page.evaluate(() => {
        const mapInstance = window.mapInstance;
        return {
          loaded: window.geoman.loaded,
          destroyed: window.geoman.destroyed,
          hasMainSource: !!mapInstance.getSource('gm_main'),
        };
      });

      expect(result.loaded).toBe(true);
      expect(result.destroyed).toBe(false);
      expect(result.hasMainSource).toBe(true);
    });
  });

  test.describe('multiple destroy/reinit cycles', () => {
    test('should handle multiple destroy/reinit cycles', async () => {
      const cycles = 3;
      const errors: string[] = [];

      for (let i = 0; i < cycles; i++) {
        try {
          // Add a feature
          await page.evaluate(async (idx) => {
            await window.geoman.features.importGeoJsonFeature({
              type: 'Feature',
              properties: { shape: 'marker' },
              geometry: { type: 'Point', coordinates: [idx, 51] },
            });
          }, i);

          await waitForMapIdle(page);

          // Destroy
          await page.evaluate(async () => {
            await window.geoman.destroy({ removeSources: true });
          });

          // Reinit
          await page.evaluate(() => {
            const mapInstance = window.mapInstance;
            const newGeoman = new window.GeomanClass(mapInstance, {});
            window.geoman = newGeoman;
          });

          // Wait for the new Geoman instance to load
          await waitForGeoman(page);
        } catch (e) {
          errors.push(`Cycle ${i}: ${(e as Error).message}`);
        }
      }

      const finalLoaded = await page.evaluate(() => window.geoman.loaded);

      expect(errors).toHaveLength(0);
      expect(finalLoaded).toBe(true);
    });
  });
});
