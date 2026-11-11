import Image from "next/image";

import PointerParallax from "@/components/frontend/motion/pointerParallax";
import RiseText from "@/components/frontend/motion/riseText";
import Navbar from "@/components/frontend/navbar";
import Container from "@/components/frontend/ui/container";
import TodaySpecialsTrigger from "./todaySpecialsTrigger";

/*
 * Menu hero. Entrance is CSS (plays before hydration): the photograph is
 * painted at once and settles from a slight zoom while a midnight veil
 * lifts; the eyebrow, heading words and description follow.
 */
export default function MenuHero() {
    return (
        <header className="relative isolate overflow-hidden bg-midnight">
            {/* Photograph — drifts a few px with the pointer on desktop */}
            <PointerParallax className="absolute inset-0 -z-20 lg:-inset-4" distance={8}>
                <Image
                    src="/assets/first-floor.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="cbg-hero-bg object-cover object-[60%_38%]"
                />
            </PointerParallax>

            {/* Legibility: dark on the text side, fading into the page below */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight/95 via-midnight/65 to-midnight/5" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-transparent to-midnight/60" />
            <div aria-hidden="true" className="cbg-hero-veil pointer-events-none absolute inset-0 z-10 bg-midnight" />

            {/* Blossom branch hanging from the top */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-[18%] -z-10 hidden h-[340px] w-[340px] rotate-[200deg] opacity-80 lg:block">
                <div className="cbg-sway absolute inset-0">
                    <Image src="/assets/story-blossom.png" alt="" fill sizes="340px" className="object-contain" />
                </div>
            </div>

            {/* Vertical calligraphy, "a delicious time" */}
            <div
                aria-hidden="true"
                className="cbg-enter-fade pointer-events-none absolute right-[4%] top-[120px] hidden flex-col items-center gap-3 lg:flex"
                style={{ animationDelay: "1.1s" }}
            >
                <span className="font-cormorant text-[28px] leading-[1.15] tracking-[0.1em] text-ivory/75 [writing-mode:vertical-rl]">
                    美味しい時間
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-blossom/80 font-cormorant text-[11px] text-midnight">
                    桜
                </span>
            </div>

            <Navbar />

            <Container className="relative pb-10 pt-6 sm:pb-12 lg:pb-12 lg:pt-2">
                <p
                    className="cbg-enter font-inter text-[11px] font-semibold uppercase tracking-[0.32em] text-blossom"
                    style={{ animationDelay: "0.25s" }}
                >
                    Our Menu
                </p>

                <h1 className="mt-3 font-cormorant text-[clamp(48px,5.4vw,84px)] font-normal leading-[0.95] tracking-[-0.02em] text-ivory">
                    <RiseText text="A Taste for" delay={0.35} />
                    <br />
                    <RiseText text="Every" delay={0.5} />{" "}
                    <span className="                    mt-2
                    font-allura font-normal
                    text-[1.22em] leading-[1.1]
                    tracking-normal text-blossom">
                        <RiseText text="Moment" delay={0.57} />
                    </span>
                </h1>

                <p
                    className="cbg-enter mt-5 max-w-[460px] font-inter text-[14px] leading-[1.7] text-ivory/85 sm:text-[15px]"
                    style={{ animationDelay: "0.75s" }}
                >
                    From handcrafted coffee to delicious dining experiences, our menu
                    brings people together over fresh flavours, quality ingredients and
                    unforgettable moments.
                </p>

                <div className="mt-7 flex items-center gap-5">
                    <span
                        aria-hidden="true"
                        className="cbg-draw block h-px w-10 bg-champagne"
                        style={{ animationDelay: "0.95s" }}
                    />
                    <div className="cbg-enter" style={{ animationDelay: "1s" }}>
                        <TodaySpecialsTrigger />
                    </div>
                </div>
            </Container>
        </header>
    );
}
