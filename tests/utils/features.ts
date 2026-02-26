import type {
  FeatureId,
  FeatureShape,
  GeoJsonImportFeature,
  GeoJsonShapeFeature,
  LngLatTuple,
  MarkerData,
} from '@/types/index.ts';
import { expect, type Page } from '@playwright/test';
import { dragAndDrop, waitForMapIdle } from './basic.ts';
import { expectCoordinatesWithinTolerance } from './assertions.ts';
import { getCoordinateByPath, getGeoJsonFirstPoint } from '@/utils/geojson.ts';
import { getScreenCoordinatesByLngLat } from './shapes.ts';
import type { GeoJSON } from 'geojson';
import { SHAPE_NAMES } from '@/modes/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';

export type FeatureCustomData = {
  id: FeatureId;
  temporary: boolean;
  shape: FeatureShape;
  geoJson: GeoJsonShapeFeature;
};

export type MarkerCustomData = {
  id: FeatureId | undefined;
  temporary: boolean | undefined;
  type: MarkerData['type'];
  position: LngLatTuple;
  point: [number, number]; // ScreenCoordinates
  path?: Array<string | number>;
};

export const getRenderedFeatureData = async ({
  page,
  temporary,
  featureId,
}: {
  page: Page;
  temporary: boolean;
  featureId: FeatureId;
}) => {
  return page.evaluate(
    (context) => {
      const geoman = window.geoman;
      const featureData = geoman.features.get(
        context.temporary ? context.SOURCES.temporary : context.SOURCES.main,
        context.featureId,
      );

      if (!featureData) {
        return null;
      }

      return {
        id: featureData.id,
        shape: featureData.shape,
        temporary: featureData.temporary,
        geoJson: featureData.getGeoJson(),
      };
    },
    { SOURCES, temporary, featureId },
  );
};

export const getRenderedFeaturesData = async ({
  page,
  temporary,
  allowedTypes = [...SHAPE_NAMES],
}: {
  page: Page;
  temporary: boolean;
  allowedTypes?: Array<FeatureShape>;
}) => {
  return page.evaluate(
    (context) => {
      const geoman = window.geoman;
      const result: Array<FeatureCustomData> = [];
      const forEach = context.temporary ? geoman.features.tmpForEach : geoman.features.forEach;

      forEach((featureData) => {
        if (!context.allowedTypes.includes(featureData.shape)) {
          return;
        }

        result.push({
          id: featureData.id,
          shape: featureData.shape,
          temporary: featureData.temporary,
          geoJson: featureData.getGeoJson(),
        });
      });

      return result;
    },
    { temporary, allowedTypes },
  );
};

export const waitForRenderedFeatureData = async ({
  page,
  temporary,
  featureId,
  timeout = process.env.CI ? 30 * 1000 : 10 * 1000,
}: {
  page: Page;
  featureId: FeatureId;
  temporary: boolean;
  timeout?: number;
}) => {
  const promise = await page.waitForFunction(
    (context) => {
      const geoman = window.geoman;
      const featureData = geoman.features.get(
        context.temporary ? context.SOURCES.temporary : context.SOURCES.main,
        context.featureId,
      );

      if (!featureData) {
        // wait until feature is rendered
        return null;
      }

      return {
        id: featureData.id,
        shape: featureData.shape,
        temporary: featureData.temporary,
        geoJson: featureData.getGeoJson(),
      };
    },
    { temporary, featureId, SOURCES },
    { timeout },
  );

  return promise.jsonValue() as Promise<FeatureCustomData | null>;
};

