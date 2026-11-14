
import { cache } from "react";
import { draftMode, headers } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";

import type {
  GalleryCategory,
  RawGallery,
} from "./content";

export const getGalleryPageData = cache(async () => {
  const payload = await getPayloadClient();

  const { isEnabled } = await draftMode();

  let canPreview = false;

  if (isEnabled) {
    const auth = await payload.auth({
      headers: await headers(),
    });

    if (auth.user) {
      try {
        await payload.findGlobal({
          slug: "gallery-page",
          user: auth.user,
          overrideAccess: false,
          depth: 0,
        });

        canPreview = true;
      } catch {
        canPreview = false;
      }
    }
  }

  const [global, categoryResult] = await Promise.all([
    payload.findGlobal({
      slug: "gallery-page",
      draft: canPreview,
      depth: 2,
      overrideAccess: true,
    }),

    payload.find({
      collection: "gallery-categories",
      where: {
        active: {
          equals: true,
        },
      },
      sort: "sortOrder",
      limit: 200,
      depth: 0,
      overrideAccess: false,
    }),
  ]);

  const raw: RawGallery =
    canPreview || global._status === "published"
      ? (global as unknown as RawGallery)
      : {};

  // Convert Payload categories into frontend categories.
  // Ignore categories without a valid slug.
  const categories: GalleryCategory[] =
    categoryResult.docs.flatMap((category) => {
      const slug = category.slug?.trim();

      if (!slug) {
        return [];
      }

      return [
        {
          id: category.id,
          slug,
          label: category.name,
        },
      ];
    });

  return {
    raw,
    categories,
  };
});
