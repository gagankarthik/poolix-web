// Firebase initialization for the Poolix web client.
// Mirrors the rideshare-30239 project that powers the Android app, so chats,
// rides, bookings, and ratings all share the same backend.
//
// Configuration is loaded from NEXT_PUBLIC_* env vars (.env.local locally,
// hosting environment in prod). Firebase web config is *not* a private
// secret — security comes from Firestore rules + App Check — but loading
// from env keeps dev/prod separable and keeps the values out of source.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in.`
    );
  }
  return v;
}

export const firebaseConfig = {
  apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  // measurementId is optional — only present when Analytics is enabled.
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Analytics is browser-only — `getAnalytics` reads `window`. Lazily import +
 * call only when running in a browser, and only when `isSupported()` returns
 * true (it's false in SSR / Safari ITP / older browsers / when the
 * measurementId is absent).
 */
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}
