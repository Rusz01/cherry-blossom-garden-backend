
import type { GlobalConfig } from "payload";
import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";
import { DEFAULT_MENU_COPY } from "@/lib/frontend/menu-copy";

export const MenuSettings: GlobalConfig = {
  slug: "menu-settings",
  label: "Menu Page Settings",
  access: buildGlobalAccess("menu-settings"),
  admin: {
    group: "Menu",
    description:
      "Edit menu headings and introductory text without changing the frontend.",
    preview: () =>
      `${getAppURL()}/next/menu-preview?type=settings`,
    livePreview: {
      url: () =>
        `${getAppURL()}/next/menu-preview?type=settings`,
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    max: 50,
    drafts: {
      autosave: { interval: 1000 },
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero Section",
          fields: [
            {
              name: "eyebrow",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.eyebrow,
            },
            {
              name: "lineOne",
              label: "Heading Line One",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.lineOne,
            },
            {
              name: "lineTwo",
              label: "Heading Line Two",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.lineTwo,
            },
            {
              name: "accent",
              label: "Script Heading",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.accent,
            },
            {
              name: "description",
              type: "textarea",
              defaultValue: DEFAULT_MENU_COPY.description,
            },
          ],
        },
        {
          label: "Menu Sections",
          fields: [
            {
              name: "allTitle",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.allTitle,
            },
            {
              name: "allDescription",
              type: "textarea",
              defaultValue: DEFAULT_MENU_COPY.allDescription,
            },
            {
              name: "signatureTitle",
              type: "text",
              defaultValue: DEFAULT_MENU_COPY.signatureTitle,
            },
            {
              name: "signatureDescription",
              type: "textarea",
              defaultValue: DEFAULT_MENU_COPY.signatureDescription,
            },
          ],
        },
      ],
    },
  ],
};
