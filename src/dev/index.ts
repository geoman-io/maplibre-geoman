import log from 'loglevel';
import '@/dev/styles/style.css';
import '@mapLib/style.css';

const baseMap = import.meta.env.VITE_BASE_MAP || 'maplibre';

if (import.meta.env.MODE === 'development') {
  if (baseMap === 'mapbox') {
    await import('./index.mapbox.dev.ts');
  } else {
    await import('./index.maplibre.dev.ts');
  }
} else if (import.meta.env.MODE === 'test') {
  await import('./index.maplibre.test.ts');
} else {
  log.error('Only development and test modes are supported');
}
