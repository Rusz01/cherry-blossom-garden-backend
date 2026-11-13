"use client";

import { useHomeContent } from "./HomeContentProvider";
import { imageSrc } from "@/lib/homepage/defaults";

import Image from "next/image";
import Navbar from "@/components/frontend/navbar";
import Link from "next/link";

import PointerParallax from "@/components/frontend/motion/pointerParallax";
import RiseText from "@/components/frontend/motion/riseText";
import { buttonClass } from "@/components/frontend/ui/button";

/*
 * Entrance timeline (CSS, plays on first paint — no JS needed):
 *   0.0s  photograph settles from 1.08 scale; midnight veil lifts (1.4s)
 *   0.12s eyebrow
 *   0.30s heading words rise from their masks
 *   0.72s divider draws, description follows
 *   0.84s actions
 *   1.0s  scroll cue (mobile)
 * Pointer drift on desktop starts after hydration.
 */

export default function HeroSection() {
  const { hero } = useHomeContent();
    return (
        <main className="relative min-h-[100svh] overflow-hidden bg-black lg:min-h-screen">
            {/* BACKGROUND IMAGE
                Overscanned on desktop so the pointer drift never shows an edge. */}
            <PointerParallax className="absolute inset-0 lg:-inset-4">
                <Image
                  src={imageSrc(hero.image, "/assets/hero.png")}
                    alt="Cherry Blossom Garden"
                    fill
                    priority
                    sizes="100vw"
                    className="cbg-hero-bg object-cover object-[62%_center] lg:object-center"
                />
            </PointerParallax>

            {/* Cinematic veil: lifts off the photograph on first load. */}
            <div
                aria-hidden="true"
                className="cbg-hero-veil pointer-events-none absolute inset-0 z-[3] bg-midnight"
            />

            {/* ORIGINAL DESKTOP GRADIENT — UNCHANGED */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                    background: `
            linear-gradient(
              90deg,
              rgba(3, 3, 4, 0.94) 0%,
              rgba(3, 3, 4, 0.86) 10%,
              rgba(3, 3, 4, 0.70) 22%,
              rgba(3, 3, 4, 0.48) 35%,
              rgba(3, 3, 4, 0.24) 48%,
              rgba(3, 3, 4, 0.08) 60%,
              rgba(3, 3, 4, 0) 74%
            ),

            linear-gradient(
              180deg,
              rgba(2, 2, 3, 0.72) 0%,
              rgba(2, 2, 3, 0.38) 9%,
              rgba(2, 2, 3, 0.14) 19%,
              rgba(2, 2, 3, 0) 34%
            ),

            linear-gradient(
              0deg,
              rgba(2, 2, 3, 0.48) 0%,
              rgba(2, 2, 3, 0.18) 15%,
              rgba(2, 2, 3, 0) 35%
            ),

            radial-gradient(
              ellipse at 68% 45%,
              rgba(0, 0, 0, 0) 30%,
              rgba(0, 0, 0, 0.08) 58%,
              rgba(0, 0, 0, 0.30) 100%
            )
          `,
                }}
            />

            {/* ADDITIONAL MOBILE/TABLET GRADIENT ONLY */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2] lg:hidden"
                style={{
                    background: `
            linear-gradient(
              180deg,
              rgba(3, 3, 4, 0.72) 0%,
              rgba(3, 3, 4, 0.28) 20%,
              rgba(3, 3, 4, 0.42) 40%,
              rgba(3, 3, 4, 0.75) 65%,
              rgba(3, 3, 4, 0.96) 100%
            ),
            linear-gradient(
              90deg,
              rgba(3, 3, 4, 0.45) 0%,
              rgba(3, 3, 4, 0.12) 100%
            )
          `,
                }}
            />

            <div className="relative z-10">
                <Navbar />

                {/* ===================================
            DESKTOP HERO — ORIGINAL COMPOSITION
            =================================== */}
                <section className="hidden min-h-[calc(100vh-100px)] items-center lg:flex">
                    <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20 gap-4">
                        <div className="max-w-[480px]">
                            <div className="flex flex-col gap-4">
                                <p className="cbg-enter cbg-delay-1 font-inter uppercase text-blossom font-medium tracking-wider">
                                  {hero.eyebrow}
                                </p>

                                <h1 className="font-cormorant text-8xl mb-6">
                                    <RiseText text={hero.desktopTitle} delay={0.3} />{" "}
                                    <span className="font-allura text-blossom">
                                        <RiseText text={hero.accent} delay={0.58} />
                                    </span>
                                </h1>

                                <hr className="cbg-draw" style={{ animationDelay: "0.72s" }} />

                                <p className="cbg-enter font-inter" style={{ animationDelay: "0.78s" }}>
                                    {hero.description}
                                </p>
                            </div>

                            <HeroActions
                                className="cbg-enter mt-8 flex gap-4"
                                delay="0.9s"
                            />
                        </div>
                    </div>
                </section>

                {/* ===================================
            MOBILE & TABLET HERO
            =================================== */}
                <section
                    aria-label="Welcome to Cherry Blossom Garden"
                    className="relative flex min-h-[calc(100svh-90px)] items-center pb-12 pt-14 sm:min-h-[calc(100svh-110px)] sm:pb-16 sm:pt-20 lg:hidden"
                >
                    <div className="mx-auto w-full max-w-[720px] px-6 sm:px-10">
                        <div className="max-w-[570px]">

                            {/* EYEBROW */}
                            <div className="cbg-enter cbg-delay-1 mb-6 flex items-center gap-3">
                                <span className="cbg-draw h-px w-8 bg-blossom sm:w-12" style={{ animationDelay: "0.2s" }} />

                                <p className="font-inter text-[10px] font-medium uppercase tracking-[0.24em] text-blossom sm:text-[12px]">
                                  {hero.eyebrow}
                                </p>
                            </div>

                            {/* HERO TITLE */}
                            <h1
                                className="
                  font-cormorant font-normal
                  text-[clamp(3.6rem,12vw,5.8rem)]
                  leading-[0.92] tracking-[-0.025em]
                  text-ivory
                "
                            >
                                <RiseText text={hero.mobileTitle1} delay={0.3} />
                                <br />
                                <RiseText text={hero.mobileTitle2} delay={0.44} />
                                <span
                                    className="
                    mt-2 block
                    font-allura font-normal
                    text-[1.22em] leading-[1.1]
                    tracking-normal text-blossom
                  "
                                >
                  <RiseText text={hero.accent} delay={0.56} />
                </span>
                            </h1>

                            {/* DECORATIVE SEPARATOR */}
                            <div className="mt-6 flex items-center gap-3 sm:mt-8">
                                <div className="cbg-draw h-px w-14 bg-champagne/75" style={{ animationDelay: "0.7s" }} />
                                <div className="cbg-enter-fade h-1 w-1 rotate-45 bg-champagne/70" style={{ animationDelay: "0.85s" }} />
                                <div className="cbg-draw h-px w-8 bg-champagne/35" style={{ animationDelay: "0.9s" }} />
                            </div>

                            {/* DESCRIPTION */}
                            <p
                                className="
                  cbg-enter
                  mt-6 max-w-[440px]
                  font-inter text-[12px] leading-[1.9]
                  text-ivory/80
                  sm:text-[14px]
                "
                                style={{ animationDelay: "0.78s" }}
                            >
                                {hero.description}
                            </p>

                            {/* CTA BUTTONS */}
                            <HeroActions
                                className="cbg-enter mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
                                delay="0.9s"
                            />

                            {/* SCROLL INDICATOR */}
                            <Link
                                href="#our-story"
                                className="cbg-enter-fade group mt-12 inline-flex items-center gap-4 sm:mt-16"
                                style={{ animationDelay: "1.05s" }}
                            >
                                <span
                                    aria-hidden="true"
                                    className="relative h-10 w-px overflow-hidden bg-ivory/15"
                                >
                                    <span className="cbg-scroll-cue absolute inset-x-0 top-0 h-4 bg-blossom" />
                                </span>

                                <span className="font-inter text-[9px] font-medium uppercase tracking-[0.25em] text-ivory/55 transition-colors duration-300 group-hover:text-ivory">
                  Scroll to Discover
                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

/* Shared by the desktop and mobile layouts so both offer the same actions. */
function HeroActions({
                         className,
                         delay,
                     }: {
    className: string;
    delay: string;
}) {
  const { hero } = useHomeContent();
    return (
        <div className={className} style={{ animationDelay: delay }}>
          <Link
            href={hero.primaryHref}
            className={buttonClass("primary")}
          >
            {hero.primaryLabel}

            <Image
              src="/icons/light-flower.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain transition-transform duration-500 group-hover:rotate-45"
            />
          </Link>

            <Link
              href={hero.secondaryHref}
                className={buttonClass("secondary", "backdrop-blur-sm")}
            >
              {hero.secondaryLabel}
                <Image
                    src="/icons/pink flower.png"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain transition-transform duration-500 group-hover:rotate-45"
                />
            </Link>
        </div>
    );
}
