import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/homepage/',
    plugins: [react()],
    resolve: {
        alias: {
            'components': '/src/components',
            '@constants': '/src/constants',
            'hooks': '/src/hooks',
            'types': '/src/types',
        },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
});
