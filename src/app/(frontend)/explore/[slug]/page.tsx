
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import ExplorePageLayout from
    "@/components/frontend/explore/ExplorePageLayout";

import { getExplorePageBySlug } from
    "@/lib/explore/get-pages";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
                                         params,
                                       }: Props): Promise<Metadata> {
  const { slug } = await params;

  const content =
    await getExplorePageBySlug(slug);

  if (!content) {
    return {
      title: "Page Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { isEnabled } = await draftMode();

  return {
    title: `${content.title} | Cherry Blossom Garden`,

    description: content.description,

    alternates: {
      canonical: `/explore/${content.slug}`,
    },

    robots: isEnabled
      ? {
        index: false,
        follow: false,
      }
      : undefined,
  };
}

export default async function ExplorePage({
                                            params,
                                          }: Props) {
  const { slug } = await params;

  const content =
    await getExplorePageBySlug(slug);

  if (!content) {
    notFound();
  }

  return (
    <ExplorePageLayout content={content} />
  );
}
