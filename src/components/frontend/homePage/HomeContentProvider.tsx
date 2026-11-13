
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import {
  DEFAULT_HOMEPAGE,
  type HomeContent,
  withDefaults,
} from "@/lib/homepage/defaults";

const HomeContext = createContext<HomeContent>(
  DEFAULT_HOMEPAGE,
);

type Props = {
  initialData: HomeContent;
  serverURL: string;
  children: ReactNode;
};

export default function HomeContentProvider({
                                              initialData,
                                              serverURL,
                                              children,
                                            }: Props) {
  const { data } = useLivePreview<HomeContent>({
    initialData,
    serverURL,
    depth: 2,
  });

  const content = useMemo(
    () => withDefaults(DEFAULT_HOMEPAGE, data),
    [data],
  );

  return (
    <HomeContext.Provider value={content}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContent(): HomeContent {
  return useContext(HomeContext);
}
