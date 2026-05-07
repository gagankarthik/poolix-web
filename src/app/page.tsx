import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Trust } from "@/components/landing/Trust";
import { Drivers } from "@/components/landing/Drivers";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Standalone search band so visitors can start a real ride search
            without scrolling — first attempt to book on results gates them
            through /login automatically. */}
        <section className="relative -mt-10 px-4 pb-16 sm:px-6 lg:-mt-16 lg:pb-24">
          <HeroSearch />
        </section>
        <Features />
        <HowItWorks />
        <Trust />
        <Drivers />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
