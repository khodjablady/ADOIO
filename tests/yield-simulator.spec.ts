import { test, expect } from '@playwright/test';

/**
 * Suite E2E — Parcours Critique F07 (Phase 2 de l'Audit)
 * - Convertisseur Express (Poids d'olives kg/qx & rendement configurable 15% à 25%)
 * - Synchronisation avec le simulateur agronomique complet
 * - Calculs du simulateur par poids et par nombre d'oliviers, comparaison variétale (Chemlal vs Bouchouk)
 * - Gestionnaire d'Alertes de Seuils de Maturité (HarvestAlertManager) avec persistance localStorage
 */
test.describe('Parcours Critique 2 : Calculs du Simulateur de Rendement & Alertes Maturité (F07)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#simulateur');
    await expect(page.locator('#simulateur')).toBeVisible();
  });

  test('calcule exactement le volume d’huile, les bidons de 5L et bouteilles de 75cl dans le Convertisseur Express', async ({
    page,
  }) => {
    const simulator = page.locator('#simulateur');

    // Valeur initiale par défaut : 300 kg à 20% = 60 Litres (12 bidons de 5L, 80 bouteilles de 75cl)
    const weightInput = simulator.locator('#quick-olive-weight');
    await expect(weightInput).toHaveValue('300');
    await expect(simulator.getByText('12 bidons')).toBeVisible();
    await expect(simulator.getByText('80 bout.')).toBeVisible();

    // Sélectionner le lot prédéfini "1 000 kg (10 qx)" et le rendement "22.5% Bouchouk" -> 225 Litres (45 bidons de 5L)
    await simulator.getByRole('button', { name: '1 000 kg (10 qx)' }).click();
    await simulator.getByRole('button', { name: '22.5% Bouchouk' }).click();

    await expect(weightInput).toHaveValue('1000');
    await expect(simulator.getByText('22.5% (22.5 L/qx)')).toBeVisible();
    await expect(simulator.getByText('45 bidons')).toBeVisible();
    await expect(simulator.getByText('300 bout.')).toBeVisible();

    // Basculer l'unité en Quintaux (qx) : 1000 kg -> 10 qx
    await simulator.getByRole('button', { name: 'Quintaux (qx)' }).click();
    await expect(weightInput).toHaveValue('10');
  });

  test('synchronise le convertisseur express avec le simulateur complet et met à jour les calculs par nombre d’oliviers', async ({
    page,
  }) => {
    const simulator = page.locator('#simulateur');

    // Sélectionner 1 000 kg et synchroniser avec le simulateur complet
    await simulator.getByRole('button', { name: '1 000 kg (10 qx)' }).click();
    await simulator
      .getByRole('button', { name: /Synchroniser avec le simulateur complet/i })
      .click();

    await expect(simulator.getByText('1000 kg (10.0 quintaux)')).toBeVisible();

    // Basculer sur le mode "Par Nombre d'Oliviers" (30 arbres × 25 kg/arbre = 750 kg par défaut)
    await simulator.getByRole('button', { name: /Par Nombre d'Oliviers/i }).click();
    await expect(simulator.getByText('30 arbres')).toBeVisible();
    await expect(simulator.getByText('25 kg/arbre')).toBeVisible();

    // Vérifier l'inversion Variété A ⇄ Variété B dans le comparateur variétal
    const swapButton = simulator.getByRole('button', { name: /Inverser A ⇄ B/i });
    await expect(swapButton).toBeVisible();
    await swapButton.click();
  });

  test('permet de s’abonner à un seuil de maturité dans HarvestAlertManager avec persistance dans localStorage', async ({
    page,
  }) => {
    const alertManager = page.locator('#harvest-alert-manager');
    await expect(alertManager).toBeVisible();

    // Remplir le formulaire de nouvel abonnement
    await alertManager.locator('#alert-parcel-name').fill('Verger Test Tazmalt');
    await alertManager.locator('#alert-commune').fill('Tazmalt');
    await alertManager.locator('#alert-variety').selectOption('limli');
    await alertManager.locator('#alert-im-min').fill('2.7');
    await alertManager.locator('#alert-im-max').fill('3.5');
    await alertManager.locator('#alert-min-oil').fill('19.5');

    await alertManager
      .getByRole('button', { name: /S'abonner à ce seuil de maturité/i })
      .click();

    // Vérifier l'affichage de la confirmation et de la nouvelle carte d'abonnement
    await expect(alertManager.getByText('Verger Test Tazmalt').first()).toBeVisible();

    // Vérifier la persistance réelle dans localStorage
    const storedAlerts = await page.evaluate(() => {
      const raw = localStorage.getItem('adoio_harvest_maturity_alerts_v1');
      return raw ? JSON.parse(raw) : [];
    });

    expect(Array.isArray(storedAlerts)).toBe(true);
    expect(
      storedAlerts.some(
        (sub: { parcelName: string; commune: string }) =>
          sub.parcelName === 'Verger Test Tazmalt' && sub.commune === 'Tazmalt'
      )
    ).toBe(true);
  });
});
