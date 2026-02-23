import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dts from 'rollup-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the base map from environment variable or command line arguments
const args = process.argv.slice(2);
const baseMapArg = args.find(arg => arg.includes('--base-map='));
const baseMap = process.env.VITE_BASE_MAP || (baseMapArg ? baseMapArg.split('=')[1] : 'maplibre');

export default {
  input: resolve(__dirname, 'dist/types/src/main.d.ts'),
  output: {
    file: resolve(__dirname, `dist/${baseMap}-geoman.d.ts`),
    format: 'es',
  },
  plugins: [
    dts(),
  ],
};
