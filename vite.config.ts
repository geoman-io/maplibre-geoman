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

const getCmdOptionValue = (optionName: string): string | null => {
  const optionArgument = process.argv.find((arg) => arg.startsWith(`--${optionName}=`));

  if (optionArgument) {
    const regexp = new RegExp(`--${optionName}=(\\w*)`);
    const match = optionArgument.match(regexp);

    if (match) {
      return match[1];
    }
  }
  return null;
};

export default defineConfig(() => {
  const baseMap = 'maplibre';
  const gmVersion = getCmdOptionValue('gm_version') as Options['GmVersion'] | null;

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
              return `${baseMap}-geoman.css`;
            }
            return 'assets/[name].[extname]';
          },
        },
      },
    },
  };
});
