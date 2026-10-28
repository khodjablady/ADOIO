import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  getDocFromServer,
  increment,
  Timestamp,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type { MillReview } from './data/millReviewsData';

// Initialize Firebase SDK with provisioned configuration from firebase-applet-config.json
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { firebaseConfig };

// Validate connection to Firestore on boot as required by Firebase integration guidelines
async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// 0. AUTHENTICATION & PERSISTENT USER PROFILE (/userProfiles/{userId})
// ============================================================================

export interface UserProfileData {
  uid: string;
  displayName: string;
  photoURL: string;
  favoriteMillIds: string[];
  adhesionReferenceId: string;
  adhesionProfileType: string;
  adhesionCommune: string;
  adhesionFarmName: string;
  adhesionSubmittedAt: string;
  quizCompletedLevels: number[];
  quizBestScore1: number;
  quizBestScore2: number;
  quizBestScore3: number;
  quizLastPlayedLevel: 1 | 2 | 3;
}

type AuthProfileListener = (state: {
  user: User | null;
  profile: UserProfileData | null;
  authReady: boolean;
}) => void;

let currentAuthUser: User | null = null;
let currentUserProfile: UserProfileData | null = null;
let isAuthReady = false;
let activeProfileUnsubscribe: (() => void) | null = null;
const authProfileListeners = new Set<AuthProfileListener>();

function notifyAuthProfileListeners(): void {
  const snapshot = {
    user: currentAuthUser,
    profile: currentUserProfile,
    authReady: isAuthReady,
  };
  authProfileListeners.forEach((listener) => listener(snapshot));
}

function readLocalFavoritesSeed(): string[] {
  try {
    const raw = localStorage.getItem('adoio_favorite_mills_v1');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string').slice(0, 50)
      : [];
  } catch {
    return [];
  }
}

function readLocalQuizSeed(): {
  completedLevels: number[];
  bestScores: Record<number, number>;
  lastPlayedLevel: 1 | 2 | 3;
} {
  try {
    const raw = localStorage.getItem('adoio_olive_quiz_progress_v1');
    if (!raw) {
      return { completedLevels: [], bestScores: { 1: 0, 2: 0, 3: 0 }, lastPlayedLevel: 1 };
    }
    const parsed = JSON.parse(raw);
    const completed = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter((n: unknown): n is number => n === 1 || n === 2 || n === 3)
      : [];
    const lastLvl: 1 | 2 | 3 =
      parsed.lastPlayedLevel === 1 || parsed.lastPlayedLevel === 2 || parsed.lastPlayedLevel === 3
        ? parsed.lastPlayedLevel
        : 1;
    return {
      completedLevels: completed.slice(0, 3),
      bestScores: {
        1: Math.min(5, Math.max(0, Number(parsed.bestScores?.[1]) || 0)),
        2: Math.min(5, Math.max(0, Number(parsed.bestScores?.[2]) || 0)),
        3: Math.min(5, Math.max(0, Number(parsed.bestScores?.[3]) || 0)),
      },
      lastPlayedLevel: lastLvl,
    };
  } catch {
    return { completedLevels: [], bestScores: { 1: 0, 2: 0, 3: 0 }, lastPlayedLevel: 1 };
  }
}

