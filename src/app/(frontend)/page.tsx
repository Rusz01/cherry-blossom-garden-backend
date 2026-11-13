
import { draftMode, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import HeroSection from "@/components/frontend/homePage/heroSection";
import OurStory from "@/components/frontend/homePage/ourStory";
import ThreeLevels from "@/components/frontend/homePage/threeLevels";
import WaysWeElevate from "@/components/frontend/homePage/waysWeElevate";
import TasteOfGarden from "@/components/frontend/homePage/tasteOfGarden";
import KidsPlayArea from "@/components/frontend/homePage/kidsPlayArea";
import GallerySection from "@/components/frontend/homePage/gallerySection";
import CTASection from "@/components/frontend/homePage/ctaSection";

import HomeContentProvider from "@/components/frontend/homePage/HomeContentProvider";

import {
  DEFAULT_HOMEPAGE,
  withDefaults,
} from "@/lib/homepage/defaults";

import { getAppURL } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await getPayload({ config });
  const { isEnabled } = await draftMode();

  let canPreview = false;
  let previewUser = null;

  if (isEnabled) {
    const auth = await payload.auth({
      headers: await headers(),
    });

    if (auth.user) {
      try {
        // Respect the editor's Homepage read permission.
        await payload.findGlobal({
          slug: "homepage",
          user: auth.user,
          overrideAccess: false,
        });

        canPreview = true;
        previewUser = auth.user;
      } catch {
        canPreview = false;
      }
    }
  }

  const home = await payload.findGlobal({
    slug: "homepage",
    draft: canPreview,
    depth: 2,
    overrideAccess: true,
  });

  // Never render an unpublished global to public visitors.
  const visibleContent =
    canPreview || home._status === "published"
      ? home
      : {};

  const content = withDefaults(
    DEFAULT_HOMEPAGE,
    visibleContent,
  );

  return (
    <HomeContentProvider
      initialData={content}
      serverURL={getAppURL()}
    >
      <div>
        <HeroSection />
        <OurStory />
        <ThreeLevels />
        <WaysWeElevate />
        <TasteOfGarden />
        <KidsPlayArea />
        <GallerySection />
        <CTASection />
      </div>
    </HomeContentProvider>
  );
}
