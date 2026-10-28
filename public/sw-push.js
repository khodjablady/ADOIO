/**
 * Service Worker PWA - Mode Hors-Ligne Rural (Béjaïa) & Web Push API (Vigilance Oléicole ADOIO)
 * Pré-mise en cache des ressources critiques du manifest et résilience 2G/3G/Hors-Ligne
 */

const PRIORITY_GUIDES_CACHE = 'adoio-priority-guides-v1';
const CRITICAL_MANIFEST_CACHE = 'adoio-critical-manifest-v2';

const CORE_MANIFEST_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
];

async function precacheCriticalManifestAssets(extraUrls = []) {
  if (!('caches' in self)) return [];
  const cache = await self.caches.open(CRITICAL_MANIFEST_CACHE);
  const urlsToCache = new Set([...CORE_MANIFEST_ASSETS, ...extraUrls]);

  // Dynamically inspect /manifest.webmanifest to include all declared icons, start_url, and shortcuts
  try {
    const manifestRes = await fetch('/manifest.webmanifest', { cache: 'no-cache' });
    if (manifestRes && manifestRes.ok) {
      await cache.put('/manifest.webmanifest', manifestRes.clone());
      const manifestData = await manifestRes.json();
      if (manifestData.start_url) urlsToCache.add(manifestData.start_url);
      if (Array.isArray(manifestData.icons)) {
        for (const icon of manifestData.icons) {
          if (icon && icon.src) urlsToCache.add(icon.src);
        }
      }
      if (Array.isArray(manifestData.shortcuts)) {
        for (const shortcut of manifestData.shortcuts) {
          if (shortcut && Array.isArray(shortcut.icons)) {
            for (const icon of shortcut.icons) {
              if (icon && icon.src) urlsToCache.add(icon.src);
            }
          }
        }
      }
    }
  } catch {
    // Already offline or manifest served by Workbox precache
  }

  const cachedList = [];
  await Promise.allSettled(
    Array.from(urlsToCache).map(async (rawUrl) => {
      try {
        const cleanUrl = rawUrl.split('#')[0] || '/';
        const req = new Request(cleanUrl, { credentials: 'same-origin' });
        const res = await fetch(req);
        if (res && (res.ok || res.status === 200)) {
          await cache.put(cleanUrl, res.clone());
          cachedList.push(cleanUrl);
        }
      } catch {
        // Ignore individual fetch errors when offline
      }
    })
  );

  return cachedList;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(precacheCriticalManifestAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      precacheCriticalManifestAssets(),
      // Clean up legacy critical manifest caches if any
      self.caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('adoio-critical-manifest-') && k !== CRITICAL_MANIFEST_CACHE)
            .map((k) => self.caches.delete(k))
        )
      ),
    ])
  );
});

function buildNotificationConfig(rawPayload) {
  const defaultData = {
    title: '🌿 Vigilance Oléicole ADOIO · Béjaïa',
    body: 'Nouvelle alerte période critique (récolte ou météo locale) sur votre bassin oléicole.',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'adoio-push-alert',
    renotify: true,
    data: {
      url: '/#alertes-meteo',
      timestamp: Date.now(),
      type: 'harvest-start',
    },
  };

  const merged = Object.assign({}, defaultData, rawPayload || {});
  if (rawPayload && rawPayload.data) {
    merged.data = Object.assign({}, defaultData.data, rawPayload.data);
  }

  const isHarvest = merged.data.type === 'harvest-start';
  const isAgronomic = merged.data.type === 'agronomic-period';

  const actions = isHarvest
    ? [
        { action: 'view-sim', title: '🫒 Simulateur & Maturité' },
        { action: 'dismiss', title: 'Compris' },
      ]
    : isAgronomic
    ? [
        { action: 'view-tips', title: '📅 Calendrier & Conseils' },
        { action: 'dismiss', title: 'Compris' },
      ]
    : [
        { action: 'view-tips', title: '🛡️ Mesures d’urgence' },
        { action: 'dismiss', title: 'Compris' },
      ];

  return {
    title: merged.title,
    options: {
      body: merged.body,
      icon: merged.icon || '/pwa-192x192.png',
      badge: merged.badge || '/pwa-192x192.png',
      tag: merged.tag || 'adoio-push-alert',
      renotify: true,
      vibrate: [250, 100, 250, 100, 400],
      data: merged.data,
      actions: merged.actions || actions,
      requireInteraction: true,
    },
  };
}

async function broadcastToClients(messagePayload) {
  try {
    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    for (const client of clientList) {
      client.postMessage(messagePayload);
    }
  } catch {
    // Ignore client broadcast errors
  }
}

