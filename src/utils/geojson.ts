import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import type {
  CoordinateIndices,
  GeoJsonShapeFeature,
  GeoJsonShapeFeatureCollection,
  LineBasedGeometry,
  LngLatTuple,
  LngLatDiff,
  PositionData,
  ScreenPoint,
  SegmentPosition,
  ShapeName,
} from '@/main.ts';
import { typedKeys } from '@/utils/typing.ts';
import bbox from '@turf/bbox';
import turfCircle from '@turf/circle';
import turfEllipse from '@/turf/ellipse.ts';
import turfBearing from '@turf/bearing';

import { distance as turfDistance } from '@turf/distance';
import { coordEach as turfCoordEach } from '@turf/meta';
import { multiPolygonToLine, singlePolygonToLine } from '@turf/polygon-to-line';
import type {
  BBox,
  Feature,
  FeatureCollection,
  GeoJSON,
  GeoJsonProperties,
  LineString,
  MultiLineString,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';
import { get, isEqual } from 'lodash-es';
import log from 'loglevel';
import { lineString } from '@turf/helpers';

export const isEqualPosition = (position1: LngLatTuple, position2: LngLatTuple): boolean => {
  return position1[0] === position2[0] && position1[1] === position2[1];
};

export const isLineStringFeature = (
  geoJson: Feature | FeatureCollection,
): geoJson is Feature<LineString> => {
  return geoJson.type === 'Feature' && geoJson.geometry.type === 'LineString';
};

export const isMultiLineStringFeature = (
  geoJson: Feature | FeatureCollection,
): geoJson is Feature<MultiLineString> => {
  return geoJson.type === 'Feature' && geoJson.geometry.type === 'MultiLineString';
};

export const isPolygonFeature = (
  geoJson: Feature | FeatureCollection,
): geoJson is Feature<Polygon> => {
  return geoJson.type === 'Feature' && geoJson.geometry.type === 'Polygon';
};

export const isMultiPolygonFeature = (
  geoJson: Feature | FeatureCollection,
): geoJson is Feature<MultiPolygon> => {
  return geoJson.type === 'Feature' && geoJson.geometry.type === 'MultiPolygon';
};

export const multiLineStringToFeatureCollection = (
  geoJson: Feature<MultiLineString>,
): FeatureCollection<LineString> => {
  return {
    type: 'FeatureCollection',
    features: geoJson.geometry.coordinates.map((lineCoordinates) => ({
      type: 'Feature',
      properties: geoJson.properties,
      geometry: {
        type: 'LineString',
        coordinates: lineCoordinates,
      },
    })),
  };
};

export const getLngLatDiff = (startLngLat: LngLatTuple, endLngLat: LngLatTuple): LngLatDiff => ({
  lng: endLngLat[0] - startLngLat[0],
  lat: endLngLat[1] - startLngLat[1],
});

const isPosition = (position: unknown): position is LngLatTuple =>
  Array.isArray(position) &&
  position.length >= 2 &&
  position.length <= 3 &&
  position.every((item) => typeof item === 'number');

export const eachCoordinateWithPath = (
  geoJson: GeoJSON,
  callback: (position: PositionData, index: number) => void,
  skipClosingCoordinate: boolean = false,
) => {
  let counter = 0;
  const nestedKeys = ['features', 'geometries', 'geometry', 'coordinates'] as const;

  const traverseGeoJson = (
    geoJsonItem: unknown,
    currentPath: Array<string | number>,
    isPolygon: boolean = false,
  ) => {
    if (isPosition(geoJsonItem)) {
      callback({ coordinate: geoJsonItem, path: currentPath }, counter);
      counter += 1;
    } else if (Array.isArray(geoJsonItem)) {
      geoJsonItem.forEach((subItem, index) => {
        if (
          isPolygon &&
          skipClosingCoordinate &&
          index === geoJsonItem.length - 1 &&
          isPosition(subItem)
        ) {
          return;
        }
        traverseGeoJson(subItem, [...currentPath, index], isPolygon);
      });
    } else if (typeof geoJsonItem === 'object' && geoJsonItem !== null) {
      typedKeys(geoJsonItem).forEach((key) => {
        const subItem = geoJsonItem[key];
        if (nestedKeys.includes(key) && subItem) {
          const itemType = 'type' in geoJsonItem && geoJsonItem.type;
          const nextIsPolygon = itemType === 'Polygon' || itemType === 'MultiPolygon';
          traverseGeoJson(subItem, [...currentPath, key], nextIsPolygon);
        }
      });
    }
  };

  traverseGeoJson(geoJson, []);
};

export const findCoordinateWithPath = (geoJson: GeoJSON, coordinate: LngLatTuple) => {
  let targetPosition: PositionData = { coordinate: [0, 0], path: [] };
  let targetIndex: number = -1;

  try {
    eachCoordinateWithPath(geoJson, (position, index) => {
      if (coordinate[0] === position.coordinate[0] && coordinate[1] === position.coordinate[1]) {
        targetIndex = index;
        targetPosition = position;
        throw new Error('stop');
      }
    });
  } catch {
    if (targetPosition) {
      return {
        index: targetIndex,
        coordinate: targetPosition.coordinate,
        path: targetPosition.path,
      };
    }
  }

  return null;
};

export const eachSegmentWithPath = (
  geoJson: GeoJSON,
  callback: (segment: SegmentPosition, index: number) => void,
) => {
  let counter = 0;
  const nestedKeys = ['features', 'geometries', 'geometry', 'coordinates'] as const;

  const traverseGeoJson = (
    geoJsonItem: unknown,
    nextGeoJsonItem: unknown | undefined,
    currentPath: Array<string | number>,
    nextPath: Array<string | number>,
  ) => {
    if (isPosition(geoJsonItem) && isPosition(nextGeoJsonItem)) {
      callback(
        {
          start: { coordinate: [...geoJsonItem], path: currentPath },
          end: { coordinate: [...nextGeoJsonItem], path: nextPath },
        },
        counter,
      );
      counter += 1;
    } else if (Array.isArray(geoJsonItem)) {
      geoJsonItem.forEach((subItem, index) => {
        traverseGeoJson(
          subItem,
          geoJsonItem[index + 1],
          [...currentPath, index],
          [...currentPath, index + 1],
        );
      });
    } else if (typeof geoJsonItem === 'object' && geoJsonItem !== null) {
      typedKeys(geoJsonItem).forEach((key) => {
        const subItem = geoJsonItem[key];
        if (nestedKeys.includes(key) && subItem) {
          traverseGeoJson(subItem, undefined, [...currentPath, key], []);
        }
      });
    }
  };

  traverseGeoJson(geoJson, undefined, [], []);
};

export const findCoordinateIndices = (geoJson: GeoJSON, lngLat: LngLatTuple): CoordinateIndices => {
  let indices: CoordinateIndices = {
    absCoordIndex: -1,
    featureIndex: -1,
    multiFeatureIndex: -1,
    geometryIndex: -1,
  };

  try {
    turfCoordEach(
      geoJson,
      (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) => {
        if (currentCoord[0] === lngLat[0] && currentCoord[1] === lngLat[1]) {
          indices = { absCoordIndex: coordIndex, featureIndex, multiFeatureIndex, geometryIndex };
          throw new Error('found');
        }
      },
    );
  } catch {
    // ...
  }
  return indices;
};

export const twoCoordsToLineString = (
  position1: LngLatTuple,
  position2: LngLatTuple,
  properties: GeoJsonProperties = {},
): Feature<LineString> => {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'LineString',
      coordinates: [position1, position2],
    },
  };
};

