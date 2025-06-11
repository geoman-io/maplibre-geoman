import type { GmOptionsData } from '@/main.ts';
import { Geoman } from '@/main.ts';
import log from 'loglevel';
import ml from 'maplibre-gl';
import type { PartialDeep } from 'type-fest';
import 'maplibre-gl/dist/maplibre-gl.css';

log.setLevel('debug');


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

const gmOptions: PartialDeep<GmOptionsData> = {};
const geoman = new Geoman(map, gmOptions);


map.on('load', () => {
  window.geoman = geoman;
});
