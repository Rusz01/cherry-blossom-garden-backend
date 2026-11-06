import type { Payload } from 'payload'

import type { UserDocument } from '@/access'
import { ACCOUNT_ACTIVATION_TTL_MS } from '@/email/constants'

/** Payload verification tokens are 20 random bytes, hex-encoded. */
const TOKEN_PATTERN = /^[a-f0-9]{40}$/

export type PendingActivation =
  | { status: 'invalid' }
  | { status: 'expired'; email: string }
  | { status: 'ready'; user: UserDocument & { activationSentAt?: string | null; createdAt?: string } }

/**
 * Looks up an unverified account by its verification token. Payload's native
 * verification has no expiry, so we enforce one here based on when the
 * activation email was issued.
 */
export const findPendingActivation = async (payload: Payload, token: string): Promise<PendingActivation> => {
  if (!TOKEN_PATTERN.test(token)) return { status: 'invalid' }

  const user = (await payload.db.findOne({
    collection: 'users',
    where: { _verificationToken: { equals: token } },
  })) as (UserDocument & { activationSentAt?: string | null; createdAt?: string; _verified?: boolean }) | null

  if (!user || user._verified) return { status: 'invalid' }

  const issuedAt = new Date(user.activationSentAt || user.createdAt || 0).getTime()
  if (!issuedAt || Date.now() - issuedAt > ACCOUNT_ACTIVATION_TTL_MS) {
    return { status: 'expired', email: user.email ?? '' }
  }

  return { status: 'ready', user }
}
