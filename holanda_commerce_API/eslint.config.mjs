import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { allowTemplateLiterals: true }],
      'curly': 'error',
      'no-irregular-whitespace': 'error',
      'object-curly-spacing': ['error', 'always']
    }
  }
]);
