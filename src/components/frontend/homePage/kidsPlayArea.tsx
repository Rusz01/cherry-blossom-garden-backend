"use client";

import { useHomeContent } from "./HomeContentProvider";
import { imageSrc } from "@/lib/homepage/defaults";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Lightbulb,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import StaggerReveal, { StaggerItem } from "@/components/frontend/motion/staggerReveal";
import Petal from "@/components/frontend/ui/petal";



/* =========================================================
   ORGANIC IMAGE SHAPES

   These SVG paths create custom curved image boundaries.
   The same paths are used for clipping and white outlines.
========================================================= */

const MAIN_IMAGE_SHAPE = `
  M 0.12 -0.03
  C 0.035 0.09, -0.01 0.25, 0.02 0.40
  C 0.05 0.57, 0.12 0.72, 0.34 0.80
  C 0.48 0.82, 0.59 0.84, 0.71 0.90
  C 0.84 0.965, 0.92 0.965, 1.035 0.90
  L 1.035 -0.03
  Z
`;

const BOTTOM_IMAGE_SHAPE = `
  M 0.46 0.025
  C 0.69 -0.015, 0.75 0.13, 0.81 0.36
  C 0.87 0.59, 0.92 0.68, 0.985 0.75
  C 0.89 0.87, 0.68 0.965, 0.43 0.975
  C 0.20 0.99, 0.035 0.90, 0.015 0.69
  C -0.005 0.44, 0.18 0.075, 0.46 0.025
  Z
`;

/* =========================================================
   MAIN SECTION
========================================================= */

