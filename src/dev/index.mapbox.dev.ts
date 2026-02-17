import {
  createGmOptions,
  initGeomanInstance,
  setupDevEnvironment,
  toggleLeftPanel,
  toggleRightPanel,
  unmountPanels,
} from '@/dev/common.ts';
import log from 'loglevel';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Mapbox access token. Use OSM raster tiles (no token needed) or set VITE_MAPBOX_TOKEN for vector styles.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

const mapStyle: mapboxgl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const gmOptions = createGmOptions();

const initGeoman = async () => {
  const existingMapInstance = window.customData?.map as mapboxgl.Map | undefined;
  const map =
    existingMapInstance ||
    new mapboxgl.Map({
      container: 'dev-map',
      style: mapStyle,
      center: [0, 51],
      zoom: 5,
      fadeDuration: 50,
    });
  console.log(`Mapbox GL JS version: "${mapboxgl.version}"`);

  const geoman = await initGeomanInstance(map, gmOptions);
  return { geoman, map };
};

// Auto-initialize on load
(async () => {
  log.debug('Initializing Geoman dev environment (Mapbox)');
  const { geoman, map } = await initGeoman();
  setupDevEnvironment(geoman, map);
})();

// Export for potential hot module replacement
export { toggleLeftPanel, toggleRightPanel, unmountPanels };
