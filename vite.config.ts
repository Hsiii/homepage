import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            components: '/src/components',
            constants: '/src/constants',
            hooks: '/src/hooks',
            types: '/src/types',
        },
    },
});
