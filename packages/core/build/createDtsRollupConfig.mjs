import fs from 'node:fs';
import path from 'node:path';
import dts from 'rollup-plugin-dts';

const declarationAliasPlugin = (variant) => ({
  name: 'declaration-aliases',
  resolveId(source) {
    const roots = {
      '@/': 'packages/core/src/',
      '@mapLib/': `packages/${variant}/src/adapter/`,
      '@dev/': 'apps/dev/',
      '@tests/': 'tests/',
    };
    const entry = Object.entries(roots).find(([prefix]) => source.startsWith(prefix));
    if (!entry || source.endsWith('.css')) return null;

    const [prefix, root] = entry;
    const resolved = path.resolve('dist/types', root, source.slice(prefix.length));
    const candidates = /\.tsx?$/.test(resolved)
      ? [resolved.replace(/\.tsx?$/, '.d.ts')]
      : [`${resolved}.d.ts`, path.join(resolved, 'index.d.ts')];
    return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
  },
});

export const createDtsRollupConfig = ({ input, output, variant }) => ({
  input,
  output: {
    file: output,
    format: 'es',
  },
  plugins: [declarationAliasPlugin(variant), dts()],
});
