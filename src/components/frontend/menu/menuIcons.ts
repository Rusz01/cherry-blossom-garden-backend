import {
    CakeSlice,
    Coffee,
    Croissant,
    CupSoda,
    Flame,
    Flower2,
    HandPlatter,
    Leaf,
    Salad,
    Soup,
    Sparkles,
    Sprout,
    UtensilsCrossed,
    WheatOff,
    type LucideIcon,
} from "lucide-react";

import type { DietFilter, MenuCategoryId, MenuView } from "@/types/menu";

export const categoryIcons: Record<MenuCategoryId, LucideIcon> = {
    coffee: Coffee,
    breakfast: Croissant,
    "small-plates": Salad,
    mains: UtensilsCrossed,
    "noodles-rice": Soup,
    "grill-bbq": Flame,
    sharing: HandPlatter,
    desserts: CakeSlice,
    drinks: CupSoda,
};

export function viewIcon(view: MenuView): LucideIcon {
    if (view === "all") return Flower2;
    if (view === "signature") return Sparkles;
    return categoryIcons[view];
}

export const dietFilters: { id: DietFilter; label: string; icon: LucideIcon }[] = [
    { id: "all", label: "All", icon: Flower2 },
    { id: "vegetarian", label: "Vegetarian", icon: Leaf },
    { id: "vegan", label: "Vegan", icon: Sprout },
    { id: "gluten-free", label: "Gluten Free", icon: WheatOff },
    { id: "spicy", label: "Spicy", icon: Flame },
];
