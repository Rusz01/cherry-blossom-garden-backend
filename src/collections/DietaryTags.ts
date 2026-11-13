
import type { CollectionConfig } from "payload";
import { buildCollectionAccess } from "@/access";
import { slugField } from "@/fields/slug";

export const DietaryTags: CollectionConfig = {
  slug: "dietary-tags",
  labels: {
    singular: "Dietary Tag",
    plural: "Dietary Tags",
  },
  admin: {
    group: "Menu",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "sortOrder", "active"],
    description:
      "Manage vegetarian, vegan, gluten-free and other labels.",
  },
  access: buildCollectionAccess("dietary-tags", {
    publicRead: true,
  }),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
    },
    slugField("name"),
  ],
};
