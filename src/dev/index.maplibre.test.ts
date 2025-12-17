import type { GmOptionsData } from '@/main.ts';
import { Geoman } from '@/main.ts';
import * as geojsonUtils from '@/utils/geojson.ts';
import log from 'loglevel';
import ml from 'maplibre-gl';
import type { PartialDeep } from 'type-fest';
import 'maplibre-gl/dist/maplibre-gl.css';

document.body.classList.add('ci');

log.setLevel('debug');

// Expose utilities for testing
window.geomanUtils = geojsonUtils;

// Expose Geoman class for testing destroy/reinit
window.GeomanClass = Geoman;

// Hide dev panels in test mode - they take up space and interfere with tests
const leftPanel = document.getElementById('dev-left-panel');
const rightPanel = document.getElementById('dev-right-panel');
if (leftPanel) leftPanel.style.display = 'none';
if (rightPanel) rightPanel.style.display = 'none';

const emptyStyle: ml.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {},
  layers: [],
};

const map = new ml.Map({
  container: 'dev-map',
  style: emptyStyle,
  center: [0, 51],
  zoom: 5,
  fadeDuration: 50,
});

// Expose the map instance for testing
window.mapInstance = map;

const gmOptions: PartialDeep<GmOptionsData> = {};
const geoman = new Geoman(map, gmOptions);

map.on('load', () => {
  window.geoman = geoman;
});
