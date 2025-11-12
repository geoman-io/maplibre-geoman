import type { Feature, FeatureCollection, MultiPolygon, Position } from 'geojson';
import turfCircle from '@turf/circle';
import { france, radius, step, size, circleSegments } from './config.ts';
import { rounded } from './util.ts';

export const geoCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    turfCircle(france, radius, {
      steps: circleSegments,
      properties: { __gm_id: 'first', __gm_shape: 'polygon' },
    }),
  ],
};

export const createCircleFeature = (
  topLeft: number[],
  size: number,
  properties: Record<string, unknown> = {},
): Feature<MultiPolygon> => {
  const [lng, lat] = topLeft;
  const bbox: number[][] = [
    [lng, lat],
    [lng + size, lat],
    [lng + size, lat - size],
    [lng, lat - size],
    [lng, lat],
  ];

  const [minLng, minLat] = bbox.reduce(
    ([minLng, minLat], [lng, lat]) => [Math.min(minLng, lng), Math.min(minLat, lat)],
    [Infinity, Infinity],
  );

  const [maxLng, maxLat] = bbox.reduce(
    ([maxLng, maxLat], [lng, lat]) => [Math.max(maxLng, lng), Math.max(maxLat, lat)],
    [-Infinity, -Infinity],
  );

  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const radiusLng = (maxLng - minLng) / 2;
  const radiusLat = (maxLat - minLat) / 2;

  const points: Position[] = [];

  for (let i = 0; i < 20; i++) {
    const angle = (2 * Math.PI * i) / 20;
    const lng = centerLng + radiusLng * Math.cos(angle);
    const lat = centerLat + radiusLat * Math.sin(angle);
    points.push([lng, lat]);
  }

  points.push(points[0]);

  properties.__gm_id ??= `${rounded(centerLng)}-${rounded(centerLat)}-circle`;
  const featureId = properties.__gm_id;

  return {
    id: featureId as string,
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[points]],
    },
    properties: {
      __gm_shape: 'polygon',
      __gm_id: featureId,
      ...properties,
    },
  };
};

export const createPolygonFeature = (
  topLeft: number[],
  size: number,
  properties: Record<string, unknown> = {},
): Feature<MultiPolygon> => {
  const [lng, lat] = topLeft;
  const bbox: number[][] = [
    [lng, lat],
    [lng + size, lat],
    [lng + size, lat - size],
    [lng, lat - size],
    [lng, lat],
  ];

  properties.__gm_id ??= `${rounded(lng)}-${rounded(lat)}-rectangle`;
  const featureId = properties.__gm_id;

  return {
    id: featureId as string,
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[bbox]],
    },
    properties: {
      __gm_shape: 'polygon',
      __gm_id: featureId,
      ...properties,
    },
  };
};

export const stressTestFeatureCollectionFactory = (
  step: number,
  size: number,
  shape: 'rectangle' | 'circle',
) => {
  const collection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let lng = france[0] - 8; lng < france[0] + 8; lng += step) {
    for (let lat = france[1] + 3; lat > france[1] - 3; lat -= step) {
      const feature =
        shape === 'rectangle'
          ? createPolygonFeature([lng, lat], size, {
              __gm_id: collection.features.length === 0 ? 'first' : undefined,
            })
          : createCircleFeature([lng, lat], size, {
              __gm_id: collection.features.length === 0 ? 'first' : undefined,
            });
      collection.features.push(feature);
    }
  }

  return collection;
};

export const stressTestFeatureCollection = stressTestFeatureCollectionFactory(
  step,
  size,
  'rectangle',
);
export const stressTestCircleFeatureCollection = stressTestFeatureCollectionFactory(
  step,
  size,
  'circle',
);