async function bootstrapUserProfile(user: User): Promise<void> {
  const path = `userProfiles/${user.uid}`;
  const docRef = doc(db, 'userProfiles', user.uid);

  const localFavs = readLocalFavoritesSeed();
  const localQuiz = readLocalQuizSeed();
  const cleanDisplayName = (
    user.displayName ||
    user.email?.split('@')[0] ||
    'Membre ADOIO'
  )
    .trim()
    .slice(0, 120);
  const cleanPhotoURL = (user.photoURL || '').trim().slice(0, 500);

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        displayName: cleanDisplayName || 'Membre ADOIO',
        photoURL: cleanPhotoURL,
        favoriteMillIds: localFavs,
        adhesionReferenceId: '',
        adhesionProfileType: '',
        adhesionCommune: '',
        adhesionFarmName: '',
        adhesionSubmittedAt: '',
        quizCompletedLevels: localQuiz.completedLevels,
        quizBestScore1: localQuiz.bestScores[1] || 0,
        quizBestScore2: localQuiz.bestScores[2] || 0,
        quizBestScore3: localQuiz.bestScores[3] || 0,
        quizLastPlayedLevel: localQuiz.lastPlayedLevel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const data = existingSnap.data();
      const existingFavs: string[] = Array.isArray(data.favoriteMillIds)
        ? data.favoriteMillIds.filter((x: unknown): x is string => typeof x === 'string')
        : [];
      const mergedFavs = Array.from(new Set([...existingFavs, ...localFavs])).slice(0, 50);

      const existingLevels: number[] = Array.isArray(data.quizCompletedLevels)
        ? data.quizCompletedLevels.filter(
            (n: unknown): n is number => n === 1 || n === 2 || n === 3
          )
        : [];
      const mergedLevels = Array.from(
        new Set([...existingLevels, ...localQuiz.completedLevels])
      ).slice(0, 3);

      const mergedBest1 = Math.max(
        Number(data.quizBestScore1) || 0,
        localQuiz.bestScores[1] || 0
      );
      const mergedBest2 = Math.max(
        Number(data.quizBestScore2) || 0,
        localQuiz.bestScores[2] || 0
      );
      const mergedBest3 = Math.max(
        Number(data.quizBestScore3) || 0,
        localQuiz.bestScores[3] || 0
      );

      if (
        mergedFavs.length !== existingFavs.length ||
        mergedLevels.length !== existingLevels.length ||
        mergedBest1 !== (Number(data.quizBestScore1) || 0) ||
        mergedBest2 !== (Number(data.quizBestScore2) || 0) ||
        mergedBest3 !== (Number(data.quizBestScore3) || 0)
      ) {
        await updateDoc(docRef, {
          displayName: cleanDisplayName || data.displayName || 'Membre ADOIO',
          photoURL: cleanPhotoURL || data.photoURL || '',
          favoriteMillIds: mergedFavs,
          quizCompletedLevels: mergedLevels,
          quizBestScore1: mergedBest1,
          quizBestScore2: mergedBest2,
          quizBestScore3: mergedBest3,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Logged structured FirestoreErrorInfo
    }
  }
}

onAuthStateChanged(auth, (user) => {
  currentAuthUser = user;
  isAuthReady = true;

  if (activeProfileUnsubscribe) {
    activeProfileUnsubscribe();
    activeProfileUnsubscribe = null;
  }

  if (!user) {
    currentUserProfile = null;
    notifyAuthProfileListeners();
    return;
  }

  notifyAuthProfileListeners();

  void bootstrapUserProfile(user).then(() => {
    if (currentAuthUser?.uid !== user.uid) return;
    const docRef = doc(db, 'userProfiles', user.uid);
    activeProfileUnsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data();
        const lastLvlRaw = Number(data.quizLastPlayedLevel);
        const lastLvl: 1 | 2 | 3 =
          lastLvlRaw === 1 || lastLvlRaw === 2 || lastLvlRaw === 3 ? lastLvlRaw : 1;

        currentUserProfile = {
          uid: data.uid || user.uid,
          displayName: data.displayName || user.displayName || 'Membre ADOIO',
          photoURL: data.photoURL || user.photoURL || '',
          favoriteMillIds: Array.isArray(data.favoriteMillIds)
            ? data.favoriteMillIds.filter((x: unknown): x is string => typeof x === 'string')
            : [],
          adhesionReferenceId:
            typeof data.adhesionReferenceId === 'string' ? data.adhesionReferenceId : '',
          adhesionProfileType:
            typeof data.adhesionProfileType === 'string' ? data.adhesionProfileType : '',
          adhesionCommune:
            typeof data.adhesionCommune === 'string' ? data.adhesionCommune : '',
          adhesionFarmName:
            typeof data.adhesionFarmName === 'string' ? data.adhesionFarmName : '',
          adhesionSubmittedAt:
            typeof data.adhesionSubmittedAt === 'string' ? data.adhesionSubmittedAt : '',
          quizCompletedLevels: Array.isArray(data.quizCompletedLevels)
            ? data.quizCompletedLevels.filter(
                (n: unknown): n is number => n === 1 || n === 2 || n === 3
              )
            : [],
          quizBestScore1: Math.min(5, Math.max(0, Number(data.quizBestScore1) || 0)),
          quizBestScore2: Math.min(5, Math.max(0, Number(data.quizBestScore2) || 0)),
          quizBestScore3: Math.min(5, Math.max(0, Number(data.quizBestScore3) || 0)),
          quizLastPlayedLevel: lastLvl,
        };
        notifyAuthProfileListeners();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, `userProfiles/${user.uid}`);
        } catch {
          // Logged structured FirestoreErrorInfo
        }
      }
    );
  });
});

