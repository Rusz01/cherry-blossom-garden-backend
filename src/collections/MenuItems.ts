
import type { CollectionConfig } from "payload";
import { buildCollectionAccess } from "@/access";
import { getAppURL } from "@/lib/env";

const previewURL = (id: unknown) =>
  `${getAppURL()}/next/menu-preview?type=item&id=${encodeURIComponent(String(id ?? ""))}`;

export const MenuItems: CollectionConfig = {
  slug: "menu-items",
  labels: {
    singular: "Menu Item",
    plural: "Menu Items",
  },
  access: buildCollectionAccess("menu-items", {
    drafts: true,
  }),
  admin: {
    group: "Menu",
    useAsTitle: "name",
    defaultColumns: [
      "name",
      "category",
      "price",
      "isAvailable",
      "_status",
    ],
    description:
      "Create dishes and drinks for the menu, homepage and specials.",
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
    maxPerDoc: 50,
    drafts: {
      autosave: { interval: 1000 },
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Basic Information",
          fields: [
            {
              name: "name",
              label: "Food / Drink Name",
              type: "text",
              required: true,
            },
            {
              name: "description",
              type: "textarea",
              required: true,
            },
            {
              name: "price",
              type: "number",
              required: true,
              min: 0,
              label: "Price",
              admin: {
                description:
                  "Use the main currency configured for the website.",
              },
            },
            {
              name: "category",
              label: "Food Category",
              type: "relationship",
              relationTo: "menu-categories",
              required: true,
              admin: {
                sortOptions: "sortOrder",
                description:
                  "Select a category previously created under Menu Categories.",
              },
            },
            {
              name: "dietaryTags",
              label: "Dietary Labels",
              type: "relationship",
              relationTo: "dietary-tags",
              hasMany: true,
              admin: {
                sortOptions: "name",
                description:
                  "Choose multiple labels such as Vegan and Gluten Free.",
              },
            },
            {
              name: "ingredients",
              type: "array",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "image",
              label: "Food Photograph",
              type: "upload",
              relationTo: "media",
            },
          ],
        },
        {
          label: "Display Settings",
          fields: [
            {
              name: "isAvailable",
              label: "Available on Menu",
              type: "checkbox",
              defaultValue: true,
            },
            {
              name: "signature",
              label: "Signature Dish",
              type: "checkbox",
              defaultValue: false,
            },
            {
              name: "popularity",
              label: "Popularity Score",
              type: "number",
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                description:
                  "85 or higher displays the Popular badge.",
              },
            },
          ],
        },
      ],
    },
  ],
};
