"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { duration, ease, viewport } from "@/lib/frontend/motion/tokens";
import {
    maskFrom,
    maskVisible,
    type RevealDirection,
} from "@/lib/frontend/motion/variants";

type ImageRevealProps = {
    /** Usually a next/image with `fill`. */
    children: ReactNode;
    /**
     * Sizes the frame (e.g. "min-h-[500px]"). Ignored for sizing when `fill`
     * is set, but still useful for extra classes.
     */
    className?: string;
    /** Fill the nearest positioned parent instead of sizing itself. */
    fill?: boolean;
    /**
     * Curtain clip-path wipe. Turn off inside frames that already clip
     * (organic SVG shapes, rounded masks) to keep only the fade and settle.
     */
    mask?: boolean;
    direction?: Exclude<RevealDirection, "none">;
    /** Seconds. */
    delay?: number;
};

/**
 * Curtain-style clip-path reveal with a slow settle of the image inside.
 * Reduced motion: a short fade, no mask or scale.
 */
export default function ImageReveal({
                                        children,
                                        className,
                                        fill = false,
                                        mask = true,
                                        direction = "up",
                                        delay = 0,
                                    }: ImageRevealProps) {
    const reduced = usePrefersReducedMotion();

    return (
        // The frame watches the viewport and is never clipped itself:
        // IntersectionObserver treats a fully clipped element as invisible.
        <m.div
            className={cn(
                fill ? "absolute inset-0" : "relative",
                "overflow-hidden",
                className
            )}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: viewport.margin }}
        >
            <m.div
                data-reveal=""
                className="absolute inset-0"
                variants={{
                    hidden: mask
                        ? { clipPath: maskFrom[direction], opacity: 0 }
                        : { opacity: 0 },
                    visible: mask
                        ? { clipPath: maskVisible, opacity: 1 }
                        : { opacity: 1 },
                }}
                transition={
                    reduced
                        ? {
                            clipPath: { duration: 0 },
                            opacity: { duration: duration.reduced },
                        }
                        : {
                            clipPath: { duration: duration.cinematic, ease: ease.mask, delay },
                            opacity: {
                                duration: mask ? duration.fast : duration.slow,
                                ease: ease.out,
                                delay,
                            },
                        }
                }
            >
                <m.div
                    className="absolute inset-0"
                    variants={{
                        hidden: { scale: 1.08 },
                        visible: { scale: 1 },
                    }}
                    transition={
                        reduced
                            ? { duration: 0 }
                            : { duration: duration.cinematic + 0.4, ease: ease.out, delay }
                    }
                >
                    {children}
                </m.div>
            </m.div>
        </m.div>
    );
}
