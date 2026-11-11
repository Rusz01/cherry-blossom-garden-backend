
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Blocks,
    Coffee,
    Flower2,
    Heart,
    PartyPopper,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";

import Navbar from "@/components/frontend/navbar";
import DrawLine from "@/components/frontend/motion/drawLine";
import ImageReveal from "@/components/frontend/motion/imageReveal";
import ParallaxMedia from "@/components/frontend/motion/parallaxMedia";
import Reveal from "@/components/frontend/motion/reveal";
import RiseText from "@/components/frontend/motion/riseText";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import Petal from "@/components/frontend/ui/petal";

export const metadata: Metadata = {
    title: "Kids Play Area | Cherry Blossom Garden",
    description:
        "Discover a beautiful family-friendly kids play area at Cherry Blossom Garden. A welcoming space for little adventures, family dining and children's celebrations.",
};

const benefits = [
    {
        title: "Thoughtful Design",
        description:
            "A comfortable, welcoming environment designed with little explorers in mind.",
        icon: ShieldCheck,
    },
    {
        title: "Creative Play",
        description:
            "An imaginative space for discovery, play and wonderful little adventures.",
        icon: Blocks,
    },
    {
        title: "Family Moments",
        description:
            "A place for families to spend meaningful time together.",
        icon: UsersRound,
    },
    {
        title: "Relax & Enjoy",
        description:
            "Enjoy food and drinks while the little ones have fun.",
        icon: Coffee,
    },
];

const playFeatures = [
    {
        icon: Sparkles,
        title: "Play Structures",
        description: "Little adventures",
    },
    {
        icon: Blocks,
        title: "Creative Corners",
        description: "Big imaginations",
    },
    {
        icon: Heart,
        title: "Family Time",
        description: "Lovely memories",
    },
];