export function subscribeToUserAccount(listener: AuthProfileListener): () => void {
  authProfileListeners.add(listener);
  listener({
    user: currentAuthUser,
    profile: currentUserProfile,
    authReady: isAuthReady,
  });
  return () => {
    authProfileListeners.delete(listener);
  };
}

export async function signInWithGoogle(): Promise<User | null> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function syncUserFavoritesInFirestore(favoriteMillIds: string[]): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const path = `userProfiles/${user.uid}`;
  const cleanFavs = Array.from(
    new Set(favoriteMillIds.filter((id) => typeof id === 'string' && id.length > 0))
  ).slice(0, 50);

  try {
    await updateDoc(doc(db, 'userProfiles', user.uid), {
      favoriteMillIds: cleanFavs,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } catch {
      // Logged structured FirestoreErrorInfo
    }
  }
}

export async function syncUserAdhesionInFirestore(adhesion: {
  referenceId: string;
  profileType: string;
  commune: string;
  farmName: string;
  submittedAt: string;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const path = `userProfiles/${user.uid}`;

  try {
    await updateDoc(doc(db, 'userProfiles', user.uid), {
      adhesionReferenceId: adhesion.referenceId.trim().slice(0, 40),
      adhesionProfileType: adhesion.profileType.trim().slice(0, 30),
      adhesionCommune: adhesion.commune.trim().slice(0, 80),
      adhesionFarmName: adhesion.farmName.trim().slice(0, 120),
      adhesionSubmittedAt: adhesion.submittedAt.trim().slice(0, 80),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } catch {
      // Logged structured FirestoreErrorInfo
    }
  }
}

export async function syncUserQuizInFirestore(quiz: {
  completedLevels: number[];
  bestScores: Record<number, number>;
  lastPlayedLevel: 1 | 2 | 3;
}): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const path = `userProfiles/${user.uid}`;
  const cleanLevels = Array.from(
    new Set(quiz.completedLevels.filter((n) => n === 1 || n === 2 || n === 3))
  ).slice(0, 3);
  const lastLvl: 1 | 2 | 3 =
    quiz.lastPlayedLevel === 1 || quiz.lastPlayedLevel === 2 || quiz.lastPlayedLevel === 3
      ? quiz.lastPlayedLevel
      : 1;

  try {
    await updateDoc(doc(db, 'userProfiles', user.uid), {
      quizCompletedLevels: cleanLevels,
      quizBestScore1: Math.min(5, Math.max(0, Math.round(Number(quiz.bestScores[1]) || 0))),
      quizBestScore2: Math.min(5, Math.max(0, Math.round(Number(quiz.bestScores[2]) || 0))),
      quizBestScore3: Math.min(5, Math.max(0, Math.round(Number(quiz.bestScores[3]) || 0))),
      quizLastPlayedLevel: lastLvl,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } catch {
      // Logged structured FirestoreErrorInfo
    }
  }
}

// ============================================================================
// 1. AVIS SUR LES HUILERIES (/millReviews/{reviewId})
// ============================================================================

interface FirestoreMillReviewDoc {
  id: string;
  millId: string;
  authorName: string;
  authorRole: string;
  communeOrigin: string;
  date: string;
  rating: number;
  extractionYield: number;
  turnaroundTime: number;
  hygiene: number;
  reception: number;
  volumeBroughtQuintals: number;
  varietyBrought: string;
  comment: string;
  recommended: boolean;
  likesCount: number;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

const firestoreReviewIds = new Set<string>();

export function isFirestoreReview(reviewId: string): boolean {
  return firestoreReviewIds.has(reviewId);
}

export function subscribeToMillReviews(
  onReviewsChange: (reviews: MillReview[]) => void
): () => void {
  const q = query(
    collection(db, 'millReviews'),
    where('rating', '>=', 1),
    where('rating', '<=', 5)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const remoteReviews: Array<{ review: MillReview; createdMs: number }> = [];
      firestoreReviewIds.clear();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreMillReviewDoc;
        if (!data || typeof data.millId !== 'string') return;
        firestoreReviewIds.add(docSnap.id);

        const createdMs =
          data.createdAt && typeof data.createdAt.toMillis === 'function'
            ? data.createdAt.toMillis()
            : Date.now();

        remoteReviews.push({
          createdMs,
          review: {
            id: data.id || docSnap.id,
            millId: data.millId,
            authorName: data.authorName,
            authorRole: data.authorRole,
            communeOrigin: data.communeOrigin,
            date: data.date,
            rating: Number(data.rating) || 5,
            serviceRatings: {
              extractionYield: Number(data.extractionYield) || 5,
              turnaroundTime: Number(data.turnaroundTime) || 5,
              hygiene: Number(data.hygiene) || 5,
              reception: Number(data.reception) || 5,
            },
            volumeBroughtQuintals:
              typeof data.volumeBroughtQuintals === 'number' && data.volumeBroughtQuintals > 0
                ? data.volumeBroughtQuintals
                : undefined,
            varietyBrought: data.varietyBrought || undefined,
            comment: data.comment,
            recommended: Boolean(data.recommended),
            likesCount: Number(data.likesCount) || 0,
          },
        });
      });

      remoteReviews.sort((a, b) => b.createdMs - a.createdMs);
      onReviewsChange(remoteReviews.map((item) => item.review));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'millReviews');
      } catch {
        // Logged structured FirestoreErrorInfo
      }
    }
  );
}

