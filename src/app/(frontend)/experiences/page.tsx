
import type { Metadata } from "next";

import Navbar from "@/components/frontend/navbar";

import ExperienceCarousel from "@/components/frontend/experiences/experienceCarousel";
import UpcomingEvents from "@/components/frontend/experiences/upcomingEvents";

import ExperiencesContentProvider from "@/components/frontend/experiences/ExperiencesContentProvider";

import {
  getExperiencesContent,
  getUpcomingEvents,
} from "@/lib/experiences/server";

import { getAppURL } from "@/lib/env";

// Always read current published content or authorised drafts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experiences | Cherry Blossom Garden",
  description:
    "Discover live music, rooftop BBQ, private dining, garden lounge evenings and family experiences at Cherry Blossom Garden.",
};

export default async function ExperiencesPage() {
  const [content, events] = await Promise.all([
    getExperiencesContent(),
    getUpcomingEvents(),
  ]);

  return (
    <div className="relative min-h-screen bg-midnight font-inter text-ivory">
      <Navbar />

      <ExperiencesContentProvider
        initialData={content}
        serverURL={getAppURL()}
      >
        <main className="w-full overflow-x-clip">
          <ExperienceCarousel />
          <UpcomingEvents events={events} />
        </main>
      </ExperiencesContentProvider>
    </div>
  );
}
