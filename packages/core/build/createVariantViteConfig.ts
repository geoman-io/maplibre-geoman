import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export type BaseMapVariant = 'maplibre' | 'mapbox';

type CreateVariantViteConfigOptions = {
  variant: BaseMapVariant;
  projectRoot: string;
  libEntry: string;
  mapLibRoot?: string;
  outDir?: string;
  gmVersion?: string | null;
  serverPort?: number;
};

export const createVariantViteConfig = ({
  variant,
  projectRoot,
  libEntry,
  mapLibRoot,
  outDir = 'dist',
  gmVersion = null,
  serverPort,
}: CreateVariantViteConfigOptions) =>
  defineConfig({
    define: {
      __GEOMAN_VERSION__: JSON.stringify(gmVersion),
    },
    server: serverPort ? { port: serverPort } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './src'),
        '@tests': path.resolve(projectRoot, './tests'),
        '@mapLib': path.resolve(projectRoot, mapLibRoot || `./src/core/map/${variant}`),
      },
    },
    plugins: [
      svelte({
        configFile: path.resolve(projectRoot, 'svelte.config.js'),
      }),
      svgLoader({ defaultImport: 'raw' }),
    ],
    build: {
      outDir,
      sourcemap: true,
      lib: {
        entry: path.resolve(projectRoot, libEntry),
        name: 'Geoman',
        fileName: (format) => `${variant}-geoman.${format}.js`,
      },
      rollupOptions: {
        external: [`${variant}-gl`],
        output: {
          globals: {
            [`${variant}-gl`]: `${variant}gl`,
          },
          assetFileNames: (chunkInfo): string => {
            if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
              return `${variant}-geoman.[ext]`;
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  });