export const getBboxFromTwoCoords = (lngLat1: LngLatTuple, lngLat2: LngLatTuple): BBox => {
  const [lng1, lat1] = lngLat1;
  const [lng2, lat2] = lngLat2;

  const minX = Math.min(lng1, lng2);
  const minY = Math.min(lat1, lat2);
  const maxX = Math.max(lng1, lng2);
  const maxY = Math.max(lat1, lat2);

  return [minX, minY, maxX, maxY];
};

export const twoCoordsToGeoJsonRectangle = (
  lngLat1: LngLatTuple,
  lngLat2: LngLatTuple,
): GeoJsonShapeFeature => {
  const bBox = getBboxFromTwoCoords(lngLat1, lngLat2);
  const southWest = [bBox[0], bBox[1]];
  const northEast = [bBox[2], bBox[3]];

  const minX = southWest[0];
  const minY = southWest[1];
  const maxX = northEast[0];
  const maxY = northEast[1];

  return {
    type: 'Feature',
    properties: {
      shape: 'rectangle',
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
        ],
      ],
    },
  };
};

export const geoJsonPointToLngLat = (geoJson: Feature<Point>): LngLatTuple => {
  return [geoJson.geometry.coordinates[0], geoJson.geometry.coordinates[1]];
};

export const getGeoJsonBounds = (geoJson: GeoJSON): [LngLatTuple, LngLatTuple] => {
  const bounds = bbox(geoJson);

  return [
    [bounds[0], bounds[1]], // South-West (min-x, min-y)
    [bounds[2], bounds[3]], // North-East (max-x, max-y)
  ];
};

