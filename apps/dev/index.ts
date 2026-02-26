import log from 'loglevel';
import './styles/style.css';
import '@mapLib/style.css';

log.setLevel(log.levels.TRACE);

const baseMap = __GEOMAN_BASE_MAP__;

log.debug(`Map library: "${baseMap}"`);

if (import.meta.env.MODE === 'development') {
  if (baseMap === 'mapbox') {
    await import('./index.mapbox.dev.ts');
  } else if (baseMap === 'maplibre') {
    await import('./index.maplibre.dev.ts');
  } else {
    log.error(`Wrong map library: "${baseMap}"`);
  }
} else if (import.meta.env.MODE === 'test') {
  if (baseMap === 'mapbox') {
    await import('./index.mapbox.test.ts');
  } else if (baseMap === 'maplibre') {
    await import('./index.maplibre.test.ts');
  } else {
    log.error(`Wrong map library: "${baseMap}"`);
  }
} else {
  log.error('Only development and test modes are supported');
}
