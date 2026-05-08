"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  startPhoneSignIn: (phone: string, recaptchaContainerId: string) => Promise<void>;
  verifyPhoneCode: (code: string) => Promise<void>;
  cancelPhoneSignIn: () => void;
  signOut: () => Promise<void>;
  /** True after a phone signInWithPhoneNumber call resolves; ready for code entry. */
  phoneStage: "idle" | "code-sent" | "verifying";
  phoneError: string | null;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
  const [phoneStage, setPhoneStage] = useState<AuthState["phoneStage"]>("idle");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Subscribe to auth state once. Triggers on initial load, sign-in, sign-out.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) await ensureUserDoc(u);
    });
    return unsub;
  }, []);

  // Resolve the redirect leg of the Google flow. If the previous popup attempt
  // was blocked we fell back to signInWithRedirect; on the return navigation
  // this picks up the credential so onAuthStateChanged fires.
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  const signInGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      const code = errorCode(e);
      if (
        code === "popup-blocked" ||
        code === "popup-closed-by-user" ||
        code === "cancelled-popup-request" ||
        code === "operation-not-supported-in-this-environment"
      ) {
        // Browser killed the popup (in-app webview, strict popup blocker,
        // third-party cookie blocking, etc.) — fall back to a full-page
        // redirect, which always works.
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      throw e;
    }
  }, []);

  const startPhoneSignIn = useCallback(
    async (phone: string, recaptchaContainerId: string) => {
      setPhoneError(null);
      setPhoneStage("verifying");
      try {
        // RecaptchaVerifier mounts an invisible reCAPTCHA into the given DOM
        // container. We re-create it each time because Firebase ties the
        // verifier instance to a single signInWithPhoneNumber invocation.
        recaptcha?.clear();
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: "invisible",
        });
        setRecaptcha(verifier);

        const result = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmation(result);
        setPhoneStage("code-sent");
      } catch (e) {
        setPhoneStage("idle");
        setPhoneError(humanFirebaseError(e));
        throw e;
      }
    },
    [recaptcha]
  );

  const verifyPhoneCode = useCallback(
    async (code: string) => {
      if (!confirmation) throw new Error("No confirmation in flight");
      setPhoneError(null);
      setPhoneStage("verifying");
      try {
        await confirmation.confirm(code);
        setConfirmation(null);
        setPhoneStage("idle");
        recaptcha?.clear();
        setRecaptcha(null);
      } catch (e) {
        setPhoneStage("code-sent");
        setPhoneError(humanFirebaseError(e));
        throw e;
      }
    },
    [confirmation, recaptcha]
  );

  const cancelPhoneSignIn = useCallback(() => {
    recaptcha?.clear();
    setRecaptcha(null);
    setConfirmation(null);
    setPhoneStage("idle");
    setPhoneError(null);
  }, [recaptcha]);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      signInGoogle,
      startPhoneSignIn,
      verifyPhoneCode,
      cancelPhoneSignIn,
      signOut,
      phoneStage,
      phoneError,
    }),
    [user, loading, signInGoogle, startPhoneSignIn, verifyPhoneCode, cancelPhoneSignIn, signOut, phoneStage, phoneError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Creates /users/{uid} on first sign-in so Firestore queries that join on the
 * user doc don't 404. Subsequent sign-ins are a no-op (merge on same data).
 */
async function ensureUserDoc(u: User) {
  try {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return;

    const phone = u.phoneNumber ?? "";
    await setDoc(
      ref,
      {
        uid: u.uid,
        name: u.displayName ?? "Rider",
        email: u.email ?? "",
        phone,
        profilePhoto: u.photoURL ?? "",
        rating: 0,
        ratingCount: 0,
        phoneVerified: !!u.phoneNumber,
        verificationStatus: "not_started",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Best-effort — don't block sign-in if rules reject (e.g. transient).
  }
}

function errorCode(e: unknown): string | null {
  const msg = e instanceof Error ? e.message : String(e);
  const m = /\(auth\/([^)]+)\)/.exec(msg);
  return m ? m[1] : null;
}

function humanFirebaseError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const code = errorCode(e);
  if (!code) return msg;
  return (
    {
      "invalid-phone-number": "That doesn't look like a valid phone number.",
      "invalid-verification-code": "Wrong code. Try again.",
      "code-expired": "Code expired. Request a new one.",
      "too-many-requests": "Too many attempts — wait a minute and try again.",
      "popup-closed-by-user": "Sign-in cancelled.",
      "popup-blocked": "Your browser blocked the sign-in popup.",
      "operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
      "network-request-failed": "Network error. Check your connection.",
    }[code] ?? `Sign-in failed (${code}).`
  );
}
