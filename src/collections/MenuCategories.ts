
import type { CollectionConfig } from "payload";
import { buildCollectionAccess } from "@/access";
import { slugField } from "@/fields/slug";

export const MenuCategories: CollectionConfig = {
  slug: "menu-categories",
  labels: {
    singular: "Menu Category",
    plural: "Menu Categories",
  },
  admin: {
    group: "Menu",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "sortOrder", "active"],
    description: "Organise dishes into editable menu categories.",
  },
  access: buildCollectionAccess("menu-categories", {
    publicRead: true,
  }),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Category Name",
    },
    {
      name: "description",
      type: "textarea",
      label: "Category Description",
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      label: "Display Order",
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      label: "Show on Menu",
    },
    slugField("name"),
  ],
};
