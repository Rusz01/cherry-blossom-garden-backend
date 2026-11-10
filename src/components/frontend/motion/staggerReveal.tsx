"use client";

import type { ReactNode } from "react";
import { m, stagger as staggerDelay, type Variants } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { stagger, viewport, type MotionIntensity } from "@/lib/frontend/motion/tokens";
import {
    revealTransition,
    revealVariants,
    staggerVariants,
    type RevealDirection,
} from "@/lib/frontend/motion/variants";

const containerTags = {
    div: m.div,
    ul: m.ul,
    ol: m.ol,
    section: m.section,
};

const itemTags = {
    div: m.div,
    li: m.li,
    article: m.article,
    figure: m.figure,
    p: m.p,
    span: m.span,
};

type StaggerRevealProps = {
    children: ReactNode;
    as?: keyof typeof containerTags;
    className?: string;
    /** Seconds between items. Defaults to stagger.base. */
    interval?: number;
    /** Seconds before the first item. */
    delay?: number;
    amount?: number;
    once?: boolean;
};

/**
 * Plays its StaggerItem children in sequence when the group enters view.
 * Use for card grids, lists and feature rows.
 */
export default function StaggerReveal({
                                          children,
                                          as = "div",
                                          className,
                                          interval,
                                          delay,
                                          amount = 0.15,
                                          once = viewport.once,
                                      }: StaggerRevealProps) {
    const reduced = usePrefersReducedMotion();
    const Component = containerTags[as];

    return (
        <Component
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount, margin: viewport.margin }}
            variants={staggerVariants(reduced, { interval, delay })}
        >
            {children}
        </Component>
    );
}

type StaggerItemProps = {
    children: ReactNode;
    as?: keyof typeof itemTags;
    className?: string;
    direction?: RevealDirection;
    intensity?: MotionIntensity;
    /**
     * Also sequence this item's own StaggerItem children (e.g. details inside
     * a card): they follow the item's turn, `delay` seconds later.
     */
    stagger?: { interval?: number; delay?: number };
    /** For decorative items that repeat information shown elsewhere. */
    "aria-hidden"?: boolean;
};

/** One item in a StaggerReveal. Inherits the parent's play state. */
export function StaggerItem({
                                children,
                                as = "div",
                                className,
                                direction = "up",
                                intensity = "base",
                                stagger: childStagger,
                                "aria-hidden": ariaHidden,
                            }: StaggerItemProps) {
    const reduced = usePrefersReducedMotion();
    const Component = itemTags[as];

    const base = revealVariants(direction, intensity);
    const transition = revealTransition(reduced);

    // A variant-level transition replaces the prop transition, so it carries
    // the reveal timing as well as the children's stagger.
    const variants: Variants = childStagger
        ? {
            hidden: base.hidden,
            visible: {
                ...(base.visible as object),
                transition: {
                    ...transition,
                    delayChildren: reduced
                        ? 0
                        : staggerDelay(childStagger.interval ?? stagger.tight, {
                            startDelay: childStagger.delay ?? 0,
                        }),
                },
            },
        }
        : base;

    return (
        <Component
            data-reveal=""
            aria-hidden={ariaHidden}
            className={className}
            variants={variants}
            transition={transition}
        >
            {children}
        </Component>
    );
}
