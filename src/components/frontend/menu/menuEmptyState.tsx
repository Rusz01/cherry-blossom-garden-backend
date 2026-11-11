import { RotateCcw, SearchX } from "lucide-react";

/** Shown when search and filters leave nothing; offers a one-click reset. */
export default function MenuEmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="cbg-enter-fade flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-champagne/20 bg-white/[0.015] px-6 py-14 text-center" style={{ animationDuration: "400ms" }}>
            <SearchX aria-hidden="true" size={32} strokeWidth={1.1} className="text-champagne" />
            <h3 className="mt-5 font-cormorant text-[32px] font-normal leading-none text-ivory">
                Nothing matches just yet.
            </h3>
            <p className="mt-3 max-w-sm font-inter text-[13px] leading-relaxed text-ivory/70">
                Try a different search or dietary filter, or clear them to see the full menu.
            </p>
            <button
                type="button"
                onClick={onClear}
                className="group focus-ring mt-7 inline-flex h-11 items-center gap-2.5 rounded-full border border-champagne/60 px-6 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne transition-colors duration-300 hover:bg-champagne hover:text-midnight"
            >
                <RotateCcw aria-hidden="true" size={14} className="transition-transform duration-500 group-hover:-rotate-180" />
                Clear filters
            </button>
        </div>
    );
}
