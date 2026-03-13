import type { GeoJsonShapeFeature, LngLatTuple, ScreenPoint } from '@/types';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import type { BaseMapAdapter } from '@/core/map/base';
import { getShapeProperties } from '@/utils/features.ts';
import distance from '@turf/distance';
import { earthRadius } from '@turf/helpers';
import { toMercator, toWgs84 } from '@turf/projection';

const WEB_MERCATOR_RADIUS = 6378137;

const metersToMercatorDelta = (meters: number, latitude: number): number => {
  const latitudeRad = (latitude * Math.PI) / 180;
  const cosLatitude = Math.cos(latitudeRad);

  if (Math.abs(cosLatitude) < Number.EPSILON) {
    return 0;
  }

  // Rectangle metadata stores dimensions in ground meters, but the geometry itself
  // must stay axis-aligned in Web Mercator around the rectangle center.
  return (meters * WEB_MERCATOR_RADIUS) / (earthRadius * cosLatitude);
};

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

export const moveRectangle = (
  geoJson: GeoJsonShapeFeature,
  newCenter: LngLatTuple,
): GeoJsonShapeFeature => {
  const rectangleProperties = getShapeProperties(geoJson, 'rectangle');
  if (!rectangleProperties) {
    return geoJson;
  }

  const [centerX, centerY] = toMercator(newCenter);
  const halfWidth = metersToMercatorDelta(rectangleProperties.width / 2, newCenter[1]);
  const halfHeight = metersToMercatorDelta(rectangleProperties.height / 2, newCenter[1]);

  const corners: Array<LngLatTuple> = [
    toWgs84([centerX - halfWidth, centerY + halfHeight]),
    toWgs84([centerX + halfWidth, centerY + halfHeight]),
    toWgs84([centerX + halfWidth, centerY - halfHeight]),
    toWgs84([centerX - halfWidth, centerY - halfHeight]),
  ];

  const properties = {
    ...geoJson.properties,
    [`${FEATURE_PROPERTY_PREFIX}center`]: newCenter,
    [`${FEATURE_PROPERTY_PREFIX}angle`]: 0,
  };

  return {
    ...geoJson,
    properties,
    geometry: {
      type: 'Polygon',
      coordinates: [[...corners, corners[0]]],
    },
  };
};
