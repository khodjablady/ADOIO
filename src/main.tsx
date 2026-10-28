import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Google Maps Platform Tier 1 Quota & Auth Defense
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

function warmCriticalManifestCache() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready
    .then((registration) => {
      const sw = registration.active || navigator.serviceWorker.controller;
      if (!sw) return;

      const discoveredUrls = new Set<string>([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/icon.svg',
        '/pwa-192x192.png',
        '/pwa-512x512.png',
        '/pwa-maskable-512x512.png',
        '/apple-touch-icon.png',
      ]);

      document.querySelectorAll('link[rel="stylesheet"], link[rel="manifest"], link[rel="apple-touch-icon"], link[rel="icon"]').forEach((el) => {
        const href = el.getAttribute('href');
        if (href && href.startsWith('/')) discoveredUrls.add(href);
      });

      sw.postMessage({
        type: 'PRECACHE_CRITICAL_MANIFEST_ASSETS',
        urls: Array.from(discoveredUrls),
      });
    })
    .catch(() => {});
}

// Register full PWA service worker in production; in dev mode, unregister any caching SW and register push-only /sw-push.js
if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Automatically reloads on update when idle
    },
    onOfflineReady() {
      // Cache primed for rural & disconnected regions
      warmCriticalManifestCache();
    },
  });
  warmCriticalManifestCache();
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(async (registrations) => {
      for (const registration of registrations) {
        const scriptUrl = registration.active?.scriptURL || registration.installing?.scriptURL || '';
        if (!scriptUrl.endsWith('/sw-push.js')) {
          await registration.unregister();
        }
      }
      await navigator.serviceWorker.register('/sw-push.js', { scope: '/' });
      warmCriticalManifestCache();
    })
    .catch(() => {});
}

createRoot(document.getElementById('root')!).render(<App />);