export const boundsToBBox = (bounds: [LngLatTuple, LngLatTuple]): BBox => {
  return [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
};

export const bBoxContains = (bBoxBounds: BBox, lngLat: LngLatTuple): boolean => {
  const [minX, minY, maxX, maxY] = bBoxBounds;
  const [lng, lat] = lngLat;

  return lng >= minX && lng <= maxX && lat >= minY && lat <= maxY;
};

export const boundsContains = (
  bounds: [LngLatTuple, LngLatTuple],
  lngLat: LngLatTuple,
): boolean => {
  const bBoxBounds = boundsToBBox(bounds);
  return bBoxContains(bBoxBounds, lngLat);
};

export const getGeoJsonCoordinatesCount = (geoJson: GeoJSON): number => {
  let count: number = 0;
  turfCoordEach(
    geoJson,
    () => {
      count += 1;
    },
    true,
  );
  return count;
};

export const getAllGeoJsonCoordinates = (geoJson: GeoJSON): Array<LngLatTuple> => {
  const coordinates: Array<LngLatTuple> = [];
  turfCoordEach(
    geoJson,
    (coord) => {
      coordinates.push([coord[0], coord[1]]);
    },
    true,
  );
  return coordinates;
};

export const allCoordinatesEqual = (geoJson: GeoJSON): boolean => {
  const featureLngLats: Array<LngLatTuple> = getAllGeoJsonCoordinates(geoJson);

  // for now only checks if all points aren't the same
  return featureLngLats.some((lngLat) => !isEqual(featureLngLats[0], lngLat));
};

export const getGeoJsonFirstPoint = (shapeGeoJson: GeoJSON): LngLatTuple | null => {
  let firstPoint: LngLatTuple | null = null;

  try {
    eachCoordinateWithPath(shapeGeoJson, (position) => {
      firstPoint = position.coordinate;
      throw new Error('found');
    });
  } catch {
    return firstPoint;
  }

  return null;
};

export const getEuclideanDistance = (point1: ScreenPoint, point2: ScreenPoint): number => {
  return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
};

export const getEuclideanSegmentNearestPoint = (
  linePoint1: ScreenPoint,
  linePoint2: ScreenPoint,
  targetPoint: ScreenPoint,
): ScreenPoint => {
  const [x1, y1] = [linePoint1[0], linePoint1[1]];
  const [x2, y2] = [linePoint2[0], linePoint2[1]];
  const [px, py] = [targetPoint[0], targetPoint[1]];

  // Calculate vector components
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;

  // Calculate dot product and projection scalar
  const c1 = wx * vx + wy * vy;
  const c2 = vx * vx + vy * vy;
  let b = c1 / c2;

  // Clamp b between 0 and 1 to ensure the nearest point lies on the segment
  b = Math.max(0, Math.min(1, b));

  // Calculate nearest point
  return [x1 + b * vx, y1 + b * vy];
};

export const removeVertexFromLine = (
  lineGeoJson: Feature<LineString>,
  vertexLngLat: LngLatTuple,
): boolean => {
  const { absCoordIndex } = findCoordinateIndices(lineGeoJson, vertexLngLat);

  if (absCoordIndex !== -1) {
    lineGeoJson.geometry.coordinates.splice(absCoordIndex, 1);
    return true;
  }
  return false;
};

export const removeVertexFromPolygon = (
  shapeGeoJson: Feature<Polygon>,
  vertexLngLat: LngLatTuple,
): boolean => {
  const coordIndices = findCoordinateIndices(shapeGeoJson, vertexLngLat);

  if (coordIndices.absCoordIndex !== -1) {
    const coordinatesPath: [number] = [coordIndices.geometryIndex];
    const coordinates = get(
      shapeGeoJson.geometry.coordinates,
      coordinatesPath,
    ) as Array<LngLatTuple>;
    const targetCoordIndex = coordinates.findIndex((coord) => isEqual(coord, vertexLngLat));

    if (coordinates.length <= 4) {
      shapeGeoJson.geometry.coordinates.splice(coordIndices.geometryIndex, 1);
      return true;
    }

    coordinates.splice(targetCoordIndex, 1);
    if (targetCoordIndex === 0) {
      coordinates[coordinates.length - 1] = [...coordinates[0]];
    }
    return true;
  }
  return false;
};

export const removeVertexFromMultiPolygon = (
  shapeGeoJson: Feature<MultiPolygon>,
  vertexLngLat: LngLatTuple,
): boolean => {
  const coordIndices = findCoordinateIndices(shapeGeoJson, vertexLngLat);

  if (coordIndices.absCoordIndex !== -1) {
    const coordinatesPath: LngLatTuple = [
      coordIndices.multiFeatureIndex,
      coordIndices.geometryIndex,
    ];
    const coordinates = get(
      shapeGeoJson.geometry.coordinates,
      coordinatesPath,
    ) as Array<LngLatTuple>;
    const targetCoordIndex = coordinates.findIndex((coord) => isEqual(coord, vertexLngLat));

    if (coordinates.length <= 4) {
      coordinatesPath.pop();
      const coordinatesContainer = get(
        shapeGeoJson.geometry.coordinates,
        coordIndices.multiFeatureIndex,
      ) as Array<Array<LngLatTuple>>;
      coordinatesContainer.splice(coordIndices.geometryIndex, 1);

      if (coordinatesContainer.length === 0) {
        shapeGeoJson.geometry.coordinates.splice(coordIndices.multiFeatureIndex, 1);
      }
      return true;
    }

    coordinates.splice(targetCoordIndex, 1);
    if (targetCoordIndex === 0) {
      coordinates[coordinates.length - 1] = [...coordinates[0]];
    }
    return true;
  }
  return false;
};

export const removeVertexFromGeoJsonFeature = (
  shapeGeoJson: Feature<LineString | Polygon | MultiPolygon>,
  vertexLngLat: LngLatTuple,
): boolean => {
  if (isLineStringFeature(shapeGeoJson)) {
    return removeVertexFromLine(shapeGeoJson, vertexLngLat);
  }

  if (isPolygonFeature(shapeGeoJson)) {
    return removeVertexFromPolygon(shapeGeoJson, vertexLngLat);
  }

  if (isMultiPolygonFeature(shapeGeoJson)) {
    return removeVertexFromMultiPolygon(shapeGeoJson, vertexLngLat);
  }

  return false;
};

export const calculatePerimeter = (geoJson: Feature<LineBasedGeometry>) => {
  let perimeter = 0;

  eachSegmentWithPath(geoJson, (segment) => {
    perimeter += turfDistance(segment.start.coordinate, segment.end.coordinate, {
      units: 'meters',
    });
  });

  return perimeter;
};

export const convertToLineStringFeatureCollection = (
  sourceFeatureCollection: GeoJsonShapeFeatureCollection,
): FeatureCollection<LineString> => {
  const targetFeatureCollection: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [],
  };

  // convert lines/polygons/multipolygons to a FutureCollection of LineStrings
  sourceFeatureCollection.features.forEach((feature) => {
    if (isLineStringFeature(feature)) {
      targetFeatureCollection.features.push(feature);
    } else if (isPolygonFeature(feature)) {
      const lineFeature = singlePolygonToLine(feature);
      if (isLineStringFeature(lineFeature)) {
        targetFeatureCollection.features.push(lineFeature);
      } else if (isMultiLineStringFeature(lineFeature)) {
        const line = multiLineStringToFeatureCollection(lineFeature);
        line.features.forEach((item) => {
          targetFeatureCollection.features.push(item);
        });
      }
    } else if (isMultiPolygonFeature(feature)) {
      const featureCollection = multiPolygonToLine(feature);
      featureCollection.features.forEach((lineFeature) => {
        if (isLineStringFeature(lineFeature)) {
          targetFeatureCollection.features.push(lineFeature);
        } else if (isMultiLineStringFeature(lineFeature)) {
          const line = multiLineStringToFeatureCollection(lineFeature);
          line.features.forEach((item) => {
            targetFeatureCollection.features.push(item);
          });
        }
      });
    } else {
      log.warn('AutoTraceHelper.getFeaturesGeoJsonAsLines: Feature is not supported', feature);
    }
  });

  return targetFeatureCollection;
};

