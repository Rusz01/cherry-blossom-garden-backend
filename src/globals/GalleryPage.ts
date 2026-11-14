
import type { Field, GlobalConfig } from "payload";

import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";
import { GALLERY_DEFAULTS as D } from "@/lib/gallery/defaults";

const text = (
  name: string,
  label: string,
  defaultValue?: string,
): Field => ({
  name,
  label,
  type: "text",
  defaultValue,
});

const textarea = (
  name: string,
  label: string,
  defaultValue?: string,
): Field => ({
  name,
  label,
  type: "textarea",
  defaultValue,
});

const breakpoints = [
  {
    label: "Mobile",
    name: "mobile",
    width: 390,
    height: 844,
  },
  {
    label: "Tablet",
    name: "tablet",
    width: 834,
    height: 1112,
  },
  {
    label: "Desktop",
    name: "desktop",
    width: 1440,
    height: 900,
  },
];

export const GalleryPage: GlobalConfig = {
  slug: "gallery-page",
  label: "Gallery Page",

  access: buildGlobalAccess("gallery-page"),

  admin: {
    group: "Gallery",
    description:
      "Manage Gallery photographs, categories, headings and SEO while preserving the existing website design.",

    preview: () =>
      `${getAppURL()}/next/gallery-preview`,

    livePreview: {
      url: () => `${getAppURL()}/gallery`,
      breakpoints,
    },
  },

  versions: {
    max: 50,
    drafts: {
      autosave: {
        interval: 1000,
      },
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
              name: "hero",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Small Heading",
                  D.hero.eyebrow,
                ),
                text(
                  "title",
                  "Main Heading",
                  D.hero.title,
                ),
                text(
                  "accent",
                  "Script Heading",
                  D.hero.accent,
                ),
                textarea(
                  "description",
                  "Hero Description",
                  D.hero.description,
                ),
                text(
                  "buttonLabel",
                  "Explore Button Text",
                  D.hero.buttonLabel,
                ),
                text(
                  "badgeLineOne",
                  "Badge Line One",
                  D.hero.badgeLineOne,
                ),
                text(
                  "badgeLineTwo",
                  "Badge Line Two",
                  D.hero.badgeLineTwo,
                ),
                text(
                  "imageCaption",
                  "Image Caption",
                  D.hero.imageCaption,
                ),
                {
                  name: "image",
                  label: "Hero Photograph",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional. The original Garden photograph is used when no image is selected.",
                  },
                },
              ],
            },
          ],
        },

        {
          label: "Gallery Collection",
          fields: [
            {
              name: "collection",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Collection Eyebrow",
                  D.collection.eyebrow,
                ),
                text(
                  "allTitle",
                  "All Photographs Heading",
                  D.collection.allTitle,
                ),
                text(
                  "searchPlaceholder",
                  "Search Placeholder",
                  D.collection.searchPlaceholder,
                ),
                text(
                  "emptyTitle",
                  "No Results Heading",
                  D.collection.emptyTitle,
                ),
                textarea(
                  "emptyDescription",
                  "No Results Description",
                  D.collection.emptyDescription,
                ),
                text(
                  "emptyButtonLabel",
                  "No Results Button",
                  D.collection.emptyButtonLabel,
                ),
                text(
                  "bottomMessage",
                  "Collection Closing Message",
                  D.collection.bottomMessage,
                ),
                text(
                  "bottomBrand",
                  "Collection Closing Brand",
                  D.collection.bottomBrand,
                ),
              ],
            },
          ],
        },

        {
          label: "Photographs",
          fields: [
            {
              name: "photos",
              label: "Gallery Photographs",
              type: "array",
              admin: {
                initCollapsed: true,
                description:
                  "Add, remove or reorder photographs. Select at least one Gallery category for every new photograph.",
              },

              labels: {
                singular: "Photograph",
                plural: "Photographs",
              },

              fields: [
                text("title", "Photograph Title"),

                textarea(
                  "description",
                  "Photograph Description",
                ),

                text(
                  "alt",
                  "Alternative Text Override",
                ),

                {
                  name: "image",
                  label: "Photograph",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Upload a new image or choose an existing image from Media. Seeded photographs initially use their original website files.",
                  },
                },

                {
                  name: "fallbackSrc",
                  label: "Original Photograph Path",
                  type: "text",
                  admin: {
                    readOnly: true,
                    description:
                      "Used only for the original seeded photographs until an uploaded image replaces them.",
                  },
                },

                {
                  name: "categories",
                  label: "Categories",
                  type: "relationship",
                  relationTo: "gallery-categories",
                  hasMany: true,
                  required: true,
                  admin: {
                    description:
                      "Choose one or more categories. Create new categories under Gallery → Gallery Categories.",
                  },
                },

                {
                  name: "ratio",
                  label: "Photograph Aspect Ratio",
                  type: "select",
                  defaultValue: "4 / 5",
                  options: [
                    { label: "Portrait 4:5", value: "4 / 5" },
                    { label: "Portrait 3:4", value: "3 / 4" },
                    { label: "Landscape 5:4", value: "5 / 4" },
                    { label: "Landscape 3:2", value: "3 / 2" },
                    { label: "Square 1:1", value: "1 / 1" },
                    { label: "Tall 2:3", value: "2 / 3" },
                  ],
                },

                {
                  name: "position",
                  label: "Image Position",
                  type: "select",
                  defaultValue: "center",
                  options: [
                    { label: "Center", value: "center" },
                    { label: "Top", value: "top" },
                    { label: "Bottom", value: "bottom" },
                    { label: "Left", value: "left" },
                    { label: "Right", value: "right" },
                  ],
                },

                {
                  name: "visible",
                  label: "Show Photograph",
                  type: "checkbox",
                  defaultValue: true,
                },
              ],
            },
          ],
        },

        {
          label: "Final Invitation",
          fields: [
            {
              name: "closing",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Section Eyebrow",
                  D.closing.eyebrow,
                ),
                text(
                  "title",
                  "Main Heading",
                  D.closing.title,
                ),
                text(
                  "accent",
                  "Accent Heading",
                  D.closing.accent,
                ),
                text(
                  "buttonLabel",
                  "Button Text",
                  D.closing.buttonLabel,
                ),
                text(
                  "buttonHref",
                  "Button Link",
                  D.closing.buttonHref,
                ),
              ],
            },
          ],
        },

        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                text(
                  "title",
                  "SEO Title",
                  D.seo.title,
                ),
                textarea(
                  "description",
                  "Meta Description",
                  D.seo.description,
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
};
