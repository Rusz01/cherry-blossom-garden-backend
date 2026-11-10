"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { viewport, type MotionIntensity } from "@/lib/frontend/motion/tokens";
import {
    revealTransition,
    revealVariants,
    type RevealDirection,
} from "@/lib/frontend/motion/variants";

const tags = {
    div: m.div,
    section: m.section,
    article: m.article,
    header: m.header,
    figure: m.figure,
    p: m.p,
    span: m.span,
    li: m.li,
};

type RevealProps = {
    children: ReactNode;
    as?: keyof typeof tags;
    className?: string;
    id?: string;
    direction?: RevealDirection;
    intensity?: MotionIntensity;
    /** Seconds. */
    delay?: number;
    /** Seconds. */
    duration?: number;
    /** Share of the element that must be visible before it plays (0–1). */
    amount?: number;
    once?: boolean;
    /** Viewport margin (IntersectionObserver rootMargin). Defaults to none. */
    margin?: string;
};

/**
 * Fades and lifts content into place when it scrolls into view.
 * Use for below-the-fold content. Above-the-fold entrances should use
 * the CSS `cbg-enter` classes so they play before hydration.
 */
export default function Reveal({
                                   children,
                                   as = "div",
                                   className,
                                   id,
                                   direction = "up",
                                   intensity = "base",
                                   delay,
                                   duration,
                                   amount = viewport.amount,
                                   once = viewport.once,
                                   margin = viewport.margin,
                               }: RevealProps) {
    const reduced = usePrefersReducedMotion();
    const Component = tags[as];

    return (
        <Component
            data-reveal=""
            id={id}
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount, margin }}
            variants={revealVariants(direction, intensity)}
            transition={revealTransition(reduced, { delay, duration })}
        >
            {children}
        </Component>
    );
}
