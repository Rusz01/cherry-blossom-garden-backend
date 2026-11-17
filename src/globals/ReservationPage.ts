import type { Field, GlobalConfig } from 'payload'
import { buildGlobalAccess } from '@/access'
import { getAppURL } from '@/lib/env'
import { DEFAULT_RESERVATION as D } from '@/lib/reservation/config'

type TextKey = { [K in keyof typeof D]: (typeof D)[K] extends string ? K : never }[keyof typeof D]

const text = (name: TextKey, label: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue: D[name],
  maxLength: 200,
})
const paragraph = (name: TextKey, label: string): Field => ({
  name,
  label,
  type: 'textarea',
  defaultValue: D[name],
  maxLength: 1000,
})
const dateField = (name: string, label: string): Field => ({
  name,
  label,
  type: 'date',
  required: true,
  timezone: {
    defaultTimezone: 'Asia/Kathmandu',
    required: true,
    supportedTimezones: [{ label: 'Nepal Standard Time', value: 'Asia/Kathmandu' }],
  },
  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' } },
})

export const ReservationPage: GlobalConfig = {
  slug: 'reservation-page',
  dbName: 'resv',
  label: 'Reservation & Contact Page',
  admin: {
    group: 'Content',
    description:
      'Edit both sides of the page and control dates, days, times and guest limits. Publish changes to make them public.',
    preview: () => `${getAppURL()}/next/reservation-preview`,
    livePreview: {
      url: () => `${getAppURL()}/reservation`,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  access: buildGlobalAccess('reservation-page'),
  versions: { max: 50, drafts: { autosave: { interval: 1000 } } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Reservation Content',
          fields: [
            text('reservationLabel', 'Eyebrow'),
            text('reservationHeading1', 'Heading, line 1'),
            text('reservationHeading2', 'Heading, line 2'),
            text('reservationAccent', 'Accent heading'),
            paragraph('reservationDescription', 'Introduction'),
          ],
        },
        {
          label: 'Contact Content',
          fields: [
            text('contactLabel', 'Eyebrow'),
            text('contactHeading1', 'Heading, line 1'),
            text('contactHeading2', 'Heading, line 2'),
            paragraph('contactDescription', 'Introduction'),
            text('enquiryTitle', 'Enquiry form heading'),
            paragraph('enquiryDescription', 'Enquiry form description'),
            {
              name: 'contact',
              type: 'group',
              label: 'Public contact details',
              fields: [
                { name: 'email', type: 'email', label: 'Public email' },
                { name: 'phone', type: 'text', label: 'Phone', maxLength: 40 },
                { name: 'address', type: 'textarea', label: 'Address', maxLength: 400 },
                { name: 'hours', type: 'textarea', label: 'Opening hours', maxLength: 300 },
                {
                  name: 'mapsUrl',
                  type: 'text',
                  label: 'Google Maps URL',
                  validate: (v: unknown) =>
                    !v || /^https:\/\//i.test(String(v)) || 'Enter a full https:// URL.',
                },
              ],
            },
          ],
        },
        {
          label: 'Booking Availability',
          fields: [
            {
              name: 'booking',
              type: 'group',
              label: 'Reservation request rules',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: D.booking.enabled,
                  label: 'Accept online reservation requests',
                },
                {
                  name: 'maxGuests',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 100,
                  defaultValue: D.booking.maxGuests,
                  label: 'Maximum online guests per request',
                },
                {
                  name: 'maxDaysAhead',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 365,
                  defaultValue: D.booking.maxDaysAhead,
                  label: 'Maximum advance booking days',
                },
                {
                  name: 'blockedWeekdays',
                  type: 'select',
                  hasMany: true,
                  defaultValue: [],
                  label: 'Closed weekdays',
                  options: [
                    { label: 'Sunday', value: '0' },
                    { label: 'Monday', value: '1' },
                    { label: 'Tuesday', value: '2' },
                    { label: 'Wednesday', value: '3' },
                    { label: 'Thursday', value: '4' },
                    { label: 'Friday', value: '5' },
                    { label: 'Saturday', value: '6' },
                  ],
                },
                {
                  name: 'blockedDates',
                  type: 'array',
                  label: 'Individual blocked dates',
                  maxRows: 366,
                  fields: [
                    dateField('date', 'Blocked date'),
                    { name: 'reason', type: 'text', label: 'Internal reason', maxLength: 160 },
                  ],
                },
                {
                  name: 'blockedRanges',
                  type: 'array',
                  label: 'Blocked date ranges',
                  maxRows: 100,
                  fields: [
                    dateField('startDate', 'From'),
                    dateField('endDate', 'To (inclusive)'),
                    { name: 'reason', type: 'text', label: 'Internal reason', maxLength: 160 },
                  ],
                },
                {
                  name: 'timeSlots',
                  type: 'array',
                  label: 'Preferred arrival times (Nepal time)',
                  defaultValue: D.booking.timeSlots.map((time) => ({ time })),
                  fields: [
                    {
                      name: 'time',
                      type: 'text',
                      required: true,
                      label: '24-hour time (HH:MM)',
                      validate: (v: unknown) =>
                        /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v ?? '')) ||
                        'Enter a time such as 18:30.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [text('seoTitle', 'Page title'), paragraph('seoDescription', 'Meta description')],
        },
      ],
    },
  ],
}
