import { APIError } from 'payload'

/** Thrown when an email cannot be sent because Resend is not configured. */
export class EmailNotConfiguredError extends APIError {
  constructor() {
    super(
      'Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM_ADDRESS to send emails.',
      503,
    )
    this.name = 'EmailNotConfiguredError'
  }
}

/** Reduces provider errors to a short, secret-free message suitable for logs. */
export const summarizeError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : String(error)
  return raw
    .replace(/re_[A-Za-z0-9_]+/g, 're_[redacted]')
    .replace(/[a-f0-9]{32,}/gi, '[redacted]')
    .slice(0, 500)
}
