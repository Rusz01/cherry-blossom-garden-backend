"use client";

import { ArrowUpRight, Flower2 } from "lucide-react";

import { cn } from "@/lib/frontend/cn";
import { useTodaySpecials } from "./todaySpecialsProvider";

/** Opens the Today's Specials popup. Must sit inside <TodaySpecialsProvider>. */
export default function TodaySpecialsTrigger({ className }: { className?: string }) {

  const {
    openSpecials,
    isOpen,
    dialogId,
    hasSpecials,
  } = useTodaySpecials();

  if (!hasSpecials) return null;


  return (
        <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={isOpen ? dialogId : undefined}
            onClick={(event) => openSpecials(event.currentTarget)}
            className={cn(
                "group focus-ring cbg-sheen relative inline-flex h-11 items-center gap-3 overflow-hidden rounded-full border border-champagne/60 bg-midnight/40 px-5 font-inter text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne transition-colors duration-300 hover:border-champagne hover:bg-champagne hover:text-midnight active:scale-[0.98]",
                className
            )}
        >
            Today&rsquo;s Specials
            <ArrowUpRight aria-hidden="true" size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
    );
}
