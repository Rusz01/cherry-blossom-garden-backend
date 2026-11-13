
import { cache } from "react";
import { draftMode, headers } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";

import {
  EXPLORE_DEFAULTS,
  FLOOR_KEYS,
  isFloorKey,
  withExploreDefaults,
  type ExploreContent,
  type FloorKey,
} from "./defaults";

export type ExploreNavItem = {
  floor: FloorKey;
  number: string;
  label: string;
  description: string;
  href: string;
  homeEyebrow: string;
  homeTitle: string;
  homeShortTitle: string;
  homeDescription: string;
};

export const getExplorePageBySlug = cache(
  async (
    slug: string,
  ): Promise<ExploreContent | null> => {
    const payload = await getPayloadClient();

    const { isEnabled } = await draftMode();

    let previewUser = null;
    let canPreview = false;

    if (isEnabled) {
      const auth = await payload.auth({
        headers: await headers(),
      });

      canPreview = Boolean(
        auth.user &&
        auth.permissions?.collections?.[
          "explore-pages"
          ]?.read,
      );

      if (canPreview) {
        previewUser = auth.user;
      }
    }

    const result = await payload.find({
      collection: "explore-pages",
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: canPreview,
      user: previewUser ?? undefined,
      overrideAccess: false,
      depth: 2,
      limit: 1,
    });

    const document = result.docs[0];

    if (document && isFloorKey(document.floor)) {
      return withExploreDefaults(
        document.floor,
        document as Partial<ExploreContent>,
      );
    }

    // Original URLs retain their default design
    // until a published CMS record replaces them.
    const defaultFloor = FLOOR_KEYS.find(
      (key) => EXPLORE_DEFAULTS[key].slug === slug,
    );

    if (!defaultFloor) {
      return null;
    }

    // Do not keep serving an old default URL once
    // a page has been published under a new slug.
    const published = await payload.find({
      collection: "explore-pages",
      where: {
        floor: {
          equals: defaultFloor,
        },
      },
      draft: false,
      overrideAccess: false,
      depth: 0,
      limit: 1,
    });

    if (published.docs.length > 0) {
      return null;
    }

    return EXPLORE_DEFAULTS[defaultFloor];
  },
);

export const getExploreNavigation = cache(
  async (): Promise<ExploreNavItem[]> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "explore-pages",
      draft: false,
      overrideAccess: false,
      depth: 0,
      limit: 10,
    });

    return FLOOR_KEYS.map((floor, index) => {
      const document = result.docs.find(
        (item) => item.floor === floor,
      );

      const content = withExploreDefaults(
        floor,
        document as
          | Partial<ExploreContent>
          | undefined,
      );

      return {
        floor,
        number: String(index + 1).padStart(2, "0"),

        label: content.menuLabel,
        description: content.menuDescription,

        href: `/explore/${content.slug}`,

        homeEyebrow: content.homeEyebrow,
        homeTitle: content.homeTitle,
        homeShortTitle: content.homeShortTitle,
        homeDescription: content.homeDescription,
      };
    });
  },
);
