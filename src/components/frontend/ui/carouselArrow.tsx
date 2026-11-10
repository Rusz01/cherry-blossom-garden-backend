import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/frontend/cn";

const sizes = {
    md: { button: "h-11 w-11", icon: 18 },
    lg: { button: "h-14 w-14 lg:h-16 lg:w-16", icon: 22 },
};

const accents = {
    blossom: {
        outline: "border-ivory/15 text-ivory/70 hover:border-blossom hover:bg-blossom hover:text-midnight",
        solid: "border-blossom bg-blossom text-midnight hover:bg-blossom/85",
    },
    champagne: {
        outline: "border-champagne/70 bg-midnight/90 text-ivory hover:bg-champagne hover:text-midnight",
        solid: "border-champagne bg-champagne text-midnight hover:bg-champagne/85",
    },
};

type CarouselArrowProps = {
    direction: "previous" | "next";
    onClick: () => void;
    /** Accessible name, e.g. "Next dish". */
    label: string;
    size?: keyof typeof sizes;
    accent?: keyof typeof accents;
    solid?: boolean;
    /** Positioning only (e.g. absolute placement). */
    className?: string;
};

/** Round previous/next control shared by the site's carousels. */
export default function CarouselArrow({
                                          direction,
                                          onClick,
                                          label,
                                          size = "md",
                                          accent = "blossom",
                                          solid = false,
                                          className,
                                      }: CarouselArrowProps) {
    const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
                "focus-ring flex shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                sizes[size].button,
                accents[accent][solid ? "solid" : "outline"],
                className
            )}
        >
            <Icon aria-hidden="true" size={sizes[size].icon} strokeWidth={1.4} />
        </button>
    );
}
