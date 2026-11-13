import { ArrowLeft, ArrowRight } from "lucide-react";

import type { MenuSection } from "@/lib/frontend/menu";
import { viewIcon } from "./menuIcons";
import MenuItemRow from "./menuItemRow";

type MenuCategorySectionProps = {
    section: MenuSection;
    /** True when this category is the selected view (shows "All menu" instead of "View all"). */
    focused: boolean;
    /** Position of the first row on the page, so the stagger continues across sections. */
    startIndex: number;
    onViewAll: () => void;
    onBackToAll: () => void;
};

/** Category heading with icon, count and View all, then the item rows in two columns. */
export default function MenuCategorySection({
                                                section,
                                                focused,
                                                startIndex,
                                                onViewAll,
                                                onBackToAll,
                                            }: MenuCategorySectionProps) {
    const { category, items, total } = section;
  const Icon = viewIcon(category.id);
    const headingId = `menu-section-${category.id}`;

    return (
        <section aria-labelledby={headingId} className="border-t border-champagne/25 pt-5 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-baseline gap-3">
                    <Icon aria-hidden="true" size={26} strokeWidth={1.2} className="translate-y-1 text-champagne" />
                    <h3 id={headingId} className="font-cormorant text-[28px] font-normal leading-none text-ivory">
                        {category.label}
                    </h3>
                    <span className="font-inter text-[11px] text-ivory/60">
                        {total} {total === 1 ? "item" : "items"}
                    </span>
                </div>

                {focused ? (
                    <button
                        type="button"
                        onClick={onBackToAll}
                        className="group focus-ring inline-flex min-h-11 items-center gap-2 font-inter text-[12px] text-champagne transition-colors duration-300 hover:text-ivory"
                    >
                        <ArrowLeft aria-hidden="true" size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                        All menu
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onViewAll}
                        aria-label={`View all ${category.label}`}
                        className="group focus-ring inline-flex min-h-11 items-center gap-2 font-inter text-[12px] text-champagne transition-colors duration-300 hover:text-ivory"
                    >
                        View all
                        <ArrowRight aria-hidden="true" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                )}
            </div>

            {/* Row-major two columns with a hairline between them (as the printed menu). */}
            <ul className="grid lg:grid-cols-2 lg:[&>li:nth-child(odd)]:border-r lg:[&>li:nth-child(odd)]:border-r-champagne/12 lg:[&>li:nth-child(odd)]:pr-6 lg:[&>li:nth-child(even)]:pl-6">
                {items.map((item, index) => (
                    <MenuItemRow key={item.id} item={item} index={startIndex + index} />
                ))}
            </ul>
        </section>
    );
}
