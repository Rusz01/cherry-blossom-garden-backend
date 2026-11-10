"use client";

import { useSyncExternalStore } from "react";

import { restaurantDate } from "@/lib/specials";
import type { RestaurantDate } from "@/types/specials";

/** Re-check once a minute so a page left open rolls over at midnight. */
function subscribe(onChange: () => void) {
    const interval = window.setInterval(onChange, 60_000);

    return () => window.clearInterval(interval);
}

function getServerSnapshot() {
    return null;
}

/**
 * Today's date in the restaurant's time zone (Asia/Kathmandu).
 * Null on the server and during hydration (a prerendered page can't know
 * the visitor's day), then the real date, so it never causes a mismatch.
 */
export function useRestaurantDate(): RestaurantDate | null {
    return useSyncExternalStore(subscribe, restaurantDate, getServerSnapshot);
}
