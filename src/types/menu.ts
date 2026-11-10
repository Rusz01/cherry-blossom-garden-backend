export type MenuCategoryId =
    | "coffee"
    | "breakfast"
    | "small-plates"
    | "mains"
    | "noodles-rice"
    | "grill-bbq"
    | "sharing"
    | "desserts"
    | "drinks";

export type MenuCategory = {
    id: MenuCategoryId;
    label: string;
    /** One line shown under the heading when the category is selected. */
    description: string;
};

/** Dietary properties. Vegan items also count as vegetarian when filtering. */
export type DietaryInfo = {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
    /** Shown as an informational "Contains Gluten" badge. */
    containsGluten?: boolean;
};

/** ISO 4217 code. The sample menu is priced in pounds; add codes as needed. */
export type CurrencyCode = "GBP";

export type MenuItem = {
    id: string;
    name: string;
    description: string;
    /** Price in GBP (pounds, not pence). */
    price: number;
    category: MenuCategoryId;
    /** Searchable ingredient list. */
    ingredients: string[];
    dietary: DietaryInfo;
    /** 0–100. Drives "Popular" sorting and the Popular badge. */
    popularity: number;
    /** Featured in "Signature Flavours". */
    signature?: boolean;
};

/* ---------- View state ---------- */

/** What the menu shows: everything, signature dishes, or one category. */
export type MenuView = "all" | "signature" | MenuCategoryId;

export type DietFilter = "all" | "vegetarian" | "vegan" | "gluten-free" | "spicy";

export type MenuSortKey = "popular" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
