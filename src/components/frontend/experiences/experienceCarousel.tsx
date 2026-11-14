
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
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type TouchEvent,
} from "react";

import { useInView } from "motion/react";

import RiseText from "@/components/frontend/motion/riseText";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";

import { imageSrc } from "@/lib/homepage/defaults";

import {
  useExperiencesContent,
} from "./ExperiencesContentProvider";

import styles from "./experienceCarousel.module.css";

const AUTOPLAY_DELAY = 7000;

const formatNumber = (value: number) =>
  String(value).padStart(2, "0");

export default function ExperienceCarousel() {
  const { hero, slides } = useExperiencesContent();

  const experiences = useMemo(
    () =>
      slides.map((item, index) => ({
        ...item,
        number: formatNumber(index + 1),
        image: imageSrc(
          item.image,
          item.imagePath || "/assets/first-floor.png",
        ),
      })),
    [slides],
  );

  const TOTAL = experiences.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    amount: 0.35,
  });

  const touchStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const currentIndex = Math.min(
    activeIndex,
    Math.max(0, TOTAL - 1),
  );

  useEffect(() => {
    setActiveIndex((index) =>
      Math.min(index, Math.max(0, TOTAL - 1)),
    );
  }, [TOTAL]);

  const playing =
    autoplay && !reducedMotion && TOTAL > 1;

  const held =
    isHovered ||
    isFocused ||
    isTouching ||
    !inView;

  const move = useCallback(
    (step: number) => {
      if (TOTAL <= 1) return;

      setDirection(step > 0 ? 1 : -1);

      setActiveIndex(
        (previous) =>
          (previous + step + TOTAL) % TOTAL,
      );
    },
    [TOTAL],
  );

  const previous = () => move(-1);
  const next = () => move(1);

  const goTo = (index: number) => {
    if (!TOTAL) return;

    const target = (index + TOTAL) % TOTAL;

    let delta = target - currentIndex;

    if (delta > TOTAL / 2) delta -= TOTAL;
    if (delta < -TOTAL / 2) delta += TOTAL;

    if (delta !== 0) {
      setDirection(delta > 0 ? 1 : -1);
    }

    setActiveIndex(target);
  };

  const getPosition = (index: number) => {
    if (!TOTAL) return 0;

    let position = index - currentIndex;

    if (position > Math.floor(TOTAL / 2)) {
      position -= TOTAL;
    }

    if (position < -Math.floor(TOTAL / 2)) {
      position += TOTAL;
    }

    return position;
  };

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    setIsTouching(true);
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
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
      Math.abs(differenceX) >
      Math.abs(differenceY) * 1.2
    ) {
      move(differenceX < 0 ? 1 : -1);
    }

    touchStart.current = null;
    setIsTouching(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
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

  if (TOTAL === 0) return null;

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
            event.relatedTarget as Node | null,
          )
        ) {
          setIsFocused(false);
        }
      }}
    >
      <div
        className={styles.ambientGlow}
        aria-hidden="true"
      />

      <div className={styles.header}>
        <div
          className={`${styles.eyebrow} cbg-enter cbg-delay-1`}
        >
          <span
            className={`${styles.eyebrowLine} cbg-draw`}
            style={{ animationDelay: "0.25s" }}
          />

          {hero.eyebrow}

          <span className={styles.edition}>
            01 — {formatNumber(TOTAL)}
          </span>
        </div>

        <div className={styles.headerContent}>
          <h1
            className={`${styles.pageTitle} font-cormorant`}
          >
            <RiseText
              text={hero.title}
              delay={0.3}
            />{" "}

            <span
              className={`${styles.pageAccent} font-allura`}
            >
              <RiseText
                text={hero.accent}
                delay={0.5}
              />
            </span>
          </h1>

          <p
            className={`${styles.pageDescription} cbg-enter`}
            style={{ animationDelay: "0.7s" }}
          >
            {hero.description}
          </p>
        </div>
      </div>

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
          style={
            { "--dir": direction } as CSSProperties
          }
        >
          {experiences.map((experience, index) => {
            const position = getPosition(index);

            const isActive = position === 0;
            const isPreview = Math.abs(position) === 1;
            const isHidden = Math.abs(position) > 1;

            return (
              <article
                key={experience.id || experience.key || index}
                className={styles.slide}
                data-position={position}
                aria-roledescription="slide"
                aria-label={`${experience.number} of ${formatNumber(TOTAL)}: ${experience.label}`}
                aria-hidden={isHidden}
                inert={isHidden}
              >
                <div className={styles.imageLayer}>
                  <Image
                    src={experience.image}
                    alt={experience.alt}
                    fill
                    sizes="(max-width: 700px) 85vw, (max-width: 1100px) 70vw, 780px"
                    priority={index === 0}
                    unoptimized={experience.image.startsWith("http")}
                    className={styles.image}
                  />
                </div>

                <div className={styles.imageOverlay} />
                <div className={styles.innerBorder} />

                <div className={styles.cardHeader}>
                  <div className={styles.cardIdentity}>
                    <span className={styles.smallFlower}>
                      ✳
                    </span>
                    CHERRY BLOSSOM GARDEN
                  </div>

                  <span className={styles.cardNumber}>
                    {experience.number} /{" "}
                    {formatNumber(TOTAL)}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.categoryRow}>
                    <span
                      className={styles.categoryLine}
                    />
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
                    href={experience.href || "/#three-levels"}
                    className={styles.cardLink}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {experience.linkLabel ||
                      "DISCOVER OUR SPACES"}

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>

                {isPreview && (
                  <button
                    type="button"
                    className={styles.previewButton}
                    onClick={() => goTo(index)}
                    aria-label={`Show ${experience.label}`}
                  >
                    <span
                      className={styles.previewLabel}
                    >
                      {position < 0
                        ? "PREV"
                        : "NEXT"}
                    </span>
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.slideCounter}>
          <span className={styles.counterWindow}>
            <span
              key={currentIndex}
              className={styles.currentNumber}
            >
              {formatNumber(currentIndex + 1)}
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
              key={experience.id || experience.key || index}
              type="button"
              className={`${styles.paginationButton} ${
                currentIndex === index
                  ? styles.paginationActive
                  : ""
              }`}
              onClick={() => goTo(index)}
              aria-label={`Go to ${experience.label}`}
              aria-current={
                currentIndex === index
                  ? "true"
                  : undefined
              }
            >
              <span>
                {currentIndex === index && (
                  <i
                    key={currentIndex}
                    aria-hidden="true"
                    className={styles.paginationProgress}
                    onAnimationEnd={next}
                    style={
                      playing
                        ? {
                          animation: `cbgProgress ${AUTOPLAY_DELAY}ms linear forwards`,
                          animationPlayState: held
                            ? "paused"
                            : "running",
                        }
                        : undefined
                    }
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.navigation}>
          {!reducedMotion && (
            <>
              <button
                type="button"
                className={styles.autoplayButton}
                onClick={() =>
                  setAutoplay((value) => !value)
                }
                aria-label={
                  autoplay
                    ? "Pause automatic slides"
                    : "Play automatic slides"
                }
                title={
                  autoplay
                    ? "Pause autoplay"
                    : "Resume autoplay"
                }
              >
                {autoplay ? (
                  <Pause
                    size={14}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={14}
                    fill="currentColor"
                  />
                )}
              </button>

              <span
                className={styles.navigationDivider}
              />
            </>
          )}

          <button
            type="button"
            className={styles.arrowButton}
            onClick={previous}
            aria-label="Previous experience"
          >
            <ArrowLeft
              size={19}
              strokeWidth={1.5}
            />
          </button>

          <button
            type="button"
            className={`${styles.arrowButton} ${styles.arrowNext}`}
            onClick={next}
            aria-label="Next experience"
          >
            <ArrowRight
              size={19}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>

      <p
        className={styles.srOnly}
        role="status"
        aria-live={playing ? "off" : "polite"}
      >
        Showing {experiences[currentIndex]?.label},
        slide {currentIndex + 1} of {TOTAL}
      </p>
    </section>
  );
}
