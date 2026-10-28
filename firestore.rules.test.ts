/**
 * Test Runner de Sécurité Firestore — Vérification des 12 Payloads "Dirty Dozen"
 * Conforme à la Phase 0 (Payload-First Security TDD) de security_spec.md
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list';
  payload: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on millReviews create',
    collection: 'millReviews',
    operation: 'create',
    payload: {
      id: 'rev-test-1',
      millId: 'mill-01',
      authorName: 'Mouloud K.',
      authorRole: 'Oléiculteur Récoltant',
      communeOrigin: 'Seddouk',
      date: '28 Octobre 2026',
      rating: 5,
      extractionYield: 5,
      turnaroundTime: 5,
      hygiene: 5,
      reception: 5,
      volumeBroughtQuintals: 40,
      varietyBrought: 'Chemlal de Kabylie',
      comment: 'Trituration impeccable à froid en moins de 12 heures.',
      recommended: true,
      likesCount: 0,
      isVerifiedAdmin: true, // Ghost field blocked by hasOnly
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'ID Poisoning with special characters',
    collection: 'millReviews',
    operation: 'create',
    payload: {
      id: 'rev/$bad$id!',
      millId: 'mill-01',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Timestamp Spoofing (client-forged createdAt != request.time)',
    collection: 'millReviews',
    operation: 'create',
    payload: {
      id: 'rev-test-3',
      createdAt: '2020-01-01T00:00:00Z',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Too-short comment (< 15 chars) on millReviews',
    collection: 'millReviews',
    operation: 'create',
    payload: {
      id: 'rev-test-4',
      comment: 'Court',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Out-of-bounds rating (rating: 99) on millReviews',
    collection: 'millReviews',
    operation: 'create',
    payload: {
      id: 'rev-test-5',
      rating: 99,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Likes Count Jump (+100 instead of +1/-1) on millReviews update',
    collection: 'millReviews',
    operation: 'update',
    payload: {
      likesCount: 105,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Update Gap attempt modifying immutable comment field on millReviews',
    collection: 'millReviews',
    operation: 'update',
    payload: {
      comment: 'Tentative de modification non autorisée du commentaire existant.',
      likesCount: 1,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Orphaned Write on contestEntries without matching contestRegistrationsPrivate batch',
    collection: 'contestEntries',
    operation: 'create',
    payload: {
      id: 'entry-orphan-1',
      registrationNumber: 'ADOIO-2026-HO-999',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Invalid Competition Category outside official enum on contestEntries',
    collection: 'contestEntries',
    operation: 'create',
    payload: {
      id: 'entry-invalid-cat',
      category: 'Huile Raffinée Industrielle',
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unauthorized PII read on contestRegistrationsPrivate by non-admin visitor',
    collection: 'contestRegistrationsPrivate',
    operation: 'get',
    payload: {},
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unauthorized PII read on adhesionRequestsPrivate by non-admin visitor',
    collection: 'adhesionRequestsPrivate',
    operation: 'get',
    payload: {},
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Email Spoofing Admin read with email_verified == false',
    collection: 'adhesionRequestsPrivate',
    operation: 'list',
    payload: {
      authEmail: 'khodja.co@gmail.com',
      emailVerified: false,
    },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
