import area from '@turf/area';
import turfClone from '@turf/clone';
import combine from '@turf/combine';
import unkinkPolygon from '@turf/unkink-polygon';
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';
import { isDegenerateRing } from '@/utils/ring-degeneracy.ts';

export type PolygonSelfIntersection = 'split' | 'reject';

export type PolygonFinishRejection =
  | 'too_few_vertices'
  | 'zero_area'
  | 'self_intersection'
  | 'invalid';

const samePoint = (a: Position, b: Position): boolean => a[0] === b[0] && a[1] === b[1];

/** Drop a duplicated closing vertex so a 2-click close is not mistaken for a ring. */
export const withoutClosingVertex = (coordinates: Array<Position>): Array<Position> => {
  if (coordinates.length >= 2 && samePoint(coordinates[0], coordinates[coordinates.length - 1])) {
    return coordinates.slice(0, -1);
  }
  return coordinates;
};

/**
 * `@turf/line-to-polygon` throws unless the line can become a ring of 4 or more
 * positions. A click on the first vertex of a 1- or 2-point cut is `[A]` or
 * `[A, B, A]`, and that throw used to abort the edit after the draft was dropped.
 */
export const canFormPolygonRing = (coordinates: Array<Position> | undefined): boolean =>
  Array.isArray(coordinates) && withoutClosingVertex(coordinates).length >= 3;

/**
 * Turn the vertices of a finished polygon draw into the feature that should be
 * created, or a reason to refuse it and leave the drawing open.
 *
 * `selfIntersection: 'split'` (the historical default) unkinks a crossing ring
 * into a MultiPolygon. `'reject'` refuses it instead. `asPolygon` unwraps a
 * one-part MultiPolygon into a Polygon; the default keeps the MultiPolygon.
 */
export const preparePolygonFinish = (
  coordinates: Array<Position>,
  options: { selfIntersection: PolygonSelfIntersection; asPolygon: boolean },
):
  | { ok: true; feature: Feature<Polygon | MultiPolygon> }
  | { ok: false; reason: PolygonFinishRejection } => {
  const open = withoutClosingVertex(coordinates);
  if (open.length < 3) {
    return { ok: false, reason: 'too_few_vertices' };
  }
  // NaN/Infinity vertices make spherical area non-finite, and `Infinity > 0`
  // would otherwise accept the ring.
  if (open.some((position) => !Number.isFinite(position[0]) || !Number.isFinite(position[1]))) {
    return { ok: false, reason: 'invalid' };
  }

  // Exactly collinear clicks have a non-zero spherical area residue (#266).
  if (isDegenerateRing(open)) {
    return { ok: false, reason: 'zero_area' };
  }

  const ring = [...open, open[0]];
  const polygon: Feature<Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [ring] },
  };

  try {
    const unkinked = unkinkPolygon(polygon);
    // A bowtie can have zero net area and still split into positive-area parts.
    // Only refuse a ring when unkinking leaves nothing with area (#257).
    if (
      !unkinked.features.some((feature) => {
        const featureArea = area(feature);
        return Number.isFinite(featureArea) && featureArea > 0;
      })
    ) {
      return { ok: false, reason: 'zero_area' };
    }
    if (options.selfIntersection === 'reject' && unkinked.features.length > 1) {
      return { ok: false, reason: 'self_intersection' };
    }

    const combined = turfClone(combine(unkinked));
    const feature = combined.features[0] as Feature<Polygon | MultiPolygon> | undefined;
    if (!feature) {
      return { ok: false, reason: 'invalid' };
    }

    if (
      options.asPolygon &&
      feature.geometry.type === 'MultiPolygon' &&
      feature.geometry.coordinates.length === 1
    ) {
      return {
        ok: true,
        feature: {
          ...feature,
          geometry: { type: 'Polygon', coordinates: feature.geometry.coordinates[0] },
        },
      };
    }

    return { ok: true, feature };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
};
