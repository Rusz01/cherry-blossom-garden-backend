"use client";

import { useSyncExternalStore } from "react";

const DEFAULT_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True on devices with a precise, hovering pointer (mouse or trackpad).
 * False on the server and during hydration, so it never causes a mismatch.
 * Pass a stricter query to add conditions such as a minimum width.
 */
export function useFinePointer(query: string = DEFAULT_QUERY) {
    return useSyncExternalStore(
        (onChange) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", onChange);

            return () => media.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => false
    );
}
