// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  initializeFirestore,
  enableNetwork,
  connectFirestoreEmulator,
  clearIndexedDbPersistence,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// ---- helpers ENV ----
const env = (k: string, fallback?: string) =>
  (import.meta as any).env?.[k] ?? fallback ?? '';

const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

for (const k of REQUIRED) {
  if (!env(k)) console.warn(`[firebase] Variable manquante dans .env: ${k}`);
}

// ---- config depuis .env ----
const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
  ...(env('VITE_FIREBASE_MEASUREMENT_ID') && {
    measurementId: env('VITE_FIREBASE_MEASUREMENT_ID'),
  }),
};

// ---- init app/services ----
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore (long polling utile en réseau restrictif)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Storage (uploads documents)
export const storage = getStorage(app);

// ---- émulateurs (optionnels) ----
// Active-les en mettant VITE_USE_FIREBASE_EMULATOR=true dans .env.local
const useEmu = env('VITE_USE_FIREBASE_EMULATOR', 'false') === 'true';
if (import.meta.env.DEV && useEmu) {
  const ah = env('VITE_EMU_AUTH_HOST', 'localhost');
  const ap = Number(env('VITE_EMU_AUTH_PORT', '9099'));
  const fh = env('VITE_EMU_FIRESTORE_HOST', 'localhost');
  const fp = Number(env('VITE_EMU_FIRESTORE_PORT', '8080'));
  const sh = env('VITE_EMU_STORAGE_HOST', 'localhost');
  const sp = Number(env('VITE_EMU_STORAGE_PORT', '9199'));

  try {
    connectAuthEmulator(auth, `http://${ah}:${ap}`);
    connectFirestoreEmulator(db, fh, fp);
    connectStorageEmulator(storage, sh, sp);
    console.log('Émulateurs Firebase connectés');
  } catch (e) {
    console.warn('Échec connexion émulateurs Firebase:', e);
  }
}

// ---- gestion réseau / cache ----
export const initializeFirestoreConnection = async () => {
  try {
    try {
      await clearIndexedDbPersistence(db);
      console.log('Cache Firestore vidé');
    } catch {
      console.log('Cache déjà propre ou non disponible');
    }
    await enableNetwork(db);
    console.log('Firestore connecté au réseau');
    return true;
  } catch (error) {
    console.error('Erreur init Firestore:', error);
    return false;
  }
};

if (import.meta.env.DEV) {
  console.log('🔧 Mode développement — Firebase initialisé');
}

// Démarre la connexion tout de suite 
initializeFirestoreConnection();
