import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/cms/payload'
import { bookingDateError, getNepalTime, getNepalToday, normalizeReservationContent } from '@/lib/reservation/config'
import { sendFormEmails, type ContactSubmission, type FormEmailStatus, type ReservationSubmission } from '@/lib/reservation/emails'

export const runtime = 'nodejs'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_EXPERIENCES = new Set(['cafe', 'restaurant', 'garden-balcony', 'private-dining', 'rooftop'])

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } })
const readString = (data: Record<string, unknown>, field: string, max: number): string | null => {
  const value = data[field]
  if (typeof value !== 'string' || value.length > max) return null
  return value.trim()
}
const getEmailList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const email = item && typeof item === 'object' && 'email' in item ? item.email : null
    return typeof email === 'string' && EMAIL_PATTERN.test(email.trim()) ? [email.trim()] : []
  })
}

/** Save before sending. A provider outage must not erase a valid request. */
async function notify(
  collection: 'reservations' | 'contact-messages',
  id: number,
  submission: ReservationSubmission | ContactSubmission,
) {
  const payload = await getPayloadClient()
  let status: FormEmailStatus = 'failed'
  try {
    const settings = await payload.findGlobal({ slug: 'form-notifications', depth: 0, overrideAccess: true })
    const recipients = collection === 'reservations'
      ? getEmailList(settings.reservationRecipients)
      : getEmailList(settings.contactRecipients)
    if (!recipients.length) payload.logger.warn(`[forms] No notification recipients configured for ${collection}.`)
    status = await sendFormEmails({
      payload,
      kind: collection === 'reservations' ? 'reservation' : 'contact',
      id,
      submission,
      staffEmails: recipients,
    })
  } catch (cause) {
    payload.logger.error({ msg: `[forms] Email handling failed for ${collection} ${id}.`, error: String(cause) })
  }
  try {
    if (collection === 'reservations') {
      await payload.update({ collection: 'reservations', id, data: { emailStatus: status }, overrideAccess: true })
    } else {
      await payload.update({ collection: 'contact-messages', id, data: { emailStatus: status }, overrideAccess: true })
    }
  } catch (cause) {
    payload.logger.error({ msg: '[forms] Could not update email status.', error: String(cause) })
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin')
    if (origin && new URL(origin).origin !== request.nextUrl.origin) return error('Invalid request origin.', 403)
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return error('Expected JSON.', 415)
    }
    const raw = await request.text()
    if (raw.length > 12_000) return error('Request is too large.', 413)
    let input: unknown
    try { input = JSON.parse(raw) } catch { return error('Invalid JSON.', 400) }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return error('Invalid request.', 400)
    const data = input as Record<string, unknown>

    // Honeypot: a hidden field used only by bots. Do not persist or email it.
    if (data.website) return NextResponse.json({ ok: true })
    const kind = data.type
    if (kind !== 'reservation' && kind !== 'contact') return error('Invalid form type.', 400)
    const name = readString(data, 'name', 120)
    const email = readString(data, 'email', 254)?.toLowerCase() ?? null
    const message = readString(data, 'message', kind === 'reservation' ? 1000 : 3000)
    if (!name || !email || !EMAIL_PATTERN.test(email) || message === null) {
      return error('Please provide a valid name, email address and message.', 422)
    }
    if (kind === 'contact' && !message) return error('Please enter your message.', 422)
    const payload = await getPayloadClient()

    if (kind === 'contact') {
      const submission: ContactSubmission = { name, email, message }
      const record = await payload.create({
        collection: 'contact-messages', data: { ...submission, status: 'new', emailStatus: 'pending' },
        overrideAccess: true,
      })
      await notify('contact-messages', record.id, submission)
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    // Never trust frontend date rules. The public page may be stale or tampered with.
    const page = await payload.findGlobal({ slug: 'reservation-page', draft: false, depth: 0, overrideAccess: true })
    const rules = normalizeReservationContent(page._status === 'published' ? page : null).booking
    const date = readString(data, 'date', 10)
    const time = readString(data, 'time', 5)
    const phone = readString(data, 'phone', 35)
    const experience = readString(data, 'experience', 50)
    const occasion = readString(data, 'occasion', 100)
    const guests = data.guests
    if (!date || !time || !phone || !experience || occasion === null ||
      !Number.isInteger(guests) || (guests as number) < 1 || (guests as number) > rules.maxGuests) {
      return error('Please check your reservation details.', 422)
    }
    const unavailableReason = bookingDateError(date, rules)
    if (unavailableReason) return error(unavailableReason, 409)
    if (!rules.timeSlots.includes(time) || !ALLOWED_EXPERIENCES.has(experience)) {
      return error('Please choose a valid experience and preferred time.', 422)
    }
    if (date === getNepalToday() && time <= getNepalTime()) {
      return error('Please select a future arrival time.', 409)
    }
    const submission: ReservationSubmission = {
      name, email, phone, date, time, guests: guests as number, experience: experience as ReservationSubmission['experience'], occasion, message,
    }
    const record = await payload.create({
      collection: 'reservations', data: { ...submission, status: 'pending', emailStatus: 'pending' },
      overrideAccess: true,
    })
    await notify('reservations', record.id, submission)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (cause) {
    console.error('[forms] Submission failed:', cause)
    return error('We could not save your request. Please try again.', 500)
  }
}
