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
            'api': '/vercel/api',
        },
    },
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
});
