import { completeConfigBase } from 'eslint-config-complete';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    ...completeConfigBase,

    {
        rules: {
            '@stylistic/quotes': 'off',
            'import-x/no-unassigned-import': [
                'error',
                {
                    allow: ['**/*.css'],
                },
            ],
        },
    }
);
