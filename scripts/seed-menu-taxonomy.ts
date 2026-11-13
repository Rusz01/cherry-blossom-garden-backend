
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { getPayload } from "payload";

import { menuCategories } from "../src/data/menu";

async function main() {
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });

  const dietaryTags = [
    { name: "Vegetarian", slug: "vegetarian" },
    { name: "Vegan", slug: "vegan" },
    { name: "Gluten Free", slug: "gluten-free" },
    { name: "Spicy", slug: "spicy" },
    { name: "Contains Gluten", slug: "contains-gluten" },
  ];

  for (const [index, category] of menuCategories.entries()) {
    const existing = await payload.find({
      collection: "menu-categories",
      where: {
        slug: { equals: category.id },
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) continue;

    await payload.create({
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

    console.log(`Created category: ${category.label}`);
  }

  for (const [index, tag] of dietaryTags.entries()) {
    const existing = await payload.find({
      collection: "dietary-tags",
      where: {
        slug: { equals: tag.slug },
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) continue;

    await payload.create({
      collection: "dietary-tags",
      data: {
        name: tag.name,
        slug: tag.slug,
        sortOrder: index,
        active: true,
      },
      overrideAccess: true,
    });

    console.log(`Created dietary tag: ${tag.name}`);
  }

  console.log("Menu taxonomies ready.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
