
import { imageSrc } from "@/lib/homepage/defaults";

export type EventInput = {
  id?: string | number;
  slug?: string | null;
  title?: string | null;
  category?: string | null;
  description?: string | null;
  details?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  location?: string | null;
  address?: string | null;
  image?: unknown;
  imagePath?: string | null;
  imageAlt?: string | null;
  bookingUrl?: string | null;
  bookingLabel?: string | null;
  highlights?: Array<{
    label?: string | null;
  }> | null;
};

export type GardenEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  details: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  address: string;
  image: string;
  imageAlt: string;
  bookingUrl?: string;
  bookingLabel: string;
  highlights: string[];
};

export function toGardenEvent(
  input: EventInput,
): GardenEvent {
  const media =
    input.image &&
    typeof input.image === "object" &&
    "alt" in input.image
      ? (input.image as { alt?: string | null })
      : null;

  const bookingUrl = input.bookingUrl ?? "";

  const validBookingUrl =
    (bookingUrl.startsWith("/") &&
      !bookingUrl.startsWith("//") &&
      !bookingUrl.includes("\\")) ||
    /^https:\/\/[^\s]+$/i.test(bookingUrl);

  return {
    id: String(input.id ?? "preview"),
    slug: input.slug || "preview",
    title: input.title || "Your Next Beautiful Evening",
    category: input.category || "SPECIAL EVENT",
    description: input.description || "",
    details: input.details || "",
    startsAt: input.startsAt || "",
    endsAt: input.endsAt || undefined,
    location:
      input.location || "Cherry Blossom Garden",
    address: input.address || "",

    image: imageSrc(
      input.image,
      input.imagePath || "/assets/first-floor.png",
    ),

    imageAlt:
      input.imageAlt ||
      media?.alt ||
      input.title ||
      "Cherry Blossom Garden event",

    bookingUrl: validBookingUrl
      ? bookingUrl
      : undefined,

    bookingLabel:
      input.bookingLabel || "Reserve Your Place",

    highlights:
      input.highlights
        ?.map((item) => item.label?.trim())
        .filter((item): item is string =>
          Boolean(item),
        ) ?? [],
  };
}

const TIME_ZONE = "Asia/Kathmandu";

export function eventDate(iso: string) {
  if (!iso || Number.isNaN(Date.parse(iso))) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function eventTime(iso: string) {
  if (!iso || Number.isNaN(Date.parse(iso))) {
    return "Time to be announced";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function eventDay(iso: string) {
  if (!iso || Number.isNaN(Date.parse(iso))) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    day: "2-digit",
  }).format(new Date(iso));
}

export function eventMonth(iso: string) {
  if (!iso || Number.isNaN(Date.parse(iso))) {
    return "---";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    month: "short",
  })
    .format(new Date(iso))
    .toUpperCase();
}