export async function createMillReviewInFirestore(review: MillReview): Promise<void> {
  const reviewId = review.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
  const path = `millReviews/${reviewId}`;

  const clampScore = (val: number | undefined): number =>
    Math.min(5, Math.max(1, Math.round(Number(val) || 5)));

  const volumeNum =
    typeof review.volumeBroughtQuintals === 'number' && !Number.isNaN(review.volumeBroughtQuintals)
      ? Math.min(1000, Math.max(0, Math.round(review.volumeBroughtQuintals * 10) / 10))
      : 0;

  const payload = {
    id: reviewId,
    millId: review.millId.trim().slice(0, 64),
    authorName: review.authorName.trim().slice(0, 100),
    authorRole: (review.authorRole || 'Oléiculteur Récoltant').trim().slice(0, 80),
    communeOrigin: (review.communeOrigin || 'Béjaïa').trim().slice(0, 80),
    date: review.date.trim().slice(0, 60),
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    extractionYield: clampScore(review.serviceRatings?.extractionYield),
    turnaroundTime: clampScore(review.serviceRatings?.turnaroundTime),
    hygiene: clampScore(review.serviceRatings?.hygiene),
    reception: clampScore(review.serviceRatings?.reception),
    volumeBroughtQuintals: volumeNum,
    varietyBrought: (review.varietyBrought || 'Chemlal de Kabylie').trim().slice(0, 80),
    comment: review.comment.trim().slice(0, 1200),
    recommended: Boolean(review.recommended),
    likesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'millReviews', reviewId), payload);
    firestoreReviewIds.add(reviewId);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMillReviewHelpfulInFirestore(
  reviewId: string,
  delta: 1 | -1
): Promise<void> {
  if (!firestoreReviewIds.has(reviewId)) {
    return;
  }
  const path = `millReviews/${reviewId}`;
  try {
    await updateDoc(doc(db, 'millReviews', reviewId), {
      likesCount: increment(delta),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ============================================================================
// 2. INSCRIPTIONS AU CONCOURS D'HUILE (/contestEntries + /contestRegistrationsPrivate)
// ============================================================================

export interface PublicContestEntry {
  id: string;
  registrationNumber: string;
  fullName: string;
  companyName: string;
  communeOrigin: string;
  submissionDate: string;
  category: 'Fruité Vert' | 'Fruité Mûr' | "Fruité Goût à l'ancienne";
  sampleCount: 'Trois' | 'Quatre' | 'Cinq';
  varietyName: string;
  lotVolumeLitres: number;
  feeDza: number;
  submittedAt: string;
}

export interface CreateContestEntryInput extends PublicContestEntry {
  email: string;
  dialCode: string;
  phoneNumber: string;
  address: string;
}

export function subscribeToContestEntries(
  onEntriesChange: (entries: PublicContestEntry[]) => void
): () => void {
  const q = query(collection(db, 'contestEntries'), where('feeDza', '==', 1000));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Array<{ entry: PublicContestEntry; createdMs: number }> = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data || typeof data.registrationNumber !== 'string') return;
        const createdMs =
          data.createdAt && typeof data.createdAt.toMillis === 'function'
            ? data.createdAt.toMillis()
            : Date.now();
        items.push({
          createdMs,
          entry: {
            id: data.id || docSnap.id,
            registrationNumber: data.registrationNumber,
            fullName: data.fullName,
            companyName: data.companyName,
            communeOrigin: data.communeOrigin || 'Wilaya de Béjaïa',
            submissionDate: data.submissionDate,
            category: data.category,
            sampleCount: data.sampleCount,
            varietyName: data.varietyName || 'Chemlal',
            lotVolumeLitres: Number(data.lotVolumeLitres) || 300,
            feeDza: Number(data.feeDza) || 1000,
            submittedAt: data.submittedAt,
          },
        });
      });

      items.sort((a, b) => b.createdMs - a.createdMs);
      onEntriesChange(items.map((i) => i.entry));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'contestEntries');
      } catch {
        // Logged structured FirestoreErrorInfo
      }
    }
  );
}

