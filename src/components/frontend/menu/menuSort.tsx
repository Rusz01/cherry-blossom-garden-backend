"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";

import { cn } from "@/lib/frontend/cn";
import { ease } from "@/lib/frontend/motion/tokens";
import type { MenuSortKey } from "@/types/menu";

export const sortOptions: { value: MenuSortKey; label: string }[] = [
    { value: "popular", label: "Popular" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
];

type MenuSortProps = {
    value: MenuSortKey;
    onChange: (value: MenuSortKey) => void;
};

/**
 * Accessible listbox (button + popup). Keyboard: Arrow keys, Home/End,
 * Enter/Space to choose, Escape to close; focus returns to the button.
 */
export default function MenuSort({ value, onChange }: MenuSortProps) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(() => sortOptions.findIndex((o) => o.value === value));
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const current = sortOptions.find((o) => o.value === value) ?? sortOptions[0];

    const openList = (index = sortOptions.findIndex((o) => o.value === value)) => {
        setActive(Math.max(0, index));
        setOpen(true);
    };

    const close = (focusButton = true) => {
        setOpen(false);
        if (focusButton) buttonRef.current?.focus();
    };

    const choose = (index: number) => {
        onChange(sortOptions[index].value);
        close();
    };

    // Focus the list when it opens; close on outside pointer.
    useEffect(() => {
        if (!open) return;
        listRef.current?.focus();

        const handlePointer = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("pointerdown", handlePointer);

        return () => document.removeEventListener("pointerdown", handlePointer);
    }, [open]);

    const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openList(event.key === "ArrowUp" ? sortOptions.length - 1 : undefined);
        }
    };

    const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        const last = sortOptions.length - 1;
        const moves: Record<string, () => void> = {
            ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
            ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
            Home: () => setActive(0),
            End: () => setActive(last),
            Enter: () => choose(active),
            " ": () => choose(active),
            Escape: () => close(),
        };

        if (event.key === "Tab") {
            setOpen(false);
            return;
        }

        const move = moves[event.key];
        if (move) {
            event.preventDefault();
            move();
        }
    };

    return (
        <div ref={rootRef} className="relative flex items-center gap-3">
            <span id={`${id}-label`} className="font-inter text-[12px] text-ivory/70">
                Sort by
            </span>

            <button
                ref={buttonRef}
                id={`${id}-button`}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-labelledby={`${id}-label ${id}-button`}
                onClick={() => (open ? close() : openList())}
                onKeyDown={onButtonKeyDown}
                className="focus-ring flex h-11 min-w-[170px] items-center justify-between gap-4 rounded-full border border-champagne/30 bg-white/[0.03] px-5 font-inter text-[12px] text-ivory transition-colors duration-300 hover:border-champagne/60"
            >
                {current.label}
                <ChevronDown
                    aria-hidden="true"
                    size={15}
                    className={cn("text-champagne transition-transform duration-300", open && "rotate-180")}
                />
            </button>

            <AnimatePresence>
                {open ? (
                    <m.ul
                        ref={listRef}
                        id={`${id}-list`}
                        role="listbox"
                        tabIndex={-1}
                        aria-labelledby={`${id}-label`}
                        aria-activedescendant={`${id}-option-${active}`}
                        onKeyDown={onListKeyDown}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.22, ease: ease.out }}
                        className="absolute right-0 top-full z-30 mt-2 w-[220px] origin-top-right overflow-hidden rounded-xl border border-champagne/25 bg-[#121315] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] outline-none"
                    >
                        {sortOptions.map((option, index) => {
                            const selected = option.value === value;

                            return (
                                <li
                                    key={option.value}
                                    id={`${id}-option-${index}`}
                                    role="option"
                                    aria-selected={selected}
                                    onPointerEnter={() => setActive(index)}
                                    onClick={() => choose(index)}
                                    className={cn(
                                        "flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3.5 font-inter text-[12px] transition-colors duration-200",
                                        index === active ? "bg-champagne/12 text-ivory" : "text-ivory/80",
                                        selected && "text-champagne"
                                    )}
                                >
                                    {option.label}
                                    {selected ? <Check aria-hidden="true" size={14} /> : null}
                                </li>
                            );
                        })}
                    </m.ul>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
