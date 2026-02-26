import dts from 'rollup-plugin-dts';

export const createDtsRollupConfig = ({ input, output }) => ({
  input,
  output: {
    file: output,
    format: 'es',
  },
  plugins: [dts()],
});
