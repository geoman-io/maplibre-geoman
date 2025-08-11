import { gmPrefix } from '@/core/events/listeners/base.ts';
import {
  loadDevShapes,
  loadExternalGeoJson,
  loadStressTestCircleMarkers,
  loadStressTestFeatureCollection,
} from '@/dev/fixtures/shapes.ts';
import mapLibreStyle from '@/dev/maplibre-style.ts';
import { layerStyles } from '@/dev/styles/layer-styles.ts';
import { type GeoJsonImportFeature, Geoman, type GmOptionsData, type MapInstanceWithGeoman } from '@/main.ts';
import log from 'loglevel';
import 'maplibre-gl/dist/maplibre-gl.css';
import ml from 'maplibre-gl';
import type { PartialDeep } from 'type-fest';
import testShapes from '@/dev/fixtures/test-shapes.json';

log.setLevel(log.levels.TRACE);

const gmOptions: PartialDeep<GmOptionsData> = {
  settings: {
    controlsPosition: 'top-left',
    controlsUiEnabledByDefault: true,
    controlsCollapsable: false,
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
    helper: {},
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
  },
  '#b04': async () => {
    const geoman = window.geoman;
    if (!geoman) {
      log.warn('Geoman is not initialized');
    }

    const geojson = geoman.features.exportGeoJson();

    log.debug('total features count: ', geojson?.features?.length);
    geojson.features.forEach((feature) => {
      delete feature.properties._gmid;
    });

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
  const map = existingMapInstance || new ml.Map({
    container: 'dev-map',
    // style: 'https://demotiles.maplibre.org/style.json',
    style: mapLibreStyle,
    center: [0, 51],
    zoom: 5,
    fadeDuration: 50,
  });

  if (window.geoman) {
    console.error('Geoman is already initialized', window.geoman);
  }

  const geoman = new Geoman(map, gmOptions);

  await new Promise((resolve) => {
    map.once(`${gmPrefix}:loaded`, async () => {
      resolve(geoman);
    });
  });

  geoman.setGlobalEventsListener(() => {
    // if (event.name === 'gm:create' && 'feature' in event.payload) {
    //   log.debug('event', JSON.stringify(event.payload.feature?.getGeoJson(), null, 2));
    // }
    //
    // if ('variant' in event.payload && event.payload.variant === 'line_drawer' && event.payload.action === 'finish') {
    //   console.log('event', JSON.stringify(event, null, 2));
    // }
  });

  // map.on('gm:create', (event: GMEvent) => {
  //   log.debug('gm:create', event);
  // });

  // map.on('idle', () => {
  //   console.log('Map is fully rendered and idle!');
  // });
  return geoman;
};

const onOffButtonElement = document.querySelector('#b05') as HTMLButtonElement | null;

onOffButtonElement?.addEventListener('click', async () => {
  if (window.geoman) {
    log.debug('Destroying Geoman');
    unbindButtonHandlers();
    window.geoman.destroy();
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
