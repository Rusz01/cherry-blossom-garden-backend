
import type { Field, GlobalConfig } from "payload";

import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";
import { DEFAULT_HOMEPAGE as D } from "@/lib/homepage/defaults";

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

const image = (name = "image", label = "Image"): Field => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "Optional. Leave empty to use the original website photograph.",
  },
});

const link = (name: string, defaultValue: string): Field =>
  text(name, "Link URL", defaultValue);

const imageFallbackRows = <T extends { image: string }>(
  rows: T[],
) =>
  rows.map(({ image: _image, ...fields }) => fields);

const previewURL = `${getAppURL()}/next/preview?path=%2F`;

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",

  access: buildGlobalAccess("homepage"),

  admin: {
    group: "Content",
    description:
      "Manage homepage text, images and featured content without changing the website design.",
    preview: () => previewURL,
    livePreview: {
      url: () => `${getAppURL()}/`,
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
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.hero.eyebrow),
                text(
                  "desktopTitle",
                  "Desktop heading",
                  D.hero.desktopTitle,
                ),
                text(
                  "mobileTitle1",
                  "Mobile heading - line 1",
                  D.hero.mobileTitle1,
                ),
                text(
                  "mobileTitle2",
                  "Mobile heading - line 2",
                  D.hero.mobileTitle2,
                ),
                text("accent", "Script heading", D.hero.accent),
                textarea(
                  "description",
                  "Description",
                  D.hero.description,
                ),
                image(),
                text(
                  "primaryLabel",
                  "Primary button",
                  D.hero.primaryLabel,
                ),
                link("primaryHref", D.hero.primaryHref),
                text(
                  "secondaryLabel",
                  "Secondary button",
                  D.hero.secondaryLabel,
                ),
                link("secondaryHref", D.hero.secondaryHref),
              ],
            },
          ],
        },

        {
          label: "Our Story",
          fields: [
            {
              name: "story",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.story.eyebrow),
                text("title1", "Heading line 1", D.story.title1),
                text("title2", "Heading line 2", D.story.title2),
                textarea(
                  "paragraph1",
                  "Paragraph 1",
                  D.story.paragraph1,
                ),
                textarea(
                  "paragraph2",
                  "Paragraph 2",
                  D.story.paragraph2,
                ),
                image(),
                text(
                  "buttonLabel",
                  "Button label",
                  D.story.buttonLabel,
                ),
                link("buttonHref", D.story.buttonHref),
              ],
            },
          ],
        },

        {
          label: "Three Levels",
          fields: [
            {
              name: "levels",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.levels.eyebrow),
                text("title", "Heading", D.levels.title),
                textarea(
                  "description",
                  "Introduction",
                  D.levels.description,
                ),
                {
                  name: "items",
                  label: "Levels",
                  type: "array",
                  minRows: 3,
                  maxRows: 3,
                  defaultValue: imageFallbackRows(D.levels.items),
                  fields: [
                    text("eyebrow", "Level label"),
                    text("shortTitle", "Short title"),
                    text("title", "Full title"),
                    textarea("description", "Description"),
                    text("href", "Destination URL"),
                    image(),
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Experiences",
          fields: [
            {
              name: "experiences",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Eyebrow",
                  D.experiences.eyebrow,
                ),
                text(
                  "title1",
                  "Heading line 1",
                  D.experiences.title1,
                ),
                text(
                  "title2",
                  "Heading line 2",
                  D.experiences.title2,
                ),
                {
                  name: "items",
                  label: "Featured experiences",
                  type: "array",
                  minRows: 1,
                  maxRows: 10,
                  defaultValue: imageFallbackRows(
                    D.experiences.items,
                  ),
                  fields: [
                    text("number", "Slide number"),
                    text("eyebrow", "Category"),
                    text("title", "Title"),
                    textarea("description", "Description"),
                    text("href", "Destination URL"),
                    image(),
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Signature Cuisine",
          fields: [
            {
              name: "taste",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.taste.eyebrow),
                text("title1", "Heading line 1", D.taste.title1),
                text("title2", "Heading line 2", D.taste.title2),
                textarea(
                  "description",
                  "Description",
                  D.taste.description,
                ),
                image(),
                text(
                  "buttonLabel",
                  "Button",
                  D.taste.buttonLabel,
                ),
                link("buttonHref", D.taste.buttonHref),
                {
                  name: "dishes",
                  label: "Featured dishes",
                  type: "array",
                  minRows: 1,
                  maxRows: 12,
                  defaultValue: imageFallbackRows(D.taste.dishes),
                  fields: [
                    text("title", "Dish name"),
                    text("price", "Price"),
                    textarea("description", "Description"),
                    image(),
                  ],
                },
                {
                  type: "collapsible",
                  label: "Fresh ingredients section",
                  fields: [
                    text(
                      "lowerEyebrow",
                      "Eyebrow",
                      D.taste.lowerEyebrow,
                    ),
                    text(
                      "lowerTitle1",
                      "Heading line 1",
                      D.taste.lowerTitle1,
                    ),
                    text(
                      "lowerTitle2",
                      "Heading line 2",
                      D.taste.lowerTitle2,
                    ),
                    textarea(
                      "lowerDescription",
                      "Description",
                      D.taste.lowerDescription,
                    ),
                    image("lowerImage", "Background image"),
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Kids Play Area",
          fields: [
            {
              name: "kids",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.kids.eyebrow),
                text("title1", "Heading line 1", D.kids.title1),
                text("title2", "Heading line 2", D.kids.title2),
                text(
                  "titleAccent",
                  "Accent heading",
                  D.kids.titleAccent,
                ),
                textarea(
                  "description",
                  "Description",
                  D.kids.description,
                ),
                image("mainImage", "Main image"),
                image("topImage", "Top image"),
                image("bottomImage", "Bottom image"),
                {
                  name: "features",
                  label: "Feature labels",
                  type: "array",
                  minRows: 3,
                  maxRows: 3,
                  defaultValue: D.kids.features,
                  fields: [
                    text("line1", "First line"),
                    text("line2", "Second line"),
                  ],
                },
                text(
                  "buttonLabel",
                  "Button",
                  D.kids.buttonLabel,
                ),
                link("buttonHref", D.kids.buttonHref),
              ],
            },
          ],
        },

        {
          label: "Gallery",
          fields: [
            {
              name: "gallery",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.gallery.eyebrow),
                text("title", "Heading", D.gallery.title),
                text(
                  "buttonLabel",
                  "Button",
                  D.gallery.buttonLabel,
                ),
                {
                  name: "photos",
                  label: "Homepage photographs",
                  type: "array",
                  minRows: 7,
                  maxRows: 7,
                  defaultValue: imageFallbackRows(
                    D.gallery.photos,
                  ),
                  admin: {
                    description:
                      "Seven photographs in the existing editorial grid order.",
                  },
                  fields: [
                    text("title", "Photo title"),
                    text("alt", "Alternative text"),
                    image(),
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "Garden Journal",
          fields: [
            {
              name: "journal",
              type: "group",
              fields: [
                text("eyebrow", "Eyebrow", D.journal.eyebrow),
                text("title1", "Heading start", D.journal.title1),
                text(
                  "titleAccent",
                  "Script heading",
                  D.journal.titleAccent,
                ),
                text("title2", "Heading end", D.journal.title2),
                textarea(
                  "description",
                  "Description",
                  D.journal.description,
                ),
                text("prompt", "Form prompt", D.journal.prompt),
                text(
                  "placeholder",
                  "Email placeholder",
                  D.journal.placeholder,
                ),
                text(
                  "buttonLabel",
                  "Button",
                  D.journal.buttonLabel,
                ),
                textarea(
                  "privacy",
                  "Privacy note",
                  D.journal.privacy,
                ),
                text("footer", "Footer note", D.journal.footer),
                image(),
              ],
            },
          ],
        },
      ],
    },
  ],
};
