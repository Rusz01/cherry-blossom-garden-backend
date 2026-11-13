
import Navbar from "@/components/frontend/navbar";

import ExploreContent from "./ExploreContent";

import type {
  ExploreContent as ExploreContentType,
} from "@/lib/explore/defaults";

import { getAppURL } from "@/lib/env";

type Props = {
  content: ExploreContentType;
};

export default function ExplorePageLayout({
                                            content,
                                          }: Props) {
  return (
    <div
      id={`${content.floor}-top`}
      className="relative min-h-screen bg-midnight font-inter text-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[170px] bg-gradient-to-b from-midnight/95 via-midnight/60 to-transparent sm:h-[190px] lg:h-[210px]"
      />

      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <main className="w-full overflow-x-clip">
        <ExploreContent
          initialData={content}
          serverURL={getAppURL()}
        />

        <div id={`${content.floor}-details`} />
      </main>
    </div>
  );
}
