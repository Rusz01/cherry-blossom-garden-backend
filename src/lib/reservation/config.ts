/** Shared, browser-safe reservation defaults and date rules. */
export type ReservationRules = {
  enabled: boolean
  maxGuests: number
  maxDaysAhead: number
  blockedWeekdays: string[]
  blockedDates: string[]
  blockedRanges: Array<{ start: string; end: string }>
  timeSlots: string[]
}

export type ReservationView = {
  seoTitle: string
  seoDescription: string
  reservationLabel: string
  reservationHeading1: string
  reservationHeading2: string
  reservationAccent: string
  reservationDescription: string
  contactLabel: string
  contactHeading1: string
  contactHeading2: string
  contactDescription: string
  enquiryTitle: string
  enquiryDescription: string
  contact: {
    email: string
    phone: string
    address: string
    hours: string
    mapsUrl: string
  }
  booking: ReservationRules
}

export const DEFAULT_RESERVATION: ReservationView = {
  seoTitle: 'Reservation & Contact | Cherry Blossom Garden',
  seoDescription: 'Plan your visit to Cherry Blossom Garden. Request a table or contact our team.',
  reservationLabel: 'Make a Reservation',
  reservationHeading1: 'A Beautiful',
  reservationHeading2: 'Experience',
  reservationAccent: 'Awaits.',
  reservationDescription: 'Good food, beautiful spaces and memorable moments. We look forward to welcoming you.',
  contactLabel: 'Contact Us',
  contactHeading1: "We're Here",
  contactHeading2: 'for You.',
  contactDescription: 'Planning a celebration, have a question or looking for something special? Our team would love to hear from you.',
  enquiryTitle: 'Send Us a Message.',
  enquiryDescription: 'Not making a reservation? Send us your enquiry here.',
  contact: { email: '', phone: '', address: '', hours: '', mapsUrl: '' },
  booking: {
    enabled: true,
    maxGuests: 20,
    maxDaysAhead: 90,
    blockedWeekdays: [],
    blockedDates: [],
    blockedRanges: [],
    timeSlots: ['11:00', '12:00', '13:00', '14:00', '15:00', '17:00', '18:00', '19:00', '20:00'],
  },
}

const obj = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {}
const stringOr = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value : fallback
const day = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value)
  return !Number.isNaN(date.valueOf()) ? getNepalToday(date) : ''
}
const intOr = (value: unknown, fallback: number, min: number, max: number): number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max
    ? value as number : fallback

/** Accepts a Payload global document or the already-normalized preview data. */
export function normalizeReservationContent(raw: unknown): ReservationView {
  const value = obj(raw)
  const contact = obj(value.contact)
  const booking = obj(value.booking)
  const defaults = DEFAULT_RESERVATION

  const dates = Array.isArray(booking.blockedDates) ? booking.blockedDates : []
  const ranges = Array.isArray(booking.blockedRanges) ? booking.blockedRanges : []
  const slots = Array.isArray(booking.timeSlots) ? booking.timeSlots : null
  const weekdays = Array.isArray(booking.blockedWeekdays) ? booking.blockedWeekdays : []

  return {
    seoTitle: stringOr(value.seoTitle, defaults.seoTitle),
    seoDescription: stringOr(value.seoDescription, defaults.seoDescription),
    reservationLabel: stringOr(value.reservationLabel, defaults.reservationLabel),
    reservationHeading1: stringOr(value.reservationHeading1, defaults.reservationHeading1),
    reservationHeading2: stringOr(value.reservationHeading2, defaults.reservationHeading2),
    reservationAccent: stringOr(value.reservationAccent, defaults.reservationAccent),
    reservationDescription: stringOr(value.reservationDescription, defaults.reservationDescription),
    contactLabel: stringOr(value.contactLabel, defaults.contactLabel),
    contactHeading1: stringOr(value.contactHeading1, defaults.contactHeading1),
    contactHeading2: stringOr(value.contactHeading2, defaults.contactHeading2),
    contactDescription: stringOr(value.contactDescription, defaults.contactDescription),
    enquiryTitle: stringOr(value.enquiryTitle, defaults.enquiryTitle),
    enquiryDescription: stringOr(value.enquiryDescription, defaults.enquiryDescription),
    contact: {
      email: stringOr(contact.email, defaults.contact.email),
      phone: stringOr(contact.phone, defaults.contact.phone),
      address: stringOr(contact.address, defaults.contact.address),
      hours: stringOr(contact.hours, defaults.contact.hours),
      mapsUrl: stringOr(contact.mapsUrl, defaults.contact.mapsUrl),
    },
    booking: {
      enabled: typeof booking.enabled === 'boolean' ? booking.enabled : defaults.booking.enabled,
      maxGuests: intOr(booking.maxGuests, defaults.booking.maxGuests, 1, 100),
      maxDaysAhead: intOr(booking.maxDaysAhead, defaults.booking.maxDaysAhead, 1, 365),
      blockedWeekdays: weekdays.filter((v): v is string => typeof v === 'string' && /^[0-6]$/.test(v)),
      blockedDates: dates.map((v) => day(typeof v === 'string' ? v : obj(v).date)).filter(Boolean),
      blockedRanges: ranges.map((v) => {
        const row = obj(v)
        return { start: day(row.startDate ?? row.start), end: day(row.endDate ?? row.end) }
      }).filter((v) => v.start && v.end),
      timeSlots: (slots ?? defaults.booking.timeSlots).map((v) =>
        typeof v === 'string' ? v : obj(v).time,
      ).filter((v): v is string => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v)),
    },
  }
}

/** Current calendar date at the venue, regardless of the visitor's timezone. */
export function getNepalToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}

export function getNepalTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('hour')}:${pick('minute')}`
}

export function bookingDateError(date: string, rules: ReservationRules, now = new Date()): string | null {
  if (!rules.enabled) return 'Online reservation requests are temporarily unavailable.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Please select a valid date.'
  const selected = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(selected.valueOf()) || selected.toISOString().slice(0, 10) !== date) {
    return 'Please select a valid date.'
  }
  const today = getNepalToday(now)
  if (date < today) return 'Please select a future date.'
  const end = new Date(`${today}T00:00:00.000Z`)
  end.setUTCDate(end.getUTCDate() + rules.maxDaysAhead)
  if (date > end.toISOString().slice(0, 10)) return 'This date is outside our booking window.'
  if (rules.blockedWeekdays.includes(String(selected.getUTCDay())) || rules.blockedDates.includes(date)) {
    return 'We are not taking reservations on this date.'
  }
  if (rules.blockedRanges.some((range) => date >= range.start && date <= range.end)) {
    return 'We are not taking reservations on this date.'
  }
  return null
}