self.addEventListener('push', (event) => {
  let rawPayload = {};

  if (event.data) {
    try {
      rawPayload = event.data.json();
    } catch {
      rawPayload = { body: event.data.text() };
    }
  }

  const { title, options } = buildNotificationConfig(rawPayload);

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      broadcastToClients({
        type: 'PUSH_NOTIFICATION_DISPATCHED',
        title,
        options,
        timestamp: Date.now(),
      }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  let targetUrl =
    (event.notification.data && event.notification.data.url) || '/#alertes-meteo';
  if (event.action === 'view-sim') {
    targetUrl = '/#simulateur';
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            if ('navigate' in client) {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

self.addEventListener('notificationclose', () => {
  // Notification closed by user
});

async function cacheGuideEntriesInSW(guides) {
  if (!('caches' in self) || !Array.isArray(guides)) return [];
  const cache = await self.caches.open(PRIORITY_GUIDES_CACHE);
  const cachedIds = [];

  // Ensure critical manifest & shell URLs are also refreshed
  await precacheCriticalManifestAssets();

  for (const guide of guides) {
    if (!guide || !guide.id) continue;
    const guideUrl = `/offline-guides/${guide.id}.json`;
    const payload = JSON.stringify({
      ...guide,
      cachedAt: new Date().toISOString(),
      source: 'ServiceWorker CacheStorage (adoio-priority-guides-v1)',
    });
    const response = new Response(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Cache-Status': 'HIT-OFFLINE-PRIORITY',
        'X-Cached-At': new Date().toISOString(),
      },
    });
    await cache.put(guideUrl, response);
    cachedIds.push(guide.id);
  }

  return cachedIds;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Virtual offline technical guides endpoint (/offline-guides/*.json)
  if (url.pathname.startsWith('/offline-guides/')) {
    event.respondWith(
      self.caches.open(PRIORITY_GUIDES_CACHE).then(async (cache) => {
        const matched = await cache.match(event.request, { ignoreSearch: true });
        if (matched) return matched;
        return new Response(
          JSON.stringify({ error: 'Guide non présent dans le Cache Storage hors-ligne' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // 2. Critical Manifest Assets (manifest.webmanifest, PWA PNG icons, apple-touch-icon, icon.svg)
  const isCriticalManifestAsset =
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/icon.svg' ||
    url.pathname === '/apple-touch-icon.png' ||
    /^\/pwa-.*\.png$/i.test(url.pathname);

  if (isCriticalManifestAsset) {
    event.respondWith(
      self.caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const cache = await self.caches.open(CRITICAL_MANIFEST_CACHE);
              await cache.put(url.pathname, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // 3. Offline navigation fallback for rural zones without signal (supports deep-links ?commune=..., ?mill=...)
  if (event.request.mode === 'navigate' && !self.navigator.onLine) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedIndex =
          (await self.caches.match('/index.html', { ignoreSearch: true })) ||
          (await self.caches.match('/', { ignoreSearch: true }));
        if (cachedIndex) return cachedIndex;
        return new Response('Mode hors-ligne ADOIO Béjaïa actif', {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'PRECACHE_CRITICAL_MANIFEST_ASSETS') {
    const extraUrls = Array.isArray(event.data.urls) ? event.data.urls : [];
    event.waitUntil(
      precacheCriticalManifestAssets(extraUrls).then((cachedUrls) =>
        broadcastToClients({
          type: 'CRITICAL_MANIFEST_PRECACHE_COMPLETE',
          cachedUrls,
          timestamp: Date.now(),
        })
      )
    );
  }

  if (
    event.data.type === 'TRIGGER_SW_NOTIFICATION' ||
    event.data.type === 'SIMULATE_PUSH_EVENT'
  ) {
    const { title, options } = buildNotificationConfig({
      title: event.data.title,
      ...(event.data.options || {}),
    });

    event.waitUntil(
      Promise.all([
        self.registration.showNotification(title, options).catch(() => {}),
        broadcastToClients({
          type: 'PUSH_NOTIFICATION_DISPATCHED',
          title,
          options,
          timestamp: Date.now(),
        }),
      ])
    );
  }

  if (event.data.type === 'CACHE_PRIORITY_GUIDES') {
    event.waitUntil(
      cacheGuideEntriesInSW(event.data.guides || []).then((cachedIds) =>
        broadcastToClients({
          type: 'PRIORITY_GUIDES_CACHE_UPDATED',
          cachedIds,
          timestamp: Date.now(),
        })
      )
    );
  }

  if (event.data.type === 'REMOVE_CACHED_GUIDE' && event.data.guideId) {
    event.waitUntil(
      self.caches
        .open(PRIORITY_GUIDES_CACHE)
        .then((cache) => cache.delete(`/offline-guides/${event.data.guideId}.json`))
        .then(() =>
          broadcastToClients({
            type: 'PRIORITY_GUIDES_CACHE_UPDATED',
            removedId: event.data.guideId,
            timestamp: Date.now(),
          })
        )
    );
  }

  if (event.data.type === 'CLEAR_PRIORITY_GUIDES_CACHE') {
    event.waitUntil(
      self.caches.delete(PRIORITY_GUIDES_CACHE).then(() =>
        broadcastToClients({
          type: 'PRIORITY_GUIDES_CACHE_UPDATED',
          cachedIds: [],
          timestamp: Date.now(),
        })
      )
    );
  }
});

