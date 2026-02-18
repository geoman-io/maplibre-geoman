/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import type { Options } from '../vite.config.ts';
import type { Geoman } from '@/main.ts';
import type * as geojsonUtils from '@/utils/geojson.ts';
import type ml from 'maplibre-gl';
import mapboxgl from 'mapbox-gl';

declare global {
  declare const __GEOMAN_VERSION__: Options['GmVersion'];

  interface Window {
    geoman: Geoman;
    geomanUtils: typeof geojsonUtils;
    // Test environment only
    GeomanClass: typeof Geoman;
    mapInstance: ml.Map | mapboxgl.Map;
  }
}
