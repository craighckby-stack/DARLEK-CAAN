import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, type Firestore } from 'firebase/firestore';

interface ExtendedFirebaseOptions extends FirebaseOptions {
  firestoreDatabaseId?: string;
}

const rawApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const rawProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/**
 * Validates whether real Firebase credentials are provided in the environment.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    rawApiKey &&
    !rawApiKey.startsWith('dummy-') &&
    rawApiKey !== 'dummy-api-key' &&
    rawProjectId &&
    !rawProjectId.startsWith('dummy-') &&
    rawProjectId !== 'dummy-project-id'
  );
};

const firebaseConfig: ExtendedFirebaseOptions = {
  apiKey: rawApiKey || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-domain',
  projectId: rawProjectId || 'dummy-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'dummy-sender-id',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy-app-id',
  firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || undefined
};

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const getOrCreateFirebaseApp = (): FirebaseApp => {
  if (appInstance) return appInstance;
  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    appInstance = existingApps[0];
  } else {
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
};

const app = getOrCreateFirebaseApp();

export const db: Firestore = dbInstance || (dbInstance = initializeFirestore(
  app,
  { experimentalForceLongPolling: true },
  firebaseConfig.firestoreDatabaseId ?? '(default)'
));

export const auth: Auth = authInstance || (authInstance = getAuth(app));

const testFirestoreConnection = async (): Promise<void> => {
  if (!isFirebaseConfigured()) return;
  try {
    await getDocFromServer(doc(db, 'world_test', 'connection'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[Darlek Caan] Firestore service is in local/offline sandbox fallback mode: ${errorMessage}`);
  }
};

const handleAnonymousAuthFailure = (error: unknown): void => {
  const errObj = error as { code?: string; message?: string };
  if (errObj?.code === 'auth/admin-restricted-operation') {
    console.warn('Anonymous Auth is disabled in Firebase Console. Cloud features may be limited.');
  } else {
    console.warn(`Anonymous authentication is in sandbox/offline fallback mode: ${errObj?.message ?? String(error)}`);
  }
};

const initializeAuthentication = (): void => {
  if (!isFirebaseConfigured()) return;
  if (!auth.currentUser) {
    signInAnonymously(auth).catch(handleAnonymousAuthFailure);
  }
};

if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  initializeAuthentication();
  void testFirestoreConnection();
}