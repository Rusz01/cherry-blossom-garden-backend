import type { Payload } from 'payload'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { arthanovaEmailAdapter } from '@/email/adapter'
import { EmailNotConfiguredError, summarizeError } from '@/email/errors'
import { embedEmailMeta, extractEmailMeta } from '@/email/meta'
import { renderEmail } from '@/email/render'
import { AccountInvitationEmail } from '@/email/templates/AccountInvitationEmail'
import { PasswordResetEmail } from '@/email/templates/PasswordResetEmail'
import { VerifyEmailEmail } from '@/email/templates/VerifyEmailEmail'
import { WelcomeEmail } from '@/email/templates/WelcomeEmail'

const templates = [
  { name: 'Welcome', element: <WelcomeEmail {...WelcomeEmail.PreviewProps} />, link: WelcomeEmail.PreviewProps.loginURL },
  {
    name: 'Account invitation',
    element: <AccountInvitationEmail {...AccountInvitationEmail.PreviewProps} />,
    link: AccountInvitationEmail.PreviewProps.activationURL,
  },
  { name: 'Verify email', element: <VerifyEmailEmail {...VerifyEmailEmail.PreviewProps} />, link: VerifyEmailEmail.PreviewProps.verificationURL },
  { name: 'Password reset', element: <PasswordResetEmail {...PasswordResetEmail.PreviewProps} />, link: PasswordResetEmail.PreviewProps.resetURL },
]

describe('email templates', () => {
  it.each(templates)('$name renders branded, accessible HTML and a plain-text alternative', async ({ element, link }) => {
    const { html, text } = await renderEmail(element)
    expect(html).toMatch(/^<!DOCTYPE html/i)
    expect(html).toContain('lang="en"')
    expect(html).toContain('alt="Arthanova Studio"')
    expect(html).toContain('/brand/arthanova-logo-email.png')
    expect(html).toContain(link)
    expect(html).toContain('Partners in Digital Growth')
    expect(html).not.toMatch(/undefined|\[object Object\]/)
    expect(text).toContain(link)
    expect(text.length).toBeGreaterThan(100)
  })

  it('never includes a password field in the invitation', async () => {
    const { html } = await renderEmail(<AccountInvitationEmail {...AccountInvitationEmail.PreviewProps} />)
    expect(html.toLowerCase()).not.toContain('temporary password')
    expect(html).toContain('We will never email you a password')
  })
})

describe('email metadata', () => {
  it('round-trips and is stripped before sending', () => {
    const html = embedEmailMeta('<p>Hello</p>', { category: 'welcome', userId: 7, idempotencyKey: 'welcome/7' })
    const { html: clean, meta } = extractEmailMeta(html)
    expect(clean).toBe('<p>Hello</p>')
    expect(meta).toEqual({ category: 'welcome', userId: 7, idempotencyKey: 'welcome/7' })
  })

  it('redacts API keys and long tokens from error summaries', () => {
    const summary = summarizeError(new Error('bad key re_abc123XYZ for token ' + 'a'.repeat(40)))
    expect(summary).not.toContain('re_abc123XYZ')
    expect(summary).not.toContain('a'.repeat(40))
  })
})

describe('email adapter when Resend is not configured', () => {
  it('throws instead of pretending to send, and records the attempt', async () => {
    const previousKey = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    try {
      const create = vi.fn().mockResolvedValue({})
      const fakePayload = { create, logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } } as unknown as Payload
      const adapter = arthanovaEmailAdapter()({ payload: fakePayload })

      await expect(
        adapter.sendEmail({ to: 'someone@example.test', subject: 'Hi', html: embedEmailMeta('<p>x</p>', { category: 'welcome' }) }),
      ).rejects.toBeInstanceOf(EmailNotConfiguredError)

      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          collection: 'email-logs',
          data: expect.objectContaining({ status: 'not-configured', category: 'welcome', recipient: 'someone@example.test' }),
        }),
      )
      // Message bodies are never stored.
      expect(JSON.stringify(create.mock.calls)).not.toContain('<p>x</p>')
    } finally {
      process.env.RESEND_API_KEY = previousKey
    }
  })
})
