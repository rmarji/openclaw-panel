import { CouponBanner } from "@/components/CouponBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PricingSection } from "@/components/PricingSection";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <CouponBanner />
      <Navbar />
      <Hero />
      <Features />
      <PricingSection />
      <ComparisonTable />
      <Footer />
    </div>
  );
}
