
import type { CollectionConfig } from "payload";

import { buildCollectionAccess } from "@/access";
import { slugField } from "@/fields/slug";
import { getAppURL } from "@/lib/env";

// =====================================================
// NEPAL TIMEZONE CONFIGURATION
// =====================================================

const NEPAL_TIMEZONE = "Asia/Kathmandu";

const nepalTimezone = {
  defaultTimezone: NEPAL_TIMEZONE,
  supportedTimezones: [
    {
      label: "Nepal Standard Time (NPT, UTC+05:45)",
      value: NEPAL_TIMEZONE,
    },
  ],
};

// =====================================================
// EVENTS COLLECTION
// =====================================================

export const Events: CollectionConfig = {
  slug: "events",

  labels: {
    singular: "Event",
    plural: "Events",
  },

  // ===================================================
  // ACCESS CONTROL
  // ===================================================

  access: buildCollectionAccess("events", {
    drafts: true,
  }),

  // ===================================================
  // ADMIN PANEL
  // ===================================================

  admin: {
    group: "Events",

    useAsTitle: "title",

    defaultColumns: [
      "title",
      "startsAt",
      "location",
      "_status",
      "updatedAt",
    ],

    description:
      "Create, schedule, publish and manage events displayed at Cherry Blossom Garden. All event dates and times use Nepal Standard Time (NPT, UTC+05:45).",

    // -------------------------------------------------
    // DRAFT PREVIEW
    // -------------------------------------------------

    preview: (doc) =>
      `${getAppURL()}/next/event-preview?id=${encodeURIComponent(
        String(doc?.id ?? ""),
      )}`,

    // -------------------------------------------------
    // LIVE PREVIEW
    // -------------------------------------------------

    livePreview: {
      url: () => `${getAppURL()}/next/event-live`,

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

  // ===================================================
  // VERSIONING & DRAFTS
  // ===================================================

  versions: {
    maxPerDoc: 50,

    drafts: {
      autosave: {
        interval: 1000,
      },
    },
  },

  // ===================================================
  // COLLECTION FIELDS
  // ===================================================

  fields: [
    // -------------------------------------------------
    // EVENT URL SLUG
    // -------------------------------------------------

    {
      ...slugField("title"),

      admin: {
        position: "sidebar",

        description:
          "Public event URL. Changing this will change the event's URL.",
      },
    },

    // =================================================
    // TABS
    // =================================================

    {
      type: "tabs",

      tabs: [
        // =============================================
        // TAB 1: EVENT INFORMATION
        // =============================================

        {
          label: "Event Information",

          fields: [
            {
              name: "title",
              label: "Event Name",
              type: "text",
              required: true,
              maxLength: 150,
            },

            {
              name: "category",
              label: "Event Category",
              type: "select",
              required: true,

              options: [
                {
                  label: "Live Entertainment",
                  value: "LIVE ENTERTAINMENT",
                },
                {
                  label: "Rooftop Experience",
                  value: "ROOFTOP EXPERIENCE",
                },
                {
                  label: "Family & Lifestyle",
                  value: "FAMILY & LIFESTYLE",
                },
                {
                  label: "Garden & Lounge",
                  value: "GARDEN & LOUNGE",
                },
                {
                  label: "Private Dining",
                  value: "PRIVATE DINING",
                },
                {
                  label: "Special Event",
                  value: "SPECIAL EVENT",
                },
                {
                  label: "Other",
                  value: "OTHER",
                },
              ],
            },

            {
              name: "description",
              label: "Short Description",
              type: "textarea",
              required: true,
              maxLength: 500,

              admin: {
                description:
                  "Displayed on the upcoming-event card and event details page.",
              },
            },

            {
              name: "details",
              label: "Full Event Description",
              type: "textarea",

              admin: {
                description:
                  "Detailed information about the event. Use blank lines to separate paragraphs.",
              },
            },

            {
              name: "highlights",
              label: "Event Highlights",
              type: "array",
              maxRows: 12,

              admin: {
                initCollapsed: true,
                description:
                  "Add special features or highlights of the event.",
              },

              fields: [
                {
                  name: "label",
                  label: "Highlight",
                  type: "text",
                  required: true,
                },
              ],
            },
          ],
        },

        // =============================================
        // TAB 2: SCHEDULE & LOCATION
        // =============================================

        {
          label: "Schedule & Location",

          fields: [
            // -----------------------------------------
            // EVENT START DATE & TIME - NEPAL
            // -----------------------------------------

            {
              name: "startsAt",

              label:
                "Event Start Date & Time (Nepal)",

              type: "date",

              required: true,
              index: true,

              timezone: {
                ...nepalTimezone,
                required: true,
              },

              admin: {
                description:
                  "Select the event start date and time in Nepal Standard Time (NPT, UTC+05:45).",

                date: {
                  pickerAppearance: "dayAndTime",

                  displayFormat:
                    "dd MMM yyyy, h:mm aa",

                  timeFormat: "h:mm aa",

                  timeIntervals: 15,
                },
              },
            },

            // -----------------------------------------
            // EVENT END DATE & TIME - NEPAL
            // -----------------------------------------

            {
              name: "endsAt",

              label:
                "Event End Date & Time (Nepal)",

              type: "date",

              timezone: nepalTimezone,

              admin: {
                description:
                  "Optional. Select the event end date and time in Nepal Standard Time (NPT, UTC+05:45).",

                date: {
                  pickerAppearance: "dayAndTime",

                  displayFormat:
                    "dd MMM yyyy, h:mm aa",

                  timeFormat: "h:mm aa",

                  timeIntervals: 15,
                },
              },
            },

            // -----------------------------------------
            // EVENT LOCATION
            // -----------------------------------------

            {
              name: "location",
              label: "Venue / Floor",
              type: "text",
              required: true,

              defaultValue:
                "Cherry Blossom Garden",

              admin: {
                description:
                  "Example: Second Floor - Rooftop BBQ & Events.",
              },
            },

            // -----------------------------------------
            // ADDITIONAL ADDRESS
            // -----------------------------------------

            {
              name: "address",

              label:
                "Additional Location Details",

              type: "textarea",

              admin: {
                description:
                  "Optional meeting point, floor information or event-specific venue instructions.",
              },
            },
          ],
        },

        // =============================================
        // TAB 3: EVENT IMAGES
        // =============================================

        {
          label: "Images",

          fields: [
            {
              name: "image",

              label: "Featured Event Image",

              type: "upload",

              relationTo: "media",

              admin: {
                description:
                  "Upload the main event photograph. It appears on the event card and details page.",
              },
            },

            {
              name: "imagePath",

              label: "Fallback Image Path",

              type: "text",

              defaultValue:
                "/assets/first-floor.png",

              admin: {
                description:
                  "Default photograph when no image is uploaded.",
              },
            },

            {
              name: "imageAlt",

              label: "Image Description",

              type: "text",

              admin: {
                description:
                  "Describe the image for accessibility and SEO.",
              },
            },
          ],
        },

        // =============================================
        // TAB 4: BOOKING
        // =============================================

        {
          label: "Booking",

          fields: [
            {
              name: "bookingLabel",

              label: "Booking Button Text",

              type: "text",

              defaultValue:
                "Reserve Your Place",
            },

            {
              name: "bookingUrl",

              label:
                "Booking / Reservation URL",

              type: "text",

              validate: (value: unknown) => {
                if (!value) return true;

                if (
                  typeof value === "string" &&
                  (
                    (
                      value.startsWith("/") &&
                      !value.startsWith("//") &&
                      !value.includes("\\")
                    ) ||
                    /^https:\/\/[^\s]+$/i.test(value)
                  )
                ) {
                  return true;
                }

                return (
                  "Use an internal URL beginning " +
                  "with / or a valid HTTPS URL."
                );
              },

              admin: {
                description:
                  "Optional. Enter an internal reservation page or external HTTPS booking link. Leave empty when booking is unavailable.",
              },
            },
          ],
        },
      ],
    },
  ],
};
