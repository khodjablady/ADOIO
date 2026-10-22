/**
 * Service Worker PWA - Web Push API & Vigilance Oléicole (Périodes Critiques & Météo Locale)
 * Wilaya de Béjaïa - ADOIO (Association pour le développement de l'oléiculture et des industries oléicoles)
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function buildNotificationConfig(rawPayload) {
  const defaultData = {
    title: '🌿 Vigilance Oléicole ADOIO · Béjaïa',
    body: 'Nouvelle alerte période critique (récolte ou météo locale) sur votre bassin oléicole.',
    icon: '/pwa-192x192.png',
    badge: '/icon.svg',
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
      badge: merged.badge || '/icon.svg',
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

// Communication channel with main React app to trigger or simulate Push notifications via Service Worker
self.addEventListener('message', (event) => {
  if (!event.data) return;

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
});
