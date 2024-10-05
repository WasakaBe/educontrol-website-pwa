import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'documents',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Cache por 30 días
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache por 7 días
              },
            },
          },
        ],
      },
      manifest: {
        name: 'My PWA EDUCONTROL',
        short_name: 'PWA EDUCONTROL',
        description: 'This is my PWA Application EDUCONTROL',
        theme_color: '#000',
        icons: [
          {
            src: './logo_cbta_5.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './logo_cbta_5.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
