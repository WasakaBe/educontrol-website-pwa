import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',  // Intenta cargar desde la red primero, luego desde el caché
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 50, // Mantén hasta 50 solicitudes en el caché
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache de 7 días
              },
              networkTimeoutSeconds: 10, // Si la red no responde en 10 segundos, usa el caché
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache de 7 días
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache de 30 días
              },
            },
          },
        ],
      },
      manifest: {
        name: 'EDUCONTROL',
        short_name: 'EDC',
        description: 'EDUCONTROL',
        theme_color: '#000',
        background_color: '#074d17',
        display: 'standalone',
        icons: [
          {
            src: './logo_cbta_5.png',
            sizes: '977x1279',
            type: 'image/png',
          },
     
        ],
      },
    }),
  ],
});
