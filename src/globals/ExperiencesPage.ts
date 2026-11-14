
import type { Field, GlobalConfig } from "payload";

import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";
import { DEFAULT_EXPERIENCES_PAGE as D } from "@/lib/experiences/defaults";

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

export const ExperiencesPage: GlobalConfig = {
  slug: "experiences-page",
  label: "Experiences Page",

  access: buildGlobalAccess("experiences-page"),

  admin: {
    group: "Content",
    description:
      "Manage the experience carousel, headings and upcoming-events section without modifying the website design.",

    preview: () =>
      `${getAppURL()}/next/experiences-preview`,

    livePreview: {
      url: () => `${getAppURL()}/experiences`,
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
          label: "Page Introduction",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Small heading",
                  D.hero.eyebrow,
                ),
                text(
                  "title",
                  "Main heading",
                  D.hero.title,
                ),
                text(
                  "accent",
                  "Script heading",
                  D.hero.accent,
                ),
                textarea(
                  "description",
                  "Introduction",
                  D.hero.description,
                ),
              ],
            },
          ],
        },

        {
          label: "Experience Carousel",
          fields: [
            {
              name: "slides",
              label: "Experience Slides",
              type: "array",
              required: true,
              minRows: 1,
              maxRows: 15,

              defaultValue: D.slides,

              admin: {
                initCollapsed: true,
                description:
                  "Add, edit, remove and reorder experiences. The existing carousel layout is retained.",
              },

              fields: [
                text("key", "Unique identifier"),
                text("label", "Short label"),
                text("category", "Category"),
                text("title", "Heading"),
                textarea("description", "Description"),

                {
                  name: "image",
                  label: "Experience Photograph",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional. Overrides the default image.",
                  },
                },

                text(
                  "imagePath",
                  "Fallback image path",
                ),
                text("alt", "Image alt text"),
                text("linkLabel", "Button text"),
                text("href", "Button destination"),
              ],
            },
          ],
        },

        {
          label: "Upcoming Events Section",
          fields: [
            {
              name: "upcoming",
              type: "group",
              fields: [
                text(
                  "eyebrow",
                  "Small heading",
                  D.upcoming.eyebrow,
                ),
                text(
                  "title",
                  "Main heading",
                  D.upcoming.title,
                ),
                text(
                  "accent",
                  "Heading accent",
                  D.upcoming.accent,
                ),
                textarea(
                  "description",
                  "Introduction",
                  D.upcoming.description,
                ),
                text(
                  "emptyTitle",
                  "No events heading",
                  D.upcoming.emptyTitle,
                ),
                textarea(
                  "emptyDescription",
                  "No events description",
                  D.upcoming.emptyDescription,
                ),
                text(
                  "footerText",
                  "Footer message",
                  D.upcoming.footerText,
                ),
                text(
                  "footerLabel",
                  "Footer button",
                  D.upcoming.footerLabel,
                ),
                text(
                  "footerHref",
                  "Footer destination",
                  D.upcoming.footerHref,
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
};
