"use client";

import { m, useScroll, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import styles from "@/app/privacy-policy/privacyPolicy.module.css";

/**
 * A hairline at the top of the viewport that fills as the page is read.
 * Decorative (aria-hidden): the scroll position is already available to
 * assistive technology. Follows the scroll directly for reduced motion.
 */
export default function ReadingProgress() {
    const reduced = usePrefersReducedMotion();
    const { scrollYProgress } = useScroll();
    const smoothed = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

    return (
        <m.div
            aria-hidden="true"
            className={styles.readingProgress}
            style={{ scaleX: reduced ? scrollYProgress : smoothed }}
        />
    );
}
