
import type { Metadata } from "next";

import { getAppURL } from "@/lib/env";
import { getKidsPlayContent } from "@/lib/kids-play/server";

import KidsPlayContentProvider from '@/app/(frontend)/kids-play/KidsPlayContentProvider'
import KidsPlayView from "@/components/frontend/kids-play/KidsPlayView";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getKidsPlayContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function KidsPlayAreaPage() {
  const content = await getKidsPlayContent();

  return (
    <KidsPlayContentProvider
      initialData={content}
      serverURL={getAppURL()}
    >
      <KidsPlayView />
    </KidsPlayContentProvider>
  );
}
