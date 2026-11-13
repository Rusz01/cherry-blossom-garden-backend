"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { m } from "motion/react";

import { useExploreNavigation } from
    "@/components/frontend/explore/ExploreNavigationProvider";

import { useHomeContent } from "./HomeContentProvider";
import {
  DEFAULT_HOMEPAGE,
  imageSrc,
} from "@/lib/homepage/defaults";

import Reveal from "@/components/frontend/motion/reveal";
import TextReveal from "@/components/frontend/motion/textReveal";
import Container from "@/components/frontend/ui/container";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { duration, ease, spring } from "@/lib/frontend/motion/tokens";
import {
    revealTransition,
    revealVariants,
    staggerVariants,
} from "@/lib/frontend/motion/variants";


export default function ThreeLevels() {

  const { levels: levelContent } = useHomeContent();


  const floorNavigation = useExploreNavigation();

  const levels = levelContent.items.map(
    (level, index) => {
      const floor = floorNavigation[index];

      return {
        ...level,

        id: index + 1,

        eyebrow:
          floor?.homeEyebrow ?? level.eyebrow,

        title:
          floor?.homeTitle ?? level.title,

        shortTitle:
          floor?.homeShortTitle ?? level.shortTitle,

        description:
          floor?.homeDescription ?? level.description,

        href:
          floor?.href ?? level.href,

        image: imageSrc(
          level.image,
          DEFAULT_HOMEPAGE.levels.items[index]
            ?.image ?? "/assets/hero.png",
        ),
      };
    },
  );


  const router = useRouter();
    const reduced = usePrefersReducedMotion();

    // Start with first level expanded
    const [activeLevel, setActiveLevel] = useState(0);
    const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

    const handleCardClick = (index: number) => {
        if (activeLevel === index) {
            router.push(levels[index].href);
            return;
        }

        setActiveLevel(index);
    };

    const expandTransition = reduced ? { duration: 0 } : spring.gentle;

    const fade = (visible: boolean) => ({
        duration: reduced ? duration.reduced : 0.45,
        delay: visible && !reduced ? 0.25 : 0,
        ease: ease.out,
    });

    const panelVariants = staggerVariants(reduced, { interval: 0.07, delay: 0.18 });
    const itemVariants = revealVariants("up", "base");
    const itemTransition = revealTransition(reduced, { duration: duration.base });

    return (
        <section
            id="three-levels"
            className="relative scroll-mt-6 overflow-hidden bg-midnight py-24 sm:py-28 lg:py-32 border-y border-champagne/50"
        >
            <Container>

                {/* =========================
            SECTION HEADER
        ========================== */}
                <div className="mx-auto mb-14 max-w-4xl text-center lg:mb-20">
                    <Reveal intensity="subtle">
                        <Eyebrow className="mb-4">{levelContent.eyebrow}</Eyebrow>
                    </Reveal>

                    <TextReveal
                      text={levelContent.title}
                      className="font-cormorant text-4xl font-normal leading-none text-ivory sm:text-5xl lg:text-[62px]"
                    />

                    <Reveal intensity="subtle" delay={0.2}>
                        <p className="mx-auto mt-6 max-w-3xl font-inter text-sm leading-7 text-ivory/60 sm:text-[15px]">
                          {levelContent.description}
                        </p>
                    </Reveal>
                </div>

                <Reveal amount={0.15} delay={0.1}>

                    {/* =========================
                DESKTOP ACCORDION
            ========================== */}
                    <div className="hidden h-[620px] gap-5 lg:flex xl:h-[680px]">
                        {levels.map((level, index) => {
                            const active = activeLevel === index;
                            const hovered = hoveredLevel === index;
                            const panelId = `level-panel-desktop-${level.id}`;

                            return (
                                <m.article
                                    key={level.id}
                                    onClick={() => handleCardClick(index)}
                                    onPointerEnter={() => setHoveredLevel(index)}
                                    onPointerLeave={() => setHoveredLevel(null)}
                                    className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-champagne/30"
                                    style={{ flexBasis: "0%", flexShrink: 1 }}
                                    initial={false}
                                    animate={{
                                        flexGrow: active ? 5.5 : hovered ? 1.45 : 1.25,
                                    }}
                                    transition={expandTransition}
                                >
                                    {/* IMAGE */}
                                    <Image
                                        src={level.image}
                                        alt={level.title}
                                        fill
                                        sizes={active ? "70vw" : "18vw"}
                                        className={cn(
                                            "object-cover transition-[transform,filter] duration-[1200ms] ease-brand",
                                            active
                                                ? "scale-100 saturate-100"
                                                : "scale-105 saturate-[0.8] group-hover:scale-100 group-hover:saturate-100"
                                        )}
                                    />

                                    {/* Global dark overlay */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 transition-colors duration-700",
                                            active
                                                ? "bg-gradient-to-t from-black/90 via-black/25 to-black/10"
                                                : "bg-black/35 group-hover:bg-black/20"
                                        )}
                                    />

                                    {/* Pink subtle overlay on hover */}
                                    {!active && (
                                        <div className="absolute inset-0 bg-blossom/0 transition-colors duration-500 group-hover:bg-blossom/5" />
                                    )}

                                    {/* ==================================
                        COLLAPSED CONTENT — opens the level
                    =================================== */}
                                    <m.div
                                        className={cn(
                                            "absolute inset-0",
                                            active && "pointer-events-none"
                                        )}
                                        initial={false}
                                        animate={{ opacity: active ? 0 : 1 }}
                                        transition={fade(!active)}
                                    >
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setActiveLevel(index);
                                            }}
                                            tabIndex={active ? -1 : undefined}
                                            aria-hidden={active || undefined}
                                            aria-expanded={false}
                                            aria-controls={panelId}
                                            aria-label={`View ${level.title}`}
                                            className="focus-ring flex h-full w-full flex-col items-center justify-between rounded-[28px] py-10"
                                        >
                        <span className="font-inter text-[9px] uppercase tracking-[0.3em] text-ivory/60">
                          0{level.id}
                        </span>

                                            <span
                                                className="
                            whitespace-nowrap
                            font-cormorant
                            text-[32px]
                            font-normal
                            text-ivory
                            [writing-mode:vertical-rl]
                            rotate-180
                          "
                                            >
                                                {level.shortTitle}
                                            </span>

                                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-ivory/70 transition-all duration-300 group-hover:rotate-90 group-hover:border-blossom group-hover:text-blossom">
                          +
                        </span>
                                        </button>
                                    </m.div>

                                    {/* ==================================
                        EXPANDED CONTENT
                    =================================== */}
                                    <m.div
                                        id={panelId}
                                        aria-hidden={!active}
                                        className={cn(
                                            "absolute inset-x-0 bottom-0 p-8 md:p-10 xl:p-12",
                                            !active && "pointer-events-none"
                                        )}
                                        initial={false}
                                        animate={active ? "visible" : "hidden"}
                                        variants={panelVariants}
                                    >
                                        <div className="max-w-xl">
                                            <m.div variants={itemVariants} transition={itemTransition}>
                                                <Eyebrow className="mb-3">{level.eyebrow}</Eyebrow>
                                            </m.div>

                                            <m.h3
                                                variants={itemVariants}
                                                transition={itemTransition}
                                                className="font-cormorant text-[42px] font-normal leading-none text-ivory xl:text-[52px]"
                                            >
                                                {level.title}
                                            </m.h3>

                                            <m.p
                                                variants={itemVariants}
                                                transition={itemTransition}
                                                className="mt-5 max-w-lg font-inter text-[13px] leading-7 text-ivory/70 xl:text-sm"
                                            >
                                                {level.description}
                                            </m.p>

                                            <m.div variants={itemVariants} transition={itemTransition}>
                                                <TextLink
                                                    href={level.href}
                                                    onClick={(event) => event.stopPropagation()}
                                                    tabIndex={active ? undefined : -1}
                                                    className="mt-7"
                                                >
                                                    Explore Level
                                                </TextLink>
                                            </m.div>
                                        </div>

                                        {/* Helpful interaction hint */}
                                        <m.p
                                            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                                            transition={itemTransition}
                                            className="absolute bottom-10 right-10 hidden font-inter text-[9px] uppercase tracking-[0.18em] text-ivory/35 xl:block"
                                        >
                                            Click again to explore
                                        </m.p>
                                    </m.div>

                                    {/* Small level marker */}
                                    <div
                                        className={cn(
                                            "absolute right-8 top-8 font-inter text-[10px] uppercase tracking-[0.25em] text-ivory/50 transition-opacity duration-500",
                                            active ? "opacity-100" : "opacity-0"
                                        )}
                                    >
                                        0{level.id} / 03
                                    </div>
                                </m.article>
                            );
                        })}
                    </div>

                    {/* =========================
                MOBILE / TABLET
            ========================== */}
                    <div className="flex flex-col gap-4 lg:hidden">
                        {levels.map((level, index) => {
                            const active = activeLevel === index;
                            const panelId = `level-panel-mobile-${level.id}`;

                            return (
                                <article
                                    key={level.id}
                                    onClick={() => handleCardClick(index)}
                                    className={cn(
                                        "relative cursor-pointer overflow-hidden rounded-[22px] border border-champagne/30 transition-[height] duration-700 ease-brand",
                                        active
                                            ? "h-[520px] sm:h-[580px]"
                                            : "h-[130px] sm:h-[150px]"
                                    )}
                                >
                                    <Image
                                        src={level.image}
                                        alt={level.title}
                                        fill
                                        sizes="100vw"
                                        className={cn(
                                            "object-cover transition-[transform,filter] duration-700",
                                            active ? "scale-100 saturate-100" : "scale-105 saturate-[0.8]"
                                        )}
                                    />

                                    <div
                                        className={cn(
                                            "absolute inset-0 transition-colors duration-700",
                                            active
                                                ? "bg-gradient-to-t from-black/95 via-black/25 to-black/10"
                                                : "bg-black/45"
                                        )}
                                    />

                                    {/* Collapsed — opens the level */}
                                    {!active && (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setActiveLevel(index);
                                            }}
                                            aria-expanded={false}
                                            aria-controls={panelId}
                                            className="focus-ring absolute inset-0 flex items-center justify-between rounded-[22px] px-6 text-left sm:px-8"
                                        >
                                            <span className="flex items-center gap-5">
                        <span className="font-inter text-[9px] uppercase tracking-[0.25em] text-blossom">
                          0{level.id}
                        </span>

                                                <span className="font-cormorant text-2xl text-ivory sm:text-3xl">
                                                    {level.title}
                                                </span>
                                            </span>

                                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-ivory">
                                                +
                                            </span>
                                        </button>
                                    )}

                                    {/* Expanded */}
                                    <m.div
                                        id={panelId}
                                        aria-hidden={!active}
                                        className={cn(
                                            "absolute inset-x-0 bottom-0 p-6 sm:p-8",
                                            !active && "pointer-events-none"
                                        )}
                                        initial={false}
                                        animate={active ? "visible" : "hidden"}
                                        variants={panelVariants}
                                    >
                                        <m.div variants={itemVariants} transition={itemTransition}>
                                            <Eyebrow className="mb-3">{level.eyebrow}</Eyebrow>
                                        </m.div>

                                        <m.h3
                                            variants={itemVariants}
                                            transition={itemTransition}
                                            className="max-w-md font-cormorant text-4xl leading-none text-ivory sm:text-5xl"
                                        >
                                            {level.title}
                                        </m.h3>

                                        <m.p
                                            variants={itemVariants}
                                            transition={itemTransition}
                                            className="mt-5 max-w-xl font-inter text-[13px] leading-6 text-ivory/70"
                                        >
                                            {level.description}
                                        </m.p>

                                        <m.div
                                            variants={itemVariants}
                                            transition={itemTransition}
                                            className="mt-7 flex items-center justify-between"
                                        >
                                            <TextLink
                                                href={level.href}
                                                onClick={(event) => event.stopPropagation()}
                                                tabIndex={active ? undefined : -1}
                                            >
                                                Explore Level
                                            </TextLink>

                                            <span className="font-inter text-[8px] uppercase tracking-[0.15em] text-ivory/35">
                        Tap again to explore
                      </span>
                                        </m.div>
                                    </m.div>
                                </article>
                            );
                        })}
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
