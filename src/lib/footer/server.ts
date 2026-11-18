
import { cache } from "react";
import { draftMode, headers } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";
import type { RawFooter } from "./content";

export const getFooterContent = cache(
  async (): Promise<RawFooter> => {
    const payload = await getPayloadClient();

    const { isEnabled } = await draftMode();

    let canPreview = false;

    if (isEnabled) {
      const auth = await payload.auth({
        headers: await headers(),
      });

      if (auth.user) {
        try {
          // Check the editor's Footer read permission.
          await payload.findGlobal({
            slug: "footer",
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

    const result = await payload.findGlobal({
      slug: "footer",
      draft: canPreview,
      depth: 2,
      overrideAccess: true,
    });

    // Never expose unpublished footer content
    // to a public visitor.
    const visible =
      canPreview || result._status === "published"
        ? result
        : {};

    return visible as RawFooter;
  },
);
