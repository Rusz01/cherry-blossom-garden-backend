
"use client";

import { useMemo } from "react";

import { useLivePreview } from
    "@payloadcms/live-preview-react";

import GroundFloorShowcase from
    "@/components/frontend/explore/ground-floor/GroundFloorShow";

import { imageSrc } from
    "@/lib/homepage/defaults";

import {
  withExploreDefaults,
  type ExploreContent,
  type ShowcaseSlide,
} from "@/lib/explore/defaults";

type Props = {
  initialData: ExploreContent;
  serverURL: string;
};

export default function ExploreContent({
                                         initialData,
                                         serverURL,
                                       }: Props) {
  const { data } = useLivePreview<ExploreContent>({
    initialData,
    serverURL,
    depth: 2,
  });

  const content = useMemo(
    () =>
      withExploreDefaults(
        initialData.floor,
        data,
      ),
    [initialData.floor, data],
  );

  const experiences = useMemo<ShowcaseSlide[]>(
    () =>
      content.slides.map((slide, index) => ({
        ...slide,

        id: slide.id ?? slide.anchor ??
          String(index),

        image: imageSrc(
          slide.image,
          slide.imagePath ??
          "/assets/garden-ambience.png",
        ),
      })),
    [content.slides],
  );

  return (
    <GroundFloorShowcase
      experiences={experiences}
      title={content.title}
      serialLabel={content.serialLabel}
      imageSignature={content.imageSignature}
      imageLabel={content.imageLabel}
      sideLabel={content.sideLabel}
      sideYear={content.sideYear}
      nextLabel={content.nextLabel}
      dragHint={content.dragHint}
    />
  );
}
