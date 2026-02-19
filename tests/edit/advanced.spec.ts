import test, { expect, type Page } from '@playwright/test';
import {
  configurePageTimeouts,
  dragAndDrop,
  enableMode,
  disableMode,
  waitForGeoman,
  waitForMapIdle,
} from '@tests/utils/basic.ts';
import {
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
  waitForRenderedFeatureData,
  getFeatureMarkersData,
  waitForFeatureRemoval,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import { getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import type { LngLatTuple } from '@/types';
import centroid from '@turf/centroid';

test.describe('Edit Mode - Advanced Scenarios', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await configurePageTimeouts(page);
    await page.goto('/');
    await waitForGeoman(page);
    await expect(page).toHaveTitle('Geoman plugin');

    const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
    expect(geoJsonFeatures).not.toBeNull();

    if (geoJsonFeatures) {
      await loadGeoJsonFeatures({ page, geoJsonFeatures });
    }
  });

  test.describe('Edit mode activation', () => {
    test('should enable drag mode', async () => {
      await enableMode(page, 'edit', 'drag');

      const isEnabled = await page.evaluate(() =>
        window.geoman.options.isModeEnabled('edit', 'drag'),
      );

      expect(isEnabled).toBe(true);
    });

    test('should enable change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const isEnabled = await page.evaluate(() =>
        window.geoman.options.isModeEnabled('edit', 'change'),
      );

      expect(isEnabled).toBe(true);
    });

    test('should enable rotate mode', async () => {
      await enableMode(page, 'edit', 'rotate');

      const isEnabled = await page.evaluate(() =>
        window.geoman.options.isModeEnabled('edit', 'rotate'),
      );

      expect(isEnabled).toBe(true);
    });
  });

  test.describe('Edit mode with shape markers', () => {
    test('should show vertex markers when change mode is enabled', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const lineFeature = features.find((f) => f.shape === 'line');

      if (lineFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: lineFeature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        expect(markers.length).toBeGreaterThan(0);
      }
    });

    test('should remove vertex markers when change mode is disabled', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const lineFeature = features.find((f) => f.shape === 'line');

      if (lineFeature) {
        // Verify markers exist
        let markers = await getFeatureMarkersData({
          page,
          featureId: lineFeature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });
        expect(markers.length).toBeGreaterThan(0);

        // Disable change mode
        await disableMode(page, 'edit', 'change');

        // Verify markers are removed
        markers = await getFeatureMarkersData({
          page,
          featureId: lineFeature.id,
          temporary: false,
        });
        expect(markers.length).toBe(0);
      }
    });
  });

  test.describe('Drag editing', () => {
    test('should drag polygon feature', async () => {
      const dX = -30;
      const dY = -30;

      await enableMode(page, 'edit', 'drag');
      const features = await getRenderedFeaturesData({ page, temporary: false });
      const polygonFeature = features.find((f) => f.shape === 'polygon');

      if (polygonFeature) {
        const initialLngLat = getGeoJsonFirstPoint(polygonFeature.geoJson);
        expect(initialLngLat).not.toBeNull();

        if (initialLngLat) {
          const initialPoint = await getScreenCoordinatesByLngLat({
            page,
            position: initialLngLat,
          });
          expect(initialPoint).not.toBeNull();

          if (initialPoint) {
            const targetPoint: [number, number] = [initialPoint[0] + dX, initialPoint[1] + dY];
            await dragAndDrop(page, initialPoint, targetPoint);

            const updatedFeature = await waitForRenderedFeatureData({
              page,
              featureId: polygonFeature.id,
              temporary: false,
            });

            expect(updatedFeature).not.toBeNull();
            if (updatedFeature) {
              const newLngLat = getGeoJsonFirstPoint(updatedFeature.geoJson);
              expect(newLngLat).not.toEqual(initialLngLat);
            }
          }
        }
      }
    });

    test('should drag rectangle feature', async () => {
      const dX = 20;
      const dY = 20;

      await enableMode(page, 'edit', 'drag');
      const features = await getRenderedFeaturesData({ page, temporary: false });
      const rectangleFeature = features.find((f) => f.shape === 'rectangle');

      if (rectangleFeature) {
        const initialLngLat = getGeoJsonFirstPoint(rectangleFeature.geoJson);
        expect(initialLngLat).not.toBeNull();

        if (initialLngLat) {
          const initialPoint = await getScreenCoordinatesByLngLat({
            page,
            position: initialLngLat,
          });
          expect(initialPoint).not.toBeNull();

          if (initialPoint) {
            const targetPoint: [number, number] = [initialPoint[0] + dX, initialPoint[1] + dY];
            await dragAndDrop(page, initialPoint, targetPoint);

            const updatedFeature = await waitForRenderedFeatureData({
              page,
              featureId: rectangleFeature.id,
              temporary: false,
            });

            expect(updatedFeature).not.toBeNull();
          }
        }
      }
    });

    test('should drag circle feature by center', async () => {
      const dX = 25;
      const dY = -25;

      await enableMode(page, 'edit', 'drag');
      const features = await getRenderedFeaturesData({ page, temporary: false });
      const circleFeature = features.find((f) => f.shape === 'circle');

      if (circleFeature) {
        const center = centroid(circleFeature.geoJson).geometry.coordinates as LngLatTuple;
        const initialPoint = await getScreenCoordinatesByLngLat({ page, position: center });

        if (initialPoint) {
          const targetPoint: [number, number] = [initialPoint[0] + dX, initialPoint[1] + dY];
          await dragAndDrop(page, initialPoint, targetPoint);

          const updatedFeature = await waitForRenderedFeatureData({
            page,
            featureId: circleFeature.id,
            temporary: false,
          });

          expect(updatedFeature).not.toBeNull();
        }
      }
    });
  });

  test.describe('Delete mode', () => {
    test('should delete feature when clicked in delete mode', async () => {
      await enableMode(page, 'edit', 'delete');

      const featuresBefore = await getRenderedFeaturesData({ page, temporary: false });
      const markerFeature = featuresBefore.find((f) => f.shape === 'marker');
      expect(markerFeature).toBeDefined();

      if (markerFeature) {
        const position = markerFeature.geoJson.geometry.coordinates as LngLatTuple;
        const screenPos = await getScreenCoordinatesByLngLat({ page, position });

        if (screenPos) {
          await page.mouse.click(screenPos[0], screenPos[1]);

          await waitForFeatureRemoval({
            page,
            featureId: markerFeature.id,
            temporary: false,
          });

          const featuresAfter = await getRenderedFeaturesData({ page, temporary: false });
          expect(featuresAfter.length).toBe(featuresBefore.length - 1);
        }
      }
    });

    test('should not delete feature when delete mode is disabled', async () => {
      // Ensure delete mode is disabled
      await disableMode(page, 'edit', 'delete');

      const featuresBefore = await getRenderedFeaturesData({ page, temporary: false });
      const markerFeature = featuresBefore.find((f) => f.shape === 'marker');

      if (markerFeature) {
        const position = markerFeature.geoJson.geometry.coordinates as LngLatTuple;
        const screenPos = await getScreenCoordinatesByLngLat({ page, position });

        if (screenPos) {
          await page.mouse.click(screenPos[0], screenPos[1]);
          await waitForMapIdle(page);

          const featuresAfter = await getRenderedFeaturesData({ page, temporary: false });
          expect(featuresAfter.length).toBe(featuresBefore.length);
        }
      }
    });
  });

  test.describe('Edit mode switching', () => {
    test('should cleanly switch from drag to change mode', async () => {
      await enableMode(page, 'edit', 'drag');
      expect(await page.evaluate(() => window.geoman.options.isModeEnabled('edit', 'drag'))).toBe(
        true,
      );

      await disableMode(page, 'edit', 'drag');
      await enableMode(page, 'edit', 'change');

      const results = await page.evaluate(() => ({
        drag: window.geoman.options.isModeEnabled('edit', 'drag'),
        change: window.geoman.options.isModeEnabled('edit', 'change'),
      }));

      expect(results.drag).toBe(false);
      expect(results.change).toBe(true);
    });

    test('should cleanly switch from change to rotate mode', async () => {
      await enableMode(page, 'edit', 'change');
      await disableMode(page, 'edit', 'change');
      await enableMode(page, 'edit', 'rotate');

      const results = await page.evaluate(() => ({
        change: window.geoman.options.isModeEnabled('edit', 'change'),
        rotate: window.geoman.options.isModeEnabled('edit', 'rotate'),
      }));

      expect(results.change).toBe(false);
      expect(results.rotate).toBe(true);
    });
  });

  test.describe('Edit mode with helpers', () => {
    test('should work with snapping helper during drag', async () => {
      await enableMode(page, 'helper', 'snapping');
      await enableMode(page, 'edit', 'drag');

      const results = await page.evaluate(() => ({
        snapping: window.geoman.options.isModeEnabled('helper', 'snapping'),
        drag: window.geoman.options.isModeEnabled('edit', 'drag'),
      }));

      expect(results.snapping).toBe(true);
      expect(results.drag).toBe(true);
    });

    test('should work with shape_markers helper during change', async () => {
      await enableMode(page, 'edit', 'change');

      // shape_markers should be auto-enabled when change mode is active
      const features = await getRenderedFeaturesData({ page, temporary: false });
      const lineFeature = features.find((f) => f.shape === 'line');

      if (lineFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: lineFeature.id,
          temporary: false,
        });

        expect(markers.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Feature-specific edit behavior', () => {
    test('markers should not have vertex markers in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const markerFeature = features.find((f) => f.shape === 'marker');

      if (markerFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: markerFeature.id,
          temporary: false,
        });

        expect(markers.length).toBe(0);
      }
    });

    test('circle_marker should not have vertex markers in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const circleMarkerFeature = features.find((f) => f.shape === 'circle_marker');

      if (circleMarkerFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: circleMarkerFeature.id,
          temporary: false,
        });

        expect(markers.length).toBe(0);
      }
    });

    test('text_marker should not have vertex markers in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const textMarkerFeature = features.find((f) => f.shape === 'text_marker');

      if (textMarkerFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: textMarkerFeature.id,
          temporary: false,
        });

        expect(markers.length).toBe(0);
      }
    });

    test('line should have vertex markers in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const lineFeature = features.find((f) => f.shape === 'line');

      if (lineFeature) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: lineFeature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        expect(markers.length).toBeGreaterThan(0);
      }
    });

    test('polygon should have vertex and edge markers in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const polygonFeature = features.find((f) => f.shape === 'polygon');

      if (polygonFeature) {
        const vertexMarkers = await getFeatureMarkersData({
          page,
          featureId: polygonFeature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        const edgeMarkers = await getFeatureMarkersData({
          page,
          featureId: polygonFeature.id,
          temporary: false,
          allowedTypes: ['edge'],
        });

        expect(vertexMarkers.length).toBeGreaterThan(0);
        expect(edgeMarkers.length).toBeGreaterThan(0);
      }
    });

    test('circle should have center marker in change mode', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const circleFeature = features.find((f) => f.shape === 'circle');

      if (circleFeature) {
        const centerMarkers = await getFeatureMarkersData({
          page,
          featureId: circleFeature.id,
          temporary: false,
          allowedTypes: ['center'],
        });

        expect(centerMarkers.length).toBe(1);
      }
    });
  });

  test.describe('Edit mode persistence', () => {
    test('edit mode should persist when features are added', async () => {
      await enableMode(page, 'edit', 'change');

      // Add a new feature
      await page.evaluate(async () => {
        await window.geoman.features.importGeoJsonFeature({
          type: 'Feature',
          properties: { shape: 'marker' },
          geometry: { type: 'Point', coordinates: [0.5, 51.5] },
        });
      });
      await waitForMapIdle(page);

      const isEnabled = await page.evaluate(() => {
        return window.geoman.options.isModeEnabled('edit', 'change');
      });

      expect(isEnabled).toBe(true);
    });

    test('edit mode should persist when features are deleted', async () => {
      await enableMode(page, 'edit', 'change');

      const features = await getRenderedFeaturesData({ page, temporary: false });
      const markerFeature = features.find((f) => f.shape === 'marker');

      if (markerFeature) {
        await page.evaluate(async (featureId) => {
          const fd = window.geoman.features.get('gm_main', featureId);
          if (fd) await window.geoman.features.delete(fd);
        }, markerFeature.id);
        await waitForMapIdle(page);

        const isEnabled = await page.evaluate(() => {
          return window.geoman.options.isModeEnabled('edit', 'change');
        });

        expect(isEnabled).toBe(true);
      }
    });
  });
});
