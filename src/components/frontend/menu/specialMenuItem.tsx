import { m, type Variants } from "motion/react";

import { formatPrice } from "@/lib/frontend/menu";
import type { ResolvedSpecial } from "@/types/specials";
import MenuBadge, { type MenuBadgeKind } from "./menuBadge";

/** Status first, then dietary labels, all derived from the data. */
function badgesFor(special: ResolvedSpecial): MenuBadgeKind[] {
    const d = special.dietary;
    const kinds: MenuBadgeKind[] = [];

    if (special.chefsChoice) kinds.push("chefs-choice");
    if (special.isNew) kinds.push("new");
    if (d.vegan) kinds.push("vegan");
    else if (d.vegetarian) kinds.push("vegetarian");
    if (d.glutenFree) kinds.push("gluten-free");
    if (d.spicy) kinds.push("spicy");
    if (d.containsGluten) kinds.push("contains-gluten");

    return kinds;
}

type SpecialMenuItemProps = {
    special: ResolvedSpecial;
    /** Row variants from the list, so rows play in sequence. */
    variants: Variants;
    dividerVariants: Variants;
};

/** One dish in the Today's Specials popup. */
export default function SpecialMenuItem({ special, variants, dividerVariants }: SpecialMenuItemProps) {
    const badges = badgesFor(special);

    return (
        <m.li variants={variants} className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 py-5 sm:gap-x-8 sm:py-6">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-cormorant text-[22px] font-normal leading-tight text-ivory sm:text-[25px]">
                        {special.name}
                    </h3>
                    {badges.length ? (
                        <ul aria-label="Labels" className="flex flex-wrap gap-1.5">
                            {badges.map((kind) => (
                                <li key={kind}>
                                    <MenuBadge kind={kind} size="md" />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
                <p className="mt-2 max-w-[480px] font-inter text-[13px] leading-relaxed text-ivory/70 sm:text-[14px]">
                    {special.description}
                </p>
            </div>

            <p className="pt-1 font-inter text-[16px] font-medium tabular-nums text-champagne sm:text-[17px]">
                {formatPrice(special.price, special.currency)}
            </p>

            {/* Hairline that draws in with the row */}
            <m.span
                aria-hidden="true"
                variants={dividerVariants}
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-champagne/15"
            />
        </m.li>
    );
}
