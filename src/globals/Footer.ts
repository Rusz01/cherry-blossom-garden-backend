
import type {
  Field,
  GlobalConfig,
} from "payload";

import { buildGlobalAccess } from "@/access";
import { getAppURL } from "@/lib/env";

import {
  DEFAULT_FOOTER as D,
  safeFooterHref,
} from "@/lib/footer/content";

/* -------------------------------------------------------
   FIELD HELPERS
------------------------------------------------------- */

const text = (
  name: string,
  label: string,
  defaultValue: string,
): Field => ({
  name,
  label,
  type: "text",
  defaultValue,
});

const textarea = (
  name: string,
  label: string,
  defaultValue: string,
): Field => ({
  name,
  label,
  type: "textarea",
  defaultValue,
});

const linkField = (
  name: string,
  label: string,
  defaultValue?: string,
): Field => ({
  name,
  label,
  type: "text",

  ...(defaultValue !== undefined
    ? { defaultValue }
    : {}),

  required: true,

  validate: (value: unknown) =>
    safeFooterHref(value)
      ? true
      : "Use a relative path such as /menu or an HTTPS URL.",
});

/* -------------------------------------------------------
   NAVIGATION FIELDS

   Used by both Links and Discover sections.
   Includes the section title and reorderable links.
------------------------------------------------------- */

const navigationFields = (
  title: string,
  defaults: { label: string; href: string }[],
): Field[] => [
  text("title", "Column title", title),

  {
    name: "links",
    label: "Navigation links",
    type: "array",
    maxRows: 20,

    defaultValue: defaults.map((link) => ({
      label: link.label,
      href: link.href,
      visible: true,
    })),

    labels: {
      singular: "Link",
      plural: "Links",
    },

    admin: {
      initCollapsed: true,
      description:
        "Add, remove or drag links to change their order.",
    },

    fields: [
      {
        name: "label",
        label: "Link name",
        type: "text",
        required: true,
      },

      linkField(
        "href",
        "Destination URL",
      ),

      {
        name: "visible",
        label: "Show this link",
        type: "checkbox",
        defaultValue: true,
      },
    ],
  },
];

/* -------------------------------------------------------
   LIVE PREVIEW BREAKPOINTS
------------------------------------------------------- */

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

/* -------------------------------------------------------
   FOOTER GLOBAL
------------------------------------------------------- */

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",

  access: buildGlobalAccess("footer"),

  admin: {
    group: "Content",

    description:
      "Edit the website footer while keeping its original design, layout and animations.",

    preview: () =>
      `${getAppURL()}/next/footer-preview`,

    livePreview: {
      url: () => `${getAppURL()}/#footer`,
      breakpoints,
    },
  },

  /* -----------------------------------------------------
     VERSION HISTORY AND DRAFTS
  ----------------------------------------------------- */

  versions: {
    max: 50,

    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },

  /* -----------------------------------------------------
     FOOTER FIELDS
  ----------------------------------------------------- */

  fields: [
    {
      type: "tabs",

      tabs: [
        /* -----------------------------------------------
           BRAND
        ----------------------------------------------- */

        {
          label: "Brand",

          fields: [
            {
              name: "brand",
              type: "group",

              fields: [
                {
                  name: "logo",
                  label: "Footer logo",
                  type: "upload",
                  relationTo: "media",

                  admin: {
                    description:
                      "Optional. Uses the original Cherry Blossom Garden logo when empty.",
                  },
                },

                textarea(
                  "description",
                  "Brand description",
                  D.brand.description,
                ),

                text(
                  "tagline",
                  "Signature tagline",
                  D.brand.tagline,
                ),
              ],
            },
          ],
        },

        /* -----------------------------------------------
           SOCIAL MEDIA
        ----------------------------------------------- */

        {
          label: "Social Media",

          fields: [
            {
              name: "social",
              type: "group",

              fields: [
                text(
                  "heading",
                  "Social heading",
                  D.social.heading,
                ),

                {
                  name: "links",
                  label: "Social profiles",
                  type: "array",
                  maxRows: 12,

                  defaultValue: D.social.links.map(
                    (link) => ({
                      platform: link.platform,
                      url: link.href,
                      visible: true,
                    }),
                  ),

                  admin: {
                    initCollapsed: true,
                    description:
                      "Manage the social profiles shown in the footer.",
                  },

                  fields: [
                    {
                      name: "platform",
                      label: "Platform",
                      type: "select",
                      required: true,

                      options: [
                        {
                          label: "Facebook",
                          value: "facebook",
                        },
                        {
                          label: "Instagram",
                          value: "instagram",
                        },
                        {
                          label: "TikTok",
                          value: "tiktok",
                        },
                      ],
                    },

                    {
                      name: "url",
                      label: "Profile URL",
                      type: "text",
                      required: true,

                      validate: (value: unknown) => {
                        const href =
                          safeFooterHref(value);

                        return href?.startsWith(
                          "https://",
                        )
                          ? true
                          : "Enter a valid HTTPS profile URL.";
                      },
                    },

                    {
                      name: "visible",
                      label: "Show profile",
                      type: "checkbox",
                      defaultValue: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* -----------------------------------------------
           LINKS
        ----------------------------------------------- */

        {
          label: "Links",

          fields: [
            {
              name: "explore",
              type: "group",

              fields: navigationFields(
                D.explore.title,
                D.explore.links,
              ),
            },
          ],
        },

        /* -----------------------------------------------
           DISCOVER
        ----------------------------------------------- */

        {
          label: "Discover",

          fields: [
            {
              name: "discover",
              type: "group",

              fields: navigationFields(
                D.discover.title,
                D.discover.links,
              ),
            },
          ],
        },

        /* -----------------------------------------------
           CONTACT
        ----------------------------------------------- */

        {
          label: "Contact",

          fields: [
            {
              name: "contact",
              type: "group",

              fields: [
                text(
                  "eyebrow",
                  "Section eyebrow",
                  D.contact.eyebrow,
                ),

                text(
                  "headingLine1",
                  "Heading - line 1",
                  D.contact.headingLine1,
                ),

                text(
                  "headingLine2",
                  "Heading - line 2",
                  D.contact.headingLine2,
                ),

                textarea(
                  "description",
                  "Contact description",
                  D.contact.description,
                ),

                text(
                  "buttonLabel",
                  "Button text",
                  D.contact.buttonLabel,
                ),

                linkField(
                  "buttonHref",
                  "Button destination",
                  D.contact.buttonHref,
                ),
              ],
            },
          ],
        },

        /* -----------------------------------------------
           COPYRIGHT
        ----------------------------------------------- */

        {
          label: "Copyright",

          fields: [
            {
              name: "legal",
              type: "group",

              fields: [
                text(
                  "siteName",
                  "Business name",
                  D.legal.siteName,
                ),

                text(
                  "rightsText",
                  "Copyright statement",
                  D.legal.rightsText,
                ),

                text(
                  "privacyLabel",
                  "Privacy link text",
                  D.legal.privacyLabel,
                ),

                linkField(
                  "privacyHref",
                  "Privacy policy destination",
                  D.legal.privacyHref,
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
};
