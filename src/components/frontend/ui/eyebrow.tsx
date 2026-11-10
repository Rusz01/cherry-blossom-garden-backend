import type { ReactNode } from "react";

import { cn } from "@/lib/frontend/cn";

type EyebrowProps = {
    children: ReactNode;
    /** Short blossom rule before the label. */
    line?: boolean;
    as?: "p" | "span" | "h2" | "h3";
    className?: string;
};

/**
 * The small uppercase label above section headings.
 * Spacing below it belongs to the caller (`className="mb-4"`).
 */
export default function Eyebrow({
                                    children,
                                    line = false,
                                    as: Tag = "p",
                                    className,
                                }: EyebrowProps) {
    const label = (
        <Tag
            className={cn(
                "font-inter text-[10px] font-semibold uppercase tracking-[0.32em] text-blossom sm:text-[11px]",
                !line && className
            )}
        >
            {children}
        </Tag>
    );

    if (!line) return label;

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <span aria-hidden="true" className="h-px w-8 bg-blossom" />
            {label}
        </div>
    );
}
