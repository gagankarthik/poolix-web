import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import { FirebaseBoot } from "@/components/FirebaseBoot";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Poolix — Share the road, split the cost",
  description:
    "India's friendliest carpooling app. Find a ride going your way, or offer your empty seats to people heading the same direction.",
  metadataBase: new URL("https://poolix.app"),
  openGraph: {
    title: "Poolix — Share the road, split the cost",
    description: "Verified drivers, transparent pricing, real conversations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-cream text-ink antialiased">
        <FirebaseBoot />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
