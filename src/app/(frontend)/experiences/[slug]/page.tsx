
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import EventDetailView from "@/components/frontend/experiences/EventDetailView";

import {
  getEventBySlug,
} from "@/lib/experiences/server";

import { getAppURL } from "@/lib/env";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
                                         params,
                                       }: Props): Promise<Metadata> {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | Cherry Blossom Garden",
      robots: { index: false },
    };
  }

  const { isEnabled } = await draftMode();

  return {
    title: `${event.title} | Cherry Blossom Garden`,
    description:
      event.description ||
      "Discover upcoming experiences at Cherry Blossom Garden.",
    robots: isEnabled
      ? { index: false, follow: false }
      : undefined,
  };
}

export default async function EventPage({
                                          params,
                                        }: Props) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <EventDetailView
      initialData={{
        ...event,
        highlights: event.highlights.map((label) => ({
          label,
        })),
      }}
      serverURL={getAppURL()}
    />
  );
}
