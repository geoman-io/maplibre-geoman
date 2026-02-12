import test, { expect, type Page } from '@playwright/test';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';
import { enableMode, disableMode, waitForMapIdle } from '@tests/utils/basic.ts';
import { getRenderedFeaturesData, getFeatureMarkersData } from '@tests/utils/features.ts';
import type { FeatureShape } from '@/types';

test.describe('Shape Markers Helper', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await setupGeomanTest(page, { loadFixture: 'one-shape-of-each-type' });
  });

  test('should create vertex markers when change mode is enabled', async () => {
    // Enable change mode which should trigger shape markers
    await enableMode(page, 'edit', 'change');

    // Get all rendered features
    const features = await getRenderedFeaturesData({ page, temporary: false });
    expect(features.length).toBeGreaterThan(0);

    // Check that features with vertices have vertex markers
    const shapesWithVertexMarkers: Array<FeatureShape> = [
      'line',
      'polygon',
      'rectangle',
      'circle',
      'ellipse',
    ];

    for (const feature of features) {
      if (shapesWithVertexMarkers.includes(feature.shape)) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        expect(
          markers.length,
          `Feature ${feature.shape} should have vertex markers`,
        ).toBeGreaterThan(0);
      }
    }
  });

  test('should create center markers for shapes with center property', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const shapesWithCenterMarkers: Array<FeatureShape> = ['circle', 'ellipse'];

    for (const feature of features) {
      if (shapesWithCenterMarkers.includes(feature.shape)) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
          allowedTypes: ['center'],
        });

        expect(
          markers.length,
          `Feature ${feature.shape} should have a center marker`,
        ).toBeGreaterThan(0);
      }
    }
  });

  test('should create edge markers when change mode is enabled', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    // Edge markers are allowed for line, rectangle, polygon
    const shapesWithEdgeMarkers: Array<FeatureShape> = ['line', 'rectangle', 'polygon'];

    for (const feature of features) {
      if (shapesWithEdgeMarkers.includes(feature.shape)) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
          allowedTypes: ['edge'],
        });

        expect(markers.length, `Feature ${feature.shape} should have edge markers`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  test('should remove markers when edit mode is disabled', async () => {
    // First enable change mode
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const lineFeature = features.find((f) => f.shape === 'line');
    expect(lineFeature, 'Should have a line feature').toBeDefined();

    if (lineFeature) {
      // Verify markers exist
      let markers = await getFeatureMarkersData({
        page,
        featureId: lineFeature.id,
        temporary: false,
      });
      expect(
        markers.length,
        'Line should have markers when change mode is enabled',
      ).toBeGreaterThan(0);

      // Disable change mode
      await disableMode(page, 'edit', 'change');

      // Verify markers are removed
      markers = await getFeatureMarkersData({
        page,
        featureId: lineFeature.id,
        temporary: false,
      });
      expect(markers.length, 'Line should have no markers when change mode is disabled').toBe(0);
    }
  });

  test('should not create markers for marker-type features', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const markerShapes: Array<FeatureShape> = ['marker', 'circle_marker', 'text_marker'];

    for (const feature of features) {
      if (markerShapes.includes(feature.shape)) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
        });

        expect(
          markers.length,
          `Marker feature ${feature.shape} should not have shape markers`,
        ).toBe(0);
      }
    }
  });

  test('should not create markers when drag mode is enabled', async () => {
    await enableMode(page, 'edit', 'drag');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const shapesWithVertexMarkers: Array<FeatureShape> = ['line', 'polygon', 'rectangle'];

    for (const feature of features) {
      if (shapesWithVertexMarkers.includes(feature.shape)) {
        const markers = await getFeatureMarkersData({
          page,
          featureId: feature.id,
          temporary: false,
          allowedTypes: ['vertex'],
        });

        expect(
          markers.length,
          `Feature ${feature.shape} should not have vertex markers in drag mode`,
        ).toBe(0);
      }
    }
  });

  test('should have correct number of vertex markers for circle (4 markers)', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const circleFeature = features.find((f) => f.shape === 'circle');
    expect(circleFeature, 'Should have a circle feature').toBeDefined();

    if (circleFeature) {
      const markers = await getFeatureMarkersData({
        page,
        featureId: circleFeature.id,
        temporary: false,
        allowedTypes: ['vertex'],
      });

      // Circle should have 4 vertex markers (at cardinal points)
      expect(markers.length, 'Circle should have 4 vertex markers').toBe(4);
    }
  });

  test('should have correct number of vertex markers for ellipse (4 markers)', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const ellipseFeature = features.find((f) => f.shape === 'ellipse');
    expect(ellipseFeature, 'Should have an ellipse feature').toBeDefined();

    if (ellipseFeature) {
      const markers = await getFeatureMarkersData({
        page,
        featureId: ellipseFeature.id,
        temporary: false,
        allowedTypes: ['vertex'],
      });

      // Ellipse should have 4 vertex markers
      expect(markers.length, 'Ellipse should have 4 vertex markers').toBe(4);
    }
  });

  test('should have correct number of vertex markers for rectangle (4 markers)', async () => {
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const rectangleFeature = features.find((f) => f.shape === 'rectangle');
    expect(rectangleFeature, 'Should have a rectangle feature').toBeDefined();

    if (rectangleFeature) {
      const markers = await getFeatureMarkersData({
        page,
        featureId: rectangleFeature.id,
        temporary: false,
        allowedTypes: ['vertex'],
      });

      // Rectangle should have 4 vertex markers (corners)
      expect(markers.length, 'Rectangle should have 4 vertex markers').toBe(4);
    }
  });

  test('shape_markers mode can be enabled and disabled independently', async () => {
    // Enable shape_markers helper directly
    await enableMode(page, 'helper', 'shape_markers');

    // Also need an edit mode to see the markers
    await enableMode(page, 'edit', 'change');

    const features = await getRenderedFeaturesData({ page, temporary: false });
    const lineFeature = features.find((f) => f.shape === 'line');

    if (lineFeature) {
      let markers = await getFeatureMarkersData({
        page,
        featureId: lineFeature.id,
        temporary: false,
      });
      expect(markers.length).toBeGreaterThan(0);

      // Disable shape_markers helper
      await disableMode(page, 'helper', 'shape_markers');
      await waitForMapIdle(page);

      // Markers should be removed even though change mode is still enabled
      markers = await getFeatureMarkersData({
        page,
        featureId: lineFeature.id,
        temporary: false,
      });
      expect(markers.length).toBe(0);
    }
  });
});
