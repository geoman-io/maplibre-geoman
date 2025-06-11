import log from 'loglevel';
import '@/dev/styles/style.css';
import '@/styles/map/maplibre.css';


if (import.meta.env.MODE === 'development') {
  await import('./index.maplibre.dev.ts');
} else if (import.meta.env.MODE === 'test') {
  await import('./index.maplibre.test.ts');
} else {
  log.error('Only development and test modes are supported');
}
