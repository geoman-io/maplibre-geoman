import type { FeatureData } from '@/main';
import type {
  GeoJsonShapeFeature,
  GmEditMarkerMoveEvent,
  LngLatDiff,
  LngLatTuple,
  PositionData,
  SegmentData,
  SegmentPosition,
} from '@/types';
import type { Feature, Polygon } from 'geojson';
import { calculateRotationAngle, getSegmentMiddlePosition } from './customShapeUtil';
import turfDistance from '@turf/distance';

export type StarProperties = {
  starCenter: LngLatTuple;
  starRadius: number /* in meters*/;
  starAngle: number;
  customShape: 'star';
};

export const starCustomHandlers = {
  getAllShapeSegments: (featureData: FeatureData): SegmentData[] | null => {
    const properties = featureData.getGeoJson().properties;

    const segmentsData: SegmentData[] = [];

    const { starCenter, starRadius, starAngle = 0 } = properties as StarProperties;
    if (starCenter === undefined || starRadius === undefined) {
      return null;
    }

    const tips = getStarTips(starCenter, starRadius, starAngle);

    tips.forEach((point, idx) => {
      if (idx === 0) {
        return;
      }
      const start: PositionData = {
        coordinate: tips[idx - 1],
        path: ['geometry', 'coordinates', idx - 1],
      };
      const end: PositionData = {
        coordinate: point,
        path: ['geometry', 'coordinates', idx],
      };
      const segment: SegmentPosition = {
        start,
        end,
      };
      segmentsData.push({
        edgeMarkerKey: `edge.${idx}`,
        segment,
        middle: getSegmentMiddlePosition(segment),
      });
    });

    return segmentsData;
  },
  rotate: (
    { featureData, lngLatStart, lngLatEnd }: GmEditMarkerMoveEvent,
    shapeCentroid: LngLatTuple,
  ): GeoJsonShapeFeature | null => {
    const featureGeoJson = featureData.getGeoJson();
    const properties = featureGeoJson.properties;

    if (!properties.customShape) {
      return null;
    }

    const deltaAngle = calculateRotationAngle(shapeCentroid, lngLatStart, lngLatEnd, false);

    const { starCenter, starRadius, starAngle = 0 } = properties as StarProperties;
    if (starCenter === undefined || starRadius === undefined) {
      return null;
    }

    const nextAngle = starAngle - deltaAngle;
    const nextStar = getStar(starCenter, starRadius, nextAngle);

    return {
      ...featureGeoJson,
      geometry: nextStar.geometry,
      properties: {
        ...featureGeoJson.properties,
        starAngle: nextAngle,
      },
    };
  },
  vertexUpdate: ({ featureData, lngLatEnd }: GmEditMarkerMoveEvent): GeoJsonShapeFeature | null => {
    const featureGeoJson = featureData.getGeoJson();
    const properties = featureGeoJson.properties;

    if (!properties.customShape) {
      return null;
    }

    const { starCenter, starRadius, starAngle = 0 } = properties as StarProperties;
    if (starCenter === undefined || starRadius === undefined) {
      return null;
    }

    const nextRadius = turfDistance(starCenter, lngLatEnd, {
      units: 'meters',
    });

    const nextStar = getStar(starCenter, nextRadius, starAngle);

    return {
      ...featureGeoJson,
      geometry: nextStar.geometry,
      properties: {
        ...featureGeoJson.properties,
        starRadius: nextRadius,
      },
    };
  },
  drag: (featureData: FeatureData, lngLatDiff: LngLatDiff): GeoJsonShapeFeature | null => {
    const featureGeoJson = featureData.getGeoJson();
    const properties = featureGeoJson.properties;

    if (!properties.customShape) {
      return null;
    }

    const { starCenter, starRadius, starAngle = 0 } = properties as StarProperties;
    if (starCenter === undefined || starRadius === undefined) {
      return null;
    }

    const nextCenter: LngLatTuple = [
      starCenter[0] + lngLatDiff.lng,
      starCenter[1] + lngLatDiff.lat,
    ];

    const nextStar = getStar(nextCenter, starRadius, starAngle);

    return {
      ...featureGeoJson,
      geometry: nextStar.geometry,
      properties: {
        ...featureGeoJson.properties,
        starCenter: nextCenter,
      },
    };
  },
};

