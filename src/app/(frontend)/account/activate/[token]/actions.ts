'use server'

import config from '@payload-config'
import { redirect } from 'next/navigation'
import { createLocalReq, getPayload } from 'payload'

import { sendWelcomeEmail } from '@/email/accountEmails'
import { findPendingActivation } from '@/lib/auth/activation'

/**
 * Activates an invited account:
 *  1. verifies the email via Payload's native `verifyEmail` operation;
 *  2. issues a standard Payload password-reset token (no email is sent);
 *  3. redirects to Payload's built-in "set new password" screen.
 * No password is ever generated, emailed or handled here.
 */
export async function activateAccount(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '')
  const payload = await getPayload({ config })
  const pending = await findPendingActivation(payload, token)

  if (pending.status !== 'ready') {
    redirect(`/account/activate/${encodeURIComponent(token)}?error=${pending.status}`)
  }

  const { user } = pending
  let resetToken: string | null = null

  try {
    await payload.verifyEmail({ collection: 'users', token })
    resetToken = await payload.forgotPassword({
      collection: 'users',
      data: { email: user.email as string },
      disableEmail: true,
    })
  } catch (error) {
    payload.logger.error({
      msg: '[auth] Account activation failed.',
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  if (!resetToken) {
    // Verification may have succeeded; the user can still set a password via "Forgot password".
    redirect('/account/activate/complete?status=password')
  }

  const req = await createLocalReq({}, payload)
  await sendWelcomeEmail(req, user) // non-critical; never throws

  redirect(`/admin/reset/${encodeURIComponent(resetToken)}`)
}
