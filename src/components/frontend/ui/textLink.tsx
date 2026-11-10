import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/frontend/cn";

type TextLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
    children: ReactNode;
    /** right: moves along · up-right: opens something new. */
    icon?: "right" | "up-right";
};

/**
 * The editorial uppercase link: blossom label on a quiet hairline that an
 * ivory line draws across on hover/focus, and an arrow that nudges.
 * Works in Server and Client Components.
 */
export default function TextLink({
                                     children,
                                     icon = "right",
                                     className,
                                     ...props
                                 }: TextLinkProps) {
    const Icon = icon === "right" ? ArrowRight : ArrowUpRight;

    return (
        <Link
            {...props}
            className={cn(
                "group/link focus-ring inline-flex items-center gap-3 font-inter text-[10px] font-semibold uppercase tracking-[0.18em] text-blossom transition-colors duration-300 hover:text-ivory",
                className
            )}
        >
            <span className="relative pb-1">
                {children}

                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px bg-blossom/45"
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ivory transition-transform duration-500 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100"
                />
            </span>

            <Icon
                aria-hidden="true"
                size={14}
                strokeWidth={1.5}
                className={cn(
                    "shrink-0 transition-transform duration-300",
                    icon === "right"
                        ? "group-hover/link:translate-x-1"
                        : "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                )}
            />
        </Link>
    );
}
