import type { ReactNode } from "react";

import { cn } from "@/lib/frontend/cn";

const widths = {
    default: "max-w-[1500px]",
    wide: "max-w-[1600px]",
};

type ContainerProps = {
    children: ReactNode;
    /** default: 1500px · wide: 1600px (full-bleed carousels and editorial grids). */
    size?: keyof typeof widths;
    as?: "div" | "section" | "header" | "footer" | "nav";
    className?: string;
};

/** The site's horizontal frame: centred, max width, responsive gutters. */
export default function Container({
                                      children,
                                      size = "default",
                                      as: Tag = "div",
                                      className,
                                  }: ContainerProps) {
    return (
        <Tag
            className={cn(
                "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
                widths[size],
                className
            )}
        >
            {children}
        </Tag>
    );
}
