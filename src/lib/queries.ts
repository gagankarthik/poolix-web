"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import type {
  AppUser,
  Booking,
  Chat,
  Rating,
  Ride,
} from "@/lib/firestore-types";

// ---- Helpers --------------------------------------------------------------

function readDoc<T>(snap: QueryDocumentSnapshot<DocumentData>, id: string): T {
  return { ...(snap.data() as T), [Object.keys(snap.data()).includes("rideId") ? "rideId" : "id"]: id } as T;
}

function withId<T>(snap: QueryDocumentSnapshot<DocumentData>, idField: keyof T): T {
  return { ...(snap.data() as T), [idField]: snap.id } as unknown as T;
}

// ---- Rides ----------------------------------------------------------------

/**
 * Live list of currently-active rides departing in the future. Used on the
 * dashboard "Headed your way" panel and as the default search result.
 */
export function useUpcomingRides(limit = 12) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = Timestamp.fromDate(new Date());
    const q = query(
      collection(db, "rides"),
      where("status", "==", "active"),
      where("departureTime", ">=", now),
      orderBy("departureTime", "asc")
    );
    const unsub: Unsubscribe = onSnapshot(
      q,
      (qs) => {
        const out: Ride[] = qs.docs
          .slice(0, limit)
          .map((d) => withId<Ride>(d, "rideId"));
        setRides(out);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [limit]);

  return { rides, loading };
}

/**
 * Search for rides whose `from` or `to` match the entered city. Firestore
 * doesn't do case-insensitive contains queries — for production you'd lower-
 * case the city fields at write time. For now we run two equality queries
 * and merge.
 */
export function useSearchRides(from: string, to: string) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!from && !to) {
      setRides([]);
      return;
    }
    setLoading(true);
    const subs: Unsubscribe[] = [];
    const merged = new Map<string, Ride>();

    const push = (qs: QueryDocumentSnapshot<DocumentData>[]) => {
      for (const d of qs) {
        const r = withId<Ride>(d, "rideId");
        if (r.status === "active" && (r.seatsLeft ?? 0) > 0) merged.set(r.rideId, r);
      }
      const list = Array.from(merged.values()).sort((a, b) => {
        const aT = a.departureTime?.toMillis() ?? 0;
        const bT = b.departureTime?.toMillis() ?? 0;
        return aT - bT;
      });
      setRides(list);
      setLoading(false);
    };

    if (from) {
      const qFrom = query(collection(db, "rides"), where("from", "==", from));
      subs.push(onSnapshot(qFrom, (qs) => push(qs.docs)));
    }
    if (to) {
      const qTo = query(collection(db, "rides"), where("to", "==", to));
      subs.push(onSnapshot(qTo, (qs) => push(qs.docs)));
    }

    return () => subs.forEach((u) => u());
  }, [from, to]);

  return { rides, loading };
}

// ---- Bookings -------------------------------------------------------------

export function useMyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "bookings"),
      where("riderId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (qs) => {
        setBookings(qs.docs.map((d) => withId<Booking>(d, "bookingId")));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  return { bookings, loading };
}

/**
 * Resolves the Ride document for each booking we hold, so the booking list
 * can show the actual route instead of just "ride 0421". Caches per rideId.
 */
export function useRidesForBookings(bookings: Booking[]) {
  const rideIds = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.rideId).filter(Boolean))),
    [bookings]
  );
  const [rideMap, setRideMap] = useState<Record<string, Ride>>({});

  useEffect(() => {
    if (rideIds.length === 0) return;
    const subs: Unsubscribe[] = [];
    rideIds.forEach((rid) => {
      const ref = doc(db, "rides", rid);
      const unsub = onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;
        setRideMap((m) => ({
          ...m,
          [rid]: { ...(snap.data() as Ride), rideId: rid },
        }));
      });
      subs.push(unsub);
    });
    return () => subs.forEach((u) => u());
  }, [rideIds.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return rideMap;
}

// ---- Profile --------------------------------------------------------------

