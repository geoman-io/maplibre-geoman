/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import type { Options } from '../vite.config.ts';

declare global {
  declare const __GEOMAN_VERSION__: Options['GmVersion'];
}
