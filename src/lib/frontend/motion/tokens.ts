/* =========================================
   CHERRY BLOSSOM — MOTION TOKENS
   Single source of truth for JS motion.
   CSS mirrors live in src/app/globals.css (:root --motion-*).
   Keep both in sync when changing a value.
   ========================================= */

export type CubicBezier = readonly [number, number, number, number];

/** Seconds. */
export const duration = {
    fast: 0.25,
    base: 0.6,
    slow: 0.9,
    cinematic: 1.3,
    /** Used for every animation when the visitor prefers reduced motion. */
    reduced: 0.2,
} as const;

/** Seconds. */
export const delay = {
    none: 0,
    short: 0.08,
    base: 0.16,
    long: 0.32,
} as const;

export const ease = {
    /** Matches the existing hero curve: cubic-bezier(0.22, 1, 0.36, 1). */
    out: [0.22, 1, 0.36, 1],
    inOut: [0.65, 0, 0.35, 1],
    /** Slower start for mask and curtain reveals. */
    mask: [0.77, 0, 0.175, 1],
} as const satisfies Record<string, CubicBezier>;

/** Seconds between siblings. */
export const stagger = {
    tight: 0.05,
    base: 0.09,
    relaxed: 0.14,
} as const;

export const spring = {
    gentle: { type: "spring", stiffness: 140, damping: 22, mass: 0.9 },
    snappy: { type: "spring", stiffness: 320, damping: 30 },
} as const;

/** Travel distance in px for reveal offsets. */
export const intensity = {
    subtle: 12,
    base: 24,
    strong: 40,
} as const;

export type MotionIntensity = keyof typeof intensity;

/**
 * Default whileInView options: play once, when a quarter is visible.
 * No negative margin: content at the very end of a page can never scroll
 * past a trimmed viewport edge, so it would stay hidden for ever.
 */
export const viewport = {
    once: true,
    amount: 0.25,
    margin: "0px",
} as const;
