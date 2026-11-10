import type {
    CurrencyCode,
    DietFilter,
    MenuCategory,
    MenuCategoryId,
    MenuItem,
    MenuSortKey,
    MenuView,
} from "@/types/menu";

/** Items shown per page. */
export const MENU_PAGE_SIZE = 18;

/** Popularity score at or above which an item shows the "Popular" badge. */
export const POPULAR_THRESHOLD = 85;

export const isPopular = (item: MenuItem) => item.popularity >= POPULAR_THRESHOLD;

const priceFormatters = new Map<CurrencyCode, Intl.NumberFormat>();

export function formatPrice(price: number, currency: CurrencyCode = "GBP") {
    let formatter = priceFormatters.get(currency);
    if (!formatter) {
        formatter = new Intl.NumberFormat("en-GB", { style: "currency", currency });
        priceFormatters.set(currency, formatter);
    }

    return formatter.format(price);
}

/** Lower-case and strip accents so "creme" finds "Crème". */
export function normalise(text: string) {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function matchesDiet(item: MenuItem, diet: DietFilter) {
    const d = item.dietary;

    switch (diet) {
        case "vegetarian":
            return Boolean(d.vegetarian || d.vegan);
        case "vegan":
            return Boolean(d.vegan);
        case "gluten-free":
            return Boolean(d.glutenFree);
        case "spicy":
            return Boolean(d.spicy);
        default:
            return true;
    }
}

/** Search across name, description, category and ingredients. */
export function matchesQuery(item: MenuItem, query: string, categoryLabel: string) {
    if (!query) return true;

    const haystack = normalise(
        [item.name, item.description, categoryLabel, ...item.ingredients].join(" ")
    );

    // Every word must appear somewhere, in any order.
    return query.split(/\s+/).every((word) => haystack.includes(word));
}

export function matchesView(item: MenuItem, view: MenuView) {
    if (view === "all") return true;
    if (view === "signature") return Boolean(item.signature);
    return item.category === view;
}

const compareName = (a: MenuItem, b: MenuItem) => a.name.localeCompare(b.name, "en-GB");

export function compareItems(sort: MenuSortKey) {
    return (a: MenuItem, b: MenuItem) => {
        switch (sort) {
            case "price-asc":
                return a.price - b.price || compareName(a, b);
            case "price-desc":
                return b.price - a.price || compareName(a, b);
            case "name-asc":
                return compareName(a, b);
            case "name-desc":
                return compareName(b, a);
            default:
                return b.popularity - a.popularity || compareName(a, b);
        }
    };
}

export type MenuSection = {
    category: MenuCategory;
    items: MenuItem[];
    /** Matching items in this category across all pages. */
    total: number;
};

export type MenuResult = {
    /** Items matching search + diet, before the view (used for counts). */
    matching: MenuItem[];
    /** Items in display order for the current view. */
    ordered: MenuItem[];
    /** Sections for the current page, in category order. */
    sections: MenuSection[];
    counts: Record<MenuCategoryId, number> & { all: number; signature: number };
    page: number;
    pageCount: number;
};

/**
 * One pass from raw data to what the page renders.
 * Order: search + diet → counts → view → category order + sort → page → group.
 * Grouping keeps menu sections together (category order) while the chosen
 * sort applies within each section; pagination then cuts the flat list.
 */
export function buildMenu(
    items: MenuItem[],
    categories: MenuCategory[],
    options: { query: string; diet: DietFilter; view: MenuView; sort: MenuSortKey; page: number; pageSize?: number }
): MenuResult {
    const pageSize = options.pageSize ?? MENU_PAGE_SIZE;
    const query = normalise(options.query);
    const labels = new Map(categories.map((c) => [c.id, c.label]));
    const order = new Map(categories.map((c, index) => [c.id, index]));

    const matching = items.filter(
        (item) =>
            matchesDiet(item, options.diet) &&
            matchesQuery(item, query, labels.get(item.category) ?? "")
    );

    const counts = Object.fromEntries(categories.map((c) => [c.id, 0])) as MenuResult["counts"];
    counts.all = matching.length;
    counts.signature = 0;
    for (const item of matching) {
        counts[item.category] = (counts[item.category] ?? 0) + 1;
        if (item.signature) counts.signature += 1;
    }

    const byItem = compareItems(options.sort);
    const ordered = matching
        .filter((item) => matchesView(item, options.view))
        .sort((a, b) => (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0) || byItem(a, b));

    const pageCount = Math.max(1, Math.ceil(ordered.length / pageSize));
    const page = Math.min(Math.max(1, options.page), pageCount);
    const pageItems = ordered.slice((page - 1) * pageSize, page * pageSize);

    const sections: MenuSection[] = [];
    for (const item of pageItems) {
        const last = sections[sections.length - 1];
        if (last && last.category.id === item.category) {
            last.items.push(item);
        } else {
            const category = categories.find((c) => c.id === item.category);
            if (!category) continue;
            const total = options.view === "signature"
                ? ordered.filter((i) => i.category === category.id).length
                : counts[category.id];
            sections.push({ category, items: [item], total });
        }
    }

    return { matching, ordered, sections, counts, page, pageCount };
}

/**
 * Page numbers with ellipses, e.g. [1, 2, 3, 4, 5, "…", 9] or
 * [1, "…", 4, 5, 6, "…", 9]. Always shows first, last and neighbours.
 */
export function pageRange(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
    if (current >= total - 3) return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];

    return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}
