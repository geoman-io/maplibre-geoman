import { createDtsRollupConfig } from '../../scripts/build/createDtsRollupConfig.mjs';

export default createDtsRollupConfig({
  input: './dist/types/src/entry/mapbox.d.ts',
  output: './dist/mapbox-geoman.d.ts',
});
