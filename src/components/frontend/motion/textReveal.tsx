"use client";

import { m, type Variants } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { stagger, viewport } from "@/lib/frontend/motion/tokens";
import { revealTransition, staggerVariants } from "@/lib/frontend/motion/variants";

/** A line of text, optionally with its own classes (e.g. an Allura accent word). */
export type TextLine = string | { text: string; className?: string };

type TextRevealProps = {
    /** One string, or an array where each entry is its own line. */
    text: TextLine | TextLine[];
    as?: "h1" | "h2" | "h3" | "p" | "span";
    id?: string;
    className?: string;
    /** "inView" waits for scroll; "mount" plays straight after hydration. */
    trigger?: "inView" | "mount";
    /** Seconds before the first word. */
    delay?: number;
    /** Seconds between words. */
    interval?: number;
};

const wordVariants: Variants = {
    hidden: { y: "110%", opacity: 0 },
    visible: { y: "0%", opacity: 1 },
};

function toLine(line: TextLine) {
    return typeof line === "string" ? { text: line } : line;
}

/**
 * Masked word-by-word heading reveal. Screen readers get the full text once;
 * the animated words are aria-hidden.
 */
export default function TextReveal({
                                       text,
                                       as: Tag = "h2",
                                       id,
                                       className,
                                       trigger = "inView",
                                       delay,
                                       interval = stagger.tight,
                                   }: TextRevealProps) {
    const reduced = usePrefersReducedMotion();
    const lines = (Array.isArray(text) ? text : [text]).map(toLine);
    const label = lines.map((line) => line.text).join(" ");

    const play =
        trigger === "mount"
            ? { animate: "visible" }
            : {
                whileInView: "visible",
                viewport: { once: true, amount: 0.5, margin: viewport.margin },
            };

    return (
        <Tag id={id} className={className}>
            <span className="sr-only">{label}</span>

            <m.span
                aria-hidden="true"
                className="block"
                initial="hidden"
                variants={staggerVariants(reduced, { interval, delay })}
                {...play}
            >
                {lines.map((line, lineIndex) => (
                    <span
                        key={lineIndex}
                        className={cn("block", line.className)}
                    >
                        {line.text.split(" ").map((word, wordIndex, words) => (
                            <span key={wordIndex}>
                                {/* Padding keeps descenders (Allura, Cormorant) inside the mask. */}
                                <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-top">
                                    <m.span
                                        data-reveal=""
                                        className="inline-block will-change-transform"
                                        variants={wordVariants}
                                        transition={revealTransition(reduced)}
                                    >
                                        {word}
                                    </m.span>
                                </span>
                                {wordIndex < words.length - 1 ? " " : null}
                            </span>
                        ))}
                    </span>
                ))}
            </m.span>
        </Tag>
    );
}
