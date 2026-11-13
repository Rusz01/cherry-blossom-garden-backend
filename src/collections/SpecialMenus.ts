
import type { CollectionConfig } from "payload";
import { buildCollectionAccess } from "@/access";
import { getAppURL } from "@/lib/env";

const previewURL = (id: unknown) =>
  `${getAppURL()}/next/menu-preview?type=special&id=${encodeURIComponent(String(id ?? ""))}`;

export const SpecialMenus: CollectionConfig = {
  slug: "special-menus",
  labels: {
    singular: "Special Menu",
    plural: "Special Menus",
  },
  access: buildCollectionAccess("special-menus", {
    drafts: true,
  }),
  admin: {
    group: "Menu",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "enabled",
      "_status",
      "updatedAt",
    ],
    description:
      "Schedule reusable special-menu popups and keep past menus.",
    preview: (doc) => previewURL(doc?.id),
    livePreview: {
      url: ({ data }) => previewURL(data?.id),
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    maxPerDoc: 100,
    drafts: {
      autosave: { interval: 1000 },
    },
  },
  fields: [
    {
      name: "title",
      label: "Internal Special Menu Name",
      type: "text",
      required: true,
      admin: {
        description:
          "For example: Dashain Special 2026. Used in the admin archive.",
      },
    },
    {
      name: "enabled",
      label: "Enable This Special Menu",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "showDates",
      label: "Dates to Display Popup",
      type: "array",
      minRows: 1,
      admin: {
        description:
          "Dates use Nepal's calendar day (Asia/Kathmandu). Add as many individual dates as needed.",
      },
      fields: [
        {
          name: "day",
          label: "Display Date",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "dayOnly",
              displayFormat: "dd/MM/yyyy",
            },
          },
        },
      ],
    },
    {
      name: "items",
      label: "Special Menu Dishes",
      type: "array",
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "source",
          label: "Food Source",
          type: "select",
          required: true,
          defaultValue: "existing",
          options: [
            {
              label: "Select Existing Menu Item",
              value: "existing",
            },
            {
              label: "Create Popup-Only Item",
              value: "custom",
            },
          ],
        },
        {
          name: "menuItem",
          label: "Choose Existing Food",
          type: "relationship",
          relationTo: "menu-items",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "existing",
          },
        },
        {
          name: "customName",
          label: "Popup-Only Food Name",
          type: "text",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "custom",
          },
        },
        {
          name: "customDescription",
          label: "Popup-Only Description",
          type: "textarea",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "custom",
          },
        },
        {
          name: "customPrice",
          label: "Popup-Only Price",
          type: "number",
          min: 0,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "custom",
          },
        },
        {
          name: "customDietaryTags",
          label: "Popup-Only Dietary Labels",
          type: "relationship",
          relationTo: "dietary-tags",
          hasMany: true,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "custom",
          },
        },
        {
          name: "overrideName",
          label: "Special Display Name (Optional)",
          type: "text",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "existing",
          },
        },
        {
          name: "overrideDescription",
          label: "Special Description (Optional)",
          type: "textarea",
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "existing",
          },
        },
        {
          name: "overridePrice",
          label: "Special Price (Optional)",
          type: "number",
          min: 0,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.source === "existing",
          },
        },
        {
          name: "chefsChoice",
          label: "Chef's Choice",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "isNew",
          label: "Show New Badge",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (data._status !== "published") return data;

        // Allow an entirely new, empty form to open in the admin.
        // Validate complete documents before storing them.
        if (!data.title || !data.showDates || !data.items) {
          return data;
        }

        for (const item of data.items) {
          if (item.source === "existing" && !item.menuItem) {
            throw new Error(
              "Select a menu item for every existing-food entry.",
            );
          }

          if (item.source === "custom") {
            if (
              !item.customName?.trim() ||
              !item.customDescription?.trim() ||
              typeof item.customPrice !== "number" ||
              item.customPrice < 0
            ) {
              throw new Error(
                "Popup-only dishes need a name, description and valid price.",
              );
            }
          }
        }

        return data;
      },
    ],
  },
};
