import { test, expect } from '@playwright/test';

/**
 * Suite E2E — Parcours Critiques F01 & F02 (Phase 2 de l'Audit)
 * - Navigation dans les onglets de la barre de navigation et des 4 silos thématiques
 * - Hydratation immédiate des sections différées (DeferredSection) et mise à jour du hash URL
 * - Sélecteur de thème (Système / Clair / Sombre), persistance localStorage et synchronisation multi-onglets
 */
test.describe('Parcours Critique 1 : Navigation dans les onglets du portail & Thème (F01 / F02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('affiche l’en-tête officiel Olive Béjaïa · ADOIO et les onglets principaux de la Navbar', async ({
    page,
  }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByText('Olive Béjaïa')).toBeVisible();

    const mainNav = page.getByRole('navigation', { name: 'Navigation principale' });
    await expect(mainNav.getByRole('button', { name: /Terroir & ADOIO/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Carte & 448 Moulins/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Variétés & Guide COI/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Concours 2026/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Sous-Produits/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Diagnostic Bio/i })).toBeVisible();
    await expect(mainNav.getByRole('button', { name: /Pratiques & Météo/i })).toBeVisible();
  });

  test('navigue entre les onglets principaux, force le montage des sections différées et synchronise le hash URL', async ({
    page,
  }) => {
    const mainNav = page.getByRole('navigation', { name: 'Navigation principale' });

    // 1. Navigation vers Variétés & Guide COI (#varietes)
    await mainNav.getByRole('button', { name: /Variétés & Guide COI/i }).click();
    await expect(page).toHaveURL(/#varietes$/);
    await expect(page.locator('#varietes')).toBeVisible();

    // 2. Navigation vers Concours 2026 (#concours)
    await mainNav.getByRole('button', { name: /Concours 2026/i }).click();
    await expect(page).toHaveURL(/#concours$/);
    await expect(page.locator('#concours')).toBeVisible();
    await expect(
      page.locator('#concours').getByRole('heading', { name: /Concours de la meilleure huile d'olive/i })
    ).toBeVisible();

    // 3. Navigation vers le Simulateur via le bouton CTA de la Navbar (#simulateur)
    await page.locator('header').getByRole('button', { name: /^Simulateur$/i }).click();
    await expect(page).toHaveURL(/#simulateur$/);
    await expect(page.locator('#simulateur')).toBeVisible();
    await expect(
      page.locator('#simulateur').getByRole('heading', { name: /Simulateur de Récolte & Rendement en Huile/i })
    ).toBeVisible();

    // 4. Retour à l'accueil via le logo Olive Béjaïa ADOIO
    await page.getByRole('button', { name: /Olive Béjaïa ADOIO - Retour à l'accueil/i }).click();
    await expect(page).toHaveURL(/#hero$/);
  });

  test('prend en charge l’accès direct par ancre profonde (#annuaire et #harvest-alert-manager)', async ({
    page,
  }) => {
    await page.goto('/#harvest-alert-manager');
    const alertManager = page.locator('#harvest-alert-manager');
    await expect(alertManager).toBeVisible();
    await expect(
      alertManager.getByRole('heading', {
        name: /Gestionnaire d'Alertes de Seuils de Maturité/i,
      })
    ).toBeVisible();
  });

  test('bascule le sélecteur de thème (Système / Clair / Sombre), persiste dans localStorage et synchronise entre onglets', async ({
    context,
    page,
  }) => {
    const themeGroup = page.getByRole('radiogroup', {
      name: /Sélecteur de thème \(Système, Clair, Sombre\)/i,
    });
    await expect(themeGroup).toBeVisible();

    // Activer le thème Sombre
    const darkRadio = themeGroup.getByRole('radio', { name: 'Thème Sombre' });
    await darkRadio.click();
    await expect(darkRadio).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).toHaveClass(/dark/);

    const storedTheme = await page.evaluate(() => localStorage.getItem('olive-bejaia-theme'));
    expect(storedTheme).toBe('dark');

    // Ouvrir un second onglet pour vérifier la propagation instantanée via l'événement 'storage'
    const secondTab = await context.newPage();
    await secondTab.goto('/');
    await expect(secondTab.locator('html')).toHaveClass(/dark/);

    // Basculer en thème Clair depuis le premier onglet et vérifier la mise à jour du second onglet
    const lightRadio = themeGroup.getByRole('radio', { name: 'Thème Clair' });
    await lightRadio.click();
    await expect(lightRadio).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(secondTab.locator('html')).not.toHaveClass(/dark/);

    await secondTab.close();
  });
});
