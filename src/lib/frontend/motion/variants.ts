import { stagger as staggerDelay } from "motion/react";
import type { Transition, Variants } from "motion/react";

import {
    duration,
    ease,
    intensity as intensityScale,
    stagger,
    type MotionIntensity,
} from "@/lib/frontend/motion/tokens";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

/*
 * Variants (the hidden/visible styles) never change with the reduced-motion
 * preference, so server and client markup always match. Only the transition
 * changes: reduced motion becomes a short opacity fade, and MotionConfig
 * (reducedMotion="user") skips transform animation.
 */

function offset(direction: RevealDirection, level: MotionIntensity) {
    const distance = intensityScale[level];

    switch (direction) {
        case "up":
            return { y: distance };
        case "down":
            return { y: -distance };
        case "left":
            return { x: distance };
        case "right":
            return { x: -distance };
        default:
            return {};
    }
}

export function revealVariants(
    direction: RevealDirection = "up",
    level: MotionIntensity = "base"
): Variants {
    return {
        hidden: { opacity: 0, ...offset(direction, level) },
        visible: { opacity: 1, x: 0, y: 0 },
    };
}

/**
 * Leaves `delay` out unless one is given: Motion lets an element's own
 * transition.delay replace the delay a stagger parent hands it, so even
 * `delay: 0` would cancel the stagger.
 */
export function revealTransition(
    reduced: boolean,
    options: { delay?: number; duration?: number } = {}
): Transition {
    if (reduced) {
        return { duration: duration.reduced, ease: "linear" };
    }

    return {
        duration: options.duration ?? duration.slow,
        ease: ease.out,
        ...(options.delay !== undefined ? { delay: options.delay } : {}),
    };
}

export function staggerVariants(
    reduced: boolean,
    options: { interval?: number; delay?: number } = {}
): Variants {
    return {
        hidden: {},
        visible: {
            transition: {
                delayChildren: reduced
                    ? 0
                    : staggerDelay(options.interval ?? stagger.base, {
                        startDelay: options.delay ?? 0,
                    }),
            },
        },
    };
}

/** clip-path start positions for curtain-style image reveals. */
export const maskFrom: Record<Exclude<RevealDirection, "none">, string> = {
    up: "inset(100% 0% 0% 0%)",
    down: "inset(0% 0% 100% 0%)",
    left: "inset(0% 0% 0% 100%)",
    right: "inset(0% 100% 0% 0%)",
};

export const maskVisible = "inset(0% 0% 0% 0%)";
