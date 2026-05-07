// Firebase initialization for the Poolix web client.
// Mirrors the rideshare-30239 project that powers the Android app, so chats,
// rides, bookings, and ratings all share the same backend.
//
// Configuration is loaded from NEXT_PUBLIC_* env vars (.env.local locally,
// hosting environment in prod). Firebase web config is *not* a private
// secret — security comes from Firestore rules + App Check — but loading
// from env keeps dev/prod separable and out of source.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

function readConfig() {
  const env = process.env;
  const required = {
    apiKey:            env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:        env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => `NEXT_PUBLIC_FIREBASE_${k
      .replace(/[A-Z]/g, (m) => "_" + m)
      .toUpperCase()}`);

  if (missing.length > 0) {
    throw new Error(
      `Firebase config not loaded — missing env: ${missing.join(", ")}.\n\n` +
      `Fix:\n` +
      `  1. Make sure .env.local exists in the poolix-web project root with all NEXT_PUBLIC_FIREBASE_* keys.\n` +
      `  2. Stop the dev server (Ctrl+C), delete the .next folder, then run \`npm run dev\` again.\n` +
      `  3. Confirm the startup banner says \`Environments: .env.local\`.`
    );
  }

  return {
    ...(required as Required<typeof required>),
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export const firebaseConfig = readConfig();

// Reuse on hot-reload; calling initializeApp twice in dev throws.
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Analytics is browser-only — `getAnalytics` reads `window`. Lazily import +
 * call only when running in a browser, and only when `isSupported()` returns
 * true. Returns `null` on any failure so callers can ignore it.
 */
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (!(await isSupported())) return null;
    return getAnalytics(app);
  } catch {
    return null;
  }
}
