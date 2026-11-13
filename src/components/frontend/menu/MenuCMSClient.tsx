
"use client";

import { useMemo } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";

import MenuHero from "./menuHero";
import MenuExplorer from "./menuExplorer";
import MenuContactCTA from "./menuContactCTA";
import TodaySpecialsProvider from "./todaySpecialsProvider";

import {
  type CmsRecord,
  toMenuItem,
  toSpecials,
} from "@/lib/frontend/menu-cms";

import {
  withMenuCopy,
  type MenuCopy,
} from "@/lib/frontend/menu-copy";

import type {
  MenuCategory,
  MenuDietaryTag,
  MenuItem,
} from "@/types/menu";

import type { ResolvedSpecial } from "@/types/specials";

type Preview =
  | { type: "settings"; doc: CmsRecord }
  | { type: "item"; doc: CmsRecord }
  | { type: "special"; doc: CmsRecord }
  | null;

type Props = {
  copy: MenuCopy;
  categories: MenuCategory[];
  tags: MenuDietaryTag[];
  items: MenuItem[];
  specials: ResolvedSpecial[];
  serverURL: string;
  preview: Preview;
};

function MenuContent({
                       copy,
                       categories,
                       tags,
                       items,
                       specials,
                     }: Omit<Props, "serverURL" | "preview">) {
  return (

    <div className="min-h-screen bg-midnight font-inter text-ivory">
      <TodaySpecialsProvider specials={specials}>
        <MenuHero copy={copy} />

        <main id="main-content">
          <MenuExplorer
            items={items}
            categories={categories}
            tags={tags}
            copy={copy}
          />

          <MenuContactCTA />
        </main>
      </TodaySpecialsProvider>
    </div>
  );
}

function SettingsLive({ preview, ...props }: Props & {
  preview: { type: "settings"; doc: CmsRecord };
}) {
  const { data } = useLivePreview<CmsRecord>({
    initialData: preview.doc,
    serverURL: props.serverURL,
    depth: 2,
  });

  const copy = withMenuCopy(data as Partial<MenuCopy>);

  return <MenuContent {...props} copy={copy} />;
}

function ItemLive({ preview, ...props }: Props & {
  preview: { type: "item"; doc: CmsRecord };
}) {
  const { data } = useLivePreview<CmsRecord>({
    initialData: preview.doc,
    serverURL: props.serverURL,
    depth: 2,
  });

  const items = useMemo(() => {
    const updated = toMenuItem(
      data,
      props.categories,
      props.tags,
      true,
    );

    if (!updated) return props.items;

    return [
      ...props.items.filter((item) => item.id !== updated.id),
      updated,
    ];
  }, [data, props.items, props.categories, props.tags]);

  return <MenuContent {...props} items={items} />;
}

function SpecialLive({ preview, ...props }: Props & {
  preview: { type: "special"; doc: CmsRecord };
}) {
  const { data } = useLivePreview<CmsRecord>({
    initialData: preview.doc,
    serverURL: props.serverURL,
    depth: 2,
  });

  const specials = useMemo(
    () => toSpecials([data], props.items, props.tags, true),
    [data, props.items, props.tags],
  );

  // Force-preview allows editors to inspect future specials
  // without waiting for the scheduled day.
  return <MenuContent {...props} specials={specials} />;
}

export default function MenuCMSClient(props: Props) {
  if (props.preview?.type === "settings") {
    return <SettingsLive {...props} preview={props.preview} />;
  }

  if (props.preview?.type === "item") {
    return <ItemLive {...props} preview={props.preview} />;
  }

  if (props.preview?.type === "special") {
    return <SpecialLive {...props} preview={props.preview} />;
  }

  return <MenuContent {...props} />;
}
