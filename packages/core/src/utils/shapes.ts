import type { GeoJsonShapeFeature, LngLatTuple, ScreenPoint } from '@/types';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import type { BaseMapAdapter } from '@/core/map/base';
import distance from '@turf/distance';

export const getRectangleDimensions = ({
  startPoint,
  endPoint,
  center,
  mapAdapter,
}: {
  startPoint: ScreenPoint;
  endPoint: ScreenPoint;
  center: ScreenPoint;
  mapAdapter: BaseMapAdapter;
}) => {
  const centerLngLat = mapAdapter.unproject(center);

  const horizontalCenter = mapAdapter.unproject([(startPoint[0] + endPoint[0]) / 2, startPoint[1]]);

  const verticalCenter = mapAdapter.unproject([startPoint[0], (startPoint[1] + endPoint[1]) / 2]);

  const width = 2 * distance(centerLngLat, verticalCenter, { units: 'meters' });
  const height = 2 * distance(centerLngLat, horizontalCenter, { units: 'meters' });

  return { width, height };
};

export const getRectangleGeoJson = ({
  startLngLat,
  endLngLat,
  withProperties,
  mapAdapter,
}: {
  startLngLat: LngLatTuple;
  endLngLat: LngLatTuple;
  withProperties: boolean;
  mapAdapter: BaseMapAdapter;
}): GeoJsonShapeFeature => {
  const startPoint = mapAdapter.project(startLngLat);
  const endPoint = mapAdapter.project(endLngLat);

  const minX = Math.min(startPoint[0], endPoint[0]);
  const minY = Math.min(startPoint[1], endPoint[1]);
  const maxX = Math.max(startPoint[0], endPoint[0]);
  const maxY = Math.max(startPoint[1], endPoint[1]);

  let center: ScreenPoint | undefined = undefined;
  let dimensions = { width: 0, height: 0 };

  if (withProperties) {
    center = [(minX + maxX) / 2, (minY + maxY) / 2];
    dimensions = getRectangleDimensions({ startPoint, endPoint, center, mapAdapter });
  }

  return {
    type: 'Feature',
    properties: {
      [`${FEATURE_PROPERTY_PREFIX}shape`]: 'rectangle',
      [`${FEATURE_PROPERTY_PREFIX}center`]: center ? mapAdapter.unproject(center) : [0, 0],
      [`${FEATURE_PROPERTY_PREFIX}angle`]: 0,
      [`${FEATURE_PROPERTY_PREFIX}width`]: dimensions.width,
      [`${FEATURE_PROPERTY_PREFIX}height`]: dimensions.height,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
          [minX, minY],
        ].map((point) => mapAdapter.unproject(point as ScreenPoint)),
      ],
    },
  };
};
