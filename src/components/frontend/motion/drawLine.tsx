"use client";

import { m } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { duration, ease } from "@/lib/frontend/motion/tokens";

type DrawLineProps = {
    /** Size and colour come from the caller (a CSS Module class or utilities). */
    className?: string;
    /** Where the line grows from. */
    origin?: "left" | "right" | "center";
    /** Seconds after its parent reveal starts. */
    delay?: number;
};

/**
 * A hairline that draws itself when its parent reveal plays.
 * Must sit inside a Reveal, StaggerReveal or StaggerItem: it has no viewport
 * trigger of its own, because a line scaled to zero width can't be observed.
 */
export default function DrawLine({
                                     className,
                                     origin = "left",
                                     delay = 0,
                                 }: DrawLineProps) {
    const reduced = usePrefersReducedMotion();

    return (
        <m.span
            data-reveal=""
            aria-hidden="true"
            className={cn("block", className)}
            style={{ transformOrigin: origin }}
            variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1 },
            }}
            transition={
                reduced
                    ? { duration: 0 }
                    : { duration: duration.slow + 0.2, ease: ease.out, delay }
            }
        />
    );
}
