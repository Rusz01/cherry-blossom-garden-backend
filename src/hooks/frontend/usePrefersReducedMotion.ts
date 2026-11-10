"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
    return false;
}

/**
 * Live prefers-reduced-motion value.
 * Returns false on the server and during hydration, then the real value,
 * so it never causes a hydration mismatch.
 */
export function usePrefersReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
