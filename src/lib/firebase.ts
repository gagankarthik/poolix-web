// Firebase initialization for the Poolix web client.
// Mirrors the rideshare-30239 project that powers the Android app, so chats,
// rides, bookings, and ratings all share the same backend.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyCNRl3AeNeG1zAkdiSV3F7NJIkt53BiCbo",
  authDomain: "rideshare-30239.firebaseapp.com",
  projectId: "rideshare-30239",
  storageBucket: "rideshare-30239.firebasestorage.app",
  messagingSenderId: "19071959745",
  appId: "1:19071959745:web:bac5a45ca7359006488a40",
  measurementId: "G-1GJ74CFDB3",
};

// Reuse the existing app on hot-reload; calling initializeApp twice in dev
// throws "Firebase: Error (auth/already-initialized)".
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Analytics is browser-only — `getAnalytics` reads `window` at construction.
 * Lazily import + call only when running in a browser, and only when
 * `isSupported()` returns true (it's false in headless / SSR / older browsers).
 *
 * Returns the Analytics instance or `null` if unavailable.
 */
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}
