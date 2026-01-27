import { completeConfigBase } from 'eslint-config-complete';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    ...completeConfigBase,

    {
        rules: {
            // Insert changed or disabled rules here, if necessary.
        },
    }
);
