
export type MenuCategoryId = string;

export type MenuCategory = {
  id: string;
  cmsId?: string;
  label: string;
  description: string;
};

export type MenuDietaryTag = {
  id: string;
  cmsId?: string;
  label: string;
};

export type DietaryInfo = {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  containsGluten?: boolean;
};

export type CurrencyCode = "NPR";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategoryId;
  ingredients: string[];
  dietary: DietaryInfo;
  dietaryTags?: MenuDietaryTag[];
  image?: unknown;
  popularity: number;
  signature?: boolean;
};

export type MenuView = string;
export type DietFilter = string;

export type MenuSortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";
