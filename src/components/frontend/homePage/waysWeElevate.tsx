"use client";

import { useHomeContent } from "./HomeContentProvider";
import {
  DEFAULT_HOMEPAGE,
  imageSrc,
} from "@/lib/homepage/defaults";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "motion/react";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import Reveal from "@/components/frontend/motion/reveal";
import TextReveal from "@/components/frontend/motion/textReveal";

import CarouselArrow from "@/components/frontend/ui/carouselArrow";
import Container from "@/components/frontend/ui/container";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";

const AUTO_PLAY_DELAY = 6000;


type SlidePosition = "before" | "active" | "after";

function positionOf(index: number, activeIndex: number): SlidePosition {
    if (index < activeIndex) return "before";
    if (index > activeIndex) return "after";
    return "active";
}

/*
 * Autoplay has one clock: the active progress bar's CSS animation.
 * When it ends, the next slide plays; pausing pauses the bar, so the
 * timer and the indicator can never drift apart. No setInterval.
 */

export default function WaysWeElevate() {


  const { experiences: experienceContent } =
    useHomeContent();

  const experiences = experienceContent.items.map(
    (experience, index) => ({
      ...experience,
      image: imageSrc(
        experience.image,
        DEFAULT_HOMEPAGE.experiences.items[index]?.image ??
        "/assets/elevated-dining.png",
      ),
    }),
  );


  const [activeIndex, setActiveIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [touching, setTouching] = useState(false);
    const [stopped, setStopped] = useState(false);
    const reducedMotion = usePrefersReducedMotion();

    const sectionRef = useRef<HTMLElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTimeoutRef = useRef<number | null>(null);

    const inView = useInView(sectionRef, { amount: 0.3 });

    // Reduced motion and the visitor's own "Pause" switch autoplay off;
    // hover, focus, touch and scrolling away only hold it.
    const autoplay = !reducedMotion && !stopped;
    const held = hovered || focused || touching || !inView;

    const scrollToSlide = useCallback((index: number) => {
        const slider = sliderRef.current;
        const slide = slideRefs.current[index];

        if (!slider || !slide) return;

        const sliderRect = slider.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();

        const target =
            slider.scrollLeft +
            slideRect.left -
            sliderRect.left -
            (sliderRect.width - slideRect.width) / 2;

        slider.scrollTo({
            left: target,
            behavior: reducedMotion ? "auto" : "smooth",
        });

        setActiveIndex(index);
    }, [reducedMotion]);

    const nextSlide = useCallback(() => {
        scrollToSlide(activeIndex === experiences.length - 1 ? 0 : activeIndex + 1);
    }, [activeIndex, scrollToSlide]);

    const previousSlide = useCallback(() => {
        scrollToSlide(activeIndex === 0 ? experiences.length - 1 : activeIndex - 1);
    }, [activeIndex, scrollToSlide]);

    // Clear a pending scroll-settle timer on unmount.
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                window.clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const handleScroll = () => {
        if (scrollTimeoutRef.current) {
            window.clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = window.setTimeout(() => {
            const slider = sliderRef.current;

            if (!slider) return;

            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter =
                sliderRect.left + sliderRect.width / 2;

            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            slideRefs.current.forEach((slide, index) => {
                if (!slide) return;

                const slideRect = slide.getBoundingClientRect();
                const slideCenter =
                    slideRect.left + slideRect.width / 2;

                const distance = Math.abs(
                    slideCenter - sliderCenter
                );

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        }, 100);
    };

    return (
        <section
            ref={sectionRef}
            id="experiences"
            aria-roledescription="carousel"
            aria-label="Ways we elevate your evening"
            className="relative overflow-hidden bg-midnight py-20 sm:py-24 lg:py-28 xl:py-32 border-y border-champagne/50"
        >
            {/* Background decoration */}
            <div
                className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blossom/5 blur-[130px]"/>
            <div
                className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-champagne/5 blur-[140px]"/>

            {/* Header */}
            <Container size="wide" className="relative z-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-[760px]">
                        <Reveal intensity="subtle">
                            <Eyebrow className="mb-4">{experienceContent.eyebrow}</Eyebrow>
                        </Reveal>

                        <TextReveal
                          text={[
                            experienceContent.title1,
                            experienceContent.title2,
                          ]}
                            className="font-cormorant text-[48px] font-normal leading-[0.92] tracking-[-0.02em] text-ivory sm:text-[58px] md:text-[66px] lg:text-[74px] xl:text-[82px]"
                        />
                    </div>

                    {/* Desktop arrows */}
                    <Reveal direction="left" intensity="subtle" delay={0.3} className="hidden md:block">
                        <div className="flex items-center gap-3">
                            <CarouselArrow
                                direction="previous"
                                onClick={previousSlide}
                                label="Previous experience"
                                size="lg"
                            />

                            <CarouselArrow
                                direction="next"
                                onClick={nextSlide}
                                label="Next experience"
                                size="lg"
                            />
                        </div>
                    </Reveal>
                </div>
            </Container>

            {/* Carousel */}
            <Reveal amount={0.15} delay={0.15} className="relative z-10 mt-14 sm:mt-16 lg:mt-20">
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onTouchStart={() => setTouching(true)}
                    onTouchEnd={() => setTouching(false)}
                    onFocus={() => setFocused(true)}
                    onBlur={(event) => {
                        // Stay held while focus moves between slides.
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                            setFocused(false);
                        }
                    }}
                    className="
      flex
      snap-x
      snap-mandatory

      gap-8
      sm:gap-10
      lg:gap-14
      xl:gap-16

      overflow-x-auto
      scroll-smooth

      px-[6vw]
      sm:px-[8vw]
      lg:px-[9vw]

      pb-3

      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
    "
                >
                    {experiences.map((experience, index) => {
                        const position = positionOf(index, activeIndex);
                        const isActive = position === "active";

                        return (
                            <div
                                key={experience.number}
                                ref={(element) => {
                                    slideRefs.current[index] = element;
                                }}
                                aria-roledescription="slide"
                                aria-label={`${index + 1} of ${experiences.length}`}
                                // Only the active slide is exposed to assistive tech
                                // (neighbours are dimmed previews; use the controls).
                                aria-hidden={!isActive || undefined}
                                className={cn(
                                    `
            grid

            w-[88vw]
            shrink-0
            snap-center
            grid-cols-1

            gap-5
            sm:w-[84vw]
            sm:gap-6

            md:w-[80vw]

            lg:w-[82vw]
            lg:grid-cols-[40%_60%]
            lg:gap-7

            xl:w-[78vw]
            xl:gap-8

            2xl:max-w-[1280px]

            origin-center

            transition-[transform,opacity]
            duration-700
            ease-brand
          `,
                                    isActive
                                        ? "scale-100 opacity-100"
                                        : "scale-[0.96] opacity-25"
                                )}
                            >
                                {/* =================================================
              TEXT CARD
          ================================================== */}
                                <div
                                    className="
              relative
              flex
              min-h-[450px]
              flex-col
              overflow-hidden

              rounded-[28px]

              border
              border-champagne/15

              bg-charcoal

              p-7

              sm:min-h-[500px]
              sm:rounded-[34px]
              sm:p-9

              lg:min-h-[580px]
              lg:rounded-[40px]
              lg:p-11

              xl:p-12
            "
                                >
                                    {/* Decorative glow */}
                                    <div
                                        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blossom/5 blur-[80px]"/>

                                    {/* Top content */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                  <span className="font-inter text-[10px] font-semibold tracking-[0.24em] text-blossom">
                    {experience.number}
                  </span>

                                                <span className="h-px w-7 bg-champagne/30"/>

                                                <span
                                                    className="font-inter text-[8px] font-medium uppercase tracking-[0.24em] text-ivory/60">
                    Experience
                  </span>
                                            </div>

                                            <span className="font-inter text-[8px] tracking-[0.18em] text-ivory/60">
                  {String(index + 1).padStart(2, "0")}
                                                {" / "}
                                                {String(experiences.length).padStart(
                                                    2,
                                                    "0"
                                                )}
                </span>
                                        </div>

                                        {/* Direction-aware: copy slides in from the side it travels from. */}
                                        <div className={slideContentClass(position, "delay-150")}>
                                            <p className="mt-9 font-inter text-[9px] font-semibold uppercase tracking-[0.3em] text-blossom sm:text-[10px]">
                                                {experience.eyebrow}
                                            </p>

                                            <h3 className="mt-4 max-w-[430px] font-cormorant text-[42px] font-normal leading-[0.94] tracking-[-0.02em] text-ivory sm:text-[48px] lg:text-[52px] xl:text-[58px]">
                                                {experience.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Bottom content */}
                                    <div className={cn("relative z-10 mt-auto pt-14", slideContentClass(position, "delay-300"))}>
                                        <p className="max-w-[470px] font-inter text-[12px] leading-[1.75] text-ivory/55 sm:text-[13px] xl:text-[14px]">
                                            {experience.description}
                                        </p>

                                        <TextLink
                                            href={experience.href}
                                            icon="up-right"
                                            tabIndex={isActive ? undefined : -1}
                                            className="mt-7"
                                        >
                                            View Experience
                                        </TextLink>

                                        {/* Progress */}
                                        <div className="mt-9 h-px w-full overflow-hidden bg-ivory/10">
                                            <div
                                                className={cn(
                                                    "h-full origin-left bg-blossom transition-transform duration-700 ease-brand",
                                                    isActive ? "scale-x-100" : "scale-x-0"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* =================================================
              IMAGE CARD
          ================================================== */}
                                <Link
                                    href={experience.href}
                                    aria-label={`View ${experience.title}`}
                                    tabIndex={isActive ? undefined : -1}
                                    className="
              group
              focus-ring
              relative

              min-h-[350px]

              overflow-hidden

              rounded-[28px]

              border
              border-champagne/10

              bg-charcoal

              sm:min-h-[470px]
              sm:rounded-[34px]

              lg:min-h-[580px]
              lg:rounded-[40px]
            "
                                >
                                    {/* The photograph drifts against the slide's travel, then settles. */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 transition-[translate,scale] duration-[1400ms] ease-brand",
                                            position === "active" && "translate-x-0 scale-100",
                                            position === "before" && "translate-x-[4%] scale-110",
                                            position === "after" && "-translate-x-[4%] scale-110"
                                        )}
                                    >
                                        <Image
                                            src={experience.image}
                                            alt={experience.title}
                                            fill
                                            sizes="
                (max-width: 639px) 88vw,
                (max-width: 1023px) 80vw,
                52vw
              "
                                            className="
                object-cover
                transition-transform
                duration-[1200ms]
                ease-brand

                group-hover:scale-[1.035]
              "
                                        />
                                    </div>

                                    {/* Image gradient */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-midnight/5"/>

                                    {/* Image label */}
                                    <div className={cn("absolute bottom-6 left-6 pr-20 sm:bottom-8 sm:left-8", slideContentClass(position, "delay-500"))}>
                                        <p className="font-inter text-[8px] font-semibold uppercase tracking-[0.28em] text-white/55">
                                            Cherry Blossom Garden
                                        </p>

                                        <p className="mt-1 font-cormorant text-[24px] leading-tight text-white sm:text-[28px]">
                                            {experience.eyebrow}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div
                                        className="
                absolute
                bottom-6
                right-6

                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-full

                border
                border-white/20

                bg-midnight/30

                text-white

                backdrop-blur-md

                transition-all
                duration-300

                group-hover:border-blossom
                group-hover:bg-blossom
                group-hover:text-midnight

                sm:bottom-8
                sm:right-8
                sm:h-14
                sm:w-14
              "
                                    >
                                        <ArrowUpRight
                                            size={19}
                                            strokeWidth={1.4}
                                            className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                                        />
                                    </div>
                                </Link>
                            </div>
                        );
                    })}

                    <div className="w-[5vw] shrink-0"/>
                </div>
            </Reveal>

            {/* Bottom controls */}
            <Container
                size="wide"
                className="relative z-10 mt-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    {experiences.map((experience, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <button
                                key={experience.number}
                                type="button"
                                onClick={() => scrollToSlide(index)}
                                aria-label={`View ${experience.title}`}
                                aria-current={isActive ? "true" : undefined}
                                // 24px-tall hit area around a 2px line.
                                className="focus-ring group/dot flex h-6 items-center rounded-full"
                            >
                                <span
                                    className={cn(
                                        "relative block h-[2px] overflow-hidden rounded-full transition-[width,background-color] duration-500",
                                        isActive
                                            ? "w-10 bg-ivory/15"
                                            : "w-5 bg-ivory/15 group-hover/dot:bg-ivory/35"
                                    )}
                                >
                                {isActive ? (
                                    <span
                                        // Restart the countdown whenever the slide changes.
                                        key={activeIndex}
                                        aria-hidden="true"
                                        onAnimationEnd={nextSlide}
                                        className="absolute inset-0 origin-left bg-blossom"
                                        style={
                                            autoplay
                                                ? {
                                                    animation: `cbgProgress ${AUTO_PLAY_DELAY}ms linear forwards`,
                                                    animationPlayState: held ? "paused" : "running",
                                                }
                                                : undefined
                                        }
                                    />
                                ) : null}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-5">
                    <p className="hidden font-inter text-[8px] uppercase tracking-[0.25em] text-ivory/60 sm:block">
                        Drag to explore
                    </p>

                    {!reducedMotion ? (
                        <button
                            type="button"
                            onClick={() => setStopped((value) => !value)}
                            aria-pressed={stopped}
                            className="focus-ring min-h-6 font-inter text-[8px] uppercase tracking-[0.25em] text-ivory/60 transition-colors duration-300 hover:text-blossom"
                        >
                            {stopped ? "Play" : "Pause"}
                        </button>
                    ) : null}

                    {/* Mobile arrows */}
                    <div className="flex gap-2 md:hidden">
                        <CarouselArrow
                            direction="previous"
                            onClick={previousSlide}
                            label="Previous experience"
                        />

                        <CarouselArrow
                            direction="next"
                            onClick={nextSlide}
                            label="Next experience"
                            solid
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}

/** Copy eases in from the side the slide travels from; neighbours stay dimmed. */
function slideContentClass(position: SlidePosition, delay: string) {
    return cn(
        "transition-[transform,opacity] duration-700 ease-brand",
        position === "active" && `translate-x-0 opacity-100 ${delay}`,
        position === "before" && "-translate-x-6 opacity-40",
        position === "after" && "translate-x-6 opacity-40"
    );
}