export const loadGeoJsonFeatures = async ({
  page,
  geoJsonFeatures,
}: {
  page: Page;
  geoJsonFeatures: Array<GeoJsonImportFeature>;
}) => {
  await page.evaluate(
    async (context) => {
      const geoman = window.geoman;
      for (const shapeGeoJson of context.geoJsonFeatures) {
        await geoman.features.importGeoJsonFeature(shapeGeoJson);
      }
    },
    { geoJsonFeatures, SOURCES },
  );

  await waitForMapIdle(page);

  const addedFeatureIds = geoJsonFeatures
    .map((geoJsonFeature) => geoJsonFeature.id)
    .filter((id) => id !== undefined);
  await page.waitForFunction(
    (context) => {
      const geoman = window.geoman;
      const features = geoman.mapAdapter.queryGeoJsonFeatures({
        queryCoordinates: undefined,
        sourceNames: [geoman.features.defaultSourceName],
      });
      const currentFeatureIds = features.map((feature) => feature.id);

      return !context.addedFeatureIds.some((featureId) => !currentFeatureIds.includes(featureId));
    },
    { addedFeatureIds },
    { timeout: process.env.CI ? 30000 : 10000 },
  );
};

export const getFeatureMarkersData = async ({
  page,
  featureId,
  temporary,
  allowedTypes = undefined,
}: {
  page: Page;
  featureId: FeatureId;
  temporary: boolean;
  allowedTypes?: Array<MarkerData['type']>;
}): Promise<Array<MarkerCustomData>> => {
  return page.evaluate(
    (context) => {
      const geoman = window.geoman;
      if (!geoman.mapAdapter.getMapInstance()) {
        console.error('Map is not initialized');
        return [];
      }

      const markers: Array<MarkerCustomData> = [];
      const featureData = geoman.features.get(
        context.temporary ? context.SOURCES.temporary : context.SOURCES.main,
        context.featureId,
      );

      if (!featureData) {
        return markers;
      }

      // Process each marker
      featureData.markers.forEach((markerData: MarkerData) => {
        // Skip if marker type is not allowed
        if (context.allowedTypes && !context.allowedTypes.includes(markerData.type)) {
          return;
        }

        // Process the marker
        const type = markerData.type;
        const result: MarkerCustomData = {
          id: undefined,
          type: type,
          temporary: undefined,
          position: [0, 0],
          point: [0, 0],
          path: undefined,
        };
        let position = null;

        if (type === 'dom') {
          position = markerData.instance.getLngLat();
        } else {
          result.id = markerData.instance.id;
          result.temporary = markerData.instance.temporary;
          const geoJson = markerData.instance.getGeoJson();
          if (geoJson.geometry.type === 'Point') {
            position = geoJson.geometry.coordinates;
          }
          if (type === 'vertex') {
            result.path = markerData.position.path;
          }
        }

        if (position) {
          result.position = position as LngLatTuple;
          // Get point relative to map container
          const containerPoint = geoman.mapAdapter.project(position as LngLatTuple);
          // Convert to viewport coordinates by adding container offset
          const container = geoman.mapAdapter.getContainer();
          const rect = container.getBoundingClientRect();
          result.point = [
            Math.round(containerPoint[0] + rect.left),
            Math.round(containerPoint[1] + rect.top),
          ];
          markers.push(result);
        }
      });

      return markers;
    },
    { featureId, temporary, allowedTypes, SOURCES },
  );
};

export const waitForFeatureGeoJsonUpdate = async ({
  feature,
  originalGeoJson,
  page,
  timeout = process.env.CI ? 30 * 1000 : 10 * 1000,
}: {
  feature: FeatureCustomData;
  originalGeoJson: GeoJSON;
  page: Page;
  timeout?: number;
}) => {
  await expect
    .poll(
      async () => {
        const data = await waitForRenderedFeatureData({
          page,
          featureId: feature.id,
          temporary: false,
        });
        return data?.geoJson;
      },
      { timeout, message: 'GeoJSON never changed' },
    )
    .not.toEqual(originalGeoJson);
};

export const waitForFeatureRemoval = async ({
  page,
  featureId,
  temporary,
  timeout = process.env.CI ? 30 * 1000 : 10 * 1000,
}: {
  page: Page;
  featureId: FeatureId;
  temporary: boolean;
  timeout?: number;
}) => {
  await expect
    .poll(
      async () => {
        return await getRenderedFeatureData({ page, featureId, temporary });
      },
      { timeout, message: `Feature ${featureId} was not removed within timeout.` },
    )
    .toBeNull();
};

