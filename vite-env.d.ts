/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import type { Geoman } from '@/main.ts';
import type * as geojsonUtils from '@/utils/geojson.ts';
import type ml from 'maplibre-gl';
import type mapboxgl from 'mapbox-gl';

declare global {
  declare const __GEOMAN_VERSION__: 'pro' | 'free' | null;
  declare const __GEOMAN_BASE_MAP__: 'maplibre' | 'mapbox';

  interface Window {
    geoman: Geoman;
    geomanUtils: typeof geojsonUtils;
    // Test environment only
    GeomanClass: typeof Geoman;
    mapInstance: ml.Map | mapboxgl.Map;
  }
}
