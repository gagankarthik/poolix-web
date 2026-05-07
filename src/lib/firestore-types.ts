/**
 * Firestore document types — mirror the Android app's POJOs so the same
 * collections feed both clients without re-shaping. Field names match the
 * Java models exactly.
 */

import type { Timestamp } from "firebase/firestore";

export type RideStatus = "active" | "in_progress" | "completed" | "cancelled";

export type Ride = {
  rideId: string;            // doc id, populated by us (Firestore @DocumentId)
  driverId: string;
  from: string;
  to: string;
  departureTime: Timestamp | null;
  seatsTotal: number;
  seatsLeft: number;
  pricePerSeat: number;
  status: RideStatus;
  geohash?: string;
  waypoints?: string[];
  driverName?: string;
  driverPhotoUrl?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
  vehicleColor?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  bookingId: string;
  rideId: string;
  riderId: string;
  driverId: string;
  pickupPoint: string;
  seats: number;
  status: BookingStatus;
  pickedUp?: boolean;
  paymentCollected?: boolean;
  paymentAmount?: number;
  createdAt: Timestamp | null;
};

export type AppUser = {
  uid: string;
  name?: string;
  phone?: string;
  email?: string;
  profilePhoto?: string;
  rating?: number;
  ratingCount?: number;
  phoneVerified?: boolean;
  verificationStatus?: "not_started" | "pending" | "verified" | "rejected";
  // Verification doc fields
  idDocumentUrl?: string;
  aadhaarNumber?: string;
  licenseDocumentUrl?: string;
  // Vehicle (denormalised on profile)
  vehicleType?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleRcNumber?: string;
  // Bio (web-only addition; Android doesn't write it but reading is harmless)
  bio?: string;
  createdAt?: Timestamp | null;
};

export type Chat = {
  chatId: string;
  rideId?: string;
  driverId: string;
  riderId: string;
  driverName?: string;
  riderName?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Timestamp | null;
  unread?: Record<string, number>;
};

export type Rating = {
  ratingId: string;
  ratedUid: string;
  raterUid: string;
  raterName?: string;
  raterPhoto?: string;
  stars: number;
  comment?: string;
  rideId?: string;
  tripFrom?: string;
  tripTo?: string;
  tripDate?: Timestamp | null;
  createdAt?: Timestamp | null;
};