export function getStar(
  center: LngLatTuple,
  radius: number /* in meters*/,
  angle: number,
  numPoints: number = 5,
  innerRadiusRatio: number = 0.4,
  roundness: number = 0.3,
): Feature<Polygon> {
  const [lng, lat] = center;

  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((lat * Math.PI) / 180);

  function toCoord(x: number, y: number): [number, number] {
    return [lng + x / metersPerDegreeLng, lat + y / metersPerDegreeLat];
  }

  const innerRadius = radius * innerRadiusRatio;
  const angleStep = (2 * Math.PI) / numPoints;
  const startAngle = (angle * Math.PI) / 180 - Math.PI / 2;

  // Alternating outer/inner vertices
  const vertices: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    const outerAngle = startAngle + i * angleStep;
    vertices.push([radius * Math.cos(outerAngle), radius * Math.sin(outerAngle)]);
    const innerAngle = outerAngle + angleStep / 2;
    vertices.push([innerRadius * Math.cos(innerAngle), innerRadius * Math.sin(innerAngle)]);
  }

  const n = vertices.length; // = 2 * numPoints
  const arcSegments = 8;
  const coordinates: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n];
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];

    const prevLen = Math.hypot(curr[0] - prev[0], curr[1] - prev[1]);
    const nextLen = Math.hypot(next[0] - curr[0], next[1] - curr[1]);

    const r = Math.min(roundness * radius, prevLen * 0.45, nextLen * 0.45);

    // Entry and exit points of the rounded corner
    const p1: [number, number] = [
      curr[0] - (r * (curr[0] - prev[0])) / prevLen,
      curr[1] - (r * (curr[1] - prev[1])) / prevLen,
    ];
    const p2: [number, number] = [
      curr[0] + (r * (next[0] - curr[0])) / nextLen,
      curr[1] + (r * (next[1] - curr[1])) / nextLen,
    ];

    // Quadratic Bézier from p1 through curr to p2
    coordinates.push(toCoord(p1[0], p1[1]));
    for (let t = 1; t <= arcSegments; t++) {
      const u = t / arcSegments;
      const bx = (1 - u) * (1 - u) * p1[0] + 2 * (1 - u) * u * curr[0] + u * u * p2[0];
      const by = (1 - u) * (1 - u) * p1[1] + 2 * (1 - u) * u * curr[1] + u * u * p2[1];
      coordinates.push(toCoord(bx, by));
    }
  }

  coordinates.push(coordinates[0]); // Close the polygon

  return {
    id: 155,
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
    properties: {
      angle,
      radius,
      center,
      customShape: 'star',
    },
  };
}

export function getStarTips(
  center: LngLatTuple,
  radius: number /* in meters*/,
  angle: number,
  numPoints: number = 5,
): LngLatTuple[] {
  const [lng, lat] = center;

  const metersPerDegreeLat = 111320;
  const metersPerDegreeLng = 111320 * Math.cos((lat * Math.PI) / 180);

  const angleStep = (2 * Math.PI) / numPoints;
  const startAngle = (angle * Math.PI) / 180 - Math.PI / 2;

  const tips: LngLatTuple[] = [];
  for (let i = 0; i < numPoints; i++) {
    const outerAngle = startAngle + i * angleStep;
    tips.push([
      lng + (radius * Math.cos(outerAngle)) / metersPerDegreeLng,
      lat + (radius * Math.sin(outerAngle)) / metersPerDegreeLat,
    ]);
  }

  return tips;
}
