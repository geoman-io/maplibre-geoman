import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/*.js',
      '**/*.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      'class-methods-use-this': 'off',
      'prefer-destructuring': 'off',
      'max-classes-per-file': 'off',
      'no-return-assign': 'off',
      'arrow-body-style': 'off',
      'no-else-return': 'off',
      'no-console': 'off',
      'object-curly-newline': 'off',

      'no-multiple-empty-lines': ['error', {
        max: 2,
      }],

      'no-useless-assignment': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },

    rules: {
      'svelte/require-each-key': 'warn',
      'svelte/no-at-html-tags': 'warn',
    },
  },
);
