import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
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
        <FeaturesSection />
      </main>
      <Footer />
    </>
  );
}
