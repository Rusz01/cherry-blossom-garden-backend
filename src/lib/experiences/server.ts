
import { draftMode, headers } from "next/headers";
import { cache } from "react";

import { getPayloadClient } from "@/lib/cms/payload";

import { normalizeExperienceContent } from "./normalize";
import {
  toGardenEvent,
  type GardenEvent,
} from "./events";

async function getEventPreviewUser() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  const payload = await getPayloadClient();

  const auth = await payload.auth({
    headers: await headers(),
  });

  if (
    !auth.user ||
    !auth.permissions?.collections?.events?.read
  ) {
    return null;
  }

  return auth.user;
}

export const getExperiencesContent = cache(async () => {
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
          slug: "experiences-page",
          user: auth.user,
          overrideAccess: false,
        });

        canPreview = true;
      } catch {
        canPreview = false;
      }
    }
  }

  const result = await payload.findGlobal({
    slug: "experiences-page",
    draft: canPreview,
    depth: 2,
    overrideAccess: true,
  });

  // The public must never receive unpublished global data.
  const visible =
    canPreview || result._status === "published"
      ? result
      : {};

  return normalizeExperienceContent(visible);
});

export const getUpcomingEvents = cache(
  async (): Promise<GardenEvent[]> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "events",
      where: {
        startsAt: {
          greater_than: new Date().toISOString(),
        },
      },
      sort: "startsAt",
      limit: 100,
      depth: 2,
      draft: false,
      overrideAccess: false,
    });

    return result.docs.map(toGardenEvent);
  },
);

export const getEventBySlug = cache(
  async (
    slug: string,
  ): Promise<GardenEvent | null> => {
    const payload = await getPayloadClient();
    const previewUser = await getEventPreviewUser();

    const result = await payload.find({
      collection: "events",
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
      draft: Boolean(previewUser),
      user: previewUser ?? undefined,
      overrideAccess: false,
    });

    const document = result.docs[0];

    return document
      ? toGardenEvent(document)
      : null;
  },
);
