import { layerStyles } from '@/dev/styles/layer-styles.ts';
import { Geoman, type GmOptionsData, type MapInstanceWithGeoman } from '@/main.ts';
import log from 'loglevel';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import type { PartialDeep } from 'type-fest';

log.setLevel(log.levels.TRACE);

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

const demoPolygonData: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'feature-2 [polygon]',
      properties: { shape: 'polygon' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.2, 54.4],
            [-3.3508300781251137, 54.31018029169337],
            [-4.7, 52.6],
            [-4.7, 49.8],
            [0.3, 48.4],
            [5.1, 49.9],
            [3.4606933593746305, 53.4161475808215],
            [1.6809082031246305, 52.67645062427434],
            [0.010986328124147349, 52.31526437316501],
            [0.2, 54.4],
          ],
        ],
      },
    },
  ],
};

const DEMO_SOURCE = 'demo-polygon';
const DEMO_FILL = 'demo-polygon-fill';
const DEMO_OUTLINE = 'demo-polygon-outline';

function addDemoPolygon(map: mapboxgl.Map, dynamic: boolean) {
  // Remove existing layers/source
  if (map.getLayer(DEMO_OUTLINE)) map.removeLayer(DEMO_OUTLINE);
  if (map.getLayer(DEMO_FILL)) map.removeLayer(DEMO_FILL);
  if (map.getSource(DEMO_SOURCE)) map.removeSource(DEMO_SOURCE);

  map.addSource(DEMO_SOURCE, {
    type: 'geojson',
    dynamic,
    data: demoPolygonData,
  } as mapboxgl.GeoJSONSourceSpecification);

  map.addLayer({
    id: DEMO_FILL,
    type: 'fill',
    source: DEMO_SOURCE,
    paint: { 'fill-color': '#0080ff', 'fill-opacity': 0.5 },
  });

  map.addLayer({
    id: DEMO_OUTLINE,
    type: 'line',
    source: DEMO_SOURCE,
    paint: { 'line-color': '#d10f0f', 'line-width': 2 },
  });

  console.log(`Demo polygon added with dynamic: ${dynamic}`);
}

function createDynamicToggle(map: mapboxgl.Map): HTMLElement {
  const container = document.createElement('div');
  container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
  container.style.cssText = 'padding: 6px 10px; font-family: sans-serif; font-size: 13px;';

  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = false;

  const text = document.createElement('span');
  text.textContent = 'dynamic: false';

  checkbox.addEventListener('change', () => {
    const dynamic = checkbox.checked;
    text.textContent = `dynamic: ${dynamic}`;
    addDemoPolygon(map, dynamic);
  });

  label.appendChild(checkbox);
  label.appendChild(text);
  container.appendChild(label);
  return container;
}

class DynamicToggleControl implements mapboxgl.IControl {
  _map: mapboxgl.Map | null = null;
  _container: HTMLElement | null = null;

  onAdd(map: mapboxgl.Map): HTMLElement {
    this._map = map;
    this._container = createDynamicToggle(map);
    return this._container;
  }

  onRemove(): void {
    this._container?.parentNode?.removeChild(this._container);
    this._map = null;
    this._container = null;
  }
}

const gmOptions: PartialDeep<GmOptionsData> = {
  settings: {
    controlsPosition: 'top-left',
    useDefaultLayers: true,
    controlsUiEnabledByDefault: true,
    controlsCollapsible: true,
    controlsStyles: {
      controlGroupClass: 'mapboxgl-ctrl mapboxgl-ctrl-group',
      controlContainerClass: 'gm-control-container',
      controlButtonClass: 'gm-control-button',
    },
  },
  layerStyles: layerStyles,
  controls: {
    edit: {
      drag: {
        title: 'Drag',
        uiEnabled: true,
      },
    },
    draw: {},
    helper: {
      shape_markers: {
        active: false,
        uiEnabled: true,
      },
    },
  },
};

const initGeoman = async () => {
  const map = new mapboxgl.Map({
    container: 'dev-map',
    style: mapStyle,
    center: [0, 51],
    zoom: 5,
    fadeDuration: 50,
  });
  console.log(`Mapbox GL JS version: "${mapboxgl.version}"`);

  map.on('load', () => {
    // Add the demo polygon with dynamic: false (renders correctly)
    addDemoPolygon(map, false);
  });

  // Add toggle control to top-right
  map.addControl(new DynamicToggleControl(), 'top-right');

  if (window.geoman) {
    console.error('Geoman is already initialized', window.geoman);
  }

  let geoman = new Geoman(map, gmOptions);
  await geoman.destroy();
  geoman = new Geoman(map, gmOptions);
  await geoman.waitForGeomanLoaded();

  map.on('gm:create', (event: unknown) => {
    const e = event as { feature: { getGeoJson: () => unknown; source: { getGeoJson: () => unknown } } };
    console.log('feature geojson', e.feature.getGeoJson());
    console.log('source geojson', e.feature.source.getGeoJson());
  });

  return { geoman, map };
};

// Auto-initialize on load
(async () => {
  log.debug('Initializing Geoman dev environment (Mapbox)');
  const { geoman, map } = await initGeoman();

  window.geoman = geoman;
  window.customData ??= { eventResults: {} };
  window.customData.map = map as unknown as MapInstanceWithGeoman;

  log.debug('geoman version:', __GEOMAN_VERSION__);
})();
