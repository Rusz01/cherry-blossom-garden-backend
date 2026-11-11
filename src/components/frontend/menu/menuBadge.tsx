import { ChefHat, Flame, Flower2, Leaf, Sparkle, Sprout, Star, Wheat, WheatOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/frontend/cn";

export type MenuBadgeKind =
    | "signature"
    | "popular"
    | "vegetarian"
    | "vegan"
    | "gluten-free"
    | "spicy"
    | "contains-gluten"
    | "chefs-choice"
    | "new";

const badges: Record<MenuBadgeKind, { label: string; icon?: LucideIcon; className: string }> = {
    signature: { label: "Signature", icon: Flower2, className: "border-blossom/45 bg-blossom/15 text-[#f1c1c7]" },
    popular: { label: "Popular", icon: Star, className: "border-champagne/45 bg-walnut/45 text-champagne" },
    vegetarian: { label: "Vegetarian", icon: Leaf, className: "border-champagne/30 text-ivory/80" },
    vegan: { label: "Vegan", icon: Sprout, className: "border-champagne/30 text-ivory/80" },
    "gluten-free": { label: "Gluten Free", icon: WheatOff, className: "border-champagne/30 text-ivory/80" },
    spicy: { label: "Spicy", icon: Flame, className: "border-blossom/35 text-ivory/80" },
    "contains-gluten": { label: "Contains Gluten", icon: Wheat, className: "border-ivory/20 text-ivory/65" },
    "chefs-choice": { label: "Chef's Choice", icon: ChefHat, className: "border-champagne/45 bg-walnut/45 text-champagne" },
    new: { label: "New", icon: Sparkle, className: "border-champagne/45 text-champagne" },
};

const sizes = {
    sm: { className: "h-[22px] gap-1.5 px-2.5 text-[10px]", icon: 11 },
    md: { className: "h-[26px] gap-2 px-3 text-[11px]", icon: 12 },
};

type MenuBadgeProps = {
    kind: MenuBadgeKind;
    /** `md` for the Today's Specials popup. */
    size?: keyof typeof sizes;
};

/** Small pill used for dietary, popular, signature and specials labels. */
export default function MenuBadge({ kind, size = "sm" }: MenuBadgeProps) {
    const { label, icon: Icon, className } = badges[kind];

    return (
        <span
            className={cn(
                "inline-flex items-center whitespace-nowrap rounded-full border font-inter leading-none",
                sizes[size].className,
                className
            )}
        >
            {Icon ? (
                <Icon
                    aria-hidden="true"
                    size={sizes[size].icon}
                    strokeWidth={1.6}
                    className={kind === "spicy" ? "text-blossom" : kind === "signature" ? "" : "text-champagne"}
                />
            ) : null}
            {label}
        </span>
    );
}
