"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";

type ParallaxMediaProps = {
    /** Usually a next/image with `fill`. */
    children: ReactNode;
    /** Sizes the frame, unless `fill` is set. */
    className?: string;
    /** Fill the nearest positioned parent instead of sizing itself. */
    fill?: boolean;
    /**
     * Extra travel as a share of the frame height (0.05–0.2).
     * Keep it small: parallax is an accent, not a ride.
     */
    strength?: number;
};

/**
 * Moves media slower than the page inside a clipped frame.
 * The media is oversized by `strength` on each side so edges never show.
 * Disabled for reduced motion.
 */
export default function ParallaxMedia({
                                          children,
                                          className,
                                          fill = false,
                                          strength = 0.1,
                                      }: ParallaxMediaProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // Travel is relative to the oversized layer's own height.
    const travel = (strength / (1 + strength * 2)) * 100;
    const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);

    const bleed = `${-strength * 100}%`;

    return (
        <div
            ref={ref}
            className={cn(
                fill ? "absolute inset-0" : "relative",
                "overflow-hidden",
                className
            )}
        >
            <m.div
                className="absolute inset-x-0 will-change-transform"
                style={
                    reduced
                        ? { top: 0, bottom: 0, y: 0 }
                        : { top: bleed, bottom: bleed, y }
                }
            >
                {children}
            </m.div>
        </div>
    );
}
