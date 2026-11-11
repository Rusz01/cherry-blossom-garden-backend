
import type { Metadata } from "next";
import Navbar from "@/components/frontend/navbar";
import AboutHeroSection from "@/components/frontend/about/herosection";
import OurStorySection from "@/components/frontend/about/ourStorySection";

export const metadata: Metadata = {
    title: "About Us | Cherry Blossom Garden",
    description:
        "Discover Cherry Blossom Garden, where thoughtful hospitality, seasonal flavours and beautiful celebrations come together.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-midnight font-inter text-ivory">
            <Navbar />

            <main id="main-content">
                <AboutHeroSection />
            </main>
            <OurStorySection />
        </div>
    );
}
