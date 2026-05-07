/**
 * Mock data for the demo app shell. Swap with Firestore queries when wiring
 * to the real backend (rideshare-30239).
 */

export type Ride = {
  id: string;
  from: string;
  to: string;
  driver: { name: string; rating: number; trips: number; avatarHue: number };
  vehicle: string;
  departsAt: string; // ISO
  pricePerSeat: number;
  seatsLeft: number;
  seatsTotal: number;
  status: "active" | "in_progress" | "completed";
  durationMinutes: number;
  stops?: string[];
};

export type Booking = {
  id: string;
  ride: Ride;
  seats: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

export type Profile = {
  uid: string;
  name: string;
  phone: string;
  email: string;
  bio: string;
  rating: number;
  ratingCount: number;
  tripsAsDriver: number;
  tripsAsRider: number;
  avatarHue: number;
  verifications: { phone: boolean; email: boolean; govId: boolean; license: boolean };
  vehicle?: { model: string; color: string; plate: string };
};

const baseDate = (offsetHours: number) =>
  new Date(Date.now() + offsetHours * 3600_000).toISOString();

export const upcomingRides: Ride[] = [
  {
    id: "r1",
    from: "Bengaluru",
    to: "Mysuru",
    driver: { name: "Aanya Iyer", rating: 4.9, trips: 47, avatarHue: 142 },
    vehicle: "Maruti Swift Dzire · Pearl White",
    departsAt: baseDate(7),
    pricePerSeat: 380,
    seatsLeft: 2,
    seatsTotal: 4,
    status: "active",
    durationMinutes: 195,
    stops: ["Mandya"],
  },
  {
    id: "r2",
    from: "Mumbai",
    to: "Pune",
    driver: { name: "Rohan Sharma", rating: 4.7, trips: 23, avatarHue: 28 },
    vehicle: "Honda City · Steel Blue",
    departsAt: baseDate(22),
    pricePerSeat: 520,
    seatsLeft: 3,
    seatsTotal: 4,
    status: "active",
    durationMinutes: 165,
  },
  {
    id: "r3",
    from: "Hyderabad",
    to: "Vijayawada",
    driver: { name: "Priya Reddy", rating: 5.0, trips: 89, avatarHue: 305 },
    vehicle: "Toyota Innova · Champagne",
    departsAt: baseDate(34),
    pricePerSeat: 690,
    seatsLeft: 1,
    seatsTotal: 6,
    status: "active",
    durationMinutes: 270,
  },
  {
    id: "r4",
    from: "Chennai",
    to: "Pondicherry",
    driver: { name: "Karthik Subramaniam", rating: 4.8, trips: 31, avatarHue: 195 },
    vehicle: "Hyundai Verna · Phantom Black",
    departsAt: baseDate(50),
    pricePerSeat: 410,
    seatsLeft: 2,
    seatsTotal: 4,
    status: "active",
    durationMinutes: 210,
  },
];

export const myBookings: Booking[] = [
  {
    id: "b1",
    ride: upcomingRides[0],
    seats: 1,
    status: "confirmed",
    createdAt: baseDate(-12),
  },
  {
    id: "b2",
    ride: upcomingRides[2],
    seats: 2,
    status: "pending",
    createdAt: baseDate(-3),
  },
  {
    id: "b3",
    ride: {
      ...upcomingRides[1],
      id: "r2-old",
      departsAt: baseDate(-72),
      status: "completed",
    },
    seats: 1,
    status: "completed",
    createdAt: baseDate(-96),
  },
];

export const myProfile: Profile = {
  uid: "u-self",
  name: "Gagan Karthik",
  phone: "+91 90000 12345",
  email: "gagan@poolix.app",
  bio: "Coffee fueled. Friendly conversation. Window seat preferred.",
  rating: 4.85,
  ratingCount: 17,
  tripsAsDriver: 6,
  tripsAsRider: 11,
  avatarHue: 88,
  verifications: { phone: true, email: true, govId: true, license: false },
  vehicle: { model: "Tata Nexon EV", color: "Daytona Grey", plate: "KA 03 ZX 2024" },
};

export const liveRoute = {
  origin: "Bengaluru",
  destination: "Mysuru",
  progressPct: 42,
  passengers: [
    { name: "Aanya Iyer", pickedUp: true, paid: true, fare: 380 },
    { name: "Devansh K.", pickedUp: true, paid: false, fare: 380 },
    { name: "Meera S.", pickedUp: false, paid: false, fare: 380 },
  ],
};
