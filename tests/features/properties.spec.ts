import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman, waitForMapIdle } from '@tests/utils/basic.ts';
import type { GeoJsonImportFeature } from '@/types';

test.describe('Feature Properties Management', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test.describe('updateProperties()', () => {
    test('should add new properties to a feature', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-1',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Update properties
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-1');
        if (!fd) return null;

        fd.updateProperties({ color: 'red', size: 10, name: 'Test Marker' });

        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.color).toBe('red');
      expect(result!.size).toBe(10);
      expect(result!.name).toBe('Test Marker');

      // Wait for MapLibre to commit data and verify internal state is consistent
      await waitForMapIdle(page);
      const verifyResult = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-1');
        if (!fd) return null;
        return fd.getGeoJson().properties;
      });

      expect(verifyResult).not.toBeNull();
      expect(verifyResult!.color).toBe('red');
      expect(verifyResult!.size).toBe(10);
      expect(verifyResult!.name).toBe('Test Marker');
    });

    test('should merge with existing properties', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-2',
        type: 'Feature',
        properties: { shape: 'marker', existingProp: 'keep-me' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Update with new property, existing should remain
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-2');
        if (!fd) return null;

        fd.updateProperties({ newProp: 'added' });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.existingProp).toBe('keep-me');
      expect(result!.newProp).toBe('added');
    });

    test('should delete properties when set to undefined', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-3',
        type: 'Feature',
        properties: { shape: 'marker', toDelete: 'remove-me', toKeep: 'keep-me' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Delete property by setting to undefined
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-3');
        if (!fd) return null;

        fd.updateProperties({ toDelete: undefined });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.toDelete).toBeUndefined();
      expect(result!.toKeep).toBe('keep-me');

      // Verify internal state after MapLibre commits
      await waitForMapIdle(page);
      const verifyResult = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-3');
        if (!fd) return null;
        return fd.getGeoJson().properties;
      });

      expect(verifyResult).not.toBeNull();
      expect(verifyResult!.toDelete).toBeUndefined();
      expect(verifyResult!.toKeep).toBe('keep-me');
    });

    test('should handle mixed updates and deletions', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-4',
        type: 'Feature',
        properties: { shape: 'marker', a: 1, b: 2, c: 3 },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Mix of updates and deletions
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-4');
        if (!fd) return null;

        fd.updateProperties({
          a: 100, // update
          b: undefined, // delete
          d: 'new', // add
        });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.a).toBe(100);
      expect(result!.b).toBeUndefined();
      expect(result!.c).toBe(3);
      expect(result!.d).toBe('new');
    });

    test('should protect gm_ properties from modification', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-5',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Try to modify protected properties
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'props-test-5');
        if (!fd) return null;

        const beforeId = fd.id; // Use id getter
        const beforeShape = fd.shape; // Use the shape getter

        fd.updateProperties({
          gm_shape: 'polygon', // Should be ignored
          gm_id: 'hacked-id', // Should be ignored
          customProp: 'allowed',
        });

        const afterId = fd.id;
        const afterShape = fd.shape;

        return {
          beforeId,
          afterId,
          beforeShape,
          afterShape,
          customProp: fd.getGeoJson().properties.customProp,
        };
      });

      expect(result).not.toBeNull();
      expect(result!.beforeId).toBe(result!.afterId); // id unchanged
      expect(result!.beforeId).toBe('props-test-5');
      expect(result!.beforeShape).toBe(result!.afterShape); // shape unchanged
      expect(result!.beforeShape).toBe('marker');
      expect(result!.customProp).toBe('allowed'); // custom prop was set
    });

    test('should not cause MapLibre encoding errors when deleting properties', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'props-test-encoding',
        type: 'Feature',
        properties: { shape: 'marker', willDelete: 'value' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // This should not throw "unknown feature value" error
      const errorOccurred = await page.evaluate(async () => {
        try {
          const fd = window.geoman.features.get('gm_main', 'props-test-encoding');
          if (!fd) return 'feature not found';

          fd.updateProperties({ willDelete: undefined });

          // Wait a bit for any async errors
          await new Promise((resolve) => setTimeout(resolve, 100));
          return null;
        } catch (e) {
          return (e as Error).message;
        }
      });

      expect(errorOccurred).toBeNull();
    });
  });

  test.describe('setProperties()', () => {
    test('should replace all custom properties', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'set-props-test-1',
        type: 'Feature',
        properties: { shape: 'marker', oldProp1: 'old1', oldProp2: 'old2' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      // Replace all properties
      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'set-props-test-1');
        if (!fd) return null;

        fd.setProperties({ newProp: 'new-value' });

        return {
          properties: fd.getGeoJson().properties,
          shape: fd.shape,
          id: fd.id,
        };
      });

      expect(result).not.toBeNull();
      expect(result!.properties.oldProp1).toBeUndefined();
      expect(result!.properties.oldProp2).toBeUndefined();
      expect(result!.properties.newProp).toBe('new-value');
      // gm_ properties should be preserved (check via getters)
      expect(result!.shape).toBe('marker');
      expect(result!.id).toBe('set-props-test-1');
    });

    test('should preserve gm_ properties when replacing', async () => {
      const circleFeature: GeoJsonImportFeature = {
        id: 'set-props-test-2',
        type: 'Feature',
        properties: {
          shape: 'circle',
          customProp: 'will-be-replaced',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 51],
              [0.01, 51],
              [0.01, 51.01],
              [0, 51.01],
              [0, 51],
            ],
          ],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, circleFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'set-props-test-2');
        if (!fd) return null;

        fd.setProperties({ brand: 'new' });

        return {
          brand: fd.getGeoJson().properties.brand,
          customProp: fd.getGeoJson().properties.customProp,
          shape: fd.shape,
          id: fd.id,
        };
      });

      expect(result).not.toBeNull();
      expect(result!.brand).toBe('new');
      expect(result!.customProp).toBeUndefined();
      expect(result!.shape).toBe('circle');
      expect(result!.id).toBe('set-props-test-2');
    });

    test('should update MapLibre source correctly', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'set-props-test-3',
        type: 'Feature',
        properties: { shape: 'marker', oldProp: 'old' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'set-props-test-3');
        fd?.setProperties({ replaced: true });
      });

      // Wait for MapLibre to commit and verify internal state
      await waitForMapIdle(page);

      const verifyResult = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'set-props-test-3');
        if (!fd) return null;
        return fd.getGeoJson().properties;
      });

      expect(verifyResult).not.toBeNull();
      expect(verifyResult!.replaced).toBe(true);
      expect(verifyResult!.oldProp).toBeUndefined();
    });

    test('should ignore undefined values in input', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'set-props-test-4',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'set-props-test-4');
        if (!fd) return null;

        fd.setProperties({ validProp: 'yes', invalidProp: undefined });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.validProp).toBe('yes');
      expect(result!.invalidProp).toBeUndefined();
      expect('invalidProp' in result!).toBe(false);
    });
  });

  test.describe('Deprecated methods (backward compatibility)', () => {
    test('updateGeoJsonCustomProperties should still work', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'deprecated-test-1',
        type: 'Feature',
        properties: { shape: 'marker', existingProp: 'keep' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'deprecated-test-1');
        if (!fd) return null;

        // Using deprecated method
        fd.updateGeoJsonCustomProperties({ newProp: 'added' });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.existingProp).toBe('keep');
      expect(result!.newProp).toBe('added');
    });

    test('setGeoJsonCustomProperties should still work', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'deprecated-test-2',
        type: 'Feature',
        properties: { shape: 'marker', oldProp: 'remove' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'deprecated-test-2');
        if (!fd) return null;

        // Using deprecated method
        fd.setGeoJsonCustomProperties({ replaced: true });
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.oldProp).toBeUndefined();
      expect(result!.replaced).toBe(true);
    });

    test('deleteGeoJsonCustomProperties should still work', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'deprecated-test-3',
        type: 'Feature',
        properties: { shape: 'marker', toDelete: 'bye', toKeep: 'stay' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'deprecated-test-3');
        if (!fd) return null;

        // Using deprecated method
        fd.deleteGeoJsonCustomProperties(['toDelete']);
        return fd.getGeoJson().properties;
      });

      expect(result).not.toBeNull();
      expect(result!.toDelete).toBeUndefined();
      expect(result!.toKeep).toBe('stay');
    });
  });

  test.describe('updateGeometry()', () => {
    test('should update point geometry', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'geom-test-1',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const newCoords = [10, 52];
      const result = await page.evaluate((coords) => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-1');
        if (!fd) return null;

        fd.updateGeometry({ type: 'Point', coordinates: coords });

        return fd.getGeoJson().geometry;
      }, newCoords);

      expect(result).not.toBeNull();
      expect(result!.type).toBe('Point');
      expect(result!.coordinates).toEqual(newCoords);
    });

    test('should update polygon geometry', async () => {
      const polygonFeature: GeoJsonImportFeature = {
        id: 'geom-test-2',
        type: 'Feature',
        properties: { shape: 'polygon' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, polygonFeature);

      const newCoords = [
        [
          [10, 10],
          [20, 10],
          [20, 20],
          [10, 20],
          [10, 10],
        ],
      ];

      const result = await page.evaluate((coords) => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-2');
        if (!fd) return null;

        fd.updateGeometry({ type: 'Polygon', coordinates: coords });

        return fd.getGeoJson().geometry;
      }, newCoords);

      expect(result).not.toBeNull();
      expect(result!.type).toBe('Polygon');
      expect(result!.coordinates).toEqual(newCoords);
    });

    test('should preserve properties when updating geometry', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'geom-test-3',
        type: 'Feature',
        properties: { shape: 'marker', customProp: 'keep-me' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-3');
        if (!fd) return null;

        fd.updateGeometry({ type: 'Point', coordinates: [5, 55] });

        return {
          geometry: fd.getGeoJson().geometry,
          customProp: fd.getGeoJson().properties.customProp,
          shape: fd.shape,
        };
      });

      expect(result).not.toBeNull();
      expect(result!.geometry.coordinates).toEqual([5, 55]);
      expect(result!.customProp).toBe('keep-me');
      expect(result!.shape).toBe('marker');
    });

    test('should update internal state and be reflected after MapLibre commits', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'geom-test-4',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-4');
        fd?.updateGeometry({ type: 'Point', coordinates: [15, 60] });
      });

      // Wait for MapLibre to commit
      await waitForMapIdle(page);

      const verifyResult = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-4');
        if (!fd) return null;
        return fd.getGeoJson().geometry;
      });

      expect(verifyResult).not.toBeNull();
      expect(verifyResult!.coordinates).toEqual([15, 60]);
    });

    test('deprecated updateGeoJsonGeometry should still work', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'geom-test-deprecated',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate((feature) => {
        window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const result = await page.evaluate(() => {
        const fd = window.geoman.features.get('gm_main', 'geom-test-deprecated');
        if (!fd) return null;

        // Using deprecated method
        fd.updateGeoJsonGeometry({ type: 'Point', coordinates: [7, 53] });

        return fd.getGeoJson().geometry;
      });

      expect(result).not.toBeNull();
      expect(result!.coordinates).toEqual([7, 53]);
    });
  });
});
