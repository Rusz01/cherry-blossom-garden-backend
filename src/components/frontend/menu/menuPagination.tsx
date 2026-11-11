"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";

import { cn } from "@/lib/frontend/cn";
import { pageRange } from "@/lib/frontend/menu";

type MenuPaginationProps = {
    page: number;
    pageCount: number;
    onChange: (page: number) => void;
};

const roundButton =
    "focus-ring flex h-11 w-11 items-center justify-center rounded-full font-inter text-[13px] transition-colors duration-300";

/** Previous / numbers with ellipses / next. Hidden when there is one page. */
export default function MenuPagination({ page, pageCount, onChange }: MenuPaginationProps) {
    if (pageCount <= 1) return null;

    return (
        <nav aria-label="Menu pages" className="flex items-center justify-center gap-1.5 sm:gap-2">
            <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className={cn(roundButton, "border border-champagne/35 text-champagne hover:bg-champagne/12 disabled:pointer-events-none disabled:opacity-30")}
            >
                <ChevronLeft aria-hidden="true" size={17} />
            </button>

            {pageRange(page, pageCount).map((entry, index) =>
                entry === "ellipsis" ? (
                    <span key={`gap-${index}`} aria-hidden="true" className="w-6 text-center font-inter text-[13px] text-ivory/60">
                        …
                    </span>
                ) : (
                    <button
                        key={entry}
                        type="button"
                        aria-label={`Page ${entry}`}
                        aria-current={entry === page ? "page" : undefined}
                        onClick={() => onChange(entry)}
                        className={cn(roundButton, "relative", entry === page ? "text-midnight" : "text-ivory/80 hover:text-champagne")}
                    >
                        {entry === page ? (
                            <m.span
                                layoutId="menu-page-active"
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-champagne"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                        ) : null}
                        <span className="relative tabular-nums">{entry}</span>
                    </button>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={() => onChange(page + 1)}
                className={cn(roundButton, "border border-champagne/35 text-champagne hover:bg-champagne/12 disabled:pointer-events-none disabled:opacity-30")}
            >
                <ChevronRight aria-hidden="true" size={17} />
            </button>
        </nav>
    );
}
