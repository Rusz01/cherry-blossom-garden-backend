
import type { Field, GlobalConfig } from "payload";

import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";
import { DEFAULT_KIDS_PLAY as D } from "@/lib/kids-play/defaults";

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

const image = (): Field => ({
  name: "image",
  label: "Section Photograph",
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "Optional. Leave empty to retain the original website photograph.",
  },
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

export const KidsPlayPage: GlobalConfig = {
  slug: "kids-play-page",
  label: "Kids Play Area",

  access: buildGlobalAccess("kids-play-page"),

  admin: {
    group: "Content",
    description:
      "Manage the Kids Play Area page, family highlights, party information, photographs and SEO without changing the frontend design.",

    preview: () =>
      `${getAppURL()}/next/kids-play-preview`,

    livePreview: {
      url: () => `${getAppURL()}/kids-play`,
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
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.hero.eyebrow),
                text("title1", "Main Heading", D.hero.title1),
                text(
                  "titleAccent",
                  "Script Heading",
                  D.hero.titleAccent,
                ),
                textarea(
                  "paragraph1",
                  "First Paragraph",
                  D.hero.paragraph1,
                ),
                textarea(
                  "paragraph2",
                  "Second Paragraph",
                  D.hero.paragraph2,
                ),
                text(
                  "buttonLabel",
                  "Button Text",
                  D.hero.buttonLabel,
                ),
                text(
                  "buttonHref",
                  "Button Link",
                  D.hero.buttonHref,
                ),
                text(
                  "scrollLabel",
                  "Scroll Link Text",
                  D.hero.scrollLabel,
                ),
                text(
                  "scrollHref",
                  "Scroll Link URL",
                  D.hero.scrollHref,
                ),
                text(
                  "photoLabel",
                  "Photo Eyebrow",
                  D.hero.photoLabel,
                ),
                text(
                  "photoCaption",
                  "Photo Caption",
                  D.hero.photoCaption,
                ),
                image(),
              ],
            },
          ],
        },

        {
          label: "Family Benefits",
          fields: [
            {
              name: "benefits",
              label: "Family Highlights",
              type: "array",
              minRows: 4,
              maxRows: 4,
              defaultValue: D.benefits,
              admin: {
                initCollapsed: true,
                description:
                  "Four highlights in the existing benefits strip. Icons are retained in their original positions.",
              },
              fields: [
                text("title", "Highlight Title"),
                textarea("description", "Description"),
              ],
            },
          ],
        },

        {
          label: "Discover Play Area",
          fields: [
            {
              name: "discover",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Section Eyebrow",
                  D.discover.eyebrow,
                ),
                text(
                  "heading1",
                  "Main Heading",
                  D.discover.heading1,
                ),
                text(
                  "headingAccent",
                  "Accent Heading",
                  D.discover.headingAccent,
                ),
                textarea(
                  "paragraph1",
                  "First Paragraph",
                  D.discover.paragraph1,
                ),
                textarea(
                  "paragraph2",
                  "Second Paragraph",
                  D.discover.paragraph2,
                ),
                text(
                  "sticker",
                  "Image Sticker Text",
                  D.discover.sticker,
                ),
                image(),
                {
                  name: "features",
                  label: "Play Features",
                  type: "array",
                  minRows: 3,
                  maxRows: 3,
                  defaultValue: D.discover.features,
                  admin: {
                    initCollapsed: true,
                    description:
                      "Three mini feature cards. Existing icons and design remain unchanged.",
                  },
                  fields: [
                    text("title", "Feature Title"),
                    text("description", "Feature Caption"),
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Editorial Divider",
          fields: [
            {
              name: "divider",
              type: "group",
              fields: [
                text(
                  "text",
                  "Divider Statement",
                  D.divider.text,
                ),
              ],
            },
          ],
        },

        {
          label: "Kids Parties",
          fields: [
            {
              name: "party",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Section Eyebrow",
                  D.party.eyebrow,
                ),
                text(
                  "heading1",
                  "Heading Line One",
                  D.party.heading1,
                ),
                text(
                  "heading2",
                  "Heading Line Two",
                  D.party.heading2,
                ),
                text(
                  "accent1",
                  "Accent Heading One",
                  D.party.accent1,
                ),
                text(
                  "accent2",
                  "Accent Heading Two",
                  D.party.accent2,
                ),
                textarea(
                  "paragraph1",
                  "First Paragraph",
                  D.party.paragraph1,
                ),
                textarea(
                  "paragraph2",
                  "Second Paragraph",
                  D.party.paragraph2,
                ),
                text(
                  "feature1",
                  "First Highlight",
                  D.party.feature1,
                ),
                text(
                  "feature2",
                  "Second Highlight",
                  D.party.feature2,
                ),
                text(
                  "buttonLabel",
                  "Button Text",
                  D.party.buttonLabel,
                ),
                text(
                  "buttonHref",
                  "Button Link",
                  D.party.buttonHref,
                ),
                image(),
              ],
            },
          ],
        },

        {
          label: "Family CTA",
          fields: [
            {
              name: "family",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Section Eyebrow",
                  D.family.eyebrow,
                ),
                text(
                  "heading1",
                  "Heading Start",
                  D.family.heading1,
                ),
                text(
                  "accent",
                  "Accent Heading",
                  D.family.accent,
                ),
                text(
                  "heading2",
                  "Heading End",
                  D.family.heading2,
                ),
                textarea(
                  "paragraph",
                  "Description",
                  D.family.paragraph,
                ),
                text(
                  "buttonLabel",
                  "Button Text",
                  D.family.buttonLabel,
                ),
                text(
                  "buttonHref",
                  "Button Link",
                  D.family.buttonHref,
                ),
                image(),
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
                  "SEO Page Title",
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