export async function createContestRegistrationInFirestore(
  input: CreateContestEntryInput
): Promise<void> {
  const entryId = input.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
  const publicRef = doc(db, 'contestEntries', entryId);
  const privateRef = doc(db, 'contestRegistrationsPrivate', entryId);

  const safeVolume = Math.min(
    500000,
    Math.max(50, Math.round(Number(input.lotVolumeLitres) || 300))
  );

  const publicPayload = {
    id: entryId,
    registrationNumber: input.registrationNumber.trim().slice(0, 40),
    fullName: input.fullName.trim().slice(0, 100),
    companyName: (input.companyName.trim() || 'Producteur Particulier').slice(0, 120),
    communeOrigin: (input.communeOrigin.trim() || 'Wilaya de Béjaïa').slice(0, 120),
    submissionDate: input.submissionDate.trim().slice(0, 20),
    category: input.category,
    sampleCount: input.sampleCount,
    varietyName: (input.varietyName.trim() || 'Chemlal').slice(0, 80),
    lotVolumeLitres: safeVolume,
    feeDza: 1000,
    submittedAt: input.submittedAt.trim().slice(0, 80),
    createdAt: serverTimestamp(),
  };

  const privatePayload = {
    id: entryId,
    registrationNumber: input.registrationNumber.trim().slice(0, 40),
    fullName: input.fullName.trim().slice(0, 100),
    email: input.email.trim().slice(0, 120),
    dialCode: (input.dialCode.trim() || 'DZ (+213)').slice(0, 20),
    phoneNumber: input.phoneNumber.trim().slice(0, 30),
    address: (input.address.trim() || 'Wilaya de Béjaïa').slice(0, 200),
    createdAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);
    batch.set(publicRef, publicPayload);
    batch.set(privateRef, privatePayload);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `contestEntries/${entryId}`);
  }
}

