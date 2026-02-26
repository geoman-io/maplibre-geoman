import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export type BaseMapVariant = 'maplibre' | 'mapbox';
export type GeomanVersion = 'pro' | 'free';

type CreateVariantViteConfigOptions = {
  variant: BaseMapVariant;
  projectRoot: string;
  libEntry: string;
  mapLibRoot?: string;
  outDir?: string;
  gmVersion?: GeomanVersion | null;
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
    envDir: projectRoot,
    define: {
      __GEOMAN_VERSION__: JSON.stringify(gmVersion),
      __GEOMAN_BASE_MAP__: JSON.stringify(variant),
    },
    server: serverPort ? { port: serverPort } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(projectRoot, './packages/core/src'),
        '@dev': path.resolve(projectRoot, './apps/dev'),
        '@tests': path.resolve(projectRoot, './tests'),
        '@mapLib': path.resolve(projectRoot, mapLibRoot || `./packages/${variant}/src/adapter`),
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
