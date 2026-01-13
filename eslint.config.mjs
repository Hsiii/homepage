import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import sortKeys from 'eslint-plugin-sort-keys';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...fixupConfigRules(pluginReact.configs.flat.recommended),
    {
        plugins: {
            'react-hooks': fixupPluginRules(pluginReactHooks),
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                webpack: 'readonly',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        plugins: {
            import: fixupPluginRules(importPlugin),
        },
        rules: {
            'import/no-duplicates': ['error', { considerQueryString: true }],
            'import/order': 'off',
        },
    },
    {
        files: ['**/links.ts'],
        plugins: {
            'sort-keys': sortKeys,
        },
        rules: {
            'sort-keys/sort-keys-fix': 'error',
        },
    },
);
