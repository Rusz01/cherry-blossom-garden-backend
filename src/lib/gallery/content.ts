
import {
  categories as originalCategories,
  galleryPhotos as originalPhotos,
  type GalleryPhoto,
} from "@/components/frontend/gallery/galleryData";

import { GALLERY_DEFAULTS as D } from "./defaults";

export type GalleryCategory = {
  id?: string | number;
  slug: string;
  label: string;
};

type MediaObject = {
  url?: string | null;
  alt?: string | null;
  sizes?: Record<
    string,
    { url?: string | null } | null | undefined
  >;
};

export type RawGalleryPhoto = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  alt?: string | null;
  image?: MediaObject | number | string | null;
  fallbackSrc?: string | null;
  categories?: unknown[] | null;
  ratio?: string | null;
  position?: string | null;
  visible?: boolean | null;
};

export type RawGallery = {
  seo?: Record<string, unknown> | null;
  hero?: Record<string, unknown> | null;
  collection?: Record<string, unknown> | null;
  closing?: Record<string, unknown> | null;
  photos?: RawGalleryPhoto[] | null;
  _status?: string | null;
};

export type GalleryContent = {
  seo: typeof D.seo;
  hero: typeof D.hero & {
    imageSrc: string;
    imageAlt: string;
  };
  collection: typeof D.collection;
  closing: typeof D.closing;
  categories: GalleryCategory[];
  photos: GalleryPhoto[];
};

function mergeText<T extends Record<string, string>>(
  defaults: T,
  value: unknown,
): T {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const result = { ...defaults };

  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const candidate = source[key as string];

    if (typeof candidate === "string") {
      result[key] = candidate as T[typeof key];
    }
  }

  return result;
}

function resolveMedia(
  value: unknown,
  size: "card" | "feature",
): { src: string; alt: string } | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const media = value as MediaObject;

  const src =
    media.sizes?.[size]?.url ||
    media.url ||
    null;

  if (!src) return null;

  return {
    src,
    alt: media.alt || "",
  };
}

export function normalizeGallery(
  raw: RawGallery | null | undefined,
  databaseCategories: GalleryCategory[],
): GalleryContent {
  const value = raw ?? {};

  const seo = mergeText(D.seo, value.seo);
  const collection = mergeText(
    D.collection,
    value.collection,
  );
  const closing = mergeText(D.closing, value.closing);

  const heroCopy = mergeText(D.hero, value.hero);
  const heroMedia = resolveMedia(
    value.hero?.image,
    "feature",
  );

  const hero = {
    ...heroCopy,
    imageSrc: heroMedia?.src || D.hero.imageFallback,
    imageAlt: heroMedia?.alt || D.hero.imageAlt,
  };

  const defaults: GalleryCategory[] = originalCategories
    .filter((category) => category.slug !== "all")
    .map((category) => ({
      slug: category.slug,
      label: category.label,
    }));

  const availableCategories: GalleryCategory[] =
    databaseCategories.length > 0
      ? databaseCategories
      : defaults;

  const categories: GalleryCategory[] = [
    {
      slug: "all",
      label: "All",
    },
    ...availableCategories,
  ];

  const slugById = new Map(
    availableCategories
      .filter((category) => category.id != null)
      .map((category) => [
        String(category.id),
        category.slug,
      ]),
  );

  function resolveCategorySlug(
    relationship: unknown,
  ): string | null {
    if (
      typeof relationship === "number" ||
      typeof relationship === "string"
    ) {
      return (
        slugById.get(String(relationship)) ?? null
      );
    }

    if (
      relationship &&
      typeof relationship === "object"
    ) {
      const record = relationship as {
        id?: number | string;
        slug?: string;
      };

      if (typeof record.slug === "string") {
        return record.slug;
      }

      if (record.id != null) {
        return (
          slugById.get(String(record.id)) ?? null
        );
      }
    }

    return null;
  }

  // Only use the original hard-coded photographs
  // when the CMS array has never been initialized.
  const photos: GalleryPhoto[] = Array.isArray(
    value.photos,
  )
    ? value.photos
      .filter((row) => row.visible !== false)
      .map((row, index) => {
        const media = resolveMedia(
          row.image,
          "card",
        );

        const src =
          media?.src || row.fallbackSrc || "";

        const photoCategories = Array.isArray(
          row.categories,
        )
          ? row.categories
            .map(resolveCategorySlug)
            .filter(
              (slug): slug is string =>
                Boolean(slug),
            )
          : [];

        return {
          id: row.id || `gallery-photo-${index}`,
          src,
          alt:
            row.alt ||
            media?.alt ||
            row.title ||
            "Gallery photograph",
          title: row.title || "Untitled Photograph",
          description: row.description || "",
          categories: photoCategories,
          ratio: row.ratio || "4 / 5",
          position: row.position || "center",
        };
      })
      .filter((photo) => Boolean(photo.src))
    : [...originalPhotos];

  return {
    seo,
    hero,
    collection,
    closing,
    categories,
    photos,
  };
}
