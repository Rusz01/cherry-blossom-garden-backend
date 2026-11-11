
import Image from "next/image";
import Link from "next/link";

import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    MapPin,
    ArrowRight,
} from "lucide-react";

import DrawLine from "@/components/frontend/motion/drawLine";
import ImageReveal from "@/components/frontend/motion/imageReveal";
import Reveal from "@/components/frontend/motion/reveal";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import styles from "./upcomingEvents.module.css";

export type GardenEvent = {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    imageAlt: string;
    startsAt: string;
    location: string;
    bookingUrl?: string;
};

// DEMO EVENTS ONLY.
// Replace with real events or data from your CMS.
// Times use Nepal's UTC+05:45 offset.
const sampleEvents: GardenEvent[] = [
    {
        id: "live-music-night",
        title: "An Evening of Live Music",
        category: "LIVE ENTERTAINMENT",
        description:
            "Where good music meets unforgettable evenings. Immerse yourself in live performances, thoughtfully crafted dining and a vibrant atmosphere made for memorable nights.",
        image: "/assets/first-floor.png",
        imageAlt: "Cherry Blossom Garden live entertainment space",
        startsAt: "2027-10-24T19:00:00+05:45",
        location: "First Floor · Dining & Entertainment",
    },
    {
        id: "sunset-rooftop-bbq",
        title: "Sunset BBQ Sessions",
        category: "ROOFTOP EXPERIENCE",
        description:
            "A rooftop gathering of smoky flavours, golden-hour views and beautiful moments beneath the evening sky.",
        image: "/assets/rooftop.png",
        imageAlt: "Cherry Blossom Garden rooftop restaurant",
        startsAt: "2027-10-30T17:30:00+05:45",
        location: "Second Floor · Rooftop",
    },
    {
        id: "family-garden-sunday",
        title: "Family Garden Sunday",
        category: "FAMILY & LIFESTYLE",
        description:
            "A relaxed Sunday filled with great food, family moments and playful adventures for our youngest guests.",
        image: "/assets/kids-play-area.png",
        imageAlt: "Cherry Blossom Garden children's play area",
        startsAt: "2027-11-01T11:00:00+05:45",
        location: "Ground Floor · Café & Family",
    },
    {
        id: "garden-evening",
        title: "The Garden Sessions",
        category: "GARDEN & LOUNGE",
        description:
            "Escape into an intimate evening of warm ambience, relaxed conversation and thoughtfully curated experiences.",
        image: "/assets/garden-ambience.png",
        imageAlt: "Cherry Blossom Garden atmospheric garden seating",
        startsAt: "2027-11-06T18:30:00+05:45",
        location: "Garden Lounge",
    },
    {
        id: "private-dining",
        title: "An Evening for Two",
        category: "PRIVATE DINING",
        description:
            "Celebrate connection with an intimate dining experience where elegant surroundings and meaningful moments take centre stage.",
        image: "/assets/private-celebration.png",
        imageAlt: "Cherry Blossom Garden private dining setup",
        startsAt: "2027-11-07T19:00:00+05:45",
        location: "First Floor · Private Dining",
    },
];

const TIME_ZONE = "Asia/Kathmandu";

function eventDate(iso: string) {
    const date = new Date(iso);

    return new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function eventTime(iso: string) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(iso));
}

function eventDay(iso: string) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        day: "2-digit",
    }).format(new Date(iso));
}

function eventMonth(iso: string) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: TIME_ZONE,
        month: "short",
    })
        .format(new Date(iso))
        .toUpperCase();
}

// Reads the clock outside render so the component stays pure.
// The experiences page revalidates hourly, so past events drop off.
function getUpcomingEvents(events: GardenEvent[]) {
    const now = Date.now();

    return events
        .filter((event) => {
            const timestamp = new Date(event.startsAt).getTime();

            return Number.isFinite(timestamp) && timestamp >= now;
        })
        .sort(
            (a, b) =>
                new Date(a.startsAt).getTime() -
                new Date(b.startsAt).getTime()
        );
}

type UpcomingEventsProps = {
    events?: GardenEvent[];
};

