import { cn } from "@/lib/frontend/cn";

const variants = {
    /** Blossom fill — the main action in a section. */
    primary: "bg-blossom text-white hover:bg-blossom/85",
    /** Ivory outline on dark — the secondary action. */
    secondary:
        "border border-ivory/50 bg-charcoal/40 text-ivory hover:border-blossom hover:bg-blossom/10",
};

export type ButtonVariant = keyof typeof variants;

/**
 * Class names for the site's buttons. Apply to <Link>, <a> or <button> so
 * every call keeps its own element and semantics:
 *
 *   <Link href="/reservation" className={buttonClass("primary")}>…</Link>
 *
 * Add a flower icon with `group-hover:rotate-45` to match the hero.
 */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
    return cn(
        "group focus-ring inline-flex min-h-12 items-center justify-center gap-4 px-6 py-3.5 font-inter text-[11px] font-medium tracking-[0.04em] transition-colors duration-300 active:scale-[0.98] sm:min-h-13",
        variants[variant],
        className
    );
}
