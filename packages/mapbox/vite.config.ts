import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createVariantViteConfig } from '../core/build/createVariantViteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createVariantViteConfig({
  variant: 'mapbox',
  projectRoot: dirname(dirname(__dirname)),
  libEntry: 'packages/core/src/entry/mapbox.ts',
  mapLibRoot: 'packages/mapbox/src/adapter',
  outDir: 'dist',
});
