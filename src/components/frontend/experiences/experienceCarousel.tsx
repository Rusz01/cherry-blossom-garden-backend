"use client";

import Image from "next/image";
import Link from "next/link";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Pause,
    Play,
} from "lucide-react";

import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import { useInView } from "motion/react";

import RiseText from "@/components/frontend/motion/riseText";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import styles from "./experienceCarousel.module.css";

const experiences = [
    {
        id: "live-music",
        number: "01",
        category: "LIVE MUSIC & ENTERTAINMENT",
        title: "The Night Comes Alive.",
        description:
            "Let the evening find its rhythm. Live performances, warm lighting and a vibrant atmosphere bring music, dining and beautiful moments together.",
        image: "/assets/first-floor.png",
        alt: "Cherry Blossom Garden first-floor dining and entertainment space",
        label: "Live Music",
    },
    {
        id: "rooftop-bbq",
        number: "02",
        category: "OPEN AIR EXPERIENCES",
        title: "Sunset BBQ Sessions.",
        description:
            "Golden-hour gatherings, smoky flavours and evenings under the open sky. Discover a rooftop experience designed for great food and even better company.",
        image: "/assets/rooftop.png",
        alt: "Cherry Blossom Garden rooftop dining and BBQ area",
        label: "Rooftop BBQ",
    },
    {
        id: "private-dining",
        number: "03",
        category: "INTIMATE OCCASIONS",
        title: "Moments Made Personal.",
        description:
            "Some occasions deserve a setting of their own. From intimate dinners to meaningful celebrations, enjoy beautifully considered spaces for unforgettable moments.",
        image: "/assets/private-celebration.png",
        alt: "Elegant private celebration at Cherry Blossom Garden",
        label: "Private Dining",
    },
    {
        id: "garden-lounge",
        number: "04",
        category: "GARDEN & LOUNGE",
        title: "Stay a Little Longer.",
        description:
            "A softer pace after dark. Settle into a garden-inspired atmosphere of relaxed seating, ambient lighting and conversations that have nowhere else to be.",
        image: "/assets/garden-ambience.png",
        alt: "Cherry Blossom Garden atmospheric garden lounge",
        label: "Garden Lounge",
    },
    {
        id: "family-garden",
        number: "05",
        category: "FAMILY EXPERIENCES",
        title: "For Every Generation.",
        description:
            "A welcoming destination for shared moments. Beautiful spaces to dine and unwind, with a playful environment for younger guests to discover and enjoy.",
        image: "/assets/kids-play-area.png",
        alt: "Children's play area at Cherry Blossom Garden",
        label: "Family Garden",
    },
] as const;

const TOTAL = experiences.length;
const AUTOPLAY_DELAY = 7000;

const formatNumber = (number: number) =>
    String(number).padStart(2, "0");

/*
 * Autoplay has one clock: the active pagination pill's CSS fill.
 * When it completes, the next slide plays; holding (hover, focus, touch,
 * off-screen) pauses the fill, so countdown and slide change never drift.
 * The Pause button and reduced motion switch it off entirely.
 */

