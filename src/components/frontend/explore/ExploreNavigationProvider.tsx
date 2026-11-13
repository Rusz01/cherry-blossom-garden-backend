
"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type {
  ExploreNavItem,
} from "@/lib/explore/get-pages";

const ExploreNavigationContext =
  createContext<ExploreNavItem[]>([]);

type Props = {
  items: ExploreNavItem[];
  children: ReactNode;
};

export function ExploreNavigationProvider({
                                            items,
                                            children,
                                          }: Props) {
  return (
    <ExploreNavigationContext.Provider
      value={items}
    >
      {children}
    </ExploreNavigationContext.Provider>
  );
}

export function useExploreNavigation() {
  return useContext(ExploreNavigationContext);
}
