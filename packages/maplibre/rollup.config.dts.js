import { createDtsRollupConfig } from '../../scripts/build/createDtsRollupConfig.mjs';

export default createDtsRollupConfig({
  input: './dist/types/src/entry/maplibre.d.ts',
  output: './dist/maplibre-geoman.d.ts',
});
