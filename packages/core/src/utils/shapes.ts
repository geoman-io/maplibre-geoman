import type { GeoJsonShapeFeature, LngLatTuple, ScreenPoint } from '@/types';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import type { BaseMapAdapter } from '@/core/map/base';
import { getShapeProperties } from '@/utils/features.ts';
import distance from '@turf/distance';
import { earthRadius } from '@turf/helpers';
import { toMercator, toWgs84 } from '@turf/projection';

const WEB_MERCATOR_RADIUS = 6378137;
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

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

const mercatorDeltaToMeters = (mercatorDelta: number, latitude: number): number => {
  const latitudeRad = (latitude * Math.PI) / 180;
  const cosLatitude = Math.cos(latitudeRad);

  if (Math.abs(cosLatitude) < Number.EPSILON) {
    return 0;
  }

  return (mercatorDelta * earthRadius * cosLatitude) / WEB_MERCATOR_RADIUS;
};

const rotateMercatorOffset = ([x, y]: ScreenPoint, angle: number): ScreenPoint => {
  const angleRadians = (angle * Math.PI) / 180;
  const cosTheta = Math.cos(angleRadians);
  const sinTheta = Math.sin(angleRadians);

  return [x * cosTheta - y * sinTheta, x * sinTheta + y * cosTheta];
};

export const getRectangleCornerCoordinates = ({
  center,
  width,
  height,
  angle,
}: {
  center: LngLatTuple;
  width: number;
  height: number;
  angle: number;
}): Array<LngLatTuple> => {
  const [centerX, centerY] = toMercator(center) as ScreenPoint;
  const halfWidth = metersToMercatorDelta(width / 2, center[1]);
  const halfHeight = metersToMercatorDelta(height / 2, center[1]);

  return [
    [-halfWidth, halfHeight],
    [halfWidth, halfHeight],
    [halfWidth, -halfHeight],
    [-halfWidth, -halfHeight],
  ].map((offset) => {
    const [rotatedX, rotatedY] = rotateMercatorOffset(offset as ScreenPoint, angle);
    return toWgs84([centerX + rotatedX, centerY + rotatedY]) as LngLatTuple;
  });
};

export const getRectanglePropertiesFromDiagonal = ({
  draggedCorner,
  oppositeCorner,
  angle,
}: {
  draggedCorner: LngLatTuple;
  oppositeCorner: LngLatTuple;
  angle: number;
}): {
  center: LngLatTuple;
  width: number;
  height: number;
} => {
  const [draggedX, draggedY] = toMercator(draggedCorner) as ScreenPoint;
  const [oppositeX, oppositeY] = toMercator(oppositeCorner) as ScreenPoint;

  const centerMercator: ScreenPoint = [(draggedX + oppositeX) / 2, (draggedY + oppositeY) / 2];
  const center = toWgs84(centerMercator) as LngLatTuple;

  const [localHalfWidth, localHalfHeight] = rotateMercatorOffset(
    [(draggedX - oppositeX) / 2, (draggedY - oppositeY) / 2],
    -angle,
  );

  return {
    center,
    width: mercatorDeltaToMeters(Math.abs(localHalfWidth) * 2, center[1]),
    height: mercatorDeltaToMeters(Math.abs(localHalfHeight) * 2, center[1]),
  };
};

export const rebuildRectangle = ({
  geoJson,
  center,
  angle,
}: {
  geoJson: GeoJsonShapeFeature;
  center: LngLatTuple;
  angle: number;
}): GeoJsonShapeFeature => {
  const rectangleProperties = getShapeProperties(geoJson, 'rectangle');
  if (!rectangleProperties) {
    return geoJson;
  }

  const nextAngle = normalizeAngle(angle);
  const corners = getRectangleCornerCoordinates({
    center,
    width: rectangleProperties.width,
    height: rectangleProperties.height,
    angle: nextAngle,
  });

  return {
    ...geoJson,
    properties: {
      ...geoJson.properties,
      [`${FEATURE_PROPERTY_PREFIX}center`]: center,
      [`${FEATURE_PROPERTY_PREFIX}angle`]: nextAngle,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[...corners, corners[0]]],
    },
  };
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

export const rotateRectangle = (
  geoJson: GeoJsonShapeFeature,
  angle: number,
): GeoJsonShapeFeature => {
  const rectangleProperties = getShapeProperties(geoJson, 'rectangle');
  if (!rectangleProperties) {
    return geoJson;
  }

  return rebuildRectangle({
    geoJson,
    center: rectangleProperties.center,
    angle,
  });
};

export const moveRectangle = (
  geoJson: GeoJsonShapeFeature,
  newCenter: LngLatTuple,
): GeoJsonShapeFeature => {
  const rectangleProperties = getShapeProperties(geoJson, 'rectangle');
  if (!rectangleProperties) {
    return geoJson;
  }

  return rebuildRectangle({
    geoJson,
    center: newCenter,
    angle: rectangleProperties.angle,
  });
};
