import { cn } from "@/lib/frontend/cn";

const sizes = {
    sm: "h-[10px] w-[17px]",
    md: "h-[13px] w-[23px]",
    lg: "h-[17px] w-[29px]",
};

type PetalProps = {
    /** Position and rotation, e.g. "left-[22%] top-[3%] rotate-[28deg]". */
    className?: string;
    size?: keyof typeof sizes;
    /** Seconds; negative values start mid-cycle so petals stay out of step. */
    delay?: number;
};

/**
 * A single cherry-blossom petal that drifts slowly (cbg-drift).
 * Decorative and desktop-only (hidden below lg) so small screens stay calm.
 * Rotation uses Tailwind's `rotate-*` (the `rotate` property), which
 * composes with the drift's transform.
 */
export default function Petal({ className, size = "md", delay = 0 }: PetalProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "cbg-drift pointer-events-none absolute z-40 hidden rounded-[90%_10%_75%_25%] bg-gradient-to-br from-[#efacb5] to-[#d85d70] opacity-90 shadow-[0_2px_4px_rgba(170,64,78,0.10)] lg:block",
                sizes[size],
                className
            )}
            style={{ animationDelay: `${delay}s`, animationDuration: `${7 + Math.abs(delay)}s` }}
        />
    );
}
