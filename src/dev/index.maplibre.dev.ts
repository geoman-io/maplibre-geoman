import {
  loadDevShapes,
  loadExternalGeoJson,
  loadStressTestCircleMarkers,
  loadStressTestFeatureCollection,
} from '@/dev/fixtures/shapes.ts';
import testShapes from '@/dev/fixtures/test-shapes.json';
import mapLibreStyle from '@/dev/maplibre-style.ts';
import { layerStyles } from '@/dev/styles/layer-styles.ts';
import {
  type GeoJsonImportFeature,
  Geoman,
  type GmOptionsData,
  type MapInstanceWithGeoman,
} from '@/main.ts';
import log from 'loglevel';
import 'maplibre-gl/dist/maplibre-gl.css';
import ml from 'maplibre-gl';
import type { PartialDeep } from 'type-fest';

log.setLevel(log.levels.TRACE);

const gmOptions: PartialDeep<GmOptionsData> = {
  settings: {
    controlsPosition: 'top-left',
    useDefaultLayers: true,
    controlsUiEnabledByDefault: true,
    controlsCollapsible: true,
    controlsStyles: {
      controlGroupClass: 'maplibregl-ctrl maplibregl-ctrl-group',
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

const buttonHandlers = {
  '#b01': async () => {
    const geoman = window.geoman;
    if (!geoman) {
      log.warn('Geoman is not initialized');
    }

    if (document.querySelector('#custom-controls')) {
      log.debug('Custom controls already added');
      return;
    }

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'custom-controls';
    document.body.prepend(controlsContainer);
    await geoman.addControls(controlsContainer);
  },
  '#b02': async () => {
    const geoman = window.geoman;
    if (!geoman) {
      log.warn('Geoman is not initialized');
    }

    geoman.removeControls();
  },
  '#b03': async () => {
    log.debug('Button #b03 click');
    const feature = window.geoman.features.get('gm_main', 'custom-feature-29');
    feature?.updateGeoJsonGeometry({
      type: 'LineString',
      coordinates: [
        [-7.405029296874261, 53.923817511191146],
        [-6.548095703124517, 53.17977164467473],
        [-9.843994140625, 52.42259189531441],
        [-6.240478515624147, 51.52932168465881],
        [-8.6593980745172985, 50.08551206469775],
        [-4.1550035432676964, 50.75747515540502],
      ],
    });
    feature?.setGeoJsonCustomProperties({ testX: 'test-555' });
    feature?.setGeoJsonCustomProperties({ testY: 'test-777' });
    feature?.deleteGeoJsonCustomProperties(['testX', '__gm_shape']);
  },
  '#b04': async () => {
    const geoman = window.geoman;
    if (!geoman) {
      log.warn('Geoman is not initialized');
    }
    const geojson = geoman.features.exportGeoJson();
    log.debug('total features count: ', geojson?.features?.length);
    log.debug('geojson', JSON.stringify(geojson, null, 2));
  },
  // '#b05': async () => {
  //   const geoman = window.geoman;
  //   if (!geoman) {
  //     log.warn('Geoman is not initialized')
  //   }
  // },
};

const bindButtonHandlers = () => {
  Object.entries(buttonHandlers).forEach(([selector, handler]) => {
    document.querySelector(selector)?.addEventListener('click', handler);
  });
};

const unbindButtonHandlers = () => {
  Object.entries(buttonHandlers).forEach(([selector, handler]) => {
    document.querySelector(selector)?.removeEventListener('click', handler);
  });
};

const loadGeomanData = (geoman: Geoman) => {
  log.debug(`Running mode: "${import.meta.env.MODE}"`);
  log.debug('Geoman instance', geoman);

  const loadDevShapesFlag: boolean = true;
  const loadStressTest: boolean = false;
  const loadCircleMarkerStressTest: boolean = false;
  const loadExternalGeoJsonFlag: boolean = false;

  const step = 0.2;
  const size = 0.18;
  if (loadDevShapesFlag) {
    // loadDevShapes(geoman, devShapes);
    loadDevShapes(geoman, testShapes as GeoJsonImportFeature[]);
  }
  if (loadStressTest) {
    loadStressTestFeatureCollection(geoman, step, size);
  }
  if (loadCircleMarkerStressTest) {
    loadStressTestCircleMarkers(geoman, step);
  }
  if (loadExternalGeoJsonFlag) {
    loadExternalGeoJson(geoman);
  }

  log.debug('Shapes loaded');
};

const initGeoman = async () => {
  const existingMapInstance = window.customData?.map as ml.Map | undefined;
  const map =
    existingMapInstance ||
    new ml.Map({
      container: 'dev-map',
      // style: 'https://demotiles.maplibre.org/style.json',
      style: mapLibreStyle,
      center: [0, 51],
      zoom: 5,
      fadeDuration: 50,
    });
  console.log(`Maplibre version: "${map.version}"`);

  if (window.geoman) {
    console.error('Geoman is already initialized', window.geoman);
  }

  let geoman = new Geoman(map, gmOptions);
  await geoman.destroy();
  geoman = new Geoman(map, gmOptions);
  await geoman.waitForGeomanLoaded();

  geoman.setGlobalEventsListener((event) => {
    if (event.name === '_gm:feature:before_create') {
      log.debug('setGlobalEventsListener event', event);
    }
  });
  return geoman;
};

const onOffButtonElement = document.querySelector('#b05') as HTMLButtonElement | null;

onOffButtonElement?.addEventListener('click', async () => {
  if (window.geoman) {
    log.debug('Destroying Geoman');
    unbindButtonHandlers();
    await window.geoman.destroy();
    // @ts-expect-error geoman is undefined
    window.geoman = undefined;
  } else {
    log.debug('Initializing Geoman');
    const geoman = await initGeoman();
    loadGeomanData(geoman);
    bindButtonHandlers();
    window.geoman = geoman;
    window.customData ??= { eventResults: {} };
    window.customData.map = geoman.mapAdapter.mapInstance as MapInstanceWithGeoman;

    log.debug('geoman version:', __GEOMAN_VERSION__);
  }
});

onOffButtonElement?.click();