// ============================================================================
// 3. DEMANDES D'ADHÉSION ADOIO (/adhesionMembers + /adhesionRequestsPrivate)
// ============================================================================

export interface PublicAdhesionMember {
  id: string;
  referenceId: string;
  profileType:
    | 'oleiculteur'
    | 'moulinier'
    | 'cooperative'
    | 'conditionneur'
    | 'chercheur'
    | 'amateur';
  fullName: string;
  farmName: string;
  commune: string;
  detailsCount: string;
  submittedAt: string;
}

export interface CreateAdhesionInput extends PublicAdhesionMember {
  phone: string;
  email: string;
  message: string;
}

export function subscribeToAdhesionMembers(
  onMembersChange: (members: PublicAdhesionMember[]) => void
): () => void {
  const q = query(
    collection(db, 'adhesionMembers'),
    where('referenceId', '>=', 'ADOIO-')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Array<{ member: PublicAdhesionMember; createdMs: number }> = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data || typeof data.referenceId !== 'string') return;
        const createdMs =
          data.createdAt && typeof data.createdAt.toMillis === 'function'
            ? data.createdAt.toMillis()
            : Date.now();
        items.push({
          createdMs,
          member: {
            id: data.id || docSnap.id,
            referenceId: data.referenceId,
            profileType: data.profileType,
            fullName: data.fullName,
            farmName: data.farmName,
            commune: data.commune,
            detailsCount: data.detailsCount,
            submittedAt: data.submittedAt,
          },
        });
      });

      items.sort((a, b) => b.createdMs - a.createdMs);
      onMembersChange(items.map((i) => i.member));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'adhesionMembers');
      } catch {
        // Logged structured FirestoreErrorInfo
      }
    }
  );
}

export async function createAdhesionRequestInFirestore(
  input: CreateAdhesionInput
): Promise<void> {
  const memberId = input.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
  const publicRef = doc(db, 'adhesionMembers', memberId);
  const privateRef = doc(db, 'adhesionRequestsPrivate', memberId);

  const publicPayload = {
    id: memberId,
    referenceId: input.referenceId.trim().slice(0, 40),
    profileType: input.profileType,
    fullName: input.fullName.trim().slice(0, 100),
    farmName: (input.farmName.trim() || 'Exploitation Familiale').slice(0, 120),
    commune: (input.commune.trim() || 'Seddouk').slice(0, 80),
    detailsCount: (input.detailsCount.trim() || 'Non précisé').slice(0, 80),
    submittedAt: input.submittedAt.trim().slice(0, 80),
    createdAt: serverTimestamp(),
  };

  const privatePayload = {
    id: memberId,
    referenceId: input.referenceId.trim().slice(0, 40),
    fullName: input.fullName.trim().slice(0, 100),
    phone: input.phone.trim().slice(0, 30),
    email: input.email.trim().slice(0, 120),
    message: input.message.trim().slice(0, 1000),
    createdAt: serverTimestamp(),
  };

  try {
    const batch = writeBatch(db);
    batch.set(publicRef, publicPayload);
    batch.set(privateRef, privatePayload);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `adhesionMembers/${memberId}`);
  }
}
