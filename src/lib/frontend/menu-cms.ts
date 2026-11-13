
import type {
  DietaryInfo,
  MenuCategory,
  MenuDietaryTag,
  MenuItem,
} from "@/types/menu";
import type { ResolvedSpecial } from "@/types/specials";

export type CmsRecord = Record<string, unknown>;

const record = (value: unknown): CmsRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as CmsRecord)
    : {};

const array = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const str = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;

export function relatedId(value: unknown): string {
  const obj = record(value);
  const id = obj.id ?? value;
  return typeof id === "string" || typeof id === "number"
    ? String(id)
    : "";
}

export function toCategories(docs: CmsRecord[]): MenuCategory[] {
  return docs
    .filter((doc) => doc.active !== false)
    .map((doc) => ({
      id: str(doc.slug),
      cmsId: relatedId(doc),
      label: str(doc.name),
      description: str(doc.description),
    }))
    .filter((category) => category.id && category.label);
}

export function toDietaryTags(docs: CmsRecord[]): MenuDietaryTag[] {
  return docs
    .filter((doc) => doc.active !== false)
    .map((doc) => ({
      id: str(doc.slug),
      cmsId: relatedId(doc),
      label: str(doc.name),
    }))
    .filter((tag) => tag.id && tag.label);
}

function findTags(
  values: unknown,
  tags: MenuDietaryTag[],
): MenuDietaryTag[] {
  return array(values).flatMap((value) => {
    const obj = record(value);
    const id = relatedId(value);

    const match = tags.find(
      (tag) =>
        tag.cmsId === id ||
        tag.id === id ||
        tag.id === obj.slug,
    );

    return match ? [match] : [];
  });
}

export function dietaryFlags(
  tags: MenuDietaryTag[],
): DietaryInfo {
  const names = new Set(tags.map((tag) => tag.id));

  return {
    vegetarian: names.has("vegetarian") || names.has("vegan"),
    vegan: names.has("vegan"),
    glutenFree: names.has("gluten-free"),
    spicy: names.has("spicy"),
    containsGluten: names.has("contains-gluten"),
  };
}

export function toMenuItem(
  doc: CmsRecord,
  categories: MenuCategory[],
  tags: MenuDietaryTag[],
  includeUnavailable = false,
): MenuItem | null {
  if (!includeUnavailable && doc.isAvailable === false) {
    return null;
  }

  const categoryRef = record(doc.category);
  const categoryId = relatedId(doc.category);

  const category = categories.find(
    (item) =>
      item.cmsId === categoryId ||
      item.id === categoryRef.slug,
  );

  if (!category) return null;

  const dietaryTags = findTags(doc.dietaryTags, tags);

  return {
    id: relatedId(doc),
    name: str(doc.name),
    description: str(doc.description),
    price: num(doc.price),
    category: category.id,
    ingredients: array(doc.ingredients)
      .map((item) => str(record(item).name))
      .filter(Boolean),
    dietaryTags,
    dietary: dietaryFlags(dietaryTags),
    image: doc.image,
    popularity: num(doc.popularity, 50),
    signature: doc.signature === true,
  };
}

export function toSpecials(
  docs: CmsRecord[],
  items: MenuItem[],
  tags: MenuDietaryTag[],
  forcePreview = false,
): ResolvedSpecial[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const result: ResolvedSpecial[] = [];

  docs.forEach((doc, documentIndex) => {
    if (!forcePreview && doc.enabled !== true) return;

    // Payload's dayOnly picker stores ISO dates.
    // Taking the date part avoids converting it to the visitor's timezone.
    const dates = array(doc.showDates)
      .map((row) => str(record(row).day).slice(0, 10))
      .filter(Boolean);

    array(doc.items).forEach((rawEntry, entryIndex) => {
      const entry = record(rawEntry);
      const existing = entry.source !== "custom";

      const item = existing
        ? byId.get(relatedId(entry.menuItem))
        : undefined;

      if (existing && !item) return;

      const dietaryTags = existing
        ? item?.dietaryTags ?? []
        : findTags(entry.customDietaryTags, tags);

      const name = existing
        ? str(entry.overrideName) || item?.name || ""
        : str(entry.customName);

      const description = existing
        ? str(entry.overrideDescription) || item?.description || ""
        : str(entry.customDescription);

      const price = existing
        ? num(entry.overridePrice, item?.price ?? 0)
        : num(entry.customPrice);

      if (!name) return;

      result.push({
        id: `${relatedId(doc)}-${entryIndex}`,
        menuItemId: item?.id ?? `custom-${relatedId(doc)}-${entryIndex}`,
        name,
        description,
        price,
        currency: "NPR",
        category: item?.category ?? "special",
        dietary: item?.dietary ?? dietaryFlags(dietaryTags),
        dietaryTags,
        chefsChoice: entry.chefsChoice === true,
        isNew: entry.isNew === true,
        availableOn: forcePreview ? null : dates,
        order: documentIndex * 1000 + entryIndex,
      });
    });
  });

  return result;
}
