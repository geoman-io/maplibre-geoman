/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import type { Options } from '../vite.config.ts';
import type { BaseMapName, Geoman } from '@/main.ts';
import type * as geojsonUtils from '@/utils/geojson.ts';
import type ml from 'maplibre-gl';
import type mapboxgl from 'mapbox-gl';

declare global {
  declare const __GEOMAN_VERSION__: Options['GmVersion'];

  interface Window {
    geoman: Geoman;
    geomanUtils: typeof geojsonUtils;
    // Test environment only
    GeomanClass: typeof Geoman;
    mapInstance: ml.Map | mapboxgl.Map;
  }

  interface ImportMetaEnv {
    readonly VITE_BASE_MAP: BaseMapName;
  }
}
