import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'sw-push.js'],
        manifest: {
          id: '/',
          name: 'Olive Béjaïa - Portail Oléicole & ADOIO',
          short_name: 'OliveBéjaïa',
          description: 'Portail oléicole hors-ligne pour les producteurs et oléiculteurs de Béjaïa et de Kabylie.',
          theme_color: '#233416',
          background_color: '#FAF7F2',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait-primary',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          importScripts: ['/sw-push.js'],
          // Precache core application shell without forcing heavy below-the-fold vendor chunks on initial 3G load
          globPatterns: ['**/*.{css,html,ico,svg,woff,woff2}', 'assets/index-*.js', 'assets/vendor-react-*.js', 'assets/vendor-icons-*.js'],
          globIgnores: ['**/vendor-charts-*.js', '**/vendor-maps-*.js', '**/vendor-motion-*.js', '**/images/paysages/**'],
          runtimeCaching: [
            {
              urlPattern: /\/assets\/.*\.js$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'adoio-js-chunks-cache',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'weather-api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/images\/.*\.(?:jpg|jpeg|png|webp|svg)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'adoio-images-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/assets\/.*\.pdf$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'adoio-pdf-guides-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 90,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
      {
        name: 'disable-vite-client-ws-error',
        enforce: 'post',
        transform(code, id) {
          if (id.includes('vite/dist/client/client.mjs')) {
            return code
              .replace(
                'reject(/* @__PURE__ */ new Error("WebSocket closed without opened."));',
                'resolve();'
              )
              .replace(
                'transport.connect(createHMRHandler(handleMessage));',
                'transport.connect(createHMRHandler(handleMessage)).catch(() => {});'
              );
          }
          if (code.includes("@vitejs/plugin-react can't detect preamble")) {
            return code.replace(
              /if\s*\(!window\.\$RefreshReg\$\)\s*\{\s*throw new Error\(\s*"@vitejs\/plugin-react can't detect preamble\. Something is wrong\."\s*\);\s*\}/g,
              `if (!window.$RefreshReg$) { try { RefreshRuntime.injectIntoGlobalHook(window); } catch {} window.$RefreshReg$ = () => {}; window.$RefreshSig$ = () => (type) => type; }`
            );
          }
        },
      },
    ],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      modulePreload: {
        // Prevent preloading lazy chunks in index.html so below-the-fold libraries only download when needed
        resolveDependencies: (_filename, deps) => {
          return deps.filter(
            (dep) =>
              !dep.includes('vendor-charts') &&
              !dep.includes('vendor-maps') &&
              !dep.includes('vendor-motion')
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('@vis.gl/react-google-maps')) {
                return 'vendor-maps';
              }
              if (id.includes('framer-motion') || id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
