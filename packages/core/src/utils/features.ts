import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';
import { propertyValidators } from '@/core/features/validators.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { BaseMapAdapter } from '@/core/map/base/index.ts';
import type { FeatureId, FeatureShape, FeatureShapeProperties } from '@/types/features.ts';
import type { GeoJsonImportFeature, GeoJsonShapeFeature, LngLatDiff } from '@/types/geojson.ts';
import type { AnyMapInstance, LngLatTuple } from '@/types/map/index.ts';
import {
  eachCoordinateWithPath,
  getAllGeoJsonCoordinates,
  getGeoJsonFirstPoint,
} from '@/utils/geojson.ts';
import bearing from '@turf/bearing';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import buffer from '@turf/buffer';
import destination from '@turf/destination';
import distance from '@turf/distance';
import lineIntersect from '@turf/line-intersect';
import rewind from '@turf/rewind';
import type { Feature, GeoJSON, MultiPolygon, Polygon, Position } from 'geojson';
import { cloneDeep } from 'lodash-es';
import { isLineBasedGeoJsonFeature, isPointBasedGeoJsonFeature } from '@tests/types.ts';

const SHAPE_REQUIRED_PROPERTIES = {
  circle: ['center'],
  ellipse: ['center', 'xSemiAxis', 'ySemiAxis', 'angle'],
  rectangle: ['center', 'width', 'height', 'angle'],
} as const satisfies Partial<Record<FeatureShape, ReadonlyArray<keyof FeatureShapeProperties>>>;

export type ShapeWithRequiredProperties = keyof typeof SHAPE_REQUIRED_PROPERTIES;
export type ShapePropertiesByShape<S extends ShapeWithRequiredProperties> = {
  [K in (typeof SHAPE_REQUIRED_PROPERTIES)[S][number]]: NonNullable<FeatureShapeProperties[K]>;
};

const hasRequiredShapeProperties = (
  shape: FeatureShape,
): shape is keyof typeof SHAPE_REQUIRED_PROPERTIES => {
  return shape in SHAPE_REQUIRED_PROPERTIES;
};

const getGeoJsonPropertyValue = <T extends keyof typeof propertyValidators>(
  geoJson: Pick<Feature, 'properties'>,
  propertyName: T,
) => {
  const properties = geoJson.properties || {};
  return properties[`${FEATURE_PROPERTY_PREFIX}${propertyName}`] ?? properties[propertyName];
};

export const getShapeProperties = <S extends ShapeWithRequiredProperties>(
  geoJson: Pick<Feature, 'properties'>,
  expectedShape: S,
): ShapePropertiesByShape<S> | null => {
  const shape = expectedShape;
  if (!propertyValidators.shape(shape) || !hasRequiredShapeProperties(shape)) {
    return null;
  }

  const shapeProperties: Partial<Record<keyof FeatureShapeProperties, unknown>> = {};

  for (const propertyName of SHAPE_REQUIRED_PROPERTIES[shape]) {
    const value = getGeoJsonPropertyValue(geoJson, propertyName);
    if (!propertyValidators[propertyName](value)) {
      return null;
    }
    shapeProperties[propertyName] = value;
  }

  return shapeProperties as ShapePropertiesByShape<S>;
};

export const propertiesValid = (
  geoJson: Pick<Feature, 'properties'>,
  expectedShape?: FeatureShape,
): boolean => {
  const shape = expectedShape ?? getGeoJsonPropertyValue(geoJson, 'shape');
  if (!propertyValidators.shape(shape)) {
    // no shape metadata available; only validate shape-specific metadata when shape is known
    return !expectedShape;
  }

  if (!hasRequiredShapeProperties(shape)) {
    return true;
  }

  return !!getShapeProperties(geoJson, shape);
};

export const moveGeoJson = (geoJson: GeoJsonShapeFeature, lngLatDiff: LngLatDiff) => {
  eachCoordinateWithPath(geoJson, (position) => {
    const lngLat = position.coordinate;
    lngLat[0] += lngLatDiff.lng;
    lngLat[1] += lngLatDiff.lat;
  });

  return geoJson;
};

export const getBufferedOuterPolygon = (
  mapAdapter: BaseMapAdapter<AnyMapInstance>,
  polygonGeoJson: Feature<Polygon | MultiPolygon>,
): Feature<Polygon | MultiPolygon> | null => {
  const FRACTION = 10e-5;
  const bounds = mapAdapter.getBounds();
  const widthMeters = distance(bounds[0], bounds[1], { units: 'meters' });

  return buffer(polygonGeoJson, widthMeters * FRACTION, { units: 'meters' }) || null;
};

export const getMovedGeoJson = (featureData: FeatureData, lngLatDiff: LngLatDiff) => {
  const featureGeoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);
  moveGeoJson(featureGeoJson, lngLatDiff);
  return featureGeoJson;
};

// Below this many meters of drag we treat the move as a no-op and return the
// snapshot untouched (avoids needless re-projection of every vertex).
const TRANSLATE_EPSILON_METERS = 1e-6;

