"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { m, type Variants } from "motion/react";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import ParallaxMedia from "@/components/frontend/motion/parallaxMedia";
import Reveal from "@/components/frontend/motion/reveal";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import TextReveal from "@/components/frontend/motion/textReveal";
import { buttonClass } from "@/components/frontend/ui/button";
import CarouselArrow from "@/components/frontend/ui/carouselArrow";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { stagger, viewport } from "@/lib/frontend/motion/tokens";
import { revealTransition } from "@/lib/frontend/motion/variants";

/* Cards enter from the side the menu is paging towards (custom = 1 | -1). */
const cardVariants: Variants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction * 32 }),
    visible: { opacity: 1, x: 0 },
};

const dishes = [
    {
        title: "Sakura Roll",
        price: "£16",
        image: "/assets/first-floor.png",
        description:
            "A signature roll with fresh seafood, avocado and a touch of yuzu, inspired by cherry blossoms.",
    },
    {
        title: "Miso Glazed Salmon",
        price: "£24",
        image: "/assets/first-floor.png",
        description:
            "Perfectly grilled salmon with miso glaze, seasonal vegetables and our house special sauce.",
    },
    {
        title: "Matcha Blossom",
        price: "£9",
        image: "/assets/first-floor.png",
        description:
            "A delicate matcha dessert with seasonal fruits, inspired by the elegance of cherry blossom.",
    },
    {
        title: "Sakura King Prawns",
        price: "£28",
        image: "/assets/first-floor.png",
        description:
            "Juicy king prawns finished with seasonal herbs, delicate blossom notes and our signature sauce.",
    },
];

