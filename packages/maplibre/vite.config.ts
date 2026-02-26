import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createVariantViteConfig } from '../../scripts/build/createVariantViteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createVariantViteConfig({
  variant: 'maplibre',
  projectRoot: dirname(dirname(__dirname)),
  libEntry: 'src/entry/maplibre.ts',
  outDir: 'dist',
});
