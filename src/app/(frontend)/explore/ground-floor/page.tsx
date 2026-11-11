import type { Metadata } from "next";

import Navbar from "@/components/frontend/navbar";
import GroundFloorShowcase from "@/components/frontend/explore/ground-floor/GroundFloorShow";

export const metadata: Metadata = {
    title: "Ground Floor — Café & Family Space | Cherry Blossom Garden",
    description:
        "Explore Cherry Blossom Garden's ground-floor café and family space: specialty coffee, a welcoming entrance, beautiful seating, open kitchen, kids zone, and convenient parking.",
};


export default function GroundFloorPage() {
    return (
        <div
            id="ground-floor-top"
            className="relative min-h-screen bg-midnight font-inter text-ivory"
        >
            {/* Navbar floats above the fullscreen showcase, like the homepage hero.
                Keep it OUTSIDE <main> so the mobile menu is never clipped. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[170px] bg-gradient-to-b from-midnight/95 via-midnight/60 to-transparent sm:h-[190px] lg:h-[210px]" />
            <div className="absolute inset-x-0 top-0 z-50">
                <Navbar />
            </div>

            {/* No max-width wrapper: the slide background fills the viewport. */}
            <main className="w-full overflow-x-clip">
                <GroundFloorShowcase />

                <div id="ground-floor-details" />


            </main>
        </div>
    );
}
