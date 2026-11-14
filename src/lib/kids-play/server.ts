
import { cache } from "react";
import { draftMode, headers } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";
import { normalizeKidsPlay } from "./defaults";

export const getKidsPlayContent = cache(async () => {
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
          slug: "kids-play-page",
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
    slug: "kids-play-page",
    draft: canPreview,
    depth: 2,
    overrideAccess: true,
  });

  // Public visitors must never receive
  // unpublished page content.
  const visible =
    canPreview || result._status === "published"
      ? result
      : null;

  return normalizeKidsPlay(visible);
});
