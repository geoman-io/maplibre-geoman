import mapLibreStyle from '@/dev/maplibre-style.ts';
import {
  createGmOptions,
  initGeomanInstance,
  setupDevEnvironment,
  toggleLeftPanel,
  toggleRightPanel,
  unmountPanels,
} from '@/dev/common.ts';
import log from 'loglevel';
import 'maplibre-gl/dist/maplibre-gl.css';
import ml from 'maplibre-gl';

const gmOptions = createGmOptions();

const initGeoman = async () => {
  const existingMapInstance = window.customData?.map as ml.Map | undefined;
  const map =
    existingMapInstance ||
    new ml.Map({
      container: 'dev-map',
      style: mapLibreStyle,
      center: [0, 51],
      zoom: 5,
      fadeDuration: 50,
    });
  console.log(`Maplibre version: "${map.version}"`);

  const geoman = await initGeomanInstance(map, gmOptions);
  return { geoman, map };
};

// Auto-initialize on load
(async () => {
  log.debug('Initializing Geoman dev environment');
  const { geoman, map } = await initGeoman();
  setupDevEnvironment(geoman, map);
})();

// Export for potential hot module replacement
export { toggleLeftPanel, toggleRightPanel, unmountPanels };
