import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';


export const OPTIONS = {
  gmVersion: ['pro', 'free'],
} as const;

export type Options = {
  GmVersion: typeof OPTIONS['gmVersion'][number];
};

export default defineConfig(() => {
  const baseMap = 'maplibre';

  return {
    server: {
      port: 3100,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      svelte(),
      svgLoader({ defaultImport: 'raw' }),
    ],
    build: {
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
              return `${baseMap}-geoman.css`;
            }
            return 'assets/[name].[extname]';
          },
        },
      },
    },
  };
});
