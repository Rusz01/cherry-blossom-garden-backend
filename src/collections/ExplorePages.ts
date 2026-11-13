
import type {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
} from "payload";

import { buildCollectionAccess } from "@/access";
import { slugField } from "@/fields/slug";
import { getAppURL } from "@/lib/env";

import {
  FLOOR_KEYS,
  isFloorKey,
  withExploreDefaults,
  type ExploreContent,
} from "@/lib/explore/defaults";

const text = (
  name: string,
  label: string,
  required = false,
): Field => ({
  name,
  label,
  type: "text",
  required,
});

const textarea = (
  name: string,
  label: string,
): Field => ({
  name,
  label,
  type: "textarea",
});

const applyDefaults: CollectionBeforeValidateHook = ({
                                                       data,
                                                       operation,
                                                     }) => {
  if (
    operation !== "create" ||
    !isFloorKey(data?.floor)
  ) {
    return data;
  }

  return withExploreDefaults(
    data.floor,
    data as Partial<ExploreContent>,
  );
};

const protectFloor: CollectionBeforeChangeHook = ({
                                                    data,
                                                    originalDoc,
                                                    operation,
                                                  }) => {
  if (
    operation === "update" &&
    originalDoc?.floor &&
    data?.floor &&
    data.floor !== originalDoc.floor
  ) {
    throw new Error(
      "The floor identifier cannot be changed. " +
      "Edit the title or URL slug instead.",
    );
  }

  return data;
};

const slideFields: Field[] = [
  text("anchor", "Slide identifier", true),

  text("eyebrow", "Small heading", true),

  text("titleTop", "Title — first line", true),

  text("titleBottom", "Title — second line", true),

  text("subtitle", "Subtitle"),

  textarea("description", "Description"),

  {
    name: "image",
    label: "Upload photograph",
    type: "upload",
    relationTo: "media",
    admin: {
      description:
        "Optional. Overrides the default photograph.",
    },
  },

  {
    name: "imagePath",
    label: "Default image path",
    type: "text",
    required: true,
    admin: {
      description:
        "Local fallback image. Example: /assets/hero.png",
    },
  },

  {
    name: "imagePosition",
    label: "Image position",
    type: "text",
    defaultValue: "50% 50%",
    admin: {
      description:
        "CSS object-position, for example 50% 50%.",
    },
  },

  {
    name: "tone",
    label: "Background tone",
    type: "select",
    required: true,
    defaultValue: "midnight",
    options: [
      { label: "Midnight", value: "midnight" },
      { label: "Charcoal", value: "charcoal" },
      { label: "Walnut", value: "walnut" },
      { label: "Cream", value: "cream" },
    ],
  },

  text("cta", "Button label"),

  {
    name: "href",
    label: "Button destination",
    type: "text",
    required: true,
    validate: (value: unknown) => {
      if (
        typeof value === "string" &&
        (
          (value.startsWith("/") &&
            !value.startsWith("//") &&
            !value.includes("\\")) ||
          /^#[a-zA-Z0-9-]+$/.test(value)
        )
      ) {
        return true;
      }

      return "Use a local URL beginning with / or #.";
    },
  },
];

const previewURL = (floor: unknown) => {
  const selected = isFloorKey(floor)
    ? floor
    : "ground-floor";

  return (
    `${getAppURL()}/next/explore-preview` +
    `?floor=${encodeURIComponent(selected)}`
  );
};

const liveURL = (floor: unknown) => {
  const selected = isFloorKey(floor)
    ? floor
    : "ground-floor";

  return (
    `${getAppURL()}/next/explore-live` +
    `?floor=${encodeURIComponent(selected)}`
  );
};

export const ExplorePages: CollectionConfig = {
  slug: "explore-pages",

  labels: {
    singular: "Explore Page",
    plural: "Explore Pages",
  },

  access: buildCollectionAccess("explore-pages", {
    drafts: true,
  }),

  admin: {
    group: "Content",
    useAsTitle: "title",

    defaultColumns: [
      "title",
      "floor",
      "slug",
      "_status",
      "updatedAt",
    ],

    description:
      "Manage the three floor experiences using one shared design.",

    preview: (doc) => previewURL(doc?.floor),

    livePreview: {
      url: ({ data }) => liveURL(data?.floor),

      breakpoints: [
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
      ],
    },
  },

  versions: {
    maxPerDoc: 50,
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },

  hooks: {
    beforeValidate: [applyDefaults],
    beforeChange: [protectFloor],
  },

  fields: [
    {
      name: "floor",
      label: "Floor identifier",
      type: "select",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Select one floor per page. This identifier cannot be changed after creation.",
      },
      options: FLOOR_KEYS.map((value) => ({
        label:
          value === "ground-floor"
            ? "Ground Floor"
            : value === "first-floor"
              ? "First Floor"
              : "Rooftop",
        value,
      })),
    },

    {
      ...slugField("title"),
      admin: {
        position: "sidebar",
        description:
          "Editable URL segment after /explore/. Changing this changes the public URL.",
      },
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "Page Settings",
          fields: [
            text("title", "Page title", true),

            textarea(
              "description",
              "SEO description",
            ),
          ],
        },

        {
          label: "Navigation & Homepage",
          fields: [
            text(
              "menuLabel",
              "Navigation label",
              true,
            ),

            text(
              "menuDescription",
              "Navigation description",
            ),

            text(
              "homeEyebrow",
              "Homepage level label",
            ),

            text(
              "homeTitle",
              "Homepage card title",
            ),

            text(
              "homeShortTitle",
              "Homepage short title",
            ),

            textarea(
              "homeDescription",
              "Homepage card description",
            ),
          ],
        },

        {
          label: "Showcase Slides",
          fields: [
            {
              name: "slides",
              label: "Experience slides",
              type: "array",
              required: true,
              minRows: 1,
              maxRows: 15,

              admin: {
                initCollapsed: true,
                description:
                  "Add, remove and reorder slides. The original carousel layout is preserved.",
              },

              fields: slideFields,
            },
          ],
        },

        {
          label: "Decorative Labels",
          fields: [
            text(
              "serialLabel",
              "Image serial heading",
            ),

            text(
              "imageSignature",
              "Image signature",
            ),

            text(
              "imageLabel",
              "Image bottom label",
            ),

            text(
              "sideLabel",
              "Vertical label",
            ),

            text(
              "sideYear",
              "Vertical year",
            ),

            text(
              "nextLabel",
              "Next slide label",
            ),

            text(
              "dragHint",
              "Bottom navigation hint",
            ),
          ],
        },
      ],
    },
  ],
};
