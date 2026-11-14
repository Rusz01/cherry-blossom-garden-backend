
import { config as loadEnv } from "dotenv";
import type { GalleryPage } from "../src/payload-types";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

type GalleryPhotoRow =
  NonNullable<GalleryPage["photos"]>[number];

type GalleryRatio =
  NonNullable<GalleryPhotoRow["ratio"]>;

type GalleryPosition =
  NonNullable<GalleryPhotoRow["position"]>;

/**
 * Convert the original frontend ratio to a valid
 * Payload CMS select-field value.
 */
function normalizeRatio(value: string): GalleryRatio {
  switch (value) {
    case "4 / 5":
    case "3 / 4":
    case "5 / 4":
    case "3 / 2":
    case "1 / 1":
    case "2 / 3":
      return value;

    default:
      return "4 / 5";
  }
}

/**
 * Convert the original image position to a valid
 * Payload CMS select-field value.
 */
function normalizePosition(
  value: string | undefined,
): GalleryPosition {
  switch (value) {
    case "center":
    case "top":
    case "bottom":
    case "left":
    case "right":
      return value;

    default:
      return "center";
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.");
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing.");
  }

  const { default: config } = await import(
    "../src/payload.config"
    );

  const { getPayload } = await import("payload");

  const {
    categories,
    galleryPhotos,
  } = await import(
    "../src/components/frontend/gallery/galleryData"
    );

  const { GALLERY_DEFAULTS: D } = await import(
    "../src/lib/gallery/defaults"
    );

  const payload = await getPayload({ config });

  console.log("\nCherry Blossom Garden — Gallery Seed\n");

  // ====================================================
  // 1. SEED GALLERY CATEGORIES
  // ====================================================

  console.log("Seeding Gallery categories...");

  const categoryIds = new Map<string, number>();

  for (const [index, category] of categories
    .filter((item) => item.slug !== "all")
    .entries()) {
    const existing = await payload.find({
      collection: "gallery-categories",
      where: {
        slug: {
          equals: category.slug,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      categoryIds.set(
        category.slug,
        existing.docs[0].id,
      );

      console.log(`Exists: ${category.label}`);
      continue;
    }

    const created = await payload.create({
      collection: "gallery-categories",
      data: {
        name: category.label,
        slug: category.slug,
        sortOrder: index,
        active: true,
      },
      overrideAccess: true,
    });

    categoryIds.set(category.slug, created.id);

    console.log(`Created: ${category.label}`);
  }

  // ====================================================
  // 2. CHECK EXISTING GALLERY
  // ====================================================

  console.log("\nChecking Gallery Page...");

  const existingPage = await payload.findGlobal({
    slug: "gallery-page",
    draft: true,
    depth: 0,
    overrideAccess: true,
  });

  // Never overwrite an existing gallery with photos.
  if (
    Array.isArray(existingPage.photos) &&
    existingPage.photos.length > 0
  ) {
    console.log(
      "Gallery already contains photographs. Skipping page seed.",
    );
    return;
  }

  // ====================================================
  // 3. PREPARE DEFAULT PHOTOGRAPHS
  // ====================================================

  console.log("\nPreparing original photographs...");

  const preparedPhotos: NonNullable<
    GalleryPage["photos"]
  > = galleryPhotos.map((photo) => ({
    title: photo.title,
    description: photo.description,
    alt: photo.alt,
    fallbackSrc: photo.src,

    // These now match Payload's generated types.
    ratio: normalizeRatio(photo.ratio),
    position: normalizePosition(photo.position),

    visible: true,

    categories: photo.categories.map((slug) => {
      const id = categoryIds.get(slug);

      if (id === undefined) {
        throw new Error(
          `Missing Gallery category: ${slug}`,
        );
      }

      return id;
    }),
  }));

  // ====================================================
  // 4. PREPARE DEFAULT PAGE CONTENT
  // ====================================================

  const {
    imageFallback: _imageFallback,
    imageAlt: _imageAlt,
    ...hero
  } = D.hero;

  // ====================================================
  // 5. PUBLISH GALLERY
  // ====================================================

  await payload.updateGlobal({
    slug: "gallery-page",
    data: {
      hero,
      collection: D.collection,
      closing: D.closing,
      seo: D.seo,
      photos: preparedPhotos,
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
  });

  console.log("\nGallery seeded successfully.");
  console.log(
    `Imported ${preparedPhotos.length} photographs.`,
  );
  console.log("Gallery Page published.");
}

main().catch((error) => {
  console.error("Gallery seed failed:", error);
  process.exitCode = 1;
});
