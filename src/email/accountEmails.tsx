import type { PayloadRequest } from 'payload'

import type { UserDocument } from '@/access'
import { getEmailConfig } from '@/lib/env'

import { displayName, resolveRoleName } from './recipient'
import { sendNonCriticalEmail } from './send'
import { WelcomeEmail } from './templates/WelcomeEmail'
import { getEmailURLs } from './urls'

/**
 * Welcome email. Non-critical: failures are logged (and recorded in Email
 * Logs) but never undo the account operation that triggered it. An
 * idempotency key per user prevents duplicate welcomes within Resend's window.
 */
export const sendWelcomeEmail = async (req: PayloadRequest, user: Partial<UserDocument>) => {
  if (!user.email) return null
  const urls = getEmailURLs()
  return sendNonCriticalEmail({
    payload: req.payload,
    to: user.email,
    subject: 'Welcome to Arthanova Studio — your account is ready',
    template: (
      <WelcomeEmail
        recipientName={displayName(user)}
        recipientEmail={user.email}
        roleName={await resolveRoleName(req, user)}
        loginURL={urls.loginURL}
        logoURL={urls.logoURL}
        websiteURL={urls.websiteURL}
        supportEmail={getEmailConfig().supportEmail}
      />
    ),
    meta: { category: 'welcome', userId: user.id, idempotencyKey: `welcome/${user.id}` },
  })
}
