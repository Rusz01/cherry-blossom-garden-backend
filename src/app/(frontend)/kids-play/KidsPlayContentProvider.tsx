
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import {
  DEFAULT_KIDS_PLAY,
  normalizeKidsPlay,
  type KidsPlayContent,
} from "@/lib/kids-play/defaults";

const KidsPlayContext = createContext<KidsPlayContent>(
  DEFAULT_KIDS_PLAY,
);

type Props = {
  initialData: KidsPlayContent;
  serverURL: string;
  children: ReactNode;
};

export default function KidsPlayContentProvider({
                                                  initialData,
                                                  serverURL,
                                                  children,
                                                }: Props) {
  const { data } = useLivePreview<KidsPlayContent>({
    initialData,
    serverURL,
    depth: 2,
  });

  const content = useMemo(
    () => normalizeKidsPlay(data),
    [data],
  );

  return (
    <KidsPlayContext.Provider value={content}>
      {children}
    </KidsPlayContext.Provider>
  );
}

export function useKidsPlayContent(): KidsPlayContent {
  return useContext(KidsPlayContext);
}
