"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "motion/react";

const loadLayoutFeatures = () =>
    import("@/components/frontend/motion/layoutFeatures").then((module) => module.default);

/**
 * Adds Motion's layout features (`layout`, `layoutId`, popLayout exits) for
 * the content inside. The app-wide MotionProvider only ships the lighter
 * domAnimation bundle; this loads the rest as a separate chunk, on the
 * pages that use it. Until it arrives, elements simply don't layout-animate.
 */
export default function LayoutMotion({ children }: { children: ReactNode }) {
    return (
        <LazyMotion features={loadLayoutFeatures} strict>
            {children}
        </LazyMotion>
    );
}
