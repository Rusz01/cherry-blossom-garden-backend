
import type { Metadata } from "next";

import EventDetailView from "@/components/frontend/experiences/EventDetailView";

import { getAppURL } from "@/lib/env";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EventLivePreview() {
  return (
    <EventDetailView
      initialData={{
        id: "preview",
        slug: "preview",
        title: "Your Next Beautiful Evening",
        category: "SPECIAL EVENT",
        description:
          "Create an event in Payload CMS to see the details update here.",
        details:
          "Your full event description will appear here.",
        startsAt: "2027-01-01T12:00:00+05:45",
        location: "Cherry Blossom Garden",
        imagePath: "/assets/first-floor.png",
        bookingLabel: "Reserve Your Place",
        highlights: [],
      }}
      serverURL={getAppURL()}
    />
  );
}
