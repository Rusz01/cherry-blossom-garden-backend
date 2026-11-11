"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";

type MenuSearchProps = {
    value: string;
    onChange: (value: string) => void;
};

/** Large rounded search field; Escape or the × clears it. */
export default function MenuSearch({ value, onChange }: MenuSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="group/search relative min-w-0 flex-1">
            <label htmlFor="menu-search" className="sr-only">
                Search the menu
            </label>
            <Search
                aria-hidden="true"
                size={19}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ivory/60 transition-colors duration-300 group-focus-within/search:text-champagne"
            />
            <input
                ref={inputRef}
                id="menu-search"
                type="search"
                value={value}
                autoComplete="off"
                placeholder="Search for dishes, ingredients or categories..."
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Escape" && value) {
                        event.preventDefault();
                        onChange("");
                    }
                }}
                className="h-14 w-full rounded-full border border-champagne/25 bg-white/[0.03] pl-14 pr-12 font-inter text-[13px] text-ivory outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-ivory/50 hover:border-champagne/40 focus:border-champagne/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(197,160,106,0.12)] [&::-webkit-search-cancel-button]:hidden"
            />
            {value ? (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                        onChange("");
                        inputRef.current?.focus();
                    }}
                    className="focus-ring absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ivory/65 transition-colors duration-300 hover:bg-white/[0.06] hover:text-champagne"
                >
                    <X aria-hidden="true" size={17} strokeWidth={1.5} />
                </button>
            ) : null}
        </div>
    );
}
