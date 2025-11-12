import type maplibre from 'maplibre-gl';
import type { LngLatTuple, SegmentPosition, PositionData, ScreenPoint } from '@/types';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { typedKeys } from '@/main.ts';
import type { SourceUpdateManager } from './SourceUpdateManager';

export function rounded(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function addLayers(map: maplibre.Map, sourceId: string) {
  map.addLayer({
    id: `${sourceId}-fill`,
    source: sourceId,
    filter: ['==', ['get', '__gm_shape'], 'polygon'],
    type: 'fill',
    paint: {
      'fill-color': '#80e0ff',
    },
  });
  map.addLayer({
    id: `${sourceId}-stroke`,
    source: sourceId,
    filter: ['==', ['get', '__gm_shape'], 'polygon'],
    type: 'line',
    paint: {
      'line-color': '#8077ff',
      'line-width': 3,
    },
  });

  map.addLayer({
    type: 'circle',
    paint: {
      'circle-radius': 6,
      'circle-color': '#ffffff',
      'circle-opacity': 1,
      'circle-stroke-color': '#278cda',
      'circle-stroke-width': 1.5,
      'circle-stroke-opacity': 1,
    },
    minzoom: 4,
    id: `${sourceId}_center/vertex_marker__circle`,
    source: sourceId,
    filter: ['in', ['get', '__gm_shape'], ['literal', ['center_marker', 'vertex_marker']]],
  });
  map.addLayer({
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#ffffff',
      'circle-opacity': 0.6,
      'circle-stroke-color': '#278cda',
      'circle-stroke-width': 1,
      'circle-stroke-opacity': 1,
    },
    minzoom: 4,
    id: `${sourceId}_edge_marker_circle`,
    source: sourceId,
    filter: ['==', ['get', '__gm_shape'], 'edge_marker'],
  });
}

export function removeLayers(map: maplibre.Map, sourceId: string) {
  map.removeLayer(`${sourceId}-fill`);
  map.removeLayer(`${sourceId}-stroke`);
  map.removeLayer(`${sourceId}_center/vertex_marker__circle`);
  map.removeLayer(`${sourceId}_edge_marker_circle`);
}

const isPosition = (position: unknown): position is LngLatTuple =>
  Array.isArray(position) &&
  position.length >= 2 &&
  position.length <= 3 &&
  position.every((item) => typeof item === 'number');

export const eachSegmentWithPath = (
  geoJson: GeoJSON.GeoJSON,
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

export function getSegmentMiddlePosition(
  map: maplibre.Map,
  segment: SegmentPosition,
): PositionData {
  const startPoint = map.project(segment.start.coordinate);
  const endPoint = map.project(segment.end.coordinate);

  const middlePoint: ScreenPoint = [
    (startPoint.x + endPoint.x) / 2,
    (startPoint.y + endPoint.y) / 2,
  ];
  const middlePath = segment.start.path.slice(0, segment.start.path.length - 1).concat([-1]);

  const unprojected = map.unproject(middlePoint);
  return {
    coordinate: [unprojected.lng, unprojected.lat],
    path: middlePath,
  };
}

export function getEdgeMarkerKey(index: number) {
  return `edge.${index}`;
}

export const isEqualPosition = (position1: LngLatTuple, position2: LngLatTuple): boolean => {
  return position1[0] === position2[0] && position1[1] === position2[1];
};

type SegmentData = {
  segment: SegmentPosition;
  middle: PositionData;
  edgeMarkerKey: string;
};
export function getAllShapeSegments(map: maplibre.Map, shapeGeoJson: Feature) {
  const segmentsData: Array<SegmentData> = [];

  eachSegmentWithPath(shapeGeoJson, (segment, index) => {
    segmentsData.push({
      segment,
      middle: getSegmentMiddlePosition(map, segment),
      edgeMarkerKey: getEdgeMarkerKey(index),
    });
  });
  return segmentsData;
}

export function getMarkers(
  map: maplibre.Map,
  collection: FeatureCollection,
  options: {
    withVertex?: boolean;
    withEdge?: boolean;
  } = {},
) {
  const { withVertex = true, withEdge = false } = options;

  const markers: Feature<Point>[] = [];

  collection.features.forEach((feature) => {
    const shapeSegments = getAllShapeSegments(map, feature);

    shapeSegments.forEach((segmentData) => {
      const id = [feature.id, ...segmentData.segment.start.path.slice(2)].join('.');

      if (withVertex) {
        markers.push({
          id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: segmentData.segment.start.coordinate,
          },
          properties: {
            __gm_id: id,
            __gm_shape: 'vertex_marker',
          },
        });
      }

      if (withEdge) {
        const id = [feature.id, ...segmentData.segment.start.path.slice(2), 'edge'].join('.');
        markers.push({
          id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: segmentData.middle.coordinate,
          },
          properties: {
            __gm_id: id,
            __gm_shape: 'edge_marker',
          },
        });
      }
    });
  });

  return markers;
}

export function getMarkersAndUpdate(
  manager: SourceUpdateManager,
  map: maplibre.Map,
  collection: FeatureCollection,
  options: {
    withVertex?: boolean;
    withEdge?: boolean;
    deletion?: boolean;
  } = {},
) {
  const { withVertex = true, withEdge = false, deletion = false } = options;

  const markers: Feature<Point>[] = [];

  collection.features.forEach((feature) => {
    const shapeSegments = getAllShapeSegments(map, feature);

    shapeSegments.forEach((segmentData) => {
      const id = [feature.id, ...segmentData.segment.start.path.slice(2)].join('.');

      if (withVertex) {
        const point: Feature<Point> = {
          id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: segmentData.segment.start.coordinate,
          },
          properties: {
            __gm_id: id,
            __gm_shape: 'vertex_marker',
          },
        };

        if (deletion) {
          manager.updateSource({ remove: [id] });
        } else {
          manager.updateSource({ add: [point] });
        }
        markers.push(point);
      }

      if (withEdge) {
        const id = [feature.id, ...segmentData.segment.start.path.slice(2), 'edge'].join('.');
        const point: Feature<Point> = {
          id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: segmentData.middle.coordinate,
          },
          properties: {
            __gm_id: id,
            __gm_shape: 'edge_marker',
          },
        };

        if (deletion) {
          manager.updateSource({ remove: [id] });
        } else {
          manager.updateSource({ add: [point] });
        }
        markers.push(point);
      }
    });
  });

  return markers;
}
