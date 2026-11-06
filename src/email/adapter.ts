import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import type { EmailAdapter, Payload, SendEmailOptions } from 'payload'
import { toPlainText } from 'react-email'
import { Resend } from 'resend'

import { getEmailConfig, type EmailEnvConfig } from '@/lib/env'

import type { EmailCategory, EmailLogStatus } from './constants'
import { EmailNotConfiguredError, summarizeError } from './errors'
import { extractEmailMeta, type EmailMeta } from './meta'

export type ArthanovaSendResult = {
  status: Extract<EmailLogStatus, 'submitted' | 'captured'>
  /** Resend message id (or a dev-outbox file id). */
  id: string
}

type Address = NonNullable<SendEmailOptions['to']>

const toAddressList = (value: Address | undefined): string[] => {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]
  return list
    .map((entry) => (typeof entry === 'string' ? entry : entry.address))
    .filter((entry): entry is string => Boolean(entry))
}

const formatFrom = (from: SendEmailOptions['from'], config: EmailEnvConfig): string => {
  if (!from) return `${config.fromName} <${config.fromAddress}>`
  if (typeof from === 'string') return from
  return `${from.name} <${from.address}>`
}

/** Resend tag values only allow ASCII letters, numbers, underscores and dashes. */
const tagValue = (value: string): string => value.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 256)

let resendClient: Resend | null = null
let resendClientKey: string | undefined

const getResend = (apiKey: string): Resend => {
  if (!resendClient || resendClientKey !== apiKey) {
    resendClient = new Resend(apiKey)
    resendClientKey = apiKey
  }
  return resendClient
}

type LogEntry = {
  category: EmailCategory
  status: EmailLogStatus
  recipient: string
  subject: string
  relatedUserId?: string
  providerMessageId?: string
  error?: string
}

/**
 * Records an email attempt. Written outside the caller's transaction so that
 * failures are still recorded when the surrounding operation rolls back.
 * Logging must never break sending, so errors here are swallowed.
 */
const recordAttempt = async (payload: Payload, entry: LogEntry): Promise<void> => {
  try {
    await payload.create({
      collection: 'email-logs',
      overrideAccess: true,
      data: { ...entry, attemptedAt: new Date().toISOString() },
    })
  } catch (error) {
    payload.logger.warn({ msg: '[email] Could not write email log entry.', error: summarizeError(error) })
  }
}

const writeToDevOutbox = async (
  message: { to: string[]; subject: string; html: string; text: string },
  meta: EmailMeta | null,
): Promise<string> => {
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${meta?.category ?? 'email'}`
  const dir = path.resolve(process.cwd(), '.dev-outbox')
  await mkdir(dir, { recursive: true })
  const header = `<!-- To: ${message.to.join(', ')} | Subject: ${message.subject} -->\n`
  await writeFile(path.join(dir, `${id}.html`), header + message.html, 'utf8')
  await writeFile(path.join(dir, `${id}.txt`), message.text, 'utf8')
  return id
}

/**
 * Arthanova Studio email adapter.
 *
 * Implements Payload's `EmailAdapter` contract, so Payload's own emails
 * (password reset, verification) and our custom emails share one pipeline via
 * `payload.sendEmail`. Delivery uses the official Resend SDK directly because
 * the `@payloadcms/email-resend` adapter does not forward tags or idempotency
 * keys, which we use for categorisation and duplicate protection.
 *
 * Behaviour when Resend is not configured:
 *   - `EMAIL_DEV_OUTBOX=true` (non-production only): emails are written to
 *     `.dev-outbox/` and logged as "captured". Nothing is sent.
 *   - otherwise: the attempt is logged as "not-configured" and an error is
 *     thrown, so callers never assume an email was sent.
 */
export const arthanovaEmailAdapter = (): EmailAdapter<ArthanovaSendResult> => {
  return ({ payload }) => {
    const config = getEmailConfig()

    if (!config.enabled) {
      payload.logger.warn(
        config.devOutbox
          ? '[email] Resend is not configured. Emails will be written to .dev-outbox/ (development only).'
          : '[email] Resend is not configured (RESEND_API_KEY / EMAIL_FROM_ADDRESS). Emails will not be sent.',
      )
    }

    return {
      name: 'arthanova-resend',
      defaultFromAddress: config.fromAddress,
      defaultFromName: config.fromName,

      sendEmail: async (message) => {
        const { html: rawHTML, meta } = extractEmailMeta(message.html?.toString() ?? '')
        const html = rawHTML
        const text = message.text?.toString() || (html ? toPlainText(html) : '')
        const subject = message.subject ?? ''
        const category: EmailCategory = meta?.category ?? 'system'
        const intendedRecipients = toAddressList(message.to)
        const to = config.overrideRecipient ? [config.overrideRecipient] : intendedRecipients
        const baseLog = {
          category,
          recipient: intendedRecipients.join(', ').slice(0, 320),
          subject: subject.slice(0, 300),
          relatedUserId: meta?.userId !== undefined ? String(meta.userId) : undefined,
        }

        if (to.length === 0) {
          throw new Error('Cannot send an email without a recipient.')
        }

        if (!config.enabled) {
          if (config.devOutbox) {
            const id = await writeToDevOutbox({ to, subject, html, text }, meta)
            payload.logger.info({ msg: '[email] Captured in dev outbox (not sent).', category, outboxId: id })
            await recordAttempt(payload, { ...baseLog, status: 'captured', providerMessageId: id })
            return { status: 'captured', id }
          }

          payload.logger.warn({ msg: '[email] Not sent: email delivery is not configured.', category })
          await recordAttempt(payload, {
            ...baseLog,
            status: 'not-configured',
            error: 'RESEND_API_KEY or EMAIL_FROM_ADDRESS is not set.',
          })
          throw new EmailNotConfiguredError()
        }

        try {
          const resend = getResend(config.apiKey as string)
          const replyTo = toAddressList(message.replyTo as Address | undefined)

          const { data, error } = await resend.emails.send(
            {
              from: formatFrom(message.from, config),
              to,
              subject,
              html,
              text,
              ...(toAddressList(message.cc as Address | undefined).length
                ? { cc: toAddressList(message.cc as Address) }
                : {}),
              ...(toAddressList(message.bcc as Address | undefined).length
                ? { bcc: toAddressList(message.bcc as Address) }
                : {}),
              replyTo: replyTo.length ? replyTo : config.replyTo,
              tags: [
                { name: 'category', value: tagValue(category) },
                { name: 'app', value: 'arthanova-cms' },
              ],
            },
            meta?.idempotencyKey ? { idempotencyKey: meta.idempotencyKey } : undefined,
          )

          if (error || !data?.id) {
            throw new Error(error ? `${error.name}: ${error.message}` : 'Resend returned no message id.')
          }

          payload.logger.info({ msg: '[email] Submitted to Resend.', category, providerMessageId: data.id })
          await recordAttempt(payload, { ...baseLog, status: 'submitted', providerMessageId: data.id })
          return { status: 'submitted', id: data.id }
        } catch (error) {
          const summary = summarizeError(error)
          payload.logger.error({ msg: '[email] Delivery request failed.', category, error: summary })
          await recordAttempt(payload, { ...baseLog, status: 'failed', error: summary })
          throw error
        }
      },
    }
  }
}
