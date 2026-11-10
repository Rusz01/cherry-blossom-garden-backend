"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { m, useInView, useMotionValue, useSpring } from "motion/react";

import { useFinePointer } from "@/hooks/frontend/useFinePointer";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { cn } from "@/lib/frontend/cn";

const FINE_POINTER = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

type PointerParallaxProps = {
    children: ReactNode;
    className?: string;
    /** Maximum travel in px at the viewport edge. */
    distance?: number;
};

/**
 * Drifts its content a few pixels against the pointer.
 * Only on desktop with a fine pointer, only while on screen, and never for
 * reduced motion. Updates motion values directly, so React never re-renders.
 * Give the content a little overscan (e.g. `-inset-4`) so edges stay hidden.
 */
export default function PointerParallax({
                                            children,
                                            className,
                                            distance = 12,
                                        }: PointerParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    const reduced = usePrefersReducedMotion();
    const finePointer = useFinePointer(FINE_POINTER);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.8 });
    const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.8 });

    const active = inView && finePointer && !reduced;

    useEffect(() => {
        if (!active) {
            rawX.set(0);
            rawY.set(0);
            return;
        }

        const handleMove = (event: PointerEvent) => {
            // -1 … 1 from the viewport centre; content moves the other way.
            const offsetX = event.clientX / window.innerWidth - 0.5;
            const offsetY = event.clientY / window.innerHeight - 0.5;

            rawX.set(-offsetX * distance * 2);
            rawY.set(-offsetY * distance * 2);
        };

        window.addEventListener("pointermove", handleMove, { passive: true });

        return () => window.removeEventListener("pointermove", handleMove);
    }, [active, distance, rawX, rawY]);

    return (
        <m.div ref={ref} className={cn("will-change-transform", className)} style={{ x, y }}>
            {children}
        </m.div>
    );
}
