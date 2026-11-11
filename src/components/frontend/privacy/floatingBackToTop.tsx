"use client";

import { useState, type MouseEvent } from "react";
import { ArrowUp } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";

import styles from "@/app/privacy-policy/privacyPolicy.module.css";

/**
 * Floating "Back to top" link, shown once the reader is well into the page.
 * A real anchor to #privacy-top, so the browser scrolls (smoothly when
 * motion is allowed) and records history. When activated from the
 * keyboard, focus moves to the start of the page so the next Tab is
 * predictable; while hidden it is removed from the tab order.
 */
export default function FloatingBackToTop() {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    // Only re-renders when crossing the threshold, not on every scroll frame.
    useMotionValueEvent(scrollY, "change", (y) => {
        const next = y > 900;
        if (next !== visible) setVisible(next);
    });

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        // detail === 0: activated with Enter, not a pointer click.
        if (event.detail === 0) {
            const start = document.querySelector<HTMLElement>("#privacy-top a");
            requestAnimationFrame(() => start?.focus({ preventScroll: true }));
        }
    };

    return (
        <a
            href="#privacy-top"
            onClick={handleClick}
            aria-label="Back to top"
            aria-hidden={!visible}
            tabIndex={visible ? undefined : -1}
            data-visible={visible}
            className={styles.floatingTop}
        >
            <ArrowUp size={17} strokeWidth={1.5} aria-hidden="true" />
        </a>
    );
}
