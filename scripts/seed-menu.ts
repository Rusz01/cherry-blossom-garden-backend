
import { config as loadEnv } from "dotenv";

// Load environment variables before importing Payload.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { getPayload } from "payload";
import { menuCategories, menuItems } from "../src/data/menu";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "This seed is for development data. Production seeding is disabled.",
    );
  }

  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });

  console.log("\n🌸 Cherry Blossom Garden — Menu Seed\n");

  const categoryMap = new Map<string, number>();
  const dietaryMap = new Map<string, number>();

  let createdCategories = 0;
  let createdTags = 0;
  let createdItems = 0;
  let skippedItems = 0;

  // ==========================================================
  // 1. MENU CATEGORIES
  // ==========================================================

  console.log("📂 Seeding menu categories...");

  for (const [index, category] of menuCategories.entries()) {
    const existing = await payload.find({
      collection: "menu-categories",
      where: {
        slug: { equals: category.id },
      },
      limit: 1,
      overrideAccess: true,
    });

    let categoryId: number;

    if (existing.docs.length > 0) {
      categoryId = existing.docs[0].id;
      console.log(`  ↷ Exists: ${category.label}`);
    } else {
      const created = await payload.create({
        collection: "menu-categories",
        data: {
          name: category.label,
          slug: category.id,
          description: category.description,
          sortOrder: index,
          active: true,
        },
        overrideAccess: true,
      });

      categoryId = created.id;
      createdCategories++;

      console.log(`  ✓ Created: ${category.label}`);
    }

    categoryMap.set(category.id, categoryId);
  }

  // ==========================================================
  // 2. DIETARY TAGS
  // ==========================================================

  console.log("\n🌱 Seeding dietary tags...");

  const dietaryDefaults = [
    { name: "Vegetarian", slug: "vegetarian" },
    { name: "Vegan", slug: "vegan" },
    { name: "Gluten Free", slug: "gluten-free" },
    { name: "Spicy", slug: "spicy" },
    { name: "Contains Gluten", slug: "contains-gluten" },
  ];

  for (const [index, tag] of dietaryDefaults.entries()) {
    const existing = await payload.find({
      collection: "dietary-tags",
      where: {
        slug: { equals: tag.slug },
      },
      limit: 1,
      overrideAccess: true,
    });

    let tagId: number;

    if (existing.docs.length > 0) {
      tagId = existing.docs[0].id;
      console.log(`  ↷ Exists: ${tag.name}`);
    } else {
      const created = await payload.create({
        collection: "dietary-tags",
        data: {
          name: tag.name,
          slug: tag.slug,
          sortOrder: index,
          active: true,
        },
        overrideAccess: true,
      });

      tagId = created.id;
      createdTags++;

      console.log(`  ✓ Created: ${tag.name}`);
    }

    dietaryMap.set(tag.slug, tagId);
  }

  // ==========================================================
  // 3. FOOD AND DRINK ITEMS
  // ==========================================================

  console.log("\n🍽️ Seeding food and drinks...");

  const dietaryFields = {
    vegetarian: "vegetarian",
    vegan: "vegan",
    glutenFree: "gluten-free",
    spicy: "spicy",
    containsGluten: "contains-gluten",
  } as const;

  for (const item of menuItems) {
    const categoryId = categoryMap.get(item.category);

    if (categoryId === undefined) {
      throw new Error(
        `Category "${item.category}" not found for "${item.name}".`,
      );
    }

    // Match using both category and name to avoid duplicates.
    const existing = await payload.find({
      collection: "menu-items",
      where: {
        and: [
          { name: { equals: item.name } },
          { category: { equals: categoryId } },
        ],
      },
      depth: 0,
      draft: true,
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      console.log(`  ↷ Exists: ${item.name}`);
      skippedItems++;
      continue;
    }

    // Convert existing dietary flags into CMS relationship IDs.
    const selectedDietaryIds: number[] = [];

    for (const [field, slug] of Object.entries(dietaryFields)) {
      const enabled =
        item.dietary[field as keyof typeof item.dietary] === true;

      if (enabled) {
        const tagId = dietaryMap.get(slug);

        if (tagId === undefined) {
          throw new Error(`Dietary tag "${slug}" missing.`);
        }

        selectedDietaryIds.push(tagId);
      }
    }

    await payload.create({
      collection: "menu-items",
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: categoryId,
        dietaryTags: selectedDietaryIds,
        ingredients: item.ingredients.map((ingredient) => ({
          name: ingredient,
        })),
        popularity: item.popularity,
        signature: item.signature ?? false,
        isAvailable: true,
        _status: "published",
      },
      overrideAccess: true,
    });

    console.log(`  ✓ Created: ${item.name}`);
    createdItems++;
  }

  // ==========================================================
  // 4. SUMMARY
  // ==========================================================

  console.log("\n==================================");
  console.log("🌸 MENU SEED COMPLETE");
  console.log("==================================");
  console.log(`Categories created : ${createdCategories}`);
  console.log(`Dietary tags created: ${createdTags}`);
  console.log(`Menu items created : ${createdItems}`);
  console.log(`Menu items skipped : ${skippedItems}`);
  console.log(`Source menu items  : ${menuItems.length}`);
  console.log("==================================\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Menu seed failed:");
  console.error(error);
  process.exit(1);
});
