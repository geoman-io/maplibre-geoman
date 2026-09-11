import { FEATURE_PROPERTY_PREFIX as PREFIX } from '@/core/features/constants.ts';
import type { DrawInput } from '@/types/draw-api.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import { getRectangleCornerCoordinates } from '@/utils/shapes.ts';
import circle from '@turf/circle';
import area from '@turf/area';
import { cloneDeep } from 'lodash-es';

// The same latitude domain used by Geoman's map bounds / rectangle projection.
const MAX_LATITUDE = 85.051129;
export const isDrawCoordinate = (value: unknown): value is LngLatTuple =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every((number) => typeof number === 'number' && Number.isFinite(number)) &&
  Math.abs(value[0]) <= 180 &&
  Math.abs(value[1]) <= MAX_LATITUDE;
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

/** Pure builder: never changes caller-owned input or the map. */
export const buildDrawFeature = (input: DrawInput): GeoJsonShapeFeature | null => {
  if (!input || typeof input !== 'object') return null;
  if (
    input.properties !== undefined &&
    (!input.properties || typeof input.properties !== 'object' || Array.isArray(input.properties))
  )
    return null;
  const properties = cloneDeep(input.properties ?? {});
  if (
    Object.keys(properties).some(
      (key) =>
        key.startsWith(PREFIX) ||
        key.startsWith('gm_') ||
        ['shape', 'center', 'width', 'height', 'angle'].includes(key),
    )
  )
    return null;
  let feature: GeoJsonShapeFeature;
  if (input.shape === 'marker') {
    if (!isDrawCoordinate(input.coordinates)) return null;
    feature = {
      type: 'Feature',
      properties,
      geometry: { type: 'Point', coordinates: [...input.coordinates] },
    };
  } else if (input.shape === 'circle') {
    if (
      !isDrawCoordinate(input.center) ||
      !positive(input.radiusMeters) ||
      input.radiusMeters >= 20000000
    )
      return null;
    feature = circle(input.center, input.radiusMeters, { units: 'meters', steps: 80, properties });
    feature.properties[`${PREFIX}center`] = [...input.center];
  } else if (input.shape === 'rectangle') {
    const angle = input.angleDegrees ?? 0;
    if (
      !isDrawCoordinate(input.center) ||
      !positive(input.widthMeters) ||
      !positive(input.heightMeters) ||
      typeof angle !== 'number' ||
      !Number.isFinite(angle)
    )
      return null;
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const corners = getRectangleCornerCoordinates({
      center: input.center,
      width: input.widthMeters,
      height: input.heightMeters,
      angle: normalizedAngle,
    });
    feature = {
      type: 'Feature',
      properties: {
        ...properties,
        [`${PREFIX}center`]: [...input.center],
        [`${PREFIX}width`]: input.widthMeters,
        [`${PREFIX}height`]: input.heightMeters,
        [`${PREFIX}angle`]: normalizedAngle,
      },
      geometry: { type: 'Polygon', coordinates: [[...corners, [...corners[0]]]] },
    };
  } else return null;
  feature.properties[`${PREFIX}shape`] = input.shape;
  return isCompleteDrawFeature(feature) ? feature : null;
};

export const isCompleteDrawFeature = (feature: GeoJsonShapeFeature): boolean => {
  const shape = feature.properties[`${PREFIX}shape`] ?? feature.properties.shape;
  if (shape === 'marker')
    return feature.geometry.type === 'Point' && isDrawCoordinate(feature.geometry.coordinates);
  if (shape !== 'circle' && shape !== 'rectangle') return false;
  if (feature.geometry.type !== 'Polygon' || feature.geometry.coordinates.length !== 1)
    return false;
  const ring = feature.geometry.coordinates[0];
  if (ring.length < 4 || !ring.every(isDrawCoordinate)) return false;
  if (ring[0][0] !== ring.at(-1)?.[0] || ring[0][1] !== ring.at(-1)?.[1]) return false;
  // Dateline-spanning shapes need an explicit wrapping policy; don't silently draw across the world.
  if (ring.some((point, i) => i > 0 && Math.abs(point[0] - ring[i - 1][0]) > 180)) return false;
  if (!isDrawCoordinate(feature.properties[`${PREFIX}center`])) return false;
  if (
    shape === 'rectangle' &&
    (!positive(feature.properties[`${PREFIX}width`]) ||
      !positive(feature.properties[`${PREFIX}height`]))
  )
    return false;
  return Number.isFinite(area(feature)) && area(feature) > 0;
};
