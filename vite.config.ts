import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    plugins: [react()],
    resolve: {
        alias: {
            'components': '/src/components',
            '@constants': '/src/constants',
            'hooks': '/src/hooks',
            'types': '/src/types',
        },
    },
    server: {
        watch: {
            ignored: ['**/api/**'],
        },
        fs: {
            deny: ['api/**'],
        },
        port: 3000,
        open: true,
    },
    preview: {
        port: 3000,
    },
    optimizeDeps: {
        exclude: ['api'],
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
