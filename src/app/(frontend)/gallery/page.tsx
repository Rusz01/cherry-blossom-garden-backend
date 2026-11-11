
import type { Metadata } from "next";
import { Suspense } from "react";

import Navbar from "@/components/frontend/navbar";
import GalleryExperience from "@/components/frontend/gallery/galleryExperience";

export const metadata: Metadata = {
    title: "Gallery | Cherry Blossom Garden",
    description:
        "Explore the Cherry Blossom Garden gallery. Discover beautiful dining spaces, rooftop moments, family experiences and celebrations.",
};

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-midnight font-inter text-ivory">
            {/* Reuse the existing dark Cherry Blossom navbar */}
            <Navbar />

            <main className="w-full overflow-x-clip">
                <Suspense
                    fallback={
                        <div className="min-h-[65vh] bg-midnight" />
                    }
                >
                    <GalleryExperience />
                </Suspense>
            </main>

            {/* Existing layout.tsx already renders Footer */}
        </div>
    );
}