export default function KidsPlayAreaSection() {

  const { kids } = useHomeContent();

  const images = {
    main: imageSrc(
      kids.mainImage,
      "/assets/kids-play-area.png",
    ),
    top: imageSrc(
      kids.topImage,
      "/assets/kids-play-area.png",
    ),
    bottom: imageSrc(
      kids.bottomImage,
      "/assets/kids-play-area.png",
    ),
    blossom: "/assets/playareablossom.png",
  };

  const featureIcons = [
    ShieldCheck,
    Lightbulb,
    UsersRound,
  ];

  const features = kids.features.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index] ?? ShieldCheck,
  }));

  return (
        <section
            data-theme="light"
            className="relative isolate overflow-hidden bg-cream text-ink py-24 border-y-2 border-champagne"
        >
            <div className="relative mx-auto max-w-[1800px] overflow-hidden lg:h-[min(100svh,960px)] lg:min-h-[790px]">

                {/* ================================================
            SVG SHAPE DEFINITIONS
        ================================================= */}

                <svg
                    aria-hidden="true"
                    width="0"
                    height="0"
                    className="pointer-events-none absolute h-0 w-0"
                >
                    <defs>
                        <clipPath
                            id="kids-main-image-clip"
                            clipPathUnits="objectBoundingBox"
                        >
                            <path d={MAIN_IMAGE_SHAPE} />
                        </clipPath>

                        <clipPath
                            id="kids-bottom-image-clip"
                            clipPathUnits="objectBoundingBox"
                        >
                            <path d={BOTTOM_IMAGE_SHAPE} />
                        </clipPath>
                    </defs>
                </svg>

                {/* ================================================
            MOBILE MAIN IMAGE
        ================================================= */}

                <div
                    className="
            relative h-[350px] w-full overflow-hidden
            sm:h-[470px] lg:hidden
          "
                    style={{
                        borderRadius: "0 0 32% 12% / 0 0 15% 12%",
                    }}
                >
                    <ImageReveal fill mask={false}>
                        <Image
                            src={images.main}
                            alt="Cherry Blossom Garden kids play area"
                            fill
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                    </ImageReveal>
                </div>

                {/* ================================================
            DESKTOP RIGHT MAIN IMAGE
            Large flowing organic boundary
        ================================================= */}

                <div
                    className="
            pointer-events-none absolute inset-y-0 right-0 z-0
            hidden h-full w-[61%]
            lg:block
          "
                >
                    {/* Clipped photo */}

                    <div
                        className="absolute inset-0"
                        style={{
                            clipPath: "url(#kids-main-image-clip)",
                            WebkitClipPath: "url(#kids-main-image-clip)",
                        }}
                    >
                        <ImageReveal fill mask={false}>
                            <Image
                                src={images.main}
                                alt="Indoor jungle-themed children's play area"
                                fill
                                sizes="(min-width: 1024px) 61vw, 100vw"
                                className="object-cover object-center"
                            />
                        </ImageReveal>

                        {/* Warm image treatment */}

                        <div className="absolute inset-0 bg-[#9a5e2b]/[0.025]" />
                    </div>

                    {/* White curved outline */}

                    <svg
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full overflow-visible"
                        aria-hidden="true"
                    >
                        <path
                            d={MAIN_IMAGE_SHAPE}
                            fill="none"
                            stroke="var(--cream)"
                            strokeWidth="8"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>

                {/* ================================================
            LEFT TEXT CONTENT
        ================================================= */}

                <div
                    className="
            relative z-20
            px-6 pb-12 pt-14
            sm:px-10 sm:pb-16
            lg:absolute lg:left-0 lg:top-0
            lg:flex lg:h-full lg:w-[49%]
            lg:flex-col lg:justify-center
            lg:py-14 lg:pl-[6%] lg:pr-8
          "
                >
                    <StaggerReveal className="max-w-[455px]" interval={0.11}>

                        {/* Eyebrow */}

                        <StaggerItem className="mb-5 flex items-center gap-4" intensity="subtle">
                            <div className="cbg-sway">
                                <CherryBlossomMark />
                            </div>

                            <p
                                className="
                  font-inter text-[11px] font-semibold
                  uppercase tracking-[0.4em]
                  text-[#cf7381]
                  sm:text-xs
                "
                            >
                              {kids.eyebrow}
                            </p>
                        </StaggerItem>

                        <StaggerItem direction="none">
                            <div className="mb-5 h-px w-[190px] bg-[#d8c8bd]" />
                        </StaggerItem>

                        {/* Heading */}

                        <StaggerItem>
                        <h2
                            className="
                font-cormorant
                text-[clamp(52px,8vw,68px)]
                font-medium leading-[0.92]
                tracking-[-0.035em]
                text-ink
                lg:text-[clamp(54px,4.7vw,82px)]
              "
                        >
                          {kids.title1}
                            <br />
                          {kids.title2}
                            <br />

                            <span className="font-normal italic text-rose">
                {kids.titleAccent}
              </span>
                        </h2>
                        </StaggerItem>

                        {/* Description */}

                        <StaggerItem intensity="subtle">
                        <p
                            className="
                font-inter mt-7 max-w-[410px]
                text-[15px] leading-[1.6]
                text-[#353231]
                sm:text-[16px]
                lg:mt-8
              "
                        >
                            {kids.description}
                        </p>
                        </StaggerItem>

                        {/* Features */}

                        <StaggerReveal
                            className="
                mt-8 grid max-w-[390px]
                grid-cols-3 gap-3
              "
                            interval={0.1}
                        >
                            {features.map(({ icon: Icon, line1, line2 }) => (
                                <StaggerItem
                                    key={line2}
                                    intensity="subtle"
                                    className="flex min-w-0 flex-col items-center text-center"
                                >
                                    <div
                                        className="
                      flex h-[50px] w-[50px]
                      items-center justify-center
                      rounded-full bg-[#f5dcde]
                    "
                                    >
                                        <Icon
                                            strokeWidth={1.4}
                                            className="h-[23px] w-[23px] text-[#ca6978]"
                                        />
                                    </div>

                                    <p
                                        className="
                      font-inter mt-3 text-[9px]
                      font-semibold uppercase
                      leading-[1.4] tracking-[0.1em]
                      text-[#383332]
                      sm:text-[10px]
                    "
                                    >
                                        {line1}
                                        <br />
                                        {line2}
                                    </p>
                                </StaggerItem>
                            ))}
                        </StaggerReveal>

                        {/* CTA */}

                        <StaggerItem intensity="subtle">
                        <Link
                          href={kids.buttonHref}
                            className="
                group focus-ring mt-7 inline-flex
                min-h-[52px] items-center
                justify-center gap-4
                rounded-full bg-[#c85f6f]
                px-7
                font-inter text-[11px]
                font-semibold uppercase
                tracking-[0.14em] text-white
                transition-all duration-300
                hover:bg-[#b74f60]
                sm:px-8 sm:text-xs
              "
                        >
                          {kids.buttonLabel}

                            <ArrowRight
                                strokeWidth={1.5}
                                className="
                  h-4 w-4 transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
                            />
                        </Link>
                        </StaggerItem>
                    </StaggerReveal>
                </div>

                {/* ================================================
            TOP PICTURE
            Rounded arch with bulb-shaped bottom
        ================================================= */}

                <div
                    className="
            absolute z-30 hidden overflow-hidden
            border-[7px] border-cream
            lg:block
          "
                    style={{
                        width: "19.3%",
                        height: "42%",
                        left: "33.5%",
                        top: "9%",
                        borderRadius:
                            "49% 51% 47% 53% / 28% 28% 35% 35%",
                    }}
                >
                    <ImageReveal fill mask={false} delay={0.25}>
                        <Image
                            src={images.top}
                            alt="Cosy nature-inspired children's play nook"
                            fill
                            sizes="20vw"
                            className="object-cover object-center"
                        />
                    </ImageReveal>
                </div>

                {/* ================================================
            BOTTOM PICTURE
            Custom asymmetrical organic curved shape
        ================================================= */}

                <div
                    className="
            absolute z-30 hidden
            lg:block
          "
                    style={{
                        width: "34%",
                        height: "42%",
                        left: "34%",
                        bottom: "-0.5%",
                    }}
                >
                    {/* Organic image mask */}

                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                            clipPath: "url(#kids-bottom-image-clip)",
                            WebkitClipPath: "url(#kids-bottom-image-clip)",
                        }}
                    >
                        <ImageReveal fill mask={false} delay={0.4}>
                            <Image
                                src={images.bottom}
                                alt="Creative activity table in children's play area"
                                fill
                                sizes="35vw"
                                className="object-cover object-center"
                            />
                        </ImageReveal>
                    </div>

                    {/* White organic outline */}

                    <svg
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                        className="
              pointer-events-none absolute
              inset-0 h-full w-full
              overflow-visible
            "
                        aria-hidden="true"
                    >
                        <path
                            d={BOTTOM_IMAGE_SHAPE}
                            fill="none"
                            stroke="var(--cream)"
                            strokeWidth="8"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>

                {/* ================================================
            MOBILE SUPPORTING IMAGES
        ================================================= */}

                <div
                    className="
            relative z-30 mb-14
            grid grid-cols-2 gap-3
            px-5 sm:gap-5 sm:px-10
            lg:hidden
          "
                >
                    {/* Mobile arch */}

                    <div
                        className="
              relative aspect-[0.8]
              overflow-hidden
              border-[5px] border-white
            "
                        style={{
                            borderRadius:
                                "49% 51% 47% 53% / 28% 28% 35% 35%",
                        }}
                    >
                        <ImageReveal fill mask={false} delay={0.1}>
                            <Image
                                src={images.top}
                                alt="Cosy children's play nook"
                                fill
                                sizes="(min-width: 640px) 45vw, 50vw"
                                className="object-cover"
                            />
                        </ImageReveal>
                    </div>

                    {/* Mobile organic shape */}

                    <div
                        className="
              relative aspect-[0.9]
              overflow-hidden
              border-[5px] border-white
            "
                        style={{
                            borderRadius:
                                "60% 40% 40% 60% / 66% 49% 51% 34%",
                        }}
                    >
                        <ImageReveal fill mask={false} delay={0.2}>
                            <Image
                                src={images.bottom}
                                alt="Creative children's activity space"
                                fill
                                sizes="(min-width: 640px) 45vw, 50vw"
                                className="object-cover"
                            />
                        </ImageReveal>
                    </div>
                </div>



                {/* ================================================
            FLOATING PETALS
        ================================================= */}

                <Petal
                    className="left-[22%] top-[3%] rotate-[28deg]"
                    delay={0}
                    size="lg"
                />

                <Petal
                    className="left-[27.5%] top-[6.5%] -rotate-[74deg]"
                    delay={-2.4}
                    size="md"
                />

                <Petal
                    className="left-[30.5%] top-[15%] rotate-[82deg]"
                    delay={-4.1}
                    size="sm"
                />

                <Petal
                    className="left-[36%] top-[56%] rotate-[23deg]"
                    delay={-1.2}
                    size="md"
                />

                <Petal
                    className="left-[35.3%] top-[59%] -rotate-[21deg]"
                    delay={-5.3}
                    size="sm"
                />

                <Petal
                    className="left-[30.5%] bottom-[5.5%] rotate-[96deg]"
                    delay={-3.2}
                    size="md"
                />

                <Petal
                    className="left-[66.5%] bottom-[4%] -rotate-[63deg]"
                    delay={-6.1}
                    size="lg"
                />

                {/* Decorative petal shadow */}

                <div
                    className="
            pointer-events-none absolute
            left-[30%] top-[3%]
            hidden h-8 w-5 rotate-[27deg]
            rounded-[80%_20%_70%_30%]
            bg-black/10 blur-[5px]
            lg:block
          "
                />
            </div>
            {/* ================================================
            CHERRY BLOSSOM BRANCH
        ================================================= */}

            <div
                className="
            pointer-events-none absolute
            -bottom-50 left-50 z-10
            hidden h-[890px] w-[320px] rotate-[47deg]
            lg:block
          "
            >
                <div className="cbg-sway absolute inset-0" style={{ transformOrigin: "bottom left" }}>
                    <Image
                        src={images.blossom}
                        alt=""
                        fill
                        sizes="1050px"
                        className="object-contain object-left-bottom"
                    />
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   CHERRY BLOSSOM ICON
========================================================= */

function CherryBlossomMark() {
    return (
        <svg
            viewBox="0 0 52 45"
            className="h-8 w-10 shrink-0"
            aria-hidden="true"
        >
            <g
                fill="#e8a1aa"
                stroke="#db8590"
                strokeWidth="0.55"
            >
                <ellipse
                    cx="26"
                    cy="11"
                    rx="6"
                    ry="12"
                    transform="rotate(-5 26 11)"
                />

                <ellipse
                    cx="37"
                    cy="20"
                    rx="6"
                    ry="12"
                    transform="rotate(68 37 20)"
                />

                <ellipse
                    cx="32"
                    cy="32"
                    rx="6"
                    ry="12"
                    transform="rotate(138 32 32)"
                />

                <ellipse
                    cx="18"
                    cy="32"
                    rx="6"
                    ry="12"
                    transform="rotate(-138 18 32)"
                />

                <ellipse
                    cx="14"
                    cy="19"
                    rx="6"
                    ry="12"
                    transform="rotate(-67 14 19)"
                />
            </g>

            <circle
                cx="26"
                cy="22"
                r="3"
                fill="#c96070"
            />
        </svg>
    );
}
