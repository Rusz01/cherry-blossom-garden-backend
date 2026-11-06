import type { ReactElement } from 'react'
import type { Payload } from 'payload'

import { getEmailConfig } from '@/lib/env'

import type { ArthanovaSendResult } from './adapter'
import { embedEmailMeta, type EmailMeta } from './meta'
import { renderEmail } from './render'

export type SendTemplateEmailArgs = {
  payload: Payload
  to: string | string[]
  subject: string
  template: ReactElement
  meta: EmailMeta
  replyTo?: string
}

/**
 * The single entry point for application emails. Renders a React Email
 * template (HTML + plain text) and hands it to `payload.sendEmail`, which
 * routes through the Arthanova email adapter (logging, tagging, idempotency).
 */
export const sendTemplateEmail = async ({
  payload,
  to,
  subject,
  template,
  meta,
  replyTo,
}: SendTemplateEmailArgs): Promise<ArthanovaSendResult> => {
  const { html, text } = await renderEmail(template)
  const config = getEmailConfig()

  return (await payload.sendEmail({
    to,
    subject,
    html: embedEmailMeta(html, meta),
    text,
    replyTo: replyTo ?? config.replyTo,
  })) as ArthanovaSendResult
}

/**
 * For non-critical notifications (e.g. welcome emails): never throws, so a
 * provider outage cannot invalidate an operation that already succeeded.
 */
export const sendNonCriticalEmail = async (
  args: SendTemplateEmailArgs,
): Promise<ArthanovaSendResult | null> => {
  try {
    return await sendTemplateEmail(args)
  } catch {
    // Details were already logged and recorded in Email Logs by the adapter.
    return null
  }
}
