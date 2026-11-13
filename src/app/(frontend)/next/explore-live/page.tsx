
import { notFound } from "next/navigation";

import ExplorePageLayout from
    "@/components/frontend/explore/ExplorePageLayout";

import {
  EXPLORE_DEFAULTS,
  isFloorKey,
} from "@/lib/explore/defaults";

type Props = {
  searchParams: Promise<{
    floor?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ExploreLivePage({
                                                searchParams,
                                              }: Props) {
  const { floor } = await searchParams;

  if (!isFloorKey(floor)) {
    notFound();
  }

  // Publicly accessible defaults only.
  // Unpublished edits arrive through Payload's
  // Live Preview client messages from the admin.
  return (
    <ExplorePageLayout
      content={EXPLORE_DEFAULTS[floor]}
    />
  );
}