export function useMyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setProfile(
          snap.exists()
            ? ({ ...(snap.data() as AppUser), uid: snap.id } as AppUser)
            : null
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  return { profile, loading };
}

// ---- Chats ----------------------------------------------------------------

export function useMyChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (qs) => {
        setChats(qs.docs.map((d) => withId<Chat>(d, "chatId")));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  return { chats, loading };
}

// ---- Earnings + Ratings ---------------------------------------------------

/**
 * Computes the live driver earnings (sum of paymentAmount on confirmed
 * bookings in completed rides) plus a few related counters. Mirrors the
 * AccountFragment.loadEarnings() flow on Android.
 */
export function useDriverEarnings() {
  const { user } = useAuth();
  const [data, setData] = useState({
    totalEarnings: 0,
    uncollected: 0,
    tripsCompleted: 0,
    ridersPaid: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setData((d) => ({ ...d, loading: false }));
      return;
    }
    const ridesQ = query(
      collection(db, "rides"),
      where("driverId", "==", user.uid),
      where("status", "==", "completed")
    );
    let bookingsUnsub: Unsubscribe | null = null;

    const ridesUnsub = onSnapshot(ridesQ, (rideQs) => {
      const ridePrices = new Map<string, number>();
      const rideIds: string[] = [];
      rideQs.docs.forEach((d) => {
        rideIds.push(d.id);
        const pps = (d.data() as Ride).pricePerSeat ?? 0;
        ridePrices.set(d.id, pps);
      });

      // Reset previous booking sub
      bookingsUnsub?.();
      bookingsUnsub = null;

      if (rideIds.length === 0) {
        setData({
          totalEarnings: 0,
          uncollected: 0,
          tripsCompleted: 0,
          ridersPaid: 0,
          loading: false,
        });
        return;
      }

      // Firestore "in" filter caps at 30; chunk if needed (keeps the unsub
      // simple by collapsing into the last subscriber).
      const chunks: string[][] = [];
      for (let i = 0; i < rideIds.length; i += 30) chunks.push(rideIds.slice(i, i + 30));

      const subs: Unsubscribe[] = [];
      let collectedPaise = 0;
      let uncollectedPaise = 0;
      let ridersPaid = 0;

      const recompute = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
        for (const d of docs) {
          const b = d.data() as Booking;
          if (b.status !== "confirmed") continue;
          const seats = b.seats || 0;
          const pps = ridePrices.get(b.rideId) ?? 0;
          const expectedPaise = Math.round(pps * seats * 100);
          if (b.paymentCollected) {
            const paid = (b.paymentAmount && b.paymentAmount > 0
              ? b.paymentAmount
              : pps * seats);
            collectedPaise += Math.round(paid * 100);
            ridersPaid += 1;
          } else {
            uncollectedPaise += expectedPaise;
          }
        }
        setData({
          totalEarnings: Math.round(collectedPaise / 100),
          uncollected: Math.round(uncollectedPaise / 100),
          tripsCompleted: rideIds.length,
          ridersPaid,
          loading: false,
        });
      };

      chunks.forEach((chunk) => {
        const bq = query(
          collection(db, "bookings"),
          where("rideId", "in", chunk)
        );
        subs.push(onSnapshot(bq, (qs) => recompute(qs.docs)));
      });

      bookingsUnsub = () => subs.forEach((u) => u());
    });

    return () => {
      ridesUnsub();
      bookingsUnsub?.();
    };
  }, [user]);

  return data;
}

/**
 * Live ratings *received* by a uid (other people rating them). Used on
 * Profile and any "driver detail" view.
 */
export function useRatingsReceived(uid: string | null | undefined) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setRatings([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "ratings"),
      where("ratedUid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (qs) => {
        setRatings(qs.docs.map((d) => withId<Rating>(d, "ratingId")));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [uid]);

  const summary = useMemo(() => {
    if (ratings.length === 0) return { avg: 0, count: 0 };
    const sum = ratings.reduce((acc, r) => acc + (r.stars || 0), 0);
    return { avg: sum / ratings.length, count: ratings.length };
  }, [ratings]);

  return { ratings, loading, ...summary };
}