export default function TasteOfGarden() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    // Cards wait for the grid to enter view, then animate on every page turn.
    const [cardsEntered, setCardsEntered] = useState(false);
    const reduced = usePrefersReducedMotion();

    const visibleDishes = [
        dishes[activeIndex % dishes.length],
        dishes[(activeIndex + 1) % dishes.length],
        dishes[(activeIndex + 2) % dishes.length],
    ];

    const next = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % dishes.length);
    };

    const previous = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + dishes.length) % dishes.length);
    };

    return (
        <section
            id="taste-of-garden"
            className="relative scroll-mt-6 overflow-hidden"
        >
            {/* subtle top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />

            {/* =====================================================
          HERO
      ====================================================== */}
            <div className="mx-auto mt-16 grid min-h-[700px] max-w-[1600px] lg:grid-cols-[0.42fr_0.58fr]">
                {/* LEFT COPY */}
                <div className="relative z-10 flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
                    <StaggerReveal className="max-w-[520px]" interval={0.12}>
                        <StaggerItem className="mb-7 flex items-center gap-5" direction="none">
                            <Eyebrow as="span">Signature Cuisine</Eyebrow>

                            <div className="hidden h-px w-20 bg-champagne/50 sm:block" />
                        </StaggerItem>

                        <TextReveal
                            text={["A Taste of", "the Garden"]}
                            className="max-w-[500px] font-cormorant text-[3.5rem] font-normal leading-[0.9] tracking-[-0.04em] text-ivory sm:text-[4.5rem] lg:text-[5.2rem]"
                        />

                        <StaggerItem as="p" intensity="subtle" className="mt-8 max-w-[430px] text-sm leading-7 text-ivory/65 sm:text-[15px]">
                            More than a meal, it&apos;s a culinary journey inspired by the
                            beauty of the season. Fresh ingredients, bold flavours and a
                            dining experience like no other.
                        </StaggerItem>

                        <StaggerItem intensity="subtle">
                            <Link
                                href="/menu"
                                className={buttonClass("secondary", "mt-8")}
                            >
                                Explore Our Menu

                                <ArrowRight
                                    aria-hidden="true"
                                    size={15}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        </StaggerItem>
                    </StaggerReveal>
                </div>

                {/* HERO FOOD IMAGE */}
                <div className="relative min-h-[500px] lg:min-h-full">
                    <ImageReveal fill direction="left">
                        <ParallaxMedia fill strength={0.08}>
                            <Image
                                src="/assets/elevated-dining.png"
                                alt="Cherry Blossom Garden signature dish"
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover"
                            />
                        </ParallaxMedia>
                    </ImageReveal>

                    {/* transition to dark background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/15 to-transparent lg:from-midnight/95" />

                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/75 via-transparent to-black/10" />

                    {/* small label */}
                    <div className="cbg-drift absolute right-6 top-8 hidden h-28 w-28 items-center justify-center rounded-full border border-champagne/50 text-center md:flex xl:right-12 xl:top-12">
            <span className="text-[9px] font-medium uppercase leading-5 tracking-[0.27em] text-champagne">
              Seasonal
              <br />
              Ingredients
            </span>
                    </div>
                </div>
            </div>

            {/* =====================================================
          MENU CAROUSEL
      ====================================================== */}
            <div className="relative mx-auto mt-8 max-w-[1600px] px-6 pb-24 sm:px-10 lg:px-16 xl:px-24">
                <div className="relative">
                    {/* LEFT BUTTON */}
                    <div className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                        <CarouselArrow
                            direction="previous"
                            onClick={previous}
                            label="Previous dish"
                            accent="champagne"
                            className="backdrop-blur"
                        />
                    </div>

                    {/* Staggers in on first view; re-keyed cards slide in on each page. */}
                    <m.div
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                        viewport={{ once: true, amount: 0.2, margin: viewport.margin }}
                        onViewportEnter={() => setCardsEntered(true)}
                    >
                        {visibleDishes.map((dish, index) => (
                            <m.article
                                key={`${dish.title}-${activeIndex}-${index}`}
                                data-reveal=""
                                custom={direction}
                                variants={cardVariants}
                                initial="hidden"
                                animate={cardsEntered ? "visible" : "hidden"}
                                transition={revealTransition(reduced, {
                                    duration: 0.7,
                                    delay: reduced ? 0 : index * stagger.relaxed,
                                })}
                                className={`group relative overflow-hidden bg-charcoal ${
                                    index === 2 ? "hidden lg:block" : ""
                                }`}
                            >
                                {/* image */}
                                <div className="relative aspect-[1.32/1] overflow-hidden">
                                    <Image
                                        src={dish.image}
                                        alt={dish.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                                </div>

                                {/* content */}
                                <div className="relative min-h-[205px] px-6 pb-7 pt-6 sm:px-7">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-cormorant text-[1.8rem] leading-none text-ivory transition-colors duration-500 group-hover:text-champagne">
                                            {dish.title}
                                        </h3>

                                        <div className="h-px flex-1 origin-left bg-walnut transition-[background-color,scale] duration-500 group-hover:scale-x-95 group-hover:bg-champagne/60" />

                                        <span className="font-cormorant text-xl text-ivory">
                      {dish.price}
                    </span>
                                    </div>

                                    <p className="mt-5 max-w-[360px] text-[13px] leading-6 text-ivory/60">
                                        {dish.description}
                                    </p>

                                    {/* Revealed on hover, and on keyboard focus. */}
                                    <Link
                                        href="/menu"
                                        className="focus-ring mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-champagne opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
                                    >
                                        View dish
                                        <ArrowRight aria-hidden="true" size={13} />
                                    </Link>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-champagne transition-transform duration-500 group-hover:scale-x-100" />
                            </m.article>
                        ))}
                    </m.div>

                    {/* RIGHT BUTTON */}
                    <div className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 lg:block">
                        <CarouselArrow
                            direction="next"
                            onClick={next}
                            label="Next dish"
                            accent="champagne"
                            className="backdrop-blur"
                        />
                    </div>
                </div>

                {/* MOBILE CONTROLS */}
                <div className="mt-7 flex justify-center gap-3 lg:hidden">
                    <CarouselArrow
                        direction="previous"
                        onClick={previous}
                        label="Previous dish"
                        accent="champagne"
                    />

                    <CarouselArrow
                        direction="next"
                        onClick={next}
                        label="Next dish"
                        accent="champagne"
                    />
                </div>
            </div>

            {/* =====================================================
          BOTTOM EDITORIAL STRIP
      ====================================================== */}
            <div className="border-t border-walnut/60">
                <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.46fr_0.54fr]">
                    <ImageReveal direction="right" className="min-h-[330px]">
                        <Image
                            src="/assets/story-main.png"
                            alt="Cherry Blossom Garden dining detail"
                            fill
                            sizes="(max-width: 1024px) 100vw, 46vw"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-charcoal/75" />
                    </ImageReveal>

                    <div className="flex items-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
                        <Reveal className="grid w-full gap-10 sm:grid-cols-[1fr_0.75fr] sm:items-end">
                            <div>
                                <Eyebrow className="mb-4">Fresh Ingredients</Eyebrow>

                                <h3 className="max-w-[380px] font-cormorant text-4xl leading-[0.95] text-ivory sm:text-5xl">
                                    Flavours for
                                    <br />
                                    Every Season
                                </h3>
                            </div>

                            <div className="border-l border-walnut pl-6">
                                <p className="text-sm leading-6 text-ivory/65">
                                    Our dishes bring together locally sourced ingredients,
                                    traditional techniques and contemporary twists — creating
                                    unforgettable tastes in a truly unique setting.
                                </p>

                                <TextLink href="/about" className="mt-5">
                                    Our Story
                                </TextLink>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
