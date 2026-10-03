import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.png'],
      manifest: {
        name: 'Moji recepti',
        short_name: 'Recepti',
        description: 'Lična kolekcija zdravih, high-protein recepata.',
        theme_color: '#C08A2E',
        background_color: '#FBF8F2',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'sr',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
