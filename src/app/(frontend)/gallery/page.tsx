
import type { Metadata } from "next";
import { Suspense } from "react";

import Navbar from "@/components/frontend/navbar";
import GalleryExperience from "@/components/frontend/gallery/galleryExperience";
import GalleryContentProvider from '@/app/(frontend)/gallery/GalleryContentProvider'

import { getGalleryPageData } from "@/lib/gallery/server";
import { normalizeGallery } from "@/lib/gallery/content";
import { getAppURL } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { raw, categories } = await getGalleryPageData();
  const content = normalizeGallery(raw, categories);

  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function GalleryPage() {
  const { raw, categories } = await getGalleryPageData();

  return (
    <div className="min-h-screen bg-midnight font-inter text-ivory">
      <Navbar />

      <GalleryContentProvider
        initialData={raw}
        categories={categories}
        serverURL={getAppURL()}
      >
        <main className="w-full overflow-x-clip">
          <Suspense
            fallback={
              <div className="min-h-[65vh] bg-midnight" />
            }
          >
            <GalleryExperience />
          </Suspense>
        </main>
      </GalleryContentProvider>
    </div>
  );
}