export const lngLatToGeoJsonPoint = (
  position: LngLatTuple,
  shape: Extract<ShapeName, 'marker' | 'text_marker' | 'circle_marker'> = 'marker',
): GeoJsonShapeFeature => {
  return {
    type: 'Feature',
    properties: {
      shape,
    },
    geometry: {
      type: 'Point',
      coordinates: position,
    },
  };
};

export const getGeoJsonCircle = ({
  center,
  radius,
  steps = 80,
  properties = {},
}: {
  center: LngLatTuple;
  radius: number;
  steps?: number;
  properties?: GeoJsonProperties;
}): GeoJsonShapeFeature => {
  const circleGeoJson = turfCircle(center, radius, {
    steps,
    units: 'meters',
    properties: {
      ...properties,
      [`${FEATURE_PROPERTY_PREFIX}shape`]: 'circle',
      [`${FEATURE_PROPERTY_PREFIX}center`]: center,
    },
  });

  // remove link between first and last coordinates
  circleGeoJson.geometry.coordinates[0][0] = [...circleGeoJson.geometry.coordinates[0][0]];

  return circleGeoJson;
};

export const getEllipseParameters = ({
  center,
  xSemiAxisLngLat,
  rimLngLat,
}: {
  center: LngLatTuple;
  xSemiAxisLngLat: LngLatTuple;
  rimLngLat?: LngLatTuple;
}) => {
  let xSemiAxis = turfDistance(center, xSemiAxisLngLat, { units: 'meters' });
  if (xSemiAxis === 0) {
    xSemiAxis = 1;
  }

  const cwAngle = turfBearing(center, xSemiAxisLngLat) - 90;

  let ySemiAxis = 0;

  if (rimLngLat) {
    const ccwAngle = -cwAngle;
    const ccwAngleRad = (ccwAngle * Math.PI) / 180;
    const ccwRimAngle = -(turfBearing(center, rimLngLat) - 90);
    const ccwRimAngleRad = (ccwRimAngle * Math.PI) / 180;

    const dRim = turfDistance(center, rimLngLat, { units: 'meters' });

    const px = dRim * Math.cos(ccwRimAngleRad);
    const py = dRim * Math.sin(ccwRimAngleRad);

    const pxReproj = px * Math.cos(ccwAngleRad) + py * Math.sin(ccwAngleRad);
    const pyReproj = px * -Math.sin(ccwAngleRad) + py * Math.cos(ccwAngleRad);

    const xPart = (pxReproj * pxReproj) / (xSemiAxis * xSemiAxis);
    ySemiAxis = Math.abs(pyReproj) / Math.sqrt(1 - xPart);

    // if xPart === 1
    if (isNaN(ySemiAxis)) {
      ySemiAxis = 0;
    }
  }

  return {
    xSemiAxis,
    ySemiAxis,
    angle: cwAngle,
  };
};

