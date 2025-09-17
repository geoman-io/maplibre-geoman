import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type AnyMapInstance,
  BaseMapAdapter,
  type FeatureId,
  type GeoJsonImportFeature,
  type GeoJsonShapeFeature,
  type LngLat,
  type LngLatDiff,
} from '@/main.ts';
import {
  eachCoordinateWithPath,
  getAllGeoJsonCoordinates,
  getGeoJsonFirstPoint,
} from '@/utils/geojson.ts';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import buffer from '@turf/buffer';
import distance from '@turf/distance';
import lineIntersect from '@turf/line-intersect';
import rewind from '@turf/rewind';
import type { Feature, GeoJSON, MultiPolygon, Polygon, Position } from 'geojson';
import { cloneDeep } from 'lodash-es';
import { isLineBasedGeoJsonFeature, isPointBasedGeoJsonFeature } from '@tests/types.ts';

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

export const moveFeatureData = (featureData: FeatureData, lngLatDiff: LngLatDiff): void => {
  const featureGeoJson = getMovedGeoJson(featureData, lngLatDiff);
  const shapeCenter = featureData.getShapeProperty('center');
  if (shapeCenter) {
    featureData.setShapeProperty('center', shapeCenter[0] + lngLatDiff.lng);
    featureData.setShapeProperty('center', shapeCenter[1] + lngLatDiff.lat);
  }
  // Set the updated data back to the source
  featureData.updateGeoJsonGeometry(featureGeoJson.geometry);
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

export const getFeatureFirstPoint = (featureData: FeatureData): LngLat | null => {
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
      return {
        ...resultFeature,
        properties: feature.properties || {},
      };
    }
  }

  if (isPointBasedGeoJsonFeature(feature)) {
    return feature;
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
