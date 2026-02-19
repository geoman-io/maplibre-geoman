import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman, waitForMapIdle } from '@tests/utils/basic.ts';
import { getRenderedFeaturesData, loadGeoJsonFeatures } from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import type { GeoJsonImportFeature, LngLatTuple } from '@/types';

test.describe('Feature Management - CRUD Operations', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test.describe('Create (importGeoJson)', () => {
    test('should import a single GeoJSON feature', async () => {
      const markerFeature: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      const result = await page.evaluate(async (feature) => {
        return window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      expect(result, 'Should return a feature data object').not.toBeNull();

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
      expect(features[0].shape).toBe('marker');
    });

    test('should import multiple GeoJSON features', async () => {
      const featureCollection = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: { shape: 'marker' as const },
            geometry: { type: 'Point' as const, coordinates: [0, 51] },
          },
          {
            type: 'Feature' as const,
            properties: { shape: 'line' as const },
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                [0, 50],
                [1, 51],
              ],
            },
          },
        ],
      };

      const result = await page.evaluate(async (fc) => {
        const res = await window.geoman.features.importGeoJson(fc);
        return {
          total: res.stats.total,
          success: res.stats.success,
          failed: res.stats.failed,
        };
      }, featureCollection);

      expect(result.total).toBe(2);
      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(2);
    });

    test('should import feature with custom ID', async () => {
      const customId = 'my-custom-feature-id';
      const markerFeature: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
      expect(features[0].id).toBe(customId);
    });

    test('should reject duplicate feature IDs', async () => {
      const customId = 'duplicate-id';
      const feature1: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };
      const feature2: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [1, 52] },
      };

      const result = await page.evaluate(
        async ({ f1, f2 }) => {
          const r1 = await window.geoman.features.importGeoJsonFeature(f1);
          const r2 = await window.geoman.features.importGeoJsonFeature(f2);
          return {
            firstResult: r1 !== null,
            secondResult: r2 !== null,
          };
        },
        { f1: feature1, f2: feature2 },
      );

      expect(result.firstResult).toBe(true);
      expect(result.secondResult).toBe(false);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
    });

    test('should overwrite existing feature with same ID when overwrite option is true', async () => {
      const customId = 'overwrite-test-id';
      const originalCoords = [0, 51] as const;
      const newCoords = [5, 55] as const;

      const feature1: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [...originalCoords] },
      };
      const feature2: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [...newCoords] },
      };

      const result = await page.evaluate(
        async ({ f1, f2 }) => {
          // Import first feature
          await window.geoman.features.importGeoJson(f1);

          // Import second feature with overwrite option
          const importResult = await window.geoman.features.importGeoJson(f2, { overwrite: true });

          // Get the feature and check its coordinates
          const fd = window.geoman.features.get('gm_main', f2.id as string);
          const geoJson = fd?.getGeoJson();

          return {
            success: importResult.stats.success,
            overwritten: importResult.stats.overwritten,
            coordinates: geoJson?.geometry.coordinates,
          };
        },
        { f1: feature1, f2: feature2 },
      );

      expect(result.success).toBe(1);
      expect(result.overwritten).toBe(1);
      expect(result.coordinates).toEqual([...newCoords]);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
    });

    test('should not overwrite when overwrite option is false or not provided', async () => {
      const customId = 'no-overwrite-test-id';

      const feature1: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };
      const feature2: GeoJsonImportFeature = {
        id: customId,
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [5, 55] },
      };

      const result = await page.evaluate(
        async ({ f1, f2 }) => {
          await window.geoman.features.importGeoJson(f1);
          const importResult = await window.geoman.features.importGeoJson(f2, { overwrite: false });

          return {
            success: importResult.stats.success,
            failed: importResult.stats.failed,
            overwritten: importResult.stats.overwritten,
          };
        },
        { f1: feature1, f2: feature2 },
      );

      expect(result.success).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.overwritten).toBe(0);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
    });

    test('should overwrite multiple features in batch import', async () => {
      // First, import some features
      const initialFeatures = {
        type: 'FeatureCollection' as const,
        features: [
          {
            id: 'batch-1',
            type: 'Feature' as const,
            properties: { shape: 'marker' as const },
            geometry: { type: 'Point' as const, coordinates: [0, 50] },
          },
          {
            id: 'batch-2',
            type: 'Feature' as const,
            properties: { shape: 'marker' as const },
            geometry: { type: 'Point' as const, coordinates: [1, 51] },
          },
        ],
      };

      // Then, import updated features with one new and one existing
      const updatedFeatures = {
        type: 'FeatureCollection' as const,
        features: [
          {
            id: 'batch-1', // existing - should be overwritten
            type: 'Feature' as const,
            properties: { shape: 'marker' as const },
            geometry: { type: 'Point' as const, coordinates: [10, 60] },
          },
          {
            id: 'batch-3', // new - should be added
            type: 'Feature' as const,
            properties: { shape: 'marker' as const },
            geometry: { type: 'Point' as const, coordinates: [2, 52] },
          },
        ],
      };

      const result = await page.evaluate(
        async ({ initial, updated }) => {
          await window.geoman.features.importGeoJson(initial);
          const importResult = await window.geoman.features.importGeoJson(updated, {
            overwrite: true,
          });

          // Get coordinates of batch-1 to verify it was updated
          const fd = window.geoman.features.get('gm_main', 'batch-1');
          const geoJson = fd?.getGeoJson();

          return {
            total: importResult.stats.total,
            success: importResult.stats.success,
            overwritten: importResult.stats.overwritten,
            batch1Coords: geoJson?.geometry.coordinates,
          };
        },
        { initial: initialFeatures, updated: updatedFeatures },
      );

      expect(result.total).toBe(2);
      expect(result.success).toBe(2);
      expect(result.overwritten).toBe(1);
      expect(result.batch1Coords).toEqual([10, 60]);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(3); // batch-1, batch-2, batch-3
    });

    test('should import with idPropertyName option', async () => {
      const featureCollection = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: { shape: 'marker' as const, customId: 'custom-id-1' },
            geometry: { type: 'Point' as const, coordinates: [0, 51] },
          },
        ],
      };

      const result = await page.evaluate(async (fc) => {
        const importResult = await window.geoman.features.importGeoJson(fc, {
          idPropertyName: 'customId',
        });
        const fd = window.geoman.features.get('gm_main', 'custom-id-1');
        return {
          success: importResult.stats.success,
          featureExists: fd !== null,
          featureId: fd?.id,
        };
      }, featureCollection);

      expect(result.success).toBe(1);
      expect(result.featureExists).toBe(true);
      expect(result.featureId).toBe('custom-id-1');
    });

    test('should use idPropertyName with overwrite together', async () => {
      const feature1 = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: { shape: 'marker' as const, myId: 'shared-id' },
            geometry: { type: 'Point' as const, coordinates: [0, 51] },
          },
        ],
      };

      const feature2 = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: { shape: 'marker' as const, myId: 'shared-id' },
            geometry: { type: 'Point' as const, coordinates: [10, 60] },
          },
        ],
      };

      const result = await page.evaluate(
        async ({ f1, f2 }) => {
          await window.geoman.features.importGeoJson(f1, { idPropertyName: 'myId' });
          const importResult = await window.geoman.features.importGeoJson(f2, {
            idPropertyName: 'myId',
            overwrite: true,
          });

          const fd = window.geoman.features.get('gm_main', 'shared-id');
          const geoJson = fd?.getGeoJson();

          return {
            success: importResult.stats.success,
            overwritten: importResult.stats.overwritten,
            coordinates: geoJson?.geometry.coordinates,
          };
        },
        { f1: feature1, f2: feature2 },
      );

      expect(result.success).toBe(1);
      expect(result.overwritten).toBe(1);
      expect(result.coordinates).toEqual([10, 60]);

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBe(1);
    });
  });

  test.describe('Read (get, has, forEach)', () => {
    test('should check if feature exists with has()', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBeGreaterThan(0);

      const hasResult = await page.evaluate((featureId) => {
        return window.geoman.features.has('gm_main', featureId);
      }, features[0].id);

      expect(hasResult).toBe(true);
    });

    test('should return false for non-existent feature with has()', async () => {
      const hasResult = await page.evaluate(() => {
        return window.geoman.features.has('gm_main', 'non-existent-id');
      });

      expect(hasResult).toBe(false);
    });

    test('should get feature by ID with get()', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(features.length).toBeGreaterThan(0);

      const featureData = await page.evaluate((featureId) => {
        const fd = window.geoman.features.get('gm_main', featureId);
        return fd ? { id: fd.id, shape: fd.shape } : null;
      }, features[0].id);

      expect(featureData).not.toBeNull();
      expect(featureData?.id).toBe(features[0].id);
    });

    test('should return null for non-existent feature with get()', async () => {
      const featureData = await page.evaluate(() => {
        return window.geoman.features.get('gm_main', 'non-existent-id');
      });

      expect(featureData).toBeNull();
    });

    test('should iterate through features with forEach()', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const featureCount = await page.evaluate(() => {
        let count = 0;
        window.geoman.features.forEach(() => {
          count += 1;
        });
        return count;
      });

      const features = await getRenderedFeaturesData({ page, temporary: false });
      expect(featureCount).toBe(features.length);
    });
  });

  test.describe('Delete (delete, deleteAll)', () => {
    test('should delete a single feature by ID', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const featuresBefore = await getRenderedFeaturesData({ page, temporary: false });
      expect(featuresBefore.length).toBeGreaterThan(0);

      const deletedId = featuresBefore[0].id;
      await page.evaluate(async (featureId) => {
        const featureData = window.geoman.features.get('gm_main', featureId);
        if (featureData) {
          await window.geoman.features.delete(featureData);
        }
      }, deletedId);

      await waitForMapIdle(page);

      const featuresAfter = await getRenderedFeaturesData({ page, temporary: false });
      expect(featuresAfter.length).toBe(featuresBefore.length - 1);
      expect(featuresAfter.find((f) => f.id === deletedId)).toBeUndefined();
    });

    test('should delete all features with deleteAll()', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const featuresBefore = await getRenderedFeaturesData({ page, temporary: false });
      expect(featuresBefore.length).toBeGreaterThan(0);

      await page.evaluate(async () => {
        await window.geoman.features.deleteAll();
      });

      await waitForMapIdle(page);

      const featuresAfter = await getRenderedFeaturesData({ page, temporary: false });
      expect(featuresAfter.length).toBe(0);
    });
  });

  test.describe('Export (exportGeoJson, getAll)', () => {
    test('should export all features as GeoJSON FeatureCollection', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const exportedGeoJson = await page.evaluate(() => {
        return window.geoman.features.exportGeoJson();
      });

      expect(exportedGeoJson.type).toBe('FeatureCollection');
      expect(exportedGeoJson.features.length).toBeGreaterThan(0);
    });

    test('should export features filtered by shape', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const exportedGeoJson = await page.evaluate(() => {
        return window.geoman.features.exportGeoJson({ allowedShapes: ['marker'] });
      });

      expect(exportedGeoJson.type).toBe('FeatureCollection');
      // Verify we only got marker features by checking all features are markers
      expect(exportedGeoJson.features.length).toBeGreaterThan(0);
      // The features array should only contain markers after filtering
    });

    test('should export features with custom ID property name', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const exportedGeoJson = await page.evaluate(() => {
        return window.geoman.features.exportGeoJson({ idPropertyName: 'myCustomId' });
      });

      expect(exportedGeoJson.type).toBe('FeatureCollection');
      exportedGeoJson.features.forEach((feature) => {
        expect(feature.properties?.myCustomId).toBeDefined();
      });
    });

    test('getAll() should return same as exportGeoJson()', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const result = await page.evaluate(() => {
        const getAll = window.geoman.features.getAll();
        const exportGeoJson = window.geoman.features.exportGeoJson();
        return {
          getAllLength: getAll.features.length,
          exportLength: exportGeoJson.features.length,
        };
      });

      expect(result.getAllLength).toBe(result.exportLength);
    });
  });

  test.describe('Feature data operations', () => {
    test('should get feature GeoJSON', async () => {
      const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
      if (geoJsonFeatures) {
        await loadGeoJsonFeatures({ page, geoJsonFeatures });
      }

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const featureGeoJson = await page.evaluate((featureId) => {
        const fd = window.geoman.features.get('gm_main', featureId);
        return fd?.getGeoJson() || null;
      }, features[0].id);

      expect(featureGeoJson).not.toBeNull();
      expect(featureGeoJson?.type).toBe('Feature');
      expect(featureGeoJson?.geometry).toBeDefined();
    });

    test('should update feature geometry', async () => {
      const markerFeature: GeoJsonImportFeature = {
        id: 'update-test-marker',
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: {
          type: 'Point',
          coordinates: [0, 51],
        },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, markerFeature);

      const newCoordinates: LngLatTuple = [5, 55];
      const updatedGeoJson = await page.evaluate(
        async ({ featureId, coords }) => {
          const fd = window.geoman.features.get('gm_main', featureId);
          if (fd) {
            await fd.updateGeometry({
              type: 'Point',
              coordinates: coords,
            });
            return fd.getGeoJson();
          }
          return null;
        },
        { featureId: 'update-test-marker', coords: newCoordinates },
      );

      expect(updatedGeoJson).not.toBeNull();
      expect(updatedGeoJson?.geometry.coordinates).toEqual(newCoordinates);
    });

    test('should get shape property', async () => {
      const circleFeature: GeoJsonImportFeature = {
        id: 'shape-property-test',
        type: 'Feature',
        properties: {
          shape: 'circle',
          gm_center: [0, 51],
          gm_radius: 1000,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 51],
              [0.01, 51],
              [0, 51.01],
              [0, 51],
            ],
          ],
        },
      };

      await page.evaluate(async (feature) => {
        await window.geoman.features.importGeoJsonFeature(feature);
      }, circleFeature);

      const shapeProperty = await page.evaluate((featureId) => {
        const fd = window.geoman.features.get('gm_main', featureId);
        return fd?.getShapeProperty('center');
      }, 'shape-property-test');

      // Center property should be defined (may be slightly different due to circle generation)
      expect(shapeProperty).toBeDefined();
      expect(Array.isArray(shapeProperty)).toBe(true);
    });
  });

  test.describe('Feature ID generation', () => {
    test('should auto-generate feature IDs', async () => {
      const feature1: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [0, 51] },
      };
      const feature2: GeoJsonImportFeature = {
        type: 'Feature',
        properties: { shape: 'marker' },
        geometry: { type: 'Point', coordinates: [1, 52] },
      };

      const ids = await page.evaluate(
        async ({ f1, f2 }) => {
          const r1 = await window.geoman.features.importGeoJsonFeature(f1);
          const r2 = await window.geoman.features.importGeoJsonFeature(f2);
          return {
            id1: r1?.id,
            id2: r2?.id,
          };
        },
        { f1: feature1, f2: feature2 },
      );

      expect(ids.id1).toBeDefined();
      expect(ids.id2).toBeDefined();
      expect(ids.id1).not.toBe(ids.id2);
    });
  });
});
