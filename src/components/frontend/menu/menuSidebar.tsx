"use client";

import { m } from "motion/react";

import { cn } from "@/lib/frontend/cn";
import type { MenuCategory, MenuView } from "@/types/menu";
import { viewIcon } from "./menuIcons";

type MenuCategoryNavProps = {
    categories: MenuCategory[];
    view: MenuView;
    counts: Record<string, number>;
    onSelect: (view: MenuView) => void;
};

const views = (categories: MenuCategory[]) => [
    { id: "all" as MenuView, label: "All Menu" },
    ...categories.map((c) => ({ id: c.id as MenuView, label: c.label })),
];

/** Desktop/tablet: vertical list with icons, counts and a gliding active panel. */
export default function MenuSidebar({ categories, view, counts, onSelect }: MenuCategoryNavProps) {
    return (
        <nav aria-label="Menu categories">
            <ul className="space-y-1">
                {views(categories).map(({ id, label }) => {
                    const Icon = viewIcon(id);
                    const active = view === id;

                    return (
                        <li key={id}>
                            <button
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSelect(id)}
                                className={cn(
                                    "focus-ring group relative flex min-h-[52px] w-full items-center gap-4 rounded-lg px-4 text-left font-inter text-[13px] transition-colors duration-300",
                                    active ? "text-ivory" : "text-ivory/75 hover:text-ivory"
                                )}
                            >
                                {active ? (
                                    <m.span
                                        layoutId="menu-category-active"
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-lg border border-champagne/35 bg-white/[0.045] before:absolute before:inset-y-2 before:left-0 before:w-[2px] before:rounded-full before:bg-champagne"
                                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                                    />
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-4 bottom-0 h-px bg-champagne/10"
                                    />
                                )}
                                <Icon
                                    aria-hidden="true"
                                    size={22}
                                    strokeWidth={1.2}
                                    className="relative shrink-0 text-champagne transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                                />
                                <span className="relative flex-1">{label}</span>
                                <span className="relative font-inter text-[11px] tabular-nums text-ivory/60">
                                    {counts[id] ?? 0}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

/** Small screens: the same choices as a horizontally scrolling chip row. */
export function MenuCategoryChips({ categories, view, counts, onSelect }: MenuCategoryNavProps) {
    return (
        <nav aria-label="Menu categories" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max gap-2 pb-1">
                {views(categories).map(({ id, label }) => {
                    const Icon = viewIcon(id);
                    const active = view === id;

                    return (
                        <li key={id}>
                            <button
                                type="button"
                                aria-pressed={active}
                                onClick={() => onSelect(id)}
                                className={cn(
                                    "focus-ring flex h-11 items-center gap-2 rounded-full border px-4 font-inter text-[12px] transition-colors duration-300",
                                    active
                                        ? "border-champagne/60 bg-champagne/12 text-ivory"
                                        : "border-champagne/20 text-ivory/75"
                                )}
                            >
                                <Icon aria-hidden="true" size={15} strokeWidth={1.4} className="text-champagne" />
                                {label}
                                <span className="text-[10px] tabular-nums text-ivory/60">{counts[id] ?? 0}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
