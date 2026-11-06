import type { CollectionConfig } from 'payload'

import type { UserDocument } from '@/access'
import { getEmailConfig } from '@/lib/env'

import { PASSWORD_RESET_TTL_MS, describeDuration } from '../constants'
import { embedEmailMeta, fingerprint } from '../meta'
import { displayName } from '../recipient'
import { renderEmail } from '../render'
import { PasswordResetEmail } from '../templates/PasswordResetEmail'
import { getEmailURLs } from '../urls'

type ForgotPasswordConfig = NonNullable<Exclude<CollectionConfig['auth'], boolean | undefined>['forgotPassword']>

/**
 * Branded password reset built on Payload's native forgot-password flow:
 * Payload generates and stores the token, enforces expiry and rate limits, and
 * serves the reset screen at /admin/reset/:token. We only render the email.
 *
 * Delivery failures propagate (Payload rolls back the token and returns an
 * error), so users are never told a reset email was sent when it wasn't.
 */
export const forgotPasswordConfig: ForgotPasswordConfig = {
  expiration: PASSWORD_RESET_TTL_MS,
  generateEmailSubject: () => 'Reset your Arthanova Studio password',
  generateEmailHTML: async (args) => {
    const token = args?.token
    if (!token) throw new Error('Password reset token missing.')

    const user = (args?.user ?? {}) as Partial<UserDocument>
    const urls = getEmailURLs()
    const { html } = await renderEmail(
      <PasswordResetEmail
        recipientName={displayName(user)}
        recipientEmail={user.email ?? ''}
        resetURL={urls.resetPasswordURL(token)}
        expiresIn={describeDuration(PASSWORD_RESET_TTL_MS)}
        logoURL={urls.logoURL}
        websiteURL={urls.websiteURL}
        supportEmail={getEmailConfig().supportEmail}
      />,
    )

    return embedEmailMeta(html, {
      category: 'password-reset',
      userId: user.id,
      idempotencyKey: `password-reset/${user.id ?? 'unknown'}/${fingerprint(token)}`,
    })
  },
}
