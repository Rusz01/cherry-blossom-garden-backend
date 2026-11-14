
"use client";

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

import StaggerReveal, {
  StaggerItem,
} from "@/components/frontend/motion/staggerReveal";

import {
  eventDate,
  eventTime,
  eventDay,
  eventMonth,
  type GardenEvent,
} from "@/lib/experiences/events";

import {
  useExperiencesContent,
} from "./ExperiencesContentProvider";

import styles from "./upcomingEvents.module.css";

type Props = {
  events: GardenEvent[];
};

export default function UpcomingEvents({
                                         events,
                                       }: Props) {
  const { upcoming } = useExperiencesContent();

  return (
    <section
      id="upcoming-events"
      className={styles.section}
      aria-labelledby="upcoming-events-title"
    >
      <div className={styles.container}>
        <StaggerReveal
          className={styles.sectionHeader}
          interval={0.14}
        >
          <StaggerItem
            className={styles.headingArea}
            stagger={{ interval: 0.1 }}
          >
            <StaggerItem
              className={styles.eyebrow}
              direction="none"
            >
              <DrawLine
                className={styles.eyebrowLine}
                delay={0.15}
              />

              {upcoming.eyebrow}
            </StaggerItem>

            <StaggerItem>
              <h2
                id="upcoming-events-title"
                className={`${styles.title} font-cormorant`}
              >
                {upcoming.title}{" "}
                <span>{upcoming.accent}</span>
              </h2>
            </StaggerItem>

            <StaggerItem
              as="p"
              intensity="subtle"
              className={styles.intro}
            >
              {upcoming.description}
            </StaggerItem>
          </StaggerItem>

          <StaggerItem
            className={styles.headerRight}
            direction="left"
            intensity="subtle"
          >
            <span className={styles.count}>
              {String(events.length).padStart(2, "0")}
            </span>

            <span className={styles.countLabel}>
              UPCOMING
              <br />
              EXPERIENCES
            </span>
          </StaggerItem>
        </StaggerReveal>

        {events.length > 0 ? (
          <StaggerReveal
            className={styles.grid}
            interval={0.12}
          >
            {events.map((event, index) => {
              const featured = index === 0;

              return (
                <StaggerItem
                  as="article"
                  key={event.id}
                  stagger={{
                    interval: 0.07,
                    delay: 0.25,
                  }}
                  className={`${styles.card} ${
                    featured ? styles.featured : ""
                  }`}
                >
                  <div className={styles.imageWrapper}>
                    <ImageReveal fill delay={0.1}>
                      <Image
                        src={event.image}
                        alt={event.imageAlt}
                        fill
                        unoptimized={event.image.startsWith("http")}
                        sizes={
                          featured
                            ? "(max-width: 700px) 100vw, (max-width: 1100px) 55vw, 45vw"
                            : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        }
                        className={styles.image}
                      />
                    </ImageReveal>

                    <div
                      className={styles.imageGradient}
                    />

                    <div
                      className={styles.dateBadge}
                      aria-hidden="true"
                    >
                      <span className={styles.dateDay}>
                        {eventDay(event.startsAt)}
                      </span>

                      <span className={styles.dateMonth}>
                        {eventMonth(event.startsAt)}
                      </span>
                    </div>

                    <span
                      className={styles.imageCategory}
                    >
                      {event.category}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    {featured && (
                      <div className={styles.featuredLabel}>
                        <span
                          className={styles.featuredDot}
                        />
                        FEATURED EXPERIENCE
                      </div>
                    )}

                    <div className={styles.meta}>
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
                    </div>

                    <h3 className={styles.cardTitle}>
                      {event.title}
                    </h3>

                    <p className={styles.description}>
                      {event.description}
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.location}>
                        <MapPin
                          size={14}
                          strokeWidth={1.5}
                        />

                        <span>{event.location}</span>
                      </div>

                      <span
                        className={styles.cardArrow}
                        aria-hidden="true"
                      >
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/experiences/${event.slug}`}
                    className="absolute inset-0 z-10 focus-ring"
                    aria-label={`View details for ${event.title}`}
                  >
                    <span className="sr-only">
                      View {event.title}
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        ) : (
          <Reveal className={styles.emptyState}>
            <span className={styles.emptyFlower}>
              ✳
            </span>

            <h3>{upcoming.emptyTitle}</h3>

            <p>{upcoming.emptyDescription}</p>
          </Reveal>
        )}

        <Reveal
          className={styles.sectionFooter}
          intensity="subtle"
        >
          <div className={styles.footerText}>
            <span className={styles.footerFlower}>
              ✳
            </span>

            <p>{upcoming.footerText}</p>
          </div>

          <Link
            href={upcoming.footerHref || "/#experiences"}
            className={styles.viewLink}
          >
            <span className={styles.viewLinkLabel}>
              {upcoming.footerLabel}
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
