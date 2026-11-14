
"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Check,
} from "lucide-react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import Navbar from "@/components/frontend/navbar";

import {
  eventDate,
  eventTime,
  toGardenEvent,
  type EventInput,
} from "@/lib/experiences/events";

type Props = {
  initialData: EventInput;
  serverURL: string;
};

export default function EventDetailView({
                                          initialData,
                                          serverURL,
                                        }: Props) {
  const { data } = useLivePreview<EventInput>({
    initialData,
    serverURL,
    depth: 2,
  });

  const event = toGardenEvent(data);

  const paragraphs = event.details
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const externalBooking =
    event.bookingUrl?.startsWith("https://");

  return (
    <div className="min-h-screen bg-midnight font-inter text-ivory">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative isolate flex min-h-[78vh] flex-col justify-end overflow-hidden border-b border-champagne/20 px-5 pb-16 pt-40 sm:px-8 lg:min-h-[85vh] lg:px-16 lg:pb-24">
          <div className="absolute inset-0 z-0">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              priority
              unoptimized={event.image.startsWith("http")}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-midnight via-midnight/65 to-midnight/35" />

          <div className="relative z-10 mx-auto w-full max-w-[1450px]">
            <Link
              href="/experiences#upcoming-events"
              className="mb-14 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-ivory/75 transition-colors hover:text-blossom"
            >
              <ArrowLeft size={16} />
              All Events
            </Link>

            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-blossom" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blossom">
                {event.category}
              </span>
            </div>

            <h1 className="max-w-[1100px] font-cormorant text-[clamp(62px,8vw,130px)] font-medium leading-[0.94] tracking-[-0.065em] text-ivory">
              {event.title}
            </h1>

            <p className="mt-8 max-w-[720px] text-sm leading-[1.9] text-ivory/75 sm:text-base">
              {event.description}
            </p>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-ivory/20 pt-8">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 text-blossom"
                />

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-champagne">
                    Date
                  </p>

                  <p className="text-sm text-ivory">
                    {eventDate(event.startsAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={18}
                  className="mt-0.5 text-blossom"
                />

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-champagne">
                    Time
                  </p>

                  <p className="text-sm text-ivory">
                    {eventTime(event.startsAt)}

                    {event.endsAt &&
                      ` – ${eventTime(event.endsAt)}`}

                    <span className="ml-2 text-ivory/50">
                      NPT
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 text-blossom"
                />

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-champagne">
                    Location
                  </p>

                  <p className="text-sm text-ivory">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN EVENT CONTENT */}
        <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-32">
          <div className="mx-auto grid max-w-[1450px] gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-9 bg-blossom" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blossom">
                  THE EXPERIENCE
                </span>
              </div>

              <h2 className="font-cormorant text-[clamp(48px,6vw,85px)] leading-[1.02] tracking-[-0.06em]">
                A Moment to{" "}
                <span className="font-allura font-normal text-blossom">
                  Remember.
                </span>
              </h2>

              <div className="mt-9 max-w-[780px] space-y-6 text-[14px] leading-[2] text-ivory/70">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{event.description}</p>
                )}
              </div>

              {event.highlights.length > 0 && (
                <div className="mt-16 border-t border-champagne/20 pt-12">
                  <h3 className="mb-7 font-cormorant text-4xl tracking-[-0.04em]">
                    Event Highlights
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {event.highlights.map(
                      (highlight, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 border-b border-champagne/15 pb-5"
                        >
                          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blossom/40 text-blossom">
                            <Check size={13} />
                          </span>

                          <p className="text-sm leading-7 text-ivory/80">
                            {highlight}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* EVENT INFORMATION SIDEBAR */}
            <aside className="self-start border border-champagne/25 bg-charcoal p-7 sm:p-9 lg:sticky lg:top-24">
              <span className="text-[10px] uppercase tracking-[0.28em] text-blossom">
                THE GARDEN CALENDAR
              </span>

              <h3 className="mt-5 font-cormorant text-4xl leading-tight tracking-[-0.045em]">
                Join Us for
                <br />
                Something Special.
              </h3>

              <div className="my-8 h-px w-full bg-champagne/20" />

              <div className="space-y-7">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-champagne">
                    Date & Time
                  </p>

                  <p className="text-sm leading-7 text-ivory/85">
                    {eventDate(event.startsAt)}
                    <br />
                    {eventTime(event.startsAt)} NPT
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-champagne">
                    Venue
                  </p>

                  <p className="text-sm leading-7 text-ivory/85">
                    {event.location}
                  </p>

                  {event.address && (
                    <p className="mt-2 whitespace-pre-line text-xs leading-6 text-ivory/55">
                      {event.address}
                    </p>
                  )}
                </div>
              </div>

              {event.bookingUrl && (
                <Link
                  href={event.bookingUrl}
                  target={
                    externalBooking ? "_blank" : undefined
                  }
                  rel={
                    externalBooking
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group mt-10 flex min-h-14 items-center justify-between gap-4 bg-blossom px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-midnight transition-colors hover:bg-ivory"
                >
                  {event.bookingLabel}

                  <ArrowUpRight
                    size={19}
                    className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              )}

              <p className="mt-7 text-[11px] leading-6 text-ivory/50">
                Beautiful moments are better when shared.
              </p>
            </aside>
          </div>
        </section>

        {/* FOOTER CALL TO ACTION */}
        <section className="border-t border-champagne/20 bg-charcoal px-5 py-20 text-center sm:px-8 lg:py-28">
          <span className="text-3xl text-blossom">
            ✳
          </span>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-blossom">
            CHERRY BLOSSOM GARDEN
          </p>

          <h2 className="mt-6 font-cormorant text-[clamp(42px,6vw,76px)] leading-[1.02] tracking-[-0.05em]">
            There's Always More
            <br />
            <span className="font-allura text-blossom">
              to Discover.
            </span>
          </h2>

          <Link
            href="/experiences#upcoming-events"
            className="mt-10 inline-flex items-center gap-4 border-b border-blossom pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-blossom transition-colors hover:text-ivory"
          >
            Explore More Events
            <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
    </div>
  );
}
