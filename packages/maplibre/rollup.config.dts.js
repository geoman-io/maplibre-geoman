import { createDtsRollupConfig } from '../core/build/createDtsRollupConfig.mjs';

export default createDtsRollupConfig({
  input: './dist/types/packages/core/src/entry/maplibre.d.ts',
  output: './dist/maplibre-geoman.d.ts',
});
