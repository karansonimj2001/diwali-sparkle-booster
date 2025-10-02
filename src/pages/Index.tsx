import TopBar from "@/components/TopBar";
import HeroSection from "@/components/HeroSection";
import ProductGallery from "@/components/ProductGallery";
import BenefitsStrip from "@/components/BenefitsStrip";
import PriceSection from "@/components/PriceSection";
import SocialProof from "@/components/SocialProof";
import PackagingShowcase from "@/components/PackagingShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import CrossSell from "@/components/CrossSell";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <HeroSection />
      <BenefitsStrip />
      <ProductGallery />
      <PriceSection />
      <SocialProof />
      <PackagingShowcase />
      <WhyChooseUs />
      <CrossSell />
      <FAQ />
      <Footer />
      <StickyBottomBar />
    </div>
  );
};

export default Index;
