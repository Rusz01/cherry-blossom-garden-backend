
import type { Metadata } from "next";
import Navbar from "@/components/frontend/navbar";
import ExperienceCarousel from "@/components/frontend/experiences/experienceCarousel";
import UpcomingEvents from "@/components/frontend/experiences/upcomingEvents";

// Rebuild hourly so the upcoming events list stays current.
export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Experiences | Cherry Blossom Garden",
    description:
        "More than dining. Discover live music, rooftop BBQ, private dining, garden lounge evenings and family experiences at Cherry Blossom Garden.",
};

export default function ExperiencesPage() {
    return (
        <div className="relative min-h-screen bg-midnight font-inter text-ivory">
            {/* Reuse the existing responsive navigation */}
            <Navbar />

            <main className="w-full overflow-x-clip">
                <ExperienceCarousel />

                <UpcomingEvents />
            </main>
        </div>
    );
}