export default function UpcomingEvents({
                                           events = sampleEvents,
                                       }: UpcomingEventsProps) {
    // All upcoming events, sorted from soonest to latest.
    // No hard-coded limit.
    const upcomingEvents = getUpcomingEvents(events);

    return (
        <section
            id="upcoming-events"
            className={styles.section}
            aria-labelledby="upcoming-events-title"
        >
            <div className={styles.container}>
                {/* ================ HEADER ================ */}

                <StaggerReveal className={styles.sectionHeader} interval={0.14}>
                    <StaggerItem className={styles.headingArea} stagger={{ interval: 0.1 }}>
                        <StaggerItem className={styles.eyebrow} direction="none">
                            <DrawLine className={styles.eyebrowLine} delay={0.15} />
                            THE GARDEN CALENDAR
                        </StaggerItem>

                        <StaggerItem>
                        <h2
                            id="upcoming-events-title"
                            className={`${styles.title} font-cormorant`}
                        >
                            Upcoming <span >Events.</span>
                        </h2>
                        </StaggerItem>

                        <StaggerItem as="p" intensity="subtle" className={styles.intro}>
                            Every gathering has a story. Discover the
                            experiences, evenings and special occasions
                            waiting to bloom at Cherry Blossom Garden.
                        </StaggerItem>
                    </StaggerItem>

                    <StaggerItem className={styles.headerRight} direction="left" intensity="subtle">
            <span className={styles.count}>
              {String(upcomingEvents.length).padStart(2, "0")}
            </span>

                        <span className={styles.countLabel}>
              UPCOMING
              <br />
              EXPERIENCES
            </span>
                    </StaggerItem>
                </StaggerReveal>

                {/* ================ EVENTS GRID ================ */}

                {upcomingEvents.length > 0 ? (
                    <StaggerReveal className={styles.grid} interval={0.12}>
                        {upcomingEvents.map((event, index) => {
                            const featured = index === 0;

                            return (
                                // Details follow each card in, one after another.
                                <StaggerItem
                                    as="article"
                                    key={event.id}
                                    stagger={{ interval: 0.07, delay: 0.25 }}
                                    className={`${styles.card} ${
                                        featured ? styles.featured : ""
                                    }`}
                                >
                                    {/* IMAGE */}

                                    <div className={styles.imageWrapper}>
                                        <ImageReveal fill delay={0.1}>
                                            <Image
                                                src={event.image}
                                                alt={event.imageAlt}
                                                fill
                                                sizes={
                                                    featured
                                                        ? "(max-width: 700px) 100vw, (max-width: 1100px) 55vw, 45vw"
                                                        : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                                                }
                                                className={styles.image}
                                            />
                                        </ImageReveal>

                                        <div className={styles.imageGradient} />

                                        {/* Date overlay */}

                                        <StaggerItem
                                            className={styles.dateBadge}
                                            direction="down"
                                            intensity="subtle"
                                            aria-hidden
                                        >
                      <span className={styles.dateDay}>
                        {eventDay(event.startsAt)}
                      </span>

                                            <span className={styles.dateMonth}>
                        {eventMonth(event.startsAt)}
                      </span>
                                        </StaggerItem>

                                        {/* Category on photograph */}

                                        <StaggerItem as="span" intensity="subtle" className={styles.imageCategory}>
                      {event.category}
                    </StaggerItem>
                                    </div>

                                    {/* CONTENT */}

                                    <div className={styles.cardBody}>
                                        {featured && (
                                            <StaggerItem className={styles.featuredLabel} intensity="subtle">
                                                <span className={styles.featuredDot} />
                                                FEATURED EXPERIENCE
                                            </StaggerItem>
                                        )}

                                        <StaggerItem className={styles.meta} intensity="subtle">
                      <span className={styles.metaItem}>
                        <CalendarDays
                            size={14}
                            strokeWidth={1.5}
                        />
                        <time dateTime={event.startsAt}>
                          {eventDate(event.startsAt)}
                        </time>
                      </span>

                                            <span className={styles.metaItem}>
                        <Clock3
                            size={14}
                            strokeWidth={1.5}
                        />
                                                {eventTime(event.startsAt)} NPT
                      </span>
                                        </StaggerItem>

                                        <StaggerItem intensity="subtle">
                                            <h3 className={styles.cardTitle}>
                                                {event.title}
                                            </h3>
                                        </StaggerItem>

                                        <StaggerItem as="p" intensity="subtle" className={styles.description}>
                                            {event.description}
                                        </StaggerItem>

                                        <StaggerItem className={styles.cardFooter} direction="none">
                                            <div className={styles.location}>
                                                <MapPin
                                                    size={14}
                                                    strokeWidth={1.5}
                                                />

                                                <span>{event.location}</span>
                                            </div>

                                            {event.bookingUrl && (
                                                <Link
                                                    href={event.bookingUrl}
                                                    className={styles.cardArrow}
                                                    aria-label={`View details for ${event.title}`}
                                                >
                                                    <ArrowUpRight
                                                        size={20}
                                                        strokeWidth={1.5}
                                                    />
                                                </Link>
                                            )}
                                        </StaggerItem>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerReveal>
                ) : (
                    <Reveal className={styles.emptyState}>
                        <span className={styles.emptyFlower}>✳</span>

                        <h3>Something beautiful is coming.</h3>

                        <p>
                            Our next experiences are being prepared.
                            Stay close for upcoming announcements.
                        </p>
                    </Reveal>
                )}

                {/* ================ SECTION FOOTER ================ */}

                <Reveal className={styles.sectionFooter} intensity="subtle">
                    <div className={styles.footerText}>
                        <span className={styles.footerFlower}>✳</span>

                        <p>
                            Beautiful moments are better when shared.
                        </p>
                    </div>

                    <Link
                        href="/#experiences"
                        className={styles.viewLink}
                    >
                        <span className={styles.viewLinkLabel}>
                            EXPLORE OUR EXPERIENCES
                        </span>

                        <ArrowRight
                            size={17}
                            strokeWidth={1.5}
                            aria-hidden="true"
                            className={styles.viewLinkIcon}
                        />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
