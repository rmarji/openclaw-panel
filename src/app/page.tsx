import { CouponBanner } from "@/components/CouponBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LiveDemo } from "@/components/LiveDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { PricingSection } from "@/components/PricingSection";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <CouponBanner />
      <Navbar />
      <Hero />
      <LiveDemo />
      <HowItWorks />
      <Features />
      <Stats />
      <PricingSection />
      <ComparisonTable />
      <FinalCTA />
      <Footer />
    </div>
  );
}