/**
 * Translate a whole feature so it keeps its real-world shape and dimensions — the
 * same metric philosophy circles/ellipses already use (radius in meters). This is
 * the polygon/line analog of reconstructing a circle from its center + radius:
 * each vertex is stored as a geodesic (distance, bearing) offset from the drag
 * anchor, then rebuilt around the new anchor position.
 *
 * Why not a constant degree offset (`moveGeoJson`)? A degree offset is a rigid
 * rotation of the sphere for pure east/west drags, but for any north/south
 * component it shears the shape — horizontal edges land at a latitude where their
 * degree-span is a different number of meters, so edge lengths and area drift
 * (~3% over ~100 km near 60°N). Reconstructing from anchor-relative geodesic
 * offsets preserves edges and area to within rounding at any latitude, and was
 * empirically the only translation that does (a Web-Mercator offset is worse, and
 * Turf's `transformTranslate` is no better than the degree offset). See issue #172.
 *
 * IMPORTANT: always pass the *pristine* (drag-start) geometry and the *total*
 * anchor→target vector. Recomputing offsets from an already-moved geometry every
 * pointer tick accumulates drift over a long drag; rebuilding the snapshot from the
 * absolute anchor→target vector does not.
 */
export const getTranslatedGeoJson = (
  pristineGeoJson: GeoJsonShapeFeature,
  anchorLngLat: LngLatTuple,
  targetLngLat: LngLatTuple,
): GeoJsonShapeFeature => {
  const cloned = cloneDeep(pristineGeoJson);
  if (distance(anchorLngLat, targetLngLat, { units: 'meters' }) < TRANSLATE_EPSILON_METERS) {
    return cloned;
  }

  eachCoordinateWithPath(cloned, (position) => {
    const vertex = position.coordinate;
    const offsetDistance = distance(anchorLngLat, vertex, { units: 'meters' });
    const offsetBearing = bearing(anchorLngLat, vertex);
    const [movedLng, movedLat] = destination(targetLngLat, offsetDistance, offsetBearing, {
      units: 'meters',
    }).geometry.coordinates;
    position.coordinate[0] = movedLng;
    position.coordinate[1] = movedLat;
  });

  return cloned;
};

export const moveFeatureData = async (featureData: FeatureData, lngLatDiff: LngLatDiff) => {
  const featureGeoJson = getMovedGeoJson(featureData, lngLatDiff);
  const shapeCenter = featureData.getShapeProperty('center');
  if (shapeCenter) {
    await featureData.setShapeProperty('center', [
      shapeCenter[0] + lngLatDiff.lng,
      shapeCenter[1] + lngLatDiff.lat,
    ]);
  }
  // Set the updated data back to the source
  await featureData.updateGeometry(featureGeoJson.geometry);
};

export const getAllFeatureCoordinates = (featureData: FeatureData): Array<Position> => {
  const shapeGeoJson = featureData.getGeoJson() as GeoJSON;
  return getAllGeoJsonCoordinates(shapeGeoJson);
};

export const allFeaturePointsInPolygon = (
  featureGeoJson: Feature,
  containerGeoJson: Feature<Polygon | MultiPolygon>,
): boolean => {
  try {
    eachCoordinateWithPath(featureGeoJson, (position) => {
      if (!booleanPointInPolygon(position.coordinate, containerGeoJson)) {
        throw new Error('stop');
      }
    });
  } catch {
    return false;
  }

  return true;
};

export const isGeoJsonFeatureInPolygon = (
  featureGeoJson: Feature,
  containerGeoJson: Feature<Polygon | MultiPolygon>,
): boolean => {
  const allPointsInPolygon = allFeaturePointsInPolygon(featureGeoJson, containerGeoJson);
  if (isPointBasedGeoJsonFeature(featureGeoJson)) {
    return allPointsInPolygon;
  }

  if (allPointsInPolygon && isLineBasedGeoJsonFeature(featureGeoJson)) {
    return !lineIntersect(featureGeoJson, containerGeoJson, { ignoreSelfIntersections: true })
      .features.length;
  }
  return false;
};

export const getFeatureFirstPoint = (featureData: FeatureData): LngLatTuple | null => {
  const shapeGeoJson = featureData.getGeoJson();
  if (typeof shapeGeoJson !== 'object') {
    return null;
  }

  return getGeoJsonFirstPoint(shapeGeoJson);
};

export const fixGeoJsonFeature = (feature: GeoJsonImportFeature): GeoJsonImportFeature | null => {
  if (isLineBasedGeoJsonFeature(feature)) {
    const resultFeature = rewind(feature, { mutate: false });
    if (resultFeature.type === 'Feature' && isLineBasedGeoJsonFeature(resultFeature)) {
      const fixedFeature: GeoJsonImportFeature = {
        ...resultFeature,
        properties: feature.properties || {},
      };
      return propertiesValid(fixedFeature) ? fixedFeature : null;
    }
  }

  if (isPointBasedGeoJsonFeature(feature)) {
    return propertiesValid(feature) ? feature : null;
  }

  return null;
};

export const getCustomFeatureId = (
  featureGeoJson: Feature,
  idPropertyName: string,
): FeatureId | null => {
  const featureId = featureGeoJson.properties?.[idPropertyName];
  if (typeof featureId === 'string' || typeof featureId === 'number') {
    return featureId;
  }
  return null;
};