const getInitialDragPoint = async (
  page: Page,
  feature: FeatureCustomData,
  vertexMarker?: MarkerCustomData,
): Promise<{ initialPoint: [number, number] | null; path?: Array<string | number> }> => {
  let initialPoint: [number, number] | null;
  let path: Array<string | number> | undefined;

  if (vertexMarker) {
    // Vertex drag case
    expect(vertexMarker.path, `Vertex marker for ${feature.shape} must have a path`).toBeDefined();
    if (!vertexMarker.path) return { initialPoint: null };

    initialPoint = vertexMarker.point;
    path = vertexMarker.path;
  } else {
    // Feature body drag case
    const initialLngLat = getGeoJsonFirstPoint(feature.geoJson);
    expect(initialLngLat, `Initial LngLat for feature ${feature.id} should exist`).not.toBeNull();
    if (!initialLngLat) return { initialPoint: null };

    initialPoint = await getScreenCoordinatesByLngLat({ page, position: initialLngLat });
    expect(
      initialPoint,
      `Initial screen point for feature ${feature.id} should exist`,
    ).not.toBeNull();
  }

  return { initialPoint, path };
};

const performDragOperation = async (
  page: Page,
  feature: FeatureCustomData,
  initialPoint: [number, number],
  targetPoint: [number, number],
): Promise<void> => {
  const originalGeoJson = feature.geoJson;
  await dragAndDrop(page, initialPoint, targetPoint);
  await waitForFeatureGeoJsonUpdate({ feature, originalGeoJson, page });
};

const verifyDragResult = async (
  page: Page,
  feature: FeatureCustomData,
  targetPoint: [number, number],
  path?: Array<string | number>,
  tolerance: number = 2,
): Promise<FeatureCustomData | null> => {
  const updatedFeature = await waitForRenderedFeatureData({
    page,
    featureId: feature.id,
    temporary: false,
  });
  expect(updatedFeature, `Feature ${feature.id} should be updated`).not.toBeNull();

  if (updatedFeature) {
    // Get updated coordinates
    const updatedLngLat = path
      ? getCoordinateByPath(updatedFeature.geoJson, path)
      : getGeoJsonFirstPoint(updatedFeature.geoJson);

    expect(updatedLngLat, `Updated LngLat should exist`).not.toBeNull();

    if (updatedLngLat) {
      const newScreenPos = await getScreenCoordinatesByLngLat({ page, position: updatedLngLat });
      expectCoordinatesWithinTolerance(newScreenPos, targetPoint, tolerance);
    }
  }

  return updatedFeature;
};

export const performDragAndVerify = async (
  page: Page,
  feature: FeatureCustomData,
  offsetX: number,
  offsetY: number,
  options: {
    vertexMarker?: MarkerCustomData;
    tolerance?: number;
  } = {},
) => {
  const { vertexMarker, tolerance = 2 } = options;

  // Get initial point and path
  const { initialPoint, path } = await getInitialDragPoint(page, feature, vertexMarker);
  if (!initialPoint) return;

  // Calculate target point
  const targetPoint: [number, number] = [initialPoint[0] + offsetX, initialPoint[1] + offsetY];

  // Perform drag operation
  await performDragOperation(page, feature, initialPoint, targetPoint);

  // Verify the result
  return verifyDragResult(page, feature, targetPoint, path, tolerance);
};

/**
 * Gets the current LngLat position of the MarkerPointer
 * @param page - Playwright page object
 * @returns Promise resolving to the LngLat position or null if marker pointer is not available
 */
export const getMarkerPointerLngLat = async (page: Page): Promise<LngLatTuple | null> => {
  return page.evaluate(() => {
    const geoman = window.geoman;
    if (!geoman || !geoman.markerPointer || !geoman.markerPointer.marker) {
      return null;
    }
    return geoman.markerPointer.marker.getLngLat();
  });
};
