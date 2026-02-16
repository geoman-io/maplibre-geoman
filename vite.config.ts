import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgLoader from 'vite-svg-loader';


export const OPTIONS = {
  gmVersion: ['pro', 'free'],
} as const;

export type Options = {
  GmVersion: typeof OPTIONS['gmVersion'][number];
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const baseMap = (env.VITE_BASE_MAP as 'maplibre' | 'mapbox') || 'maplibre';
  const gmVersion = (env.VITE_GEOMAN_VERSION as Options['GmVersion']) || null;

  return {
    define: {
      __GEOMAN_VERSION__: JSON.stringify(gmVersion),
    },
    server: {
      port: 3100,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tests': path.resolve(__dirname, './tests'),
        '@mapLib': path.resolve(__dirname, `./src/core/map/${baseMap}`)
      },
    },
    plugins: [
      svelte(),
      svgLoader({ defaultImport: 'raw' }),
    ],
    build: {
      sourcemap: true,
      lib: {
        entry: 'src/main.ts',
        name: 'Geoman',
        fileName: (format) => `${baseMap}-geoman.${format}.js`,
      },
      rollupOptions: {
        external: [
          // exclude from the bundle
          // 'maplibre-gl',
          `${baseMap}-gl`,
        ],
        output: {
          globals: {
            // this should match the global variable maplibre-gl exposes
            // 'maplibre-gl': 'maplibregl',
            [`${baseMap}-gl`]: `${baseMap}gl`,
          },
          assetFileNames: (chunkInfo): string => {
            if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
              // return `${baseMap}-geoman.css`;
              return `${baseMap}-geoman.[ext]`;
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  };
});
