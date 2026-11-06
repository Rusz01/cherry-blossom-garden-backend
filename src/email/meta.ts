import { createHash } from 'crypto'

import type { EmailCategory } from './constants'

/**
 * Payload's built-in auth emails (forgot password, verification) call
 * `email.sendEmail({ html, subject, to })` without any metadata. To categorise,
 * tag and de-duplicate them, our templates embed a small HTML comment that the
 * email adapter reads and strips before sending. It never contains secrets.
 */
export type EmailMeta = {
  category: EmailCategory
  userId?: string | number
  /** Sent to Resend as an idempotency key to prevent duplicate sends. */
  idempotencyKey?: string
}

const PREFIX = '<!--arthanova-email-meta:'
const SUFFIX = '-->'
const PATTERN = /<!--arthanova-email-meta:([A-Za-z0-9+/=_-]+)-->/

export const embedEmailMeta = (html: string, meta: EmailMeta): string =>
  `${PREFIX}${Buffer.from(JSON.stringify(meta)).toString('base64url')}${SUFFIX}${html}`

export const extractEmailMeta = (html: string): { html: string; meta: EmailMeta | null } => {
  const match = PATTERN.exec(html)
  if (!match) return { html, meta: null }
  try {
    const meta = JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8')) as EmailMeta
    return { html: html.replace(PATTERN, ''), meta }
  } catch {
    return { html: html.replace(PATTERN, ''), meta: null }
  }
}

/** One-way fingerprint so a token can be part of an idempotency key without exposing it. */
export const fingerprint = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 16)
