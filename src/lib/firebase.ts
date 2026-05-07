// Firebase initialization for the Poolix web client.
// Mirrors the rideshare-30239 project that powers the Android app, so chats,
// rides, bookings, and ratings all share the same backend.
//
// Initialization is *lazy*: nothing reads env or constructs the SDK at module
// load. That keeps the root layout from blowing up if the dev server hasn't
// hydrated env yet — the first real `auth` / `db` / `storage` access pulls
// the config and inits exactly once.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type FirebaseEnvConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

function readConfig(): FirebaseEnvConfig {
  const env = process.env;
  const required: Record<string, string | undefined> = {
    NEXT_PUBLIC_FIREBASE_API_KEY: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Firebase config not loaded — missing: ${missing.join(", ")}.\n\n` +
        `Fix:\n` +
        `  1. Make sure C:\\Users\\gagan\\AndroidStudioProjects\\poolix-web\\.env.local exists with all NEXT_PUBLIC_FIREBASE_* keys.\n` +
        `  2. Stop the dev server with Ctrl+C, delete the .next folder, then run \`npm run dev\` from the poolix-web directory.\n` +
        `  3. The startup banner must include 'Environments: .env.local' — if it doesn't, you're running from the wrong folder.`
    );
  }

  return {
    apiKey: required.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: required.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: required.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: required.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: required.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: required.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

// ---- Lazy singletons ------------------------------------------------------

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

function getOrInitApp(): FirebaseApp {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApp();
    return _app;
  }
  _app = initializeApp(readConfig());
  return _app;
}

/**
 * Proxy objects so existing imports (`import { auth, db, storage } …`) keep
 * working. Each property access boots Firebase on demand. Bundle-time tree
 * shaking still removes anything you don't use.
 */
export const auth: Auth = new Proxy({} as Auth, {
  get(_t, prop) {
    if (!_auth) _auth = getAuth(getOrInitApp());
    // @ts-expect-error — runtime forwarder
    return _auth[prop];
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_t, prop) {
    if (!_db) _db = getFirestore(getOrInitApp());
    // @ts-expect-error — runtime forwarder
    return _db[prop];
  },
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_t, prop) {
    if (!_storage) _storage = getStorage(getOrInitApp());
    // @ts-expect-error — runtime forwarder
    return _storage[prop];
  },
});

export const googleProvider: GoogleAuthProvider = new Proxy(
  {} as GoogleAuthProvider,
  {
    get(_t, prop) {
      if (!_googleProvider) _googleProvider = new GoogleAuthProvider();
      // @ts-expect-error — runtime forwarder
      return _googleProvider[prop];
    },
  }
);

/** Exposed for places that want to read the project id, etc. */
export function firebaseConfig(): FirebaseEnvConfig {
  return readConfig();
}

/**
 * Analytics is browser-only — `getAnalytics` reads `window`. Lazily import +
 * call only when running in a browser, and only when `isSupported()` returns
 * true (false in SSR / older browsers / when the measurementId is absent).
 * Returns `null` on any failure path so callers can ignore it.
 */
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  let cfg: FirebaseEnvConfig;
  try {
    cfg = readConfig();
  } catch {
    return null; // env not ready — analytics is best-effort
  }
  if (!cfg.measurementId) return null;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (!(await isSupported())) return null;
    return getAnalytics(getOrInitApp());
  } catch {
    return null;
  }
}