export const ellipseSteps = 80;

export const getGeoJsonEllipse = ({
  center,
  xSemiAxis,
  ySemiAxis,
  angle,
  properties = {},
}: {
  center: LngLatTuple;
  xSemiAxis: number;
  ySemiAxis?: number;
  angle: number;
  properties?: GeoJsonProperties;
}): GeoJsonShapeFeature => {
  const options = {
    steps: ellipseSteps,
    angle,
    units: 'meters',
  } as const;

  if (ySemiAxis === undefined || ySemiAxis === 0) {
    const ellipseGeoJson = turfEllipse(center, xSemiAxis, 1, options);
    return lineString(ellipseGeoJson.geometry.coordinates[0].slice(0, 41), {
      shape: 'line',
    });
  }

  const ellipseGeoJson = turfEllipse(center, xSemiAxis, ySemiAxis, {
    ...options,
    properties: {
      ...properties,
      [`${FEATURE_PROPERTY_PREFIX}shape`]: 'ellipse',
      [`${FEATURE_PROPERTY_PREFIX}center`]: center,
      [`${FEATURE_PROPERTY_PREFIX}xSemiAxis`]: xSemiAxis,
      [`${FEATURE_PROPERTY_PREFIX}ySemiAxis`]: ySemiAxis,
      [`${FEATURE_PROPERTY_PREFIX}angle`]: angle,
    },
  });

  // remove link between first and last coordinates
  ellipseGeoJson.geometry.coordinates[0][0] = [...ellipseGeoJson.geometry.coordinates[0][0]];

  return ellipseGeoJson as GeoJsonShapeFeature;
};

export const getCoordinateByPath = (
  geoJson: GeoJSON,
  path: Array<string | number>,
): LngLatTuple | null => {
  const coordinate = get(geoJson, path) as unknown;
  if (isPosition(coordinate)) {
    return coordinate;
  }
  log.warn('getCoordinateByPath: Invalid path or coordinate not found at path', path, geoJson);
  return null;
};
