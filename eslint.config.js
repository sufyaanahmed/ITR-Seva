import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'assets-archive/**',
      '.qa/**',
      'playwright-report/**',
      'test-results/**',
      'public/agent.md',
      'public/llms.txt',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // These are the correctness rules that apply whether or not the project
      // opts into the experimental React Compiler. Compiler-specific rules
      // can be enabled separately when that compiler is adopted.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React 17+ JSX transform means JSX files need not import React solely
      // to put the identifier in scope.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' }],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.{config,conf}.js', 'playwright.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Browser globals are referenced inside Playwright page.evaluate
      // callbacks even though those callbacks are authored in Node files.
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['tests/e2e/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
