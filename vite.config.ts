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
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'sw-push.js',
        ],
        manifest: {
          id: '/',
          name: 'Olive Béjaïa - Portail Oléicole & ADOIO',
          short_name: 'OliveBéjaïa',
          description: 'Portail oléicole hors-ligne pour les producteurs et oléiculteurs de Béjaïa et de Kabylie.',
          lang: 'fr',
          dir: 'ltr',
          theme_color: '#233416',
          background_color: '#FAF7F2',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait-primary',
          categories: ['agriculture', 'productivity', 'utilities', 'education'],
          prefer_related_applications: false,
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
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
          shortcuts: [
            {
              name: 'Annuaire 448 Huileries',
              short_name: 'Huileries',
              description: 'Consulter hors-ligne les 448 moulins et huileries des 52 communes de Béjaïa',
              url: '/#annuaire',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'Simulateur de Rendement',
              short_name: 'Simulateur',
              description: 'Calculer le rendement en huile (L/qx) par variété et maturité au verger',
              url: '/#simulateur',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'Diagnostic Phytosanitaire Bio',
              short_name: 'Diagnostic Bio',
              description: 'Identifier les maladies et ravageurs de l’olivier sans réseau mobile',
              url: '/#diagnostic-phytosanitaire',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
            {
              name: 'Calendrier & Taille',
              short_name: 'Calendrier',
              description: 'Accéder aux guides techniques de taille, récolte et bonnes pratiques ADOIO',
              url: '/#pratiques',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
            },
          ],
        },
        workbox: {
          importScripts: ['/sw-push.js'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/offline-guides\//],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // Precache all critical manifest assets, HTML shell, CSS, data-terroir (448 mills + varieties), and interactive tool chunks for 100% offline reliability in rural Béjaïa
          globPatterns: [
            '**/*.{js,css,html,ico,woff,woff2}',
            'assets/*.png',
            'images/medailles/*.svg',
          ],
          // Exclude sw-push.js (already in includeAssets) and bulky decorative landscape photography from initial precache (cached on-demand via runtimeCaching)
          globIgnores: [
            '**/sw-push.js',
            '**/images/paysages/**',
            '**/assets/aistudio/**',
          ],
          runtimeCaching: [
            {
              urlPattern: /\/(?:manifest\.webmanifest|pwa-.*\.png|apple-touch-icon\.png|icon\.svg)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'adoio-manifest-critical-assets',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 90,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/assets\/.*\.(?:js|css)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'adoio-js-chunks-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/api\/(?:community\/state|weather)/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'adoio-rural-api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 25,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
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
              handler: 'NetworkFirst',
              options: {
                cacheName: 'weather-api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 15,
                  maxAgeSeconds: 60 * 60 * 24 * 3,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/(?:images|assets\/aistudio)\/.*\.(?:jpg|jpeg|png|webp|svg)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'adoio-images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 60,
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
                  maxEntries: 15,
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
            if (id.includes('src/data/bejaiaOliveData')) {
              return 'data-terroir';
            }
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
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      include: ['src/tests/**/*.test.ts'],
      exclude: ['tests/**', 'node_modules/**', 'dist/**', 'firestore.rules.test.ts'],
    },
  };
});
