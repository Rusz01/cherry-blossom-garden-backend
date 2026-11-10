
import HeroSection from "@/components/frontend/homePage/heroSection";
import OurStory from "@/components/frontend/homePage/ourStory";
import ThreeLevels from "@/components/frontend/homePage/threeLevels";
import WaysWeElevate from "@/components/frontend/homePage/waysWeElevate";
import TasteOfGarden from "@/components/frontend/homePage/tasteOfGarden";
import KidsPlayArea from "@/components/frontend/homePage/kidsPlayArea";
import GallerySection from "@/components/frontend/homePage/gallerySection";
import CTASection from "@/components/frontend/homePage/ctaSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <OurStory />
      <ThreeLevels />
      <WaysWeElevate />
      <TasteOfGarden />
      <KidsPlayArea />
      <GallerySection />
      <CTASection />


    </div>
  );
}