import test, { expect, type Page } from '@playwright/test';
import {
  configurePageTimeouts,
  enableMode,
  waitForGeoman,
  waitForMapIdle,
} from '@tests/utils/basic.ts';
import {
  getFeatureMarkersData,
  getRenderedFeatureData,
  getRenderedFeaturesData,
  loadGeoJsonFeatures,
} from '@tests/utils/features.ts';
import { loadGeoJson } from '@tests/utils/fixtures.ts';

type SourceName = 'gm_main' | 'gm_temporary';
type ShapeName = 'line' | 'polygon';

const SOURCE_STYLES = {
  line: {
    gm_main: '#0033ff',
    gm_temporary: '#ff2200',
  },
  polygon: {
    gm_main: '#00aa66',
    gm_temporary: '#ff00aa',
  },
} as const;

const recreateGeomanWithStyledSources = async (page: Page) => {
  await page.evaluate(async (styles) => {
    const mapInstance = window.mapInstance;
    await window.geoman.destroy({ removeSources: true });

    const GeomanClass = window.GeomanClass;
    window.geoman = new GeomanClass(mapInstance, {
      layerStyles: {
        line: {
          gm_main: [
            {
              type: 'line',
              paint: {
                'line-color': styles.line.gm_main,
              },
            },
          ],
          gm_temporary: [
            {
              type: 'line',
              paint: {
                'line-color': styles.line.gm_temporary,
              },
            },
          ],
        },
        polygon: {
          gm_main: [
            {
              type: 'fill',
              paint: {
                'fill-color': styles.polygon.gm_main,
              },
            },
          ],
          gm_temporary: [
            {
              type: 'fill',
              paint: {
                'fill-color': styles.polygon.gm_temporary,
              },
            },
          ],
        },
      },
    });
  }, SOURCE_STYLES);
};

const getSourceLayerColor = async ({
  page,
  sourceName,
  shapeName,
}: {
  page: Page;
  sourceName: SourceName;
  shapeName: ShapeName;
}) => {
  return page.evaluate(
    ({ sourceName, shapeName }) => {
      const style = window.mapInstance.getStyle();
      if (!style || !style.layers) {
        return null;
      }

      const layerType = shapeName === 'line' ? 'line' : 'fill';
      const paintProperty = shapeName === 'line' ? 'line-color' : 'fill-color';

      const layer = style.layers.find((styleLayer) => {
        if (!('source' in styleLayer) || typeof styleLayer.source !== 'string') {
          return false;
        }

        return (
          styleLayer.source === sourceName &&
          styleLayer.id.includes(`-${shapeName}__${layerType}-layer-`)
        );
      });

      if (!layer || !('paint' in layer) || !layer.paint) {
        return null;
      }

      const paint = layer.paint as Record<string, unknown>;
      const value = paint[paintProperty];
      return typeof value === 'string' ? value : null;
    },
    { sourceName, shapeName },
  );
};

const dragFirstVertexMarker = async ({
  page,
  featureId,
}: {
  page: Page;
  featureId: string | number;
}) => {
  const markers = await getFeatureMarkersData({
    page,
    featureId,
    temporary: false,
    allowedTypes: ['vertex'],
  });
  expect(markers.length).toBeGreaterThan(0);

  const marker = markers[0];
  const startPoint = marker.point;
  const targetPoint: [number, number] = [startPoint[0] + 18, startPoint[1] + 8];

  await page.mouse.move(startPoint[0], startPoint[1]);
  await page.mouse.down();
  await page.mouse.move(targetPoint[0], targetPoint[1], { steps: 4 });
};

const assertFeatureSourceState = async ({
  page,
  featureId,
  expectedMain,
  expectedTemporary,
}: {
  page: Page;
  featureId: string | number;
  expectedMain: boolean;
  expectedTemporary: boolean;
}) => {
  await expect
    .poll(async () => {
      const [mainFeature, temporaryFeature] = await Promise.all([
        getRenderedFeatureData({ page, featureId, temporary: false }),
        getRenderedFeatureData({ page, featureId, temporary: true }),
      ]);

      return {
        main: !!mainFeature,
        temporary: !!temporaryFeature,
      };
    })
    .toEqual({
      main: expectedMain,
      temporary: expectedTemporary,
    });
};

test.describe('Edit Mode - Active Feature Styling', () => {
  test.beforeEach(async ({ page }) => {
    await configurePageTimeouts(page);
    await page.goto('/');
    await waitForGeoman(page);
    await recreateGeomanWithStyledSources(page);
    await waitForGeoman(page);

    const geoJsonFeatures = await loadGeoJson('one-shape-of-each-type');
    expect(geoJsonFeatures).not.toBeNull();

    if (geoJsonFeatures) {
      await loadGeoJsonFeatures({ page, geoJsonFeatures });
    }
  });

  test('line feature uses temporary source (active) style while being edited', async ({ page }) => {
    const mainColor = await getSourceLayerColor({
      page,
      sourceName: 'gm_main',
      shapeName: 'line',
    });
    const temporaryColor = await getSourceLayerColor({
      page,
      sourceName: 'gm_temporary',
      shapeName: 'line',
    });

    expect(mainColor).toBe(SOURCE_STYLES.line.gm_main);
    expect(temporaryColor).toBe(SOURCE_STYLES.line.gm_temporary);

    const features = await getRenderedFeaturesData({
      page,
      temporary: false,
      allowedTypes: ['line'],
    });
    expect(features.length).toBeGreaterThan(0);
    const featureId = features[0].id;

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: true,
      expectedTemporary: false,
    });

    await enableMode(page, 'edit', 'change');
    await dragFirstVertexMarker({ page, featureId });

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: false,
      expectedTemporary: true,
    });

    await page.mouse.up();
    await waitForMapIdle(page);

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: true,
      expectedTemporary: false,
    });
  });

  test('polygon feature uses temporary source (active) fill style while being edited', async ({
    page,
  }) => {
    const mainColor = await getSourceLayerColor({
      page,
      sourceName: 'gm_main',
      shapeName: 'polygon',
    });
    const temporaryColor = await getSourceLayerColor({
      page,
      sourceName: 'gm_temporary',
      shapeName: 'polygon',
    });

    expect(mainColor).toBe(SOURCE_STYLES.polygon.gm_main);
    expect(temporaryColor).toBe(SOURCE_STYLES.polygon.gm_temporary);

    const features = await getRenderedFeaturesData({
      page,
      temporary: false,
      allowedTypes: ['polygon'],
    });
    expect(features.length).toBeGreaterThan(0);
    const featureId = features[0].id;

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: true,
      expectedTemporary: false,
    });

    await enableMode(page, 'edit', 'change');
    await dragFirstVertexMarker({ page, featureId });

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: false,
      expectedTemporary: true,
    });

    await page.mouse.up();
    await waitForMapIdle(page);

    await assertFeatureSourceState({
      page,
      featureId,
      expectedMain: true,
      expectedTemporary: false,
    });
  });
});
