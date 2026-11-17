export const EMAIL_CATEGORIES = [
  { label: 'Welcome', value: 'welcome' },
  { label: 'Account invitation', value: 'account-invitation' },
  { label: 'Email verification', value: 'email-verification' },
  { label: 'Password reset', value: 'password-reset' },
  { label: 'System', value: 'system' },
] as const

export type EmailCategory = (typeof EMAIL_CATEGORIES)[number]['value']

export const EMAIL_LOG_STATUSES = [
  // Resend accepted the request. This is NOT a delivery confirmation.
  { label: 'Submitted to provider', value: 'submitted' },
  { label: 'Failed', value: 'failed' },
  // Email integration is not configured; nothing was sent.
  { label: 'Not sent (email not configured)', value: 'not-configured' },
  // Development outbox: written to disk, nothing was sent.
  { label: 'Captured in dev outbox', value: 'captured' },
] as const

export type EmailLogStatus = (typeof EMAIL_LOG_STATUSES)[number]['value']

/** Lifetime of an account activation link sent to administrator-created users. */
export const ACCOUNT_ACTIVATION_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Lifetime of password reset tokens. */
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000

export const describeDuration = (ms: number): string => {
  const hours = Math.round(ms / (60 * 60 * 1000))
  if (hours < 24) return hours === 1 ? '1 hour' : `${hours} hours`
  const days = Math.round(hours / 24)
  return days === 1 ? '1 day' : `${days} days`
}
