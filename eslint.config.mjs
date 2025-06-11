import typescriptEslint from '@typescript-eslint/eslint-plugin';
import svelte from 'eslint-plugin-svelte';
import _import from 'eslint-plugin-import';
import {fixupPluginRules, includeIgnoreFile} from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import parser from 'svelte-eslint-parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';


const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '**/dist/*',
      '*.js',
      '*.mjs',
    ],
  }, ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:svelte/recommended',
  ), {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      svelte,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.svelte'],
      },
    },

    settings: {
      svelte: {
        compilerOptions: {
          baseUrl: '.',

          paths: {
            '@/*': ['src/*'],
          },
        },
      },

      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
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

      'import/extensions': ['warn', 'ignorePackages', {
        js: 'always',
        ts: 'always',
      }],

      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  }, {
    files: ['**/*.svelte'],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },

    rules: {
      'import/no-mutable-exports': 'off',
      'import/no-cycle': 'off',
    },
  }];
