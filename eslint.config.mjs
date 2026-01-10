import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import sortKeys from 'eslint-plugin-sort-keys';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                webpack: 'readonly',
            },
        },
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        plugins: { import: importPlugin },
        rules: {
            'import/no-duplicates': ['error', { considerQueryString: true }],
            'import/order': 'off',
        },
    },
    {
        files: ['**/links.jsx'],
        plugins: { 'sort-keys': sortKeys },
        rules: {
            'sort-keys/sort-keys-fix': 'error',
        },
    },
]);
