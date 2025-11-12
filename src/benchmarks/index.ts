import maplibre, { GeoJSONSource, type GeoJSONFeatureId } from 'maplibre-gl';
import { france } from './config.ts';
import './style.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import { stressTestCircleFeatureCollection } from './dataset.ts';
import { addLayers, getMarkers, getMarkersAndUpdate } from './util.ts';
import { SourceUpdateManager } from './SourceUpdateManager.ts';

const sourceId = 'base';
const shapeMarkersSourceId = 'shape-markers';

const map = new maplibre.Map({
  container: document.querySelector<HTMLDivElement>('#dev-map')!,
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: france,
  zoom: 6.5,
  attributionControl: false,
});

let testInfos = '';
let testMetadatas: unknown = null;
let t0 = 0;
let resultId = '';

let baseSource: GeoJSONSource;
let shapeSeparateSource: GeoJSONSource;

map.on('load', () => {
  map.addSource(sourceId, {
    type: 'geojson',
    data: stressTestCircleFeatureCollection,
    promoteId: '__gm_id',
  });
  map.addSource(shapeMarkersSourceId, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    promoteId: '__gm_id',
  });
  addLayers(map, sourceId);
  addLayers(map, shapeMarkersSourceId);
  console.log(stressTestCircleFeatureCollection);
  map.on('sourcedata', (e) => {
    if (!testInfos || !e.isSourceLoaded) {
      return;
    }
    const t1 = performance.now();
    const duration = (t1 - t0).toFixed(2);
    console.log(`${testInfos} (${duration})ms`, testMetadatas);

    if (resultId) {
      const resultDiv = document.getElementById(resultId);
      if (resultDiv) {
        resultDiv.textContent = `${duration}ms`;
      }
    }
  });

  baseSource = map.getSource<GeoJSONSource>(sourceId)!;
  shapeSeparateSource = map.getSource<GeoJSONSource>(shapeMarkersSourceId)!;
});

document.querySelector<HTMLButtonElement>('#AddShapeMarkers')?.addEventListener('click', () => {
  t0 = performance.now();
  testInfos = 'Added vertex markers';

  const markers = getMarkers(map, stressTestCircleFeatureCollection);
  baseSource.updateData({
    add: markers,
  });

  testMetadatas = markers;
  resultId = 'AddShapeMarkers-result';
});

document
  .querySelector<HTMLButtonElement>('#AddCompleteShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Added vertex/edge markers';

    const markers = getMarkers(map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });

    baseSource.updateData({ add: markers });

    testMetadatas = markers;
    resultId = 'AddCompleteShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#AddToggleShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Remove vertex then add vertex and edge markers';

    const markersToRemove = getMarkers(map, stressTestCircleFeatureCollection);
    const markersToAdd = getMarkers(map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });

    baseSource.updateData({
      remove: markersToRemove.map(({ id }) => id as GeoJSONFeatureId),
      add: markersToAdd,
    });

    testMetadatas = { markersToRemove, markersToAdd };
    resultId = 'AddToggleShapeMarkers-result';
  });

document.querySelector<HTMLButtonElement>('#RemoveShapeMarkers')?.addEventListener('click', () => {
  t0 = performance.now();
  testInfos = 'Remove shape markers';

  const markers = getMarkers(map, stressTestCircleFeatureCollection, {
    withEdge: true,
    withVertex: true,
  });
  baseSource.updateData({
    remove: markers.map(({ id }) => id as GeoJSONFeatureId),
  });

  testMetadatas = markers;
  resultId = 'RemoveShapeMarkers-result';
});

document.querySelector<HTMLButtonElement>('#SetShapeMarkers')?.addEventListener('click', () => {
  t0 = performance.now();
  testInfos = 'Added vertex markers';

  const markers = getMarkers(map, stressTestCircleFeatureCollection);
  shapeSeparateSource.setData({
    type: 'FeatureCollection',
    features: markers,
  });

  testMetadatas = markers;
  resultId = 'SetShapeMarkers-result';
});

document
  .querySelector<HTMLButtonElement>('#SetCompleteShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Added vertex/edge markers (separate source)';

    const markers = getMarkers(map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });
    shapeSeparateSource.setData({ type: 'FeatureCollection', features: markers });

    testMetadatas = markers;
    resultId = 'SetCompleteShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#SetToggleShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Added only edge markers (separate source with update)';

    const markersToAdd = getMarkers(map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: false,
    });
    shapeSeparateSource.updateData({ add: markersToAdd });

    map.once('sourcedata', (e) => {
      if (e.sourceId === shapeMarkersSourceId && e.isSourceLoaded) {
        const t1 = performance.now();
        console.log(`added only ${markersToAdd.length} edge markers (${t1 - t0})ms`, markersToAdd);
      }
    });

    testMetadatas = markersToAdd;
    resultId = 'SetToggleShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#SetToggleFlushShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'removed explicitly then added vertex/edge markers';

    shapeSeparateSource.setData({
      type: 'FeatureCollection',
      features: [],
    });

    const markers = getMarkers(map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });
    shapeSeparateSource.setData({
      type: 'FeatureCollection',
      features: markers,
    });

    testMetadatas = markers;
    resultId = 'SetToggleFlushShapeMarkers-result';
  });

document.querySelector<HTMLButtonElement>('#FlushShapeMarkers')?.addEventListener('click', () => {
  t0 = performance.now();
  testInfos = 'flush all  markers';

  shapeSeparateSource.setData({ type: 'FeatureCollection', features: [] });

  testMetadatas = null;
  resultId = 'FlushShapeMarkers-result';
});

document
  .querySelector<HTMLButtonElement>('#MultipleAddShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Added vertex markers';

    const manager = new SourceUpdateManager(baseSource);

    const markers = getMarkersAndUpdate(manager, map, stressTestCircleFeatureCollection);
    testMetadatas = markers;
    resultId = 'MultipleAddShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#MultipleAddCompleteShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Added vertex/edge markers';

    const manager = new SourceUpdateManager(baseSource);

    const markers = getMarkersAndUpdate(manager, map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });

    testMetadatas = markers;
    resultId = 'MultipleAddCompleteShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#MultipleAddToggleShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Remove vertex then add vertex and edge markers';

    const manager = new SourceUpdateManager(baseSource);

    const markersToRemove = getMarkersAndUpdate(manager, map, stressTestCircleFeatureCollection, {
      deletion: true,
      withEdge: true,
      withVertex: true,
    });
    const markersToAdd = getMarkersAndUpdate(manager, map, stressTestCircleFeatureCollection, {
      withEdge: true,
      withVertex: true,
    });

    testMetadatas = { markersToRemove, markersToAdd };
    resultId = 'MultipleAddToggleShapeMarkers-result';
  });

document
  .querySelector<HTMLButtonElement>('#MultipleRemoveShapeMarkers')
  ?.addEventListener('click', () => {
    t0 = performance.now();
    testInfos = 'Remove shape markers';

    const manager = new SourceUpdateManager(baseSource);

    const markersToRemove = getMarkersAndUpdate(manager, map, stressTestCircleFeatureCollection, {
      deletion: true,
      withEdge: true,
      withVertex: true,
    });
    testMetadatas = markersToRemove;
    resultId = 'MultipleRemoveShapeMarkers-result';
  });
