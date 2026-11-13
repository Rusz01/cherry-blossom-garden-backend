
import type { Metadata } from "next";
import { draftMode, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import MenuCMSClient from "@/components/frontend/menu/MenuCMSClient";

import {
  type CmsRecord,
  toCategories,
  toDietaryTags,
  toMenuItem,
  toSpecials,
} from "@/lib/frontend/menu-cms";

import { withMenuCopy } from "@/lib/frontend/menu-copy";
import { getAppURL } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu | Cherry Blossom Garden",
  description:
    "Discover the food and drinks at Cherry Blossom Garden.",
};

type Params = {
  previewType?: string;
  previewId?: string;
};

export default async function MenuPage({
                                         searchParams,
                                       }: {
  searchParams: Promise<Params>;
}) {
  const payload = await getPayload({ config });
  const params = await searchParams;

  const { isEnabled } = await draftMode();


  let previewUser = null;
  let canPreview = false;

  if (isEnabled) {
    const auth = await payload.auth({
      headers: await headers(),
    });

    if (auth.user) {
      try {
        await payload.findGlobal({
          slug: "menu-settings",
          user: auth.user,
          overrideAccess: false,
        });

        previewUser = auth.user;
        canPreview = true;
      } catch {
        canPreview = false;
      }
    }
  }


  const common = {
    depth: 2 as const,
    overrideAccess: false as const,
    user: previewUser ?? undefined,
    pagination: false as const,
  };

  const [
    categoryResult,
    tagResult,
    itemResult,
    specialResult,
    settings,
  ] = await Promise.all([
    payload.find({
      collection: "menu-categories",
      ...common,
      sort: "sortOrder",
    }),
    payload.find({
      collection: "dietary-tags",
      ...common,
      sort: "sortOrder",
    }),
    payload.find({
      collection: "menu-items",
      ...common,
      draft: canPreview,
      sort: "name",
    }),
    payload.find({
      collection: "special-menus",
      ...common,
      draft: canPreview,
      sort: "-updatedAt",
    }),
    payload.findGlobal({
      slug: "menu-settings",
      depth: 2,
      draft: canPreview,
      overrideAccess: true,
    }),
  ]);


  const categories = toCategories(
    categoryResult.docs as unknown as CmsRecord[],
  );

  const tags = toDietaryTags(
    tagResult.docs as unknown as CmsRecord[],
  );

  const items = (
    itemResult.docs as unknown as CmsRecord[]
  )
    .map((doc) => toMenuItem(doc, categories, tags))
    .filter((item) => item !== null);

  const specials = toSpecials(
    specialResult.docs as unknown as CmsRecord[],
    items,
    tags,
  );


  let preview:
    | { type: "settings" | "item" | "special"; doc: CmsRecord }
    | null = null;

  if (canPreview && params.previewType === "settings") {
    preview = {
      type: "settings",
      doc: settings as unknown as CmsRecord,
    };
  }

  if (
    canPreview &&
    params.previewId &&
    ["item", "special"].includes(params.previewType ?? "")
  ) {
    const type = params.previewType as "item" | "special";

    try {
      const doc = await payload.findByID({
        collection:
          type === "item" ? "menu-items" : "special-menus",
        id: /^\d+$/.test(params.previewId)
          ? Number(params.previewId)
          : params.previewId,
        depth: 2,
        draft: true,
        user: previewUser ?? undefined,
        overrideAccess: false,
      });

      preview = {
        type,
        doc: doc as unknown as CmsRecord,
      };
    } catch {
      preview = null;
    }
  }

  return (
    <MenuCMSClient
      copy={withMenuCopy(settings)}
      categories={categories}
      tags={tags}
      items={items}
      specials={specials}
      serverURL={getAppURL()}
      preview={preview}
    />
  );
}
