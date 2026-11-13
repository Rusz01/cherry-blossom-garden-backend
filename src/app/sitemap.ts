
import type { MetadataRoute } from "next";

import { getPayloadClient } from
    "@/lib/cms/payload";

import { pagePath } from
    "@/lib/cms/paths";

import { getSiteOrigin } from
    "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayloadClient();

    const seo = await payload.findGlobal({
      slug: "seo-settings",
      depth: 0,
      overrideAccess: false,
    });

    if (!seo.allowIndexing) {
      return [];
    }

    const origin = getSiteOrigin(seo);

    const [pages, explorePages] =
      await Promise.all([
        payload.find({
          collection: "pages",
          overrideAccess: false,
          draft: false,
          limit: 1000,
          depth: 0,
          where: {
            "meta.noIndex": {
              not_equals: true,
            },
          },
          select: {
            slug: true,
            updatedAt: true,
          },
        }),

        payload.find({
          collection: "explore-pages",
          overrideAccess: false,
          draft: false,
          limit: 100,
          depth: 0,
          select: {
            slug: true,
            updatedAt: true,
          },
        }),
      ]);

    return [
      ...pages.docs.map((page) => ({
        url: `${origin}${pagePath(page.slug)}`,
        lastModified: page.updatedAt,
      })),

      ...explorePages.docs.map((page) => ({
        url: `${origin}/explore/${page.slug}`,
        lastModified: page.updatedAt,
      })),
    ];
  } catch {
    return [];
  }
}
