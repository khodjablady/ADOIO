import { describe, it, expect } from 'vitest';
import { OLIVE_VARIETIES } from '../data/bejaiaOliveData';
import { filterOliveVarieties } from '../components/VarietiesGuide';

describe('filterOliveVarieties - Système de filtrage des variétés de Béjaïa', () => {
  it('returns all native varieties when default filters are applied', () => {
    const result = filterOliveVarieties(OLIVE_VARIETIES, {});
    expect(result).toHaveLength(OLIVE_VARIETIES.length);
  });

  it('filters specifically for Chemlal, Bouchouk, and Azeradj when toggled', () => {
    const chemlal = filterOliveVarieties(OLIVE_VARIETIES, { varietyId: 'chemlal' });
    expect(chemlal).toHaveLength(1);
    expect(chemlal[0].id).toBe('chemlal');
    expect(chemlal[0].name).toContain('Chemlal');

    const bouchouk = filterOliveVarieties(OLIVE_VARIETIES, { varietyId: 'bouchouk' });
    expect(bouchouk).toHaveLength(1);
    expect(bouchouk[0].id).toBe('bouchouk');
    expect(bouchouk[0].name).toContain('Bouchouk');

    const azeradj = filterOliveVarieties(OLIVE_VARIETIES, { varietyId: 'azeradj' });
    expect(azeradj).toHaveLength(1);
    expect(azeradj[0].id).toBe('azeradj');
    expect(azeradj[0].name).toContain('Azeradj');
  });

  it('filters by vocation category (oil vs mixed)', () => {
    const oilOnly = filterOliveVarieties(OLIVE_VARIETIES, { category: 'oil' });
    expect(oilOnly.every((v) => v.category === 'oil')).toBe(true);
    expect(oilOnly.map((v) => v.id)).toEqual(
      expect.arrayContaining(['chemlal', 'aberkane', 'limli'])
    );

    const mixedOnly = filterOliveVarieties(OLIVE_VARIETIES, { category: 'mixed' });
    expect(mixedOnly.every((v) => v.category === 'mixed')).toBe(true);
    expect(mixedOnly.map((v) => v.id)).toEqual(
      expect.arrayContaining(['bouchouk', 'azeradj'])
    );
  });

  it('filters by harvest precocity group (early, mid, late)', () => {
    const early = filterOliveVarieties(OLIVE_VARIETIES, { precocity: 'early' });
    expect(early.map((v) => v.id)).toEqual(
      expect.arrayContaining(['azeradj', 'bouchouk', 'limli'])
    );

    const mid = filterOliveVarieties(OLIVE_VARIETIES, { precocity: 'mid' });
    expect(mid.map((v) => v.id)).toContain('chemlal');

    const late = filterOliveVarieties(OLIVE_VARIETIES, { precocity: 'late' });
    expect(late).toHaveLength(1);
    expect(late[0].id).toBe('aberkane');
  });

  it('filters by search query matching Tamazight names, flavor profile, or terroir', () => {
    const byTamazight = filterOliveVarieties(OLIVE_VARIETIES, { searchQuery: 'Tacmlalt' });
    expect(byTamazight).toHaveLength(1);
    expect(byTamazight[0].id).toBe('chemlal');

    const byFlavor = filterOliveVarieties(OLIVE_VARIETIES, { searchQuery: 'artichaut' });
    expect(byFlavor).toHaveLength(1);
    expect(byFlavor[0].id).toBe('bouchouk');

    const noMatch = filterOliveVarieties(OLIVE_VARIETIES, {
      varietyId: 'chemlal',
      category: 'mixed',
    });
    expect(noMatch).toHaveLength(0);
  });
});
