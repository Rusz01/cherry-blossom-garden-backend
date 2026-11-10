"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

import { duration, ease } from "@/lib/frontend/motion/tokens";

/**
 * Wraps the app once (in the root layout).
 * - LazyMotion + domAnimation keeps the bundle small; `strict` enforces
 *   the lightweight `m.*` components instead of `motion.*`.
 * - reducedMotion="user" disables transform animation for visitors who
 *   prefer reduced motion.
 */
export default function MotionProvider({
                                           children,
                                       }: {
    children: ReactNode;
}) {
    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig
                reducedMotion="user"
                transition={{ duration: duration.base, ease: ease.out }}
            >
                {children}
            </MotionConfig>
        </LazyMotion>
    );
}