export default function KidsPlayAreaPage() {
    return (
        <div data-theme="light" className="min-h-screen bg-[#fbf9f6] font-inter">

            {/* =============================================
          EXISTING CHERRY BLOSSOM NAVBAR
          ============================================= */}
            <div
                className="

  "
            >
                <Navbar light />
            </div>
            <main className="overflow-x-clip text-[#302c28]">

                {/* =============================================
            01 — HERO
            ============================================= */}
                <section
                    id="top"
                    className="
            relative grid overflow-hidden
            bg-[#fbf9f6]
            lg:min-h-[690px]
            lg:grid-cols-[47%_53%]
            xl:min-h-[750px]
          "
                >
                    {/* LEFT CONTENT */}
                    <div
                        className="
              relative z-10 flex items-center
              px-6 pb-16 pt-20
              sm:px-10 sm:pt-24
              lg:py-24 lg:pl-[max(48px,calc((100vw-1440px)/2+72px))]
              lg:pr-4
            "
                    >
                        <div className="w-full max-w-[590px]">

                            {/* Eyebrow */}
                            <div className="cbg-enter cbg-delay-1 mb-10 flex items-center gap-3">
                                <Flower2
                                    size={20}
                                    strokeWidth={1.25}
                                    className="cbg-sway text-blossom"
                                />
                                <span
                                    className="
                    text-[10px] font-semibold
                    uppercase tracking-[0.3em]
                    text-[#bd7379]
                    sm:text-[11px]
                  "
                                >
                  A little world of wonder
                </span>
                            </div>

                            {/* Heading */}
                            <h1
                                className="
                  font-cormorant
                  text-[clamp(76px,8vw,132px)]
                  font-normal
                  leading-[0.8]
                  tracking-[-0.06em]
                  text-[#263120]
                "
                            >
                <span className="block whitespace-nowrap">
                  <RiseText text="Kids" delay={0.25} />{" "}
                    <span className="font-allura text-blossom block mt-5">
                    <RiseText text="Play Area." delay={0.42} />
                  </span>
                </span>


                            </h1>

                            {/* Description */}
                            <p
                                style={{ animationDelay: "0.65s" }}
                                className="
                  cbg-enter
                  mt-10 max-w-[420px]
                  text-[14px] leading-[1.95]
                  text-[#67645f]
                  sm:text-[15px]
                  lg:mt-12
                "
                            >
                                A joyful little world where imagination
                                blossoms, adventures begin, and beautiful
                                memories are made.
                            </p>

                            <p
                                style={{ animationDelay: "0.75s" }}
                                className="
                  cbg-enter
                  mt-4 max-w-[420px]
                  text-[14px] leading-[1.95]
                  text-[#67645f]
                  sm:text-[15px]
                "
                            >
                                Let the little ones explore while you
                                relax, dine, and enjoy every moment at
                                Cherry Blossom Garden.
                            </p>

                            {/* CTA */}
                            <div className="cbg-enter mt-10 flex flex-wrap items-center gap-5" style={{ animationDelay: "0.9s" }}>
                                <Link
                                    href="#kids-party"
                                    className="
                    cbg-sheen relative overflow-hidden
                    active:scale-[0.98]
                    group inline-flex min-h-[54px]
                    items-center justify-center gap-5
                    rounded-full bg-[#c57178]
                    px-8 py-4
                    text-[12px] font-medium
                    text-white
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#ab5963]
                    hover:shadow-[0_15px_35px_rgba(197,113,120,0.18)]
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[#c57178]
                  "
                                >
                                    Reserve for Kids Party
                                    <ArrowUpRight
                                        size={16}
                                        strokeWidth={1.5}
                                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                    />
                                </Link>
                            </div>

                            {/* Bottom scroll */}
                            <Link
                                href="#discover"
                                style={{ animationDelay: "1.1s" }}
                                className="
                  cbg-enter-fade
                  group
                  mt-16 inline-flex items-center gap-4
                  text-[10px] font-semibold
                  uppercase tracking-[0.2em]
                  text-[#817770]
                  transition-colors hover:text-[#c57178]
                "
                            >
                <span
                    className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full border border-[#ded3c8]
                    transition-colors duration-300
                    group-hover:border-[#c57178]
                  "
                >
                  {/* Slow, small bob — an invitation, not an alarm. */}
                  <ArrowDown size={15} strokeWidth={1.4} className="cbg-drift" />
                </span>
                                Explore the space
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div
                        className="
              relative min-h-[390px]
              overflow-hidden
              sm:min-h-[500px]
              lg:min-h-full
            "
                    >
                        {/* Gentle depth: the photograph drifts slower than the page.
                            It settles from a slight zoom while a cream curtain lifts. */}
                        <ParallaxMedia fill strength={0.06}>
                            <Image
                                src="/assets/kids-play-area.png"
                                alt="Cherry Blossom Garden children's play area"
                                fill
                                priority
                                sizes="(max-width: 1023px) 100vw, 53vw"
                                className="
                  cbg-hero-bg
                  object-cover object-center
                  transition-transform duration-[1500ms]
                  hover:scale-[1.035]
                "
                            />
                        </ParallaxMedia>

                        <div
                            aria-hidden="true"
                            className="cbg-curtain absolute -inset-px z-[1] bg-[#fbf9f6]"
                            style={{ transformOrigin: "right", animationDelay: "0.15s" }}
                        />

                        {/* Gentle blend on desktop */}
                        <div
                            className="
                pointer-events-none absolute inset-y-0 left-0
                hidden w-[30%]
                bg-gradient-to-r
                from-[#fbf9f6] via-[#fbf9f6]/60 to-transparent
                lg:block
              "
                        />

                        {/* Soft lower fade */}
                        <div
                            className="
                pointer-events-none absolute inset-x-0 bottom-0
                h-24 bg-gradient-to-t
                from-[#fbf9f6]/30 to-transparent
              "
                        />

                        {/* Photo caption */}
                        <div
                            style={{ animationDelay: "1.2s" }}
                            className="
                cbg-enter
                absolute bottom-7 right-6 z-[2]
                border border-white/40
                bg-white/80 px-5 py-3
                backdrop-blur-md
                sm:bottom-10 sm:right-10
              "
                        >
                            <p
                                className="
                  text-[9px] uppercase tracking-[0.22em]
                  text-[#665b50]
                "
                            >
                                Little adventures
                            </p>
                            <p
                                className="
                  mt-1 font-cormorant text-[23px]
                  italic text-[#263120]
                "
                            >
                                Beautiful memories.
                            </p>
                        </div>
                    </div>

                    {/* Floating blossoms (desktop only, slow drift, out of step) */}
                    <Petal className="left-[41%] top-[16%] rotate-[28deg]" size="md" />
                    <Petal className="left-[45%] top-[62%] -rotate-[54deg]" size="sm" delay={-3.1} />
                    <Petal className="left-[6%] bottom-[9%] rotate-[96deg]" size="lg" delay={-5.4} />
                </section>

                {/* =============================================
            02 — BENEFITS STRIP
            ============================================= */}
                <section
                    aria-label="Family experience highlights"
                    className="
            border-y border-[#e9e1d9]
            bg-[#fffdfb]
          "
                >
                    <StaggerReveal
                        className="
              mx-auto grid max-w-[1440px]
              grid-cols-2
              px-5 py-10
              sm:px-8 sm:py-14
              lg:grid-cols-4 lg:px-12 lg:py-16
            "
                        interval={0.1}
                    >
                        {benefits.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <StaggerItem
                                    key={item.title}
                                    intensity="subtle"
                                    className={`
                    group
                    relative flex flex-col items-center
                    px-4 py-7 text-center
                    sm:px-7
                    lg:px-10 lg:py-2
                    ${
                                        index < 2
                                            ? "border-b border-[#eee7e0] lg:border-b-0"
                                            : ""
                                    }
                    ${
                                        index % 2 === 0
                                            ? "border-r border-[#eee7e0]"
                                            : ""
                                    }
                    ${
                                        index === 1
                                            ? "lg:border-r"
                                            : ""
                                    }
                  `}
                                >
                                    <Icon
                                        size={30}
                                        strokeWidth={1.25}
                                        className="text-[#c57178] transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-6"
                                    />

                                    <h2
                                        className="
                      mt-6 font-cormorant
                      text-[25px] font-medium
                      text-[#302c28]
                      sm:text-[27px]
                    "
                                    >
                                        {item.title}
                                    </h2>

                                    <p
                                        className="
                      mt-2 max-w-[245px]
                      text-[12px] leading-[1.85]
                      text-[#77716b]
                      sm:text-[13px]
                    "
                                    >
                                        {item.description}
                                    </p>
                                </StaggerItem>
                            );
                        })}
                    </StaggerReveal>
                </section>

                {/* =============================================
            03 — DISCOVER THE PLAY AREA
            ============================================= */}
                <section
                    id="discover"
                    className="
            scroll-mt-20
            bg-[#fbf9f6]
            py-24
            sm:py-32
            lg:py-36
          "
                >
                    <div
                        className="
              mx-auto grid max-w-[1560px]
              items-center gap-14
              lg:grid-cols-2 lg:gap-20
              xl:gap-28
            "
                    >
                        {/* IMAGE */}
                        <div className="relative px-5 sm:px-10 lg:pl-0 lg:pr-0">
                            <div
                                className="
                  relative aspect-[5/5]
                  overflow-hidden
                  rounded-tr-[100px]
                  sm:aspect-[6/5]
                  sm:rounded-tr-[180px]
                  lg:aspect-[5/5]
                  xl:aspect-[6/5]
                "
                            >
                                {/* Opens upwards inside the existing shape, then drifts with scroll. */}
                                <ImageReveal fill>
                                    <ParallaxMedia fill strength={0.07}>
                                        <Image
                                            src="/assets/kids-play-area.png"
                                            alt="Play structures and activities at Cherry Blossom Garden"
                                            fill
                                            sizes="(max-width: 1023px) 100vw, 50vw"
                                            className="
                        object-cover object-left
                        transition-transform duration-1000
                        hover:scale-105
                      "
                                        />
                                    </ParallaxMedia>
                                </ImageReveal>
                            </div>

                            <Reveal
                                delay={0.6}
                                intensity="subtle"
                                className="
                  absolute -bottom-6 right-0
                  hidden rotate-[-8deg]
                  bg-[#f4e9df]
                  px-7 py-5
                  shadow-[0_15px_35px_rgba(54,40,30,0.05)]
                  sm:block
                "
                            >
                                <p
                                    className="
                    font-allura text-[27px]
                    leading-none text-[#a85d64]
                  "
                                >
                                    For little explorers
                                </p>
                            </Reveal>
                        </div>

                        {/* CONTENT */}
                        <StaggerReveal
                            className="
                px-6
                sm:px-10
                lg:pl-0 lg:pr-14
                xl:pr-20
              "
                            interval={0.11}
                        >
                            <StaggerItem intensity="subtle">
                            <SectionLabel number="01">
                                Play · Discover · Grow
                            </SectionLabel>
                            </StaggerItem>

                            <StaggerItem>
                            <h2
                                className="
                  mt-7 max-w-[580px]
                  font-cormorant
                  text-[clamp(54px,5.5vw,90px)]
                  font-normal leading-[0.93]
                  tracking-[-0.045em]
                  text-[#263120]
                "
                            >
                                A World of
                                <br />
                                <span className="text-blossom ">
                  Imagination.
                </span>
                            </h2>
                            </StaggerItem>

                            <DrawLine className="mt-10 h-px w-20 bg-[#c9a473]" delay={0.3} />

                            <StaggerItem
                                as="p"
                                intensity="subtle"
                                className="
                  mt-9 max-w-[520px]
                  text-[14px] leading-[2]
                  text-[#69635d]
                  sm:text-[15px]
                "
                            >
                                Childhood is made of tiny discoveries,
                                endless curiosity and moments of pure joy.
                                Our play area brings those special moments
                                together in a beautiful, welcoming environment.
                            </StaggerItem>

                            <StaggerItem
                                as="p"
                                intensity="subtle"
                                className="
                  mt-5 max-w-[520px]
                  text-[14px] leading-[2]
                  text-[#69635d]
                  sm:text-[15px]
                "
                            >
                                From playful adventures to moments of
                                imagination, little guests have a space
                                of their own while the grown-ups enjoy
                                the Cherry Blossom Garden experience.
                            </StaggerItem>

                            {/* MINI FEATURES — follow the copy in, one by one */}
                            <StaggerItem
                                intensity="subtle"
                                stagger={{ interval: 0.1, delay: 0.15 }}
                                className="
                  mt-12 grid grid-cols-3
                  gap-3 border-t border-[#e9dfd5]
                  pt-10
                  sm:gap-6
                "
                            >
                                {playFeatures.map((feature) => {
                                    const Icon = feature.icon;

                                    return (
                                        <StaggerItem
                                            key={feature.title}
                                            intensity="subtle"
                                            className="group flex flex-col items-start"
                                        >
                                            <div
                                                className="
                          flex h-12 w-12
                          items-center justify-center
                          rounded-full bg-[#f6e7e3]
                          text-[#b56c73]
                          transition-[translate,background-color] duration-500
                          group-hover:-translate-y-1
                          group-hover:bg-[#f2dad5]
                          sm:h-14 sm:w-14
                        "
                                            >
                                                <Icon size={22} strokeWidth={1.3} />
                                            </div>

                                            <h3
                                                className="
                          mt-5 font-cormorant
                          text-[19px] font-medium
                          leading-[1.15]
                          sm:text-[23px]
                        "
                                            >
                                                {feature.title}
                                            </h3>

                                            <p
                                                className="
                          mt-2 text-[11px]
                          leading-[1.6]
                          text-[#837b73]
                          sm:text-[12px]
                        "
                                            >
                                                {feature.description}
                                            </p>
                                        </StaggerItem>
                                    );
                                })}
                            </StaggerItem>
                        </StaggerReveal>
                    </div>
                </section>

                {/* =============================================
            04 — SOFT EDITORIAL DIVIDER
            ============================================= */}
                <div
                    className="
            relative flex items-center justify-center
            overflow-hidden
            bg-[#f4ede7]
            px-6 py-12 text-center
            sm:py-16
          "
                >
                    <Reveal intensity="subtle" className="flex items-center gap-6 sm:gap-10">
                        <DrawLine className="h-px w-8 bg-[#c9ae99] sm:w-20" origin="right" delay={0.3} />

                        <div>
                            <Flower2
                                size={24}
                                strokeWidth={1.1}
                                className="cbg-sway mx-auto mb-3 text-[#c57178]"
                            />
                            <p
                                className="
                  font-cormorant
                  text-[26px] italic
                  leading-none text-[#5f544d]
                  sm:text-[34px]
                "
                            >
                                Little moments, lifelong memories.
                            </p>
                        </div>

                        <DrawLine className="h-px w-8 bg-[#c9ae99] sm:w-20" delay={0.3} />
                    </Reveal>
                </div>

                {/* =============================================
            05 — KIDS PARTIES
            ============================================= */}
                <section
                    id="kids-party"
                    className="
            scroll-mt-20 bg-[#fffdfb]
            py-24
            sm:py-32
            lg:py-36
          "
                >
                    <div
                        className="
              mx-auto grid max-w-[1560px]
              items-center gap-16
              lg:grid-cols-2 lg:gap-20
              xl:gap-28
            "
                    >
                        {/* LEFT CONTENT */}
                        <StaggerReveal
                            className="
                order-2 px-6
                sm:px-10
                lg:order-1
                lg:pl-[max(48px,calc((100vw-1440px)/2+72px))]
                lg:pr-0
              "
                            interval={0.11}
                        >
                            <StaggerItem intensity="subtle">
                            <SectionLabel number="02">
                                Celebrate their special day
                            </SectionLabel>
                            </StaggerItem>

                            <StaggerItem>
                            <h2
                                className="
                  mt-7 font-cormorant
                  text-[clamp(54px,5.5vw,88px)]
                  font-normal
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[#302820]
                "
                            >
                                Kids Parties
                                <br />
                                at{" "}
                                <span className="text-blossom">Cherry
                </span>
                                <br />
                                <span className="text-blossom">
                                Blossom.
                                </span>
                            </h2>
                            </StaggerItem>

                            <DrawLine className="mt-10 h-px w-20 bg-[#c9a473]" delay={0.3} />

                            <StaggerItem
                                as="p"
                                intensity="subtle"
                                className="
                  mt-9 max-w-[490px]
                  text-[14px] leading-[2]
                  text-[#69635d]
                  sm:text-[15px]
                "
                            >
                                Some celebrations deserve a little extra
                                magic. Make their special day unforgettable
                                with a joyful setting for birthdays,
                                family gatherings and precious milestones.
                            </StaggerItem>

                            <StaggerItem
                                as="p"
                                intensity="subtle"
                                className="
                  mt-5 max-w-[490px]
                  text-[14px] leading-[2]
                  text-[#69635d]
                  sm:text-[15px]
                "
                            >
                                Beautiful surroundings, delightful food,
                                playful moments and the people who matter
                                most — everything for a celebration worth
                                remembering.
                            </StaggerItem>

                            {/* Subtle party feature details */}
                            <StaggerItem
                                intensity="subtle"
                                className="
                  mt-9 flex flex-wrap gap-x-6 gap-y-3
                  text-[12px] text-[#716960]
                "
                            >
                <span className="group inline-flex items-center gap-2">
                  <PartyPopper
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#c57178] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
                  />
                  Birthday celebrations
                </span>

                                <span className="group inline-flex items-center gap-2">
                  <Heart
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#c57178] transition-transform duration-500 group-hover:scale-110"
                  />
                  Family gatherings
                </span>
                            </StaggerItem>

                            {/* CTA */}
                            <StaggerItem intensity="subtle">
                            <Link
                                href="/reservation?occasion=kids-party"
                                className="
                  cbg-sheen relative overflow-hidden
                  active:scale-[0.98]
                  group mt-11 inline-flex
                  min-h-[54px] items-center
                  gap-5 rounded-full
                  bg-blossom
                  px-8 py-4
                  text-[12px] font-medium
                  text-white
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ab5963]
                  hover:shadow-[0_15px_35px_rgba(36,55,30,0.15)]
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#c57178]
                "
                            >
                                Plan a Kids Party
                                <ArrowUpRight
                                    size={16}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </Link>
                            </StaggerItem>
                        </StaggerReveal>

                        {/* RIGHT IMAGE */}
                        <div
                            className="
                order-1 px-5
                sm:px-10
                lg:order-2 lg:pl-0 lg:pr-0
              "
                        >
                            <div
                                className="
                  relative aspect-[5/5]
                  overflow-hidden
                  rounded-tl-[100px]
                  sm:aspect-[6/5]
                  sm:rounded-tl-[180px]
                  lg:aspect-[5/5]
                  xl:aspect-[6/5]
                "
                            >
                                {/* Opens from the right inside the existing shape. */}
                                <ImageReveal fill direction="left">
                                    <ParallaxMedia fill strength={0.07}>
                                        <Image
                                            src="/assets/private-celebration.png"
                                            alt="Private celebration setting at Cherry Blossom Garden"
                                            fill
                                            sizes="(max-width: 1023px) 100vw, 50vw"
                                            className="
                        object-cover
                        transition-transform duration-1000
                        hover:scale-105
                      "
                                        />
                                    </ParallaxMedia>
                                </ImageReveal>

                                <div
                                    className="
                    pointer-events-none absolute inset-x-0 bottom-0
                    h-32 bg-gradient-to-t
                    from-[#231c17]/25 to-transparent
                  "
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =============================================
            06 — FINAL CTA
            ============================================= */}
                <section
                    className="
            bg-[#fbf9f6]
            px-5 pb-20 pt-4
            sm:px-8 sm:pb-28
            lg:px-12 lg:pb-36
          "
                >
                    <div
                        className="
              mx-auto grid max-w-[1440px]
              overflow-hidden
              rounded-[24px]
              bg-[#f3eae4]
              lg:min-h-[330px]
              lg:grid-cols-[35%_65%]
              lg:rounded-[32px]
            "
                    >
                        {/* IMAGE */}
                        <div
                            className="
                relative min-h-[240px]
                overflow-hidden
                sm:min-h-[310px]
                lg:min-h-full
              "
                        >
                            <ImageReveal fill direction="right">
                                <Image
                                    src="/assets/garden-ambience.png"
                                    alt="Welcoming garden dining atmosphere"
                                    fill
                                    sizes="(max-width: 1023px) 100vw, 35vw"
                                    className="object-cover"
                                />
                            </ImageReveal>

                            <div
                                className="
                  pointer-events-none absolute inset-0
                  bg-[#675247]/10
                "
                            />
                        </div>

                        {/* CONTENT */}
                        <StaggerReveal
                            className="
                flex flex-col justify-center
                px-7 py-14
                sm:px-12 sm:py-16
                lg:px-16
                xl:px-20
              "
                            delay={0.2}
                            interval={0.1}
                        >
                            <StaggerItem intensity="subtle" className="flex items-center gap-3">
                                <Flower2
                                    size={19}
                                    strokeWidth={1.2}
                                    className="text-[#c57178]"
                                />
                                <p
                                    className="
                    text-[9px] font-semibold uppercase
                    tracking-[0.23em]
                    text-[#b47375]
                    sm:text-[10px]
                  "
                                >
                                    Good food. Happy kids. Beautiful moments.
                                </p>
                            </StaggerItem>

                            <StaggerItem>
                            <h2
                                className="
                  mt-6 font-cormorant
                  text-[clamp(45px,4.3vw,72px)]
                  font-normal
                  leading-[0.95]
                  tracking-[-0.04em]
                  text-[#332c26]
                "
                            >
                                Dine.{" "}
                                <span className="text-blossom">
                  Play.
                </span>{" "}
                                Enjoy.
                            </h2>
                            </StaggerItem>

                            <StaggerItem
                                as="p"
                                intensity="subtle"
                                className="
                  mt-6 max-w-[540px]
                  text-[13px] leading-[1.9]
                  text-[#77716b]
                  sm:text-[14px]
                "
                            >
                                Great food, a beautiful atmosphere and a
                                dedicated place for little adventures.
                                Create your next family memory at
                                Cherry Blossom Garden.
                            </StaggerItem>

                            <StaggerItem intensity="subtle">
                            <Link
                                href="/reservation?occasion=kids-party"
                                className="
                  active:scale-[0.98]
                  group mt-8 inline-flex
                  w-fit min-h-[48px]
                  items-center gap-4
                  rounded-full
                  border border-[#c57178]
                  px-7 py-3
                  text-[12px] font-medium
                  text-[#a95c65]
                  transition-colors duration-300
                  hover:bg-[#c57178]
                  hover:text-white
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                  focus-visible:outline-[#c57178]
                "
                            >
                                Reserve for Kids Party
                                <ArrowRight
                                    size={16}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                            </StaggerItem>
                        </StaggerReveal>
                    </div>
                </section>

            </main>

            {/* Footer is already rendered in src/app/layout.tsx */}
        </div>
    );
}

/* =============================================
   SHARED SECTION LABEL
   ============================================= */

function SectionLabel({
                          number,
                          children,
                      }: {
    number: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-4">
      <span
          className="
          font-cormorant text-[20px]
          italic text-[#c57178]
        "
      >
        {number}
      </span>

            <span className="h-px w-9 bg-[#d9b8a9]" />

            <p
                className="
          text-[10px] font-semibold
          uppercase tracking-[0.24em]
          text-[#b57976]
          sm:text-[11px]
        "
            >
                {children}
            </p>
        </div>
    );
}
