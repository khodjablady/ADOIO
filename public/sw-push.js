/**
 * Service Worker Extension for Push Notifications & Agricultural Weather Alerts
 * Wilaya de Béjaïa - ADOIO (Association de Développement de l'Oléiculture d'Ighzer Amokrane et Oued Soummam)
 */

self.addEventListener('push', (event) => {
  let alertData = {
    title: '⚠️ Alerte Météo Oléicole · Béjaïa',
    body: 'Vigilance climatique pour les oliveraies et la récolte en cours.',
    icon: '/pwa-192x192.png',
    badge: '/icon.svg',
    tag: 'olive-bejaia-weather-alert',
    renotify: true,
    data: {
      url: '/#pratiques',
      timestamp: Date.now(),
      type: 'general'
    }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      alertData = { ...alertData, ...parsed };
      if (parsed.data) {
        alertData.data = { ...alertData.data, ...parsed.data };
      }
    } catch {
      alertData.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: alertData.body,
    icon: alertData.icon || '/pwa-192x192.png',
    badge: alertData.badge || '/icon.svg',
    tag: alertData.tag || 'olive-weather-alert',
    renotify: true,
    vibrate: [250, 100, 250, 100, 400],
    data: alertData.data || { url: '/#pratiques' },
    actions: [
      {
        action: 'view-tips',
        title: '🛡️ Mesures d’urgence'
      },
      {
        action: 'dismiss',
        title: 'Compris'
      }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(alertData.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/#pratiques';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus and navigate it
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  // Can be used for logging telemetry if desired
});

// Communication channel with main React app to trigger notifications via Service Worker
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'TRIGGER_SW_NOTIFICATION') {
    const { title, options } = event.data;
    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      vibrate: [250, 100, 250, 100, 400],
      tag: 'olive-weather-alert',
      renotify: true,
      data: { url: '/#pratiques' },
      actions: [
        { action: 'view-tips', title: '🛡️ Mesures d’urgence' },
        { action: 'dismiss', title: 'Compris' }
      ]
    };

    const finalOptions = Object.assign({}, defaultOptions, options || {});
    self.registration.showNotification(title, finalOptions);
  }
});
