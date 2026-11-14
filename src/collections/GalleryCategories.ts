
import type { CollectionConfig } from "payload";

import { buildCollectionAccess } from "@/access";
import { slugField } from "@/fields/slug";

export const GalleryCategories: CollectionConfig = {
  slug: "gallery-categories",

  labels: {
    singular: "Gallery Category",
    plural: "Gallery Categories",
  },

  admin: {
    group: "Gallery",
    useAsTitle: "name",
    defaultColumns: [
      "name",
      "slug",
      "sortOrder",
      "active",
    ],
    description:
      "Create and manage categories for Gallery photographs.",
  },

  access: buildCollectionAccess("gallery-categories", {
    publicRead: true,
  }),

  fields: [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      maxLength: 100,
    },
    {
      ...slugField("name"),
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "sortOrder",
      label: "Display Order",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          "Lower numbers appear first in the Gallery filters.",
      },
    },
    {
      name: "active",
      label: "Show in Gallery",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
