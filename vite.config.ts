import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as dotenv from 'dotenv';
dotenv.config(); 

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
      runtimeCaching: [
        {
          urlPattern: /\/api\//,
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
        {
          src: './logocbtapequeno.png', // Ruta al icono más pequeño
          sizes: '144x144', // Tamaño del icono
          type: 'image/png', // Tipo de imagen
        },
   
      ],
    },
  }), 
  sentryVitePlugin({
    org: "universidad-tecnologica-de--2z",
    project: "javascript-react",
    authToken: process.env.SENTRY_AUTH_TOKEN, // Usar el token de Sentry desde las variables de entorno,
    release: {
      name: process.env.SENTRY_RELEASE || `educontrol-web-pwa@${new Date().toISOString()}`,
      inject: true, // Asegura que Sentry inyecte la versión del release en el bundle para identificar errores correctamente
      finalize: true, // Finaliza el release automáticamente
    },
  }),
  
],

  build: {
    sourcemap: true
  }
});