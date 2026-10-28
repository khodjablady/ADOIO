import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright E2E — Portail Olive Béjaïa & ADOIO
 * Couvre les parcours critiques identifiés dans la Phase 2 de l'Audit Global :
 * 1. Navigation dans les onglets & silos du portail + synchronisation du thème (F01 / F02)
 * 2. Calculs du simulateur de rendement & alertes de seuils de maturité (F07)
 * 3. Ajout, persistance localStorage et filtrage des huileries favorites + partage WhatsApp (F05)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    viewport: { width: 1440, height: 900 },
    locale: 'fr-FR',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
