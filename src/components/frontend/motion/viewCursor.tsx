"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "motion/react";

import { useFinePointer } from "@/hooks/frontend/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";
import { duration, ease } from "@/lib/frontend/motion/tokens";

type ViewCursorProps = {
    children: ReactNode;
    /** Short word shown in the disc. */
    label?: string;
    className?: string;
};

/**
 * A small "View" disc that follows the pointer over elements marked with
 * `data-cursor`. Desktop fine pointers only; never on touch devices or with
 * reduced motion. Pointer position lives in motion values, so moving the
 * mouse never re-renders React — only entering or leaving a target does.
 * The native cursor is hidden over targets only while the disc is active.
 */
export default function ViewCursor({
                                       children,
                                       label = "View",
                                       className,
                                   }: ViewCursorProps) {
    const finePointer = useFinePointer();
    const reduced = usePrefersReducedMotion();
    const enabled = finePointer && !reduced;

    const [visible, setVisible] = useState(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 420, damping: 38, mass: 0.6 });
    const y = useSpring(rawY, { stiffness: 420, damping: 38, mass: 0.6 });

    const handleMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!enabled || event.pointerType !== "mouse") return;

        const overTarget = Boolean(
            (event.target as Element).closest("[data-cursor]")
        );

        // Jump to the pointer when appearing, then follow with the spring.
        if (overTarget && !visible) {
            x.jump(event.clientX);
            y.jump(event.clientY);
        }

        rawX.set(event.clientX);
        rawY.set(event.clientY);

        if (overTarget !== visible) setVisible(overTarget);
    };

    return (
        <div
            className={cn(enabled && "cbg-view-cursor", className)}
            onPointerMove={handleMove}
            onPointerLeave={() => setVisible(false)}
        >
            {children}

            {enabled ? (
                // Outer layer follows the pointer; inner layer centres and scales.
                <m.div
                    aria-hidden="true"
                    className="pointer-events-none fixed left-0 top-0 z-[90]"
                    style={{ x, y }}
                >
                    <m.div
                        className="-ml-[42px] -mt-[42px] flex h-[84px] w-[84px] items-center justify-center rounded-full border border-ivory/40 bg-midnight/70 font-inter text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory backdrop-blur-md"
                        initial={false}
                        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
                        transition={{ duration: duration.fast, ease: ease.out }}
                    >
                        {label}
                    </m.div>
                </m.div>
            ) : null}
        </div>
    );
}