export default function ExperienceCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    // 1 = moving forward, -1 = back. Drives which side new copy enters from.
    const [direction, setDirection] = useState(1);
    const [autoplay, setAutoplay] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouching, setIsTouching] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

    const sectionRef = useRef<HTMLElement | null>(null);
    const inView = useInView(sectionRef, { amount: 0.35 });

    const playing = autoplay && !reducedMotion;
    const held = isHovered || isFocused || isTouching || !inView;

    const touchStart = useRef<{
        x: number;
        y: number;
    } | null>(null);

    const goTo = (index: number) => {
        const target = (index + TOTAL) % TOTAL;
        let delta = target - activeIndex;

        // Shortest way round the loop decides the direction.
        if (delta > TOTAL / 2) delta -= TOTAL;
        if (delta < -TOTAL / 2) delta += TOTAL;
        if (delta !== 0) setDirection(delta > 0 ? 1 : -1);

        setActiveIndex(target);
    };

    const move = useCallback((step: number) => {
        setDirection(step > 0 ? 1 : -1);
        setActiveIndex(
            (previous) => (previous + step + TOTAL) % TOTAL
        );
    }, []);

    const previous = () => move(-1);
    const next = () => move(1);

    // Return the shortest distance from the active slide.
    // Example: -2, -1, 0, 1, 2
    const getPosition = (index: number) => {
        let position = index - activeIndex;

        if (position > Math.floor(TOTAL / 2)) {
            position -= TOTAL;
        }

        if (position < -Math.floor(TOTAL / 2)) {
            position += TOTAL;
        }

        return position;
    };

    // Mobile and tablet swipe gesture.
    const handleTouchStart = (
        event: React.TouchEvent<HTMLDivElement>
    ) => {
        touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        setIsTouching(true);
    };

    const handleTouchEnd = (
        event: React.TouchEvent<HTMLDivElement>
    ) => {
        if (!touchStart.current) return;

        const differenceX =
            event.changedTouches[0].clientX -
            touchStart.current.x;

        const differenceY =
            event.changedTouches[0].clientY -
            touchStart.current.y;

        if (
            Math.abs(differenceX) > 50 &&
            Math.abs(differenceX) > Math.abs(differenceY) * 1.2
        ) {
            move(differenceX < 0 ? 1 : -1);
        }

        touchStart.current = null;
        setIsTouching(false);
    };

    // Arrow keys work when the carousel is focused.
    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previous();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
        }
    };

    return (
        <section
            ref={sectionRef}
            className={styles.experiences}
            aria-label="Cherry Blossom Garden experiences"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null
                    )
                ) {
                    setIsFocused(false);
                }
            }}
        >
            {/* Decorative background */}
            <div className={styles.ambientGlow} aria-hidden="true" />

            {/* ================= HEADER ================= */}
            <div className={styles.header}>
                <div className={`${styles.eyebrow} cbg-enter cbg-delay-1`}>
                    <span className={`${styles.eyebrowLine} cbg-draw`} style={{ animationDelay: "0.25s" }} />
                    THE CHERRY BLOSSOM EXPERIENCE
                    <span className={styles.edition}>01 — 05</span>
                </div>

                <div className={styles.headerContent}>
                    <h1 className={`${styles.pageTitle} font-cormorant`}>
                        <RiseText text="More Than" delay={0.3} />{" "}
                        <span className={`${styles.pageAccent} font-allura`}>
                            <RiseText text="Dining." delay={0.5} />
                        </span>
                    </h1>

                    <p className={`${styles.pageDescription} cbg-enter`} style={{ animationDelay: "0.7s" }}>
                        A place to gather, celebrate and discover.
                        From evenings filled with music to moments
                        beneath the open sky, every experience has
                        its own story.
                    </p>
                </div>
            </div>

            {/* ================= CAROUSEL ================= */}
            <div
                className={styles.viewport}
                role="region"
                aria-roledescription="carousel"
                aria-label="Explore our experiences"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                    touchStart.current = null;
                    setIsTouching(false);
                }}
            >
                <div
                    className={styles.stage}
                    style={{ "--dir": direction } as CSSProperties}
                >
                    {experiences.map((experience, index) => {
                        const position = getPosition(index);
                        const isActive = position === 0;
                        const isPreview = Math.abs(position) === 1;
                        const isHidden = Math.abs(position) > 1;

                        return (
                            <article
                                key={experience.id}
                                className={styles.slide}
                                data-position={position}
                                aria-roledescription="slide"
                                aria-label={`${experience.number} of ${formatNumber(
                                    TOTAL
                                )}: ${experience.label}`}
                                aria-hidden={isHidden}
                                inert={isHidden}
                            >
                                {/* Background photograph */}
                                <div className={styles.imageLayer}>
                                    <Image
                                        src={experience.image}
                                        alt={experience.alt}
                                        fill
                                        sizes="(max-width: 700px) 85vw, (max-width: 1100px) 70vw, 780px"
                                        priority={index === 0}
                                        className={styles.image}
                                    />
                                </div>

                                <div className={styles.imageOverlay} />

                                <div className={styles.innerBorder} />

                                {/* Image top labels */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIdentity}>
                                        <span className={styles.smallFlower}>✳</span>
                                        CHERRY BLOSSOM GARDEN
                                    </div>

                                    <span className={styles.cardNumber}>
                    {experience.number} / {formatNumber(TOTAL)}
                  </span>
                                </div>

                                {/* Heading and description inside image */}
                                <div className={styles.cardContent}>
                                    <div className={styles.categoryRow}>
                                        <span className={styles.categoryLine} />
                                        <span className={styles.category}>
                      {experience.category}
                    </span>
                                    </div>

                                    <h2 className={styles.cardTitle}>
                                        {experience.title}
                                    </h2>

                                    <p className={styles.cardDescription}>
                                        {experience.description}
                                    </p>

                                    <Link
                                        href="/#three-levels"
                                        className={styles.cardLink}
                                        tabIndex={isActive ? 0 : -1}
                                    >
                                        DISCOVER OUR SPACES
                                        <ArrowUpRight
                                            size={17}
                                            strokeWidth={1.5}
                                        />
                                    </Link>
                                </div>

                                {/* Side slides are buttons to select them */}
                                {isPreview && (
                                    <button
                                        type="button"
                                        className={styles.previewButton}
                                        onClick={() => goTo(index)}
                                        aria-label={`Show ${experience.label}`}
                                    >
                    <span className={styles.previewLabel}>
                      {position < 0 ? "PREV" : "NEXT"}
                    </span>
                                    </button>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* ================= CONTROLS ================= */}
            <div className={styles.controls}>
                <div className={styles.slideCounter}>
          <span className={styles.counterWindow}>
            <span key={activeIndex} className={styles.currentNumber}>
              {formatNumber(activeIndex + 1)}
            </span>
          </span>

                    <span className={styles.totalNumber}>
            / {formatNumber(TOTAL)}
          </span>
                </div>

                <div
                    className={styles.pagination}
                    aria-label="Choose an experience"
                >
                    {experiences.map((experience, index) => (
                        <button
                            key={experience.id}
                            type="button"
                            className={`${styles.paginationButton} ${
                                activeIndex === index ? styles.paginationActive : ""
                            }`}
                            onClick={() => goTo(index)}
                            aria-label={`Go to ${experience.label}`}
                            aria-current={activeIndex === index ? "true" : undefined}
                        >
                            <span>
                                {activeIndex === index ? (
                                    <i
                                        // Remounts per slide, restarting the countdown.
                                        key={activeIndex}
                                        aria-hidden="true"
                                        className={styles.paginationProgress}
                                        onAnimationEnd={next}
                                        style={
                                            playing
                                                ? {
                                                    animation: `cbgProgress ${AUTOPLAY_DELAY}ms linear forwards`,
                                                    animationPlayState: held ? "paused" : "running",
                                                }
                                                : undefined
                                        }
                                    />
                                ) : null}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={styles.navigation}>
                    {/* Autoplay never runs with reduced motion, so no control is needed. */}
                    {!reducedMotion ? (
                        <>
                            <button
                                type="button"
                                className={styles.autoplayButton}
                                onClick={() => setAutoplay((value) => !value)}
                                aria-label={
                                    autoplay ? "Pause automatic slides" : "Play automatic slides"
                                }
                                title={autoplay ? "Pause autoplay" : "Resume autoplay"}
                            >
                                {autoplay ? (
                                    <Pause size={14} fill="currentColor" />
                                ) : (
                                    <Play size={14} fill="currentColor" />
                                )}
                            </button>

                            <span className={styles.navigationDivider} />
                        </>
                    ) : null}

                    <button
                        type="button"
                        className={styles.arrowButton}
                        onClick={previous}
                        aria-label="Previous experience"
                    >
                        <ArrowLeft size={19} strokeWidth={1.5} />
                    </button>

                    <button
                        type="button"
                        className={`${styles.arrowButton} ${styles.arrowNext}`}
                        onClick={next}
                        aria-label="Next experience"
                    >
                        <ArrowRight size={19} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Screen reader slide announcement */}
            <p
                className={styles.srOnly}
                role="status"
                aria-live={playing ? "off" : "polite"}
            >
                Showing {experiences[activeIndex].label},
                slide {activeIndex + 1} of {TOTAL}
            </p>
        </section>
    );
}
