
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import {
  normalizeGallery,
  type GalleryCategory,
  type GalleryContent,
  type RawGallery,
} from "@/lib/gallery/content";

const GalleryContext =
  createContext<GalleryContent | null>(null);

type Props = {
  initialData: RawGallery;
  categories: GalleryCategory[];
  serverURL: string;
  children: ReactNode;
};

export default function GalleryContentProvider({
                                                 initialData,
                                                 categories,
                                                 serverURL,
                                                 children,
                                               }: Props) {
  const { data } = useLivePreview<RawGallery>({
    initialData,
    serverURL,
    depth: 2,
  });

  const content = useMemo(
    () => normalizeGallery(data, categories),
    [data, categories],
  );

  return (
    <GalleryContext.Provider value={content}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGalleryContent() {
  const context = useContext(GalleryContext);

  if (!context) {
    throw new Error(
      "useGalleryContent must be used inside GalleryContentProvider",
    );
  }

  return context;
}
