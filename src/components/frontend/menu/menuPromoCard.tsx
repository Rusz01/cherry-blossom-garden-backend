"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/frontend/cn";

type MenuPromoCardProps = {
    onExplore: () => void;
    /** Number of signature items under the current search and dietary filter. */
    count: number;
    className?: string;
};

/** "Signature Flavours" card under the sidebar; shows the signature selection. */
export default function MenuPromoCard({ onExplore, count, className }: MenuPromoCardProps) {
    return (
        <div
            className={cn(
                "relative isolate overflow-hidden rounded-xl border border-champagne/25 bg-charcoal px-6 pb-7 pt-32",
                className
            )}
        >
            {/* Blossom branch over a soft dark wash */}
            <div aria-hidden="true" className="absolute -right-10 -top-12 -z-10 h-64 w-64 rotate-[160deg] opacity-80">
                <div className="cbg-sway absolute inset-0">
                    <Image src="/assets/story-blossom.png" alt="" fill sizes="256px" className="object-contain" />
                </div>
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/85 to-charcoal/20" />

            <h2 className="font-cormorant text-[36px] font-normal leading-[0.95] text-ivory">
                <span className="text-champagne">Signature</span>
                <br />
                Flavours
            </h2>
            <p className="mt-3 max-w-[200px] font-inter text-[12px] leading-relaxed text-ivory/75">
                Handpicked dishes loved by our guests.
            </p>

            <button
                type="button"
                onClick={onExplore}
                disabled={count === 0}
                aria-label={`Explore now: show ${count} signature dishes`}
                className="group focus-ring relative isolate mt-6 inline-flex h-11 items-center gap-3 overflow-hidden rounded-full border border-champagne/70 px-5 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-champagne before:transition-transform before:duration-500 before:ease-brand hover:text-midnight hover:before:scale-x-100 focus-visible:text-midnight focus-visible:before:scale-x-100 active:scale-[0.98] disabled:opacity-40"
            >
                Explore now
                <ArrowRight aria-hidden="true" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </div>
    );
}
