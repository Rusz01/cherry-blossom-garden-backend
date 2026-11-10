"use client";

import { m } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { duration, ease, viewport } from "@/lib/frontend/motion/tokens";

const tones = {
    champagne: { strong: "bg-champagne/75", soft: "bg-champagne/35" },
    blossom: { strong: "bg-blossom", soft: "bg-blossom/40" },
    ivory: { strong: "bg-ivory/60", soft: "bg-ivory/25" },
} as const;

type AnimatedDividerProps = {
    /** "line": one rule. "ornament": rule, diamond, short rule (as in the hero). */
    variant?: "line" | "ornament";
    tone?: keyof typeof tones;
    className?: string;
    /** Seconds. */
    delay?: number;
};

/** A hairline that draws itself from the left when it enters view. */
export default function AnimatedDivider({
                                            variant = "line",
                                            tone = "champagne",
                                            className,
                                            delay = 0,
                                        }: AnimatedDividerProps) {
    const reduced = usePrefersReducedMotion();
    const colours = tones[tone];

    const draw = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1 },
    };

    const transition = (step: number) =>
        reduced
            ? { duration: duration.reduced }
            : {
                duration: duration.slow,
                ease: ease.out,
                delay: delay + step * 0.12,
            };

    return (
        <m.div
            aria-hidden="true"
            className={cn("flex items-center gap-3", className)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 1, margin: viewport.margin }}
        >
            <m.span
                data-reveal=""
                className={cn(
                    "block h-px origin-left",
                    variant === "ornament" ? "w-14" : "w-full",
                    colours.strong
                )}
                variants={draw}
                transition={transition(0)}
            />

            {variant === "ornament" ? (
                <>
                    <m.span
                        data-reveal=""
                        className={cn("block h-1 w-1 rotate-45", colours.strong)}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                        }}
                        transition={transition(1)}
                    />
                    <m.span
                        data-reveal=""
                        className={cn("block h-px w-8 origin-left", colours.soft)}
                        variants={draw}
                        transition={transition(2)}
                    />
                </>
            ) : null}
        </m.div>
    );
}
