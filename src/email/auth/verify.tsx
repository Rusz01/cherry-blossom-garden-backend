import type { PayloadRequest } from 'payload'

import type { UserDocument } from '@/access'
import { getEmailConfig } from '@/lib/env'

import { ACCOUNT_ACTIVATION_TTL_MS, describeDuration } from '../constants'
import { embedEmailMeta, fingerprint } from '../meta'
import { displayName, resolveRoleName } from '../recipient'
import { renderEmail } from '../render'
import { AccountInvitationEmail } from '../templates/AccountInvitationEmail'
import { VerifyEmailEmail } from '../templates/VerifyEmailEmail'
import { getEmailURLs } from '../urls'

type Args = { req: PayloadRequest; token: string; user: Partial<UserDocument> }

/** True when the current request was made by someone other than the new user (i.e. an administrator). */
const createdByAnotherUser = (req: PayloadRequest, user: Partial<UserDocument>): boolean =>
  Boolean(req.user && String(req.user.id) !== String(user.id))

export const buildActivationEmail = async ({ req, token, user }: Args): Promise<string> => {
  const urls = getEmailURLs()
  const common = {
    recipientName: displayName(user),
    recipientEmail: user.email ?? '',
    expiresIn: describeDuration(ACCOUNT_ACTIVATION_TTL_MS),
    logoURL: urls.logoURL,
    websiteURL: urls.websiteURL,
    supportEmail: getEmailConfig().supportEmail,
  }

  if (createdByAnotherUser(req, user)) {
    const { html } = await renderEmail(
      <AccountInvitationEmail
        {...common}
        roleName={await resolveRoleName(req, user)}
        createdByName={displayName(req.user as Partial<UserDocument>)}
        activationURL={urls.activationURL(token)}
      />,
    )
    return embedEmailMeta(html, {
      category: 'account-invitation',
      userId: user.id,
      idempotencyKey: `account-invitation/${user.id ?? 'new'}/${fingerprint(token)}`,
    })
  }

  const { html } = await renderEmail(
    <VerifyEmailEmail {...common} verificationURL={urls.activationURL(token)} />,
  )
  return embedEmailMeta(html, {
    category: 'email-verification',
    userId: user.id,
    idempotencyKey: `email-verification/${user.id ?? 'new'}/${fingerprint(token)}`,
  })
}

/**
 * Payload `auth.verify` configuration. Payload generates the verification
 * token and sends this email inside the create transaction, so if delivery
 * fails the account is not created (no half-provisioned users).
 */
export const verifyConfig = {
  generateEmailSubject: ({ req, user }: Args) =>
    createdByAnotherUser(req, user)
      ? 'You’ve been invited to Arthanova Studio'
      : 'Verify your email for Arthanova Studio',
  generateEmailHTML: buildActivationEmail,
}
