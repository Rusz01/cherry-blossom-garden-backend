
"use client";

import { m } from "motion/react";
import { Flower2, Leaf } from "lucide-react";

import { cn } from "@/lib/frontend/cn";
import type {
  DietFilter,
  MenuDietaryTag,
} from "@/types/menu";

import { dietFilters } from "./menuIcons";

type Props = {
  value: DietFilter;
  onChange: (value: DietFilter) => void;
  tags: MenuDietaryTag[];
};

export default function MenuDietaryFilters({
                                             value,
                                             onChange,
                                             tags,
                                           }: Props) {
  const options = [
    { id: "all", label: "All", icon: Flower2 },
    ...tags.map((tag) => ({
      id: tag.id,
      label: tag.label,
      icon:
        dietFilters.find((filter) => filter.id === tag.id)
          ?.icon ?? Leaf,
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Dietary filters"
      className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max items-center gap-1 rounded-full border border-champagne/25 bg-white/[0.03] p-1.5">
        {options.map(({ id, label, icon: Icon }) => {
          const active = value === id;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(id)}
              className={cn(
                "focus-ring relative flex h-11 items-center gap-2 rounded-full px-4 font-inter text-[12px] transition-colors duration-300",
                active
                  ? "text-champagne"
                  : "text-ivory/75 hover:text-ivory",
              )}
            >
              {active && (
                <m.span
                  layoutId="menu-diet-active"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-champagne/45 bg-champagne/12"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 36,
                  }}
                />
              )}

              <Icon
                aria-hidden="true"
                size={15}
                strokeWidth={1.5}
                className="relative text-champagne"
              />

              <span className="relative whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
