import log from 'loglevel';
import '@/dev/styles/style.css';
import '@mapLib/style.css';
import { get } from 'lodash-es';

log.setLevel(log.levels.TRACE);

const MODE_MAP = {
  development: 'dev',
  test: 'test',
} as const;

const baseMap = import.meta.env.VITE_BASE_MAP;
const mode = import.meta.env.MODE;
const shortMode = get(MODE_MAP, mode, 'unknown');
const importPath = `./index.${baseMap}.${shortMode}.ts`;

log.debug(`Mode: "${mode}"`);
log.debug(`Map library: "${baseMap}"`);

try {
  await import(/* @vite-ignore */ importPath);
} catch (error) {
  log.error(`Can't import module for base map "${baseMap}" and mode "${mode}"`);
  log.error(`import path: "${importPath}"`);
  log.error(error);
}
