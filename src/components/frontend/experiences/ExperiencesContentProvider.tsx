
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import {
  DEFAULT_EXPERIENCES_PAGE,
  type ExperienceContent,
} from "@/lib/experiences/defaults";

import {
  normalizeExperienceContent,
} from "@/lib/experiences/normalize";

const ExperiencesContext =
  createContext<ExperienceContent>(
    normalizeExperienceContent(
      DEFAULT_EXPERIENCES_PAGE,
    ),
  );

type Props = {
  initialData: ExperienceContent;
  serverURL: string;
  children: ReactNode;
};

export default function ExperiencesContentProvider({
                                                     initialData,
                                                     serverURL,
                                                     children,
                                                   }: Props) {
  const { data } = useLivePreview<ExperienceContent>({
    initialData,
    serverURL,
    depth: 2,
  });

  const content = useMemo(
    () => normalizeExperienceContent(data),
    [data],
  );

  return (
    <ExperiencesContext.Provider value={content}>
      {children}
    </ExperiencesContext.Provider>
  );
}

export function useExperiencesContent() {
  return useContext(ExperiencesContext);
}
