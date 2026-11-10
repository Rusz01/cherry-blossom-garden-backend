import type { MenuItem } from "@/types/menu";
import type { DailySpecial, ResolvedSpecial, RestaurantDate, TodaysSpecials } from "@/types/specials";

/** "Today" is the restaurant's day in Nepal, not the visitor's. */
export const RESTAURANT_TIME_ZONE = "Asia/Kathmandu";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

/** The restaurant-local date for an instant, as "YYYY-MM-DD". */
export function restaurantDate(now: Date = new Date()): RestaurantDate {
    const parts = dateFormatter.formatToParts(now);
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";

    return `${part("year")}-${part("month")}-${part("day")}`;
}

/**
 * Join active specials with their menu items, in display order.
 * Specials whose menu item no longer exists are dropped.
 */
export function resolveSpecials(specials: DailySpecial[], items: MenuItem[]): ResolvedSpecial[] {
    const itemsById = new Map(items.map((item) => [item.id, item]));

    return specials
        .filter((special) => special.active)
        .flatMap((special) => {
            const item = itemsById.get(special.menuItemId);
            if (!item) return [];

            return [
                {
                    id: special.id,
                    menuItemId: item.id,
                    name: special.name ?? item.name,
                    description: special.description ?? item.description,
                    price: special.price ?? item.price,
                    currency: special.currency,
                    category: item.category,
                    dietary: item.dietary,
                    chefsChoice: Boolean(special.chefsChoice),
                    isNew: Boolean(special.isNew),
                    availableOn: special.availableOn ?? null,
                    order: special.order,
                },
            ];
        })
        .sort((a, b) => a.order - b.order);
}

/**
 * The specials to show on a restaurant-local date.
 * Specials scheduled for that date win and are "verified"; otherwise the
 * unscheduled (sample) specials are shown, unverified.
 */
export function specialsForDate(specials: ResolvedSpecial[], date: RestaurantDate): TodaysSpecials {
    const scheduled = specials.filter((special) => special.availableOn?.includes(date));
    if (scheduled.length) return { specials: scheduled, verified: true };

    return { specials: specials.filter((special) => special.availableOn === null), verified: false };
}
