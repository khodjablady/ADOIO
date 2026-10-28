import { test, expect } from '@playwright/test';

/**
 * Suite E2E — Parcours Critique F05 (Phase 2 de l'Audit)
 * - Ajout et retrait d'huileries favorites via le bouton cœur sur chaque carte
 * - Persistance dans localStorage ('adoio_favorite_mills_v1') après rechargement
 * - Filtrage via le bouton de barre d'outils "Favoris uniquement"
 * - Vérification du bouton "Partager sur WhatsApp" sur les cartes d'huileries
 */
test.describe('Parcours Critique 3 : Filtrage et Persistance des Huileries Favorites (F05)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#annuaire');
    await expect(page.locator('#annuaire')).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('adoio_favorite_mills_v1'));
    await page.reload();
    await expect(page.locator('#annuaire')).toBeVisible();
  });

  test('ajoute des huileries en favoris, filtre via la barre d’outils et persiste dans localStorage après rechargement', async ({
    page,
  }) => {
    const directory = page.locator('#annuaire');

    // Vérifier que le compteur du filtre "Favoris uniquement" est initialement à 0
    const favFilterBtn = directory.getByRole('button', {
      name: /Filtrer pour afficher uniquement mes huileries favorites|Afficher toutes les huileries/i,
    });
    await expect(favFilterBtn).toBeVisible();
    await expect(favFilterBtn).toHaveAttribute('aria-pressed', 'false');

    // Ajouter la première huilerie aux favoris via son bouton cœur sur la carte
    const firstAddFavBtn = directory
      .getByRole('button', { name: /^Ajouter .* aux favoris$/i })
      .first();
    const firstButtonLabel = (await firstAddFavBtn.getAttribute('aria-label')) || '';
    const millName = firstButtonLabel.replace(/^Ajouter\s+/i, '').replace(/\s+aux favoris$/i, '');

    await firstAddFavBtn.click();

    // Vérifier que le bouton de la carte est passé à l'état pressé (aria-pressed="true")
    const removeFavBtn = directory.getByRole('button', {
      name: `Retirer ${millName} des favoris`,
    });
    await expect(removeFavBtn).toHaveAttribute('aria-pressed', 'true');

    // Vérifier la sauvegarde immédiate dans localStorage ('adoio_favorite_mills_v1')
    const savedIds = await page.evaluate(() => {
      const raw = localStorage.getItem('adoio_favorite_mills_v1');
      return raw ? JSON.parse(raw) : [];
    });
    expect(savedIds.length).toBe(1);

    // Activer le filtre "Favoris uniquement" dans la barre d'outils
    await favFilterBtn.click();
    await expect(favFilterBtn).toHaveAttribute('aria-pressed', 'true');

    // Vérifier que la bannière de synthèse des favoris et l'huilerie sélectionnée s'affichent
    await expect(
      directory.getByRole('region', { name: /Synthèse de vos huileries favorites/i })
    ).toBeVisible();
    await expect(directory.getByRole('heading', { name: millName })).toBeVisible();

    // Recharger la page et vérifier que le favori est toujours persisté dans localStorage
    await page.reload();
    await expect(page.locator('#annuaire')).toBeVisible();
    await expect(
      directory.getByRole('button', { name: `Retirer ${millName} des favoris` })
    ).toHaveAttribute('aria-pressed', 'true');

    // Retirer l'huilerie des favoris et vérifier le retour à l'état vide dans l'onglet Favoris
    await directory.getByRole('button', { name: `Retirer ${millName} des favoris` }).click();
    const afterRemoveIds = await page.evaluate(() => {
      const raw = localStorage.getItem('adoio_favorite_mills_v1');
      return raw ? JSON.parse(raw) : [];
    });
    expect(afterRemoveIds.length).toBe(0);
  });

  test('expose un bouton "Partager sur WhatsApp" valide sur chaque carte d’huilerie', async ({
    page,
  }) => {
    const directory = page.locator('#annuaire');
    const whatsappLinks = directory.getByRole('link', { name: /Partager .* sur WhatsApp/i });
    const count = await whatsappLinks.count();
    expect(count).toBeGreaterThan(0);

    const firstHref = await whatsappLinks.first().getAttribute('href');
    expect(firstHref).toContain('https://wa.me/?text=');
    expect(decodeURIComponent(firstHref || '')).toContain('Recommandation Huilerie — ADOIO Béjaïa');
  });
});
