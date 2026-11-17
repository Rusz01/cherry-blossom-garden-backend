import type { Payload } from 'payload'
import { embedEmailMeta, fingerprint } from '@/email/meta'
import { getEmailConfig } from '@/lib/env'

export type ReservationSubmission = {
  name: string; email: string; phone: string
  date: string; time: string; guests: number; experience: 'cafe' | 'restaurant' | 'garden-balcony' | 'private-dining' | 'rooftop'
  occasion: string; message: string
}
export type ContactSubmission = { name: string; email: string; message: string }
export type FormEmailStatus = 'submitted' | 'partial' | 'failed' | 'captured'

const escapeHTML = (value: unknown): string => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const shell = (title: string, content: string): string => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f8f5f3;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#252224">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border:1px solid #eadfe0;border-radius:10px" cellspacing="0" cellpadding="0">
<tr><td style="background:#111113;padding:26px 30px;color:#f6edf0;letter-spacing:2px;font-size:13px">CHERRY BLOSSOM GARDEN</td></tr>
<tr><td style="padding:28px 30px"><h1 style="font-size:25px;color:#684149;margin:0 0 20px">${escapeHTML(title)}</h1>${content}</td></tr>
<tr><td style="padding:20px 30px;background:#faf7f7;color:#76666a;font-size:12px">Cherry Blossom Garden · Kathmandu, Nepal</td></tr>
</table></td></tr></table></body></html>`

const row = (label: string, value: unknown): string => `<tr><th align="left" valign="top" style="padding:9px 12px 9px 0;color:#70575d;font-size:13px">${escapeHTML(label)}</th><td style="padding:9px 0;font-size:13px;white-space:pre-wrap">${escapeHTML(value)}</td></tr>`
const table = (rows: Array<[string, unknown]>): string =>
  `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">${rows.map(([key, value]) => row(key, value)).join('')}</table>`

const experienceNames: Record<string, string> = {
  cafe: 'Café', restaurant: 'Restaurant', 'garden-balcony': 'Garden Balcony',
  'private-dining': 'Private Dining', rooftop: 'Rooftop',
}

export async function sendFormEmails(args: {
  payload: Payload
  kind: 'reservation' | 'contact'
  id: string | number
  submission: ReservationSubmission | ContactSubmission
  staffEmails: string[]
}): Promise<FormEmailStatus> {
  const { payload, kind, id, submission } = args
  const staffEmails = [...new Set(args.staffEmails.map((v) => v.trim().toLowerCase()).filter(Boolean))]
  const isReservation = kind === 'reservation'
  const booking = isReservation ? submission as ReservationSubmission : null
  const details: Array<[string, unknown]> = [
    ['Name', submission.name], ['Email', submission.email],
    ...(booking ? [
      ['Phone', booking.phone], ['Date', booking.date], ['Time (Nepal)', booking.time],
      ['Guests', booking.guests], ['Experience', experienceNames[booking.experience] ?? booking.experience],
      ['Occasion', booking.occasion || 'Not specified'],
    ] as Array<[string, unknown]> : []),
    ['Message', submission.message || 'Not provided'],
  ]

  const staffSubject = isReservation ? `New reservation request — ${submission.name}` : `New contact enquiry — ${submission.name}`
  const guestSubject = isReservation
    ? 'Your reservation request — Cherry Blossom Garden'
    : 'We received your message — Cherry Blossom Garden'

  const staffHTML = shell(staffSubject, `<p>A new ${kind} submission was saved in Payload CMS.</p>${table(details)}<p style="font-size:12px;color:#70575d">Reply to this email to respond to the guest.</p>`)
  const guestHTML = shell(guestSubject,
    `<p>Dear ${escapeHTML(submission.name)},</p><p>Thank you for getting in touch with Cherry Blossom Garden.</p>` +
    (booking
      ? `<p>We have received your reservation <strong>request</strong>. This is <strong>not a confirmed reservation</strong>. Our team will contact you to confirm availability.</p>${table(details.filter(([label]) => label !== 'Email' && label !== 'Phone'))}`
      : `<p>Our team has received your message and will respond as soon as possible.</p>${table([['Your message', submission.message]])}`) +
    `<p style="margin-top:25px">Warm regards,<br>Cherry Blossom Garden Team</p>`)

  const replyTo = getEmailConfig().replyTo
  const messages = [
    ...staffEmails.map((to) => ({
      to,
      subject: staffSubject,
      html: embedEmailMeta(staffHTML, {
        category: kind,
        idempotencyKey: `${kind}/${id}/staff/${fingerprint(to)}`,
      }),
      text: `New ${kind} submission\n\n${details.map(([key, value]) => `${key}: ${value}`).join('\n')}`,
      replyTo: submission.email,
    })),
    {
      to: submission.email,
      subject: guestSubject,
      html: embedEmailMeta(guestHTML, {
        category: kind,
        idempotencyKey: `${kind}/${id}/guest`,
      }),
      text: isReservation
        ? `Dear ${submission.name},\n\nYour reservation request has been received. It is not yet confirmed. Our team will contact you.\n\nCherry Blossom Garden`
        : `Dear ${submission.name},\n\nYour enquiry has been received. Our team will respond soon.\n\nCherry Blossom Garden`,
      ...(replyTo ? { replyTo } : {}),
    },
  ]

  const results = await Promise.allSettled(messages.map((message) => payload.sendEmail(message)))
  const submitted = results.filter((item) =>
    item.status === 'fulfilled' && (item.value as { status?: string } | undefined)?.status === 'submitted',
  ).length
  const captured = results.filter((item) =>
    item.status === 'fulfilled' && (item.value as { status?: string } | undefined)?.status === 'captured',
  ).length
  if (submitted === messages.length && staffEmails.length > 0) return 'submitted'
  if (captured === messages.length) return 'captured'
  if (submitted > 0 || captured > 0) return 'partial'
  return 'failed'
}
