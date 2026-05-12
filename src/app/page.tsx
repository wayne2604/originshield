import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ApiSection from "@/components/landing/ApiSection";
import SocialProof from "@/components/landing/SocialProof";
import Pricing from "@/components/landing/Pricing";
import ScannerHub from "@/components/scanner/ScannerHub";
import RecentScans from "@/components/scanner/RecentScans";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ScannerHub />
        <RecentScans />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <ApiSection />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
