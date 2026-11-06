import crypto from 'crypto'

import type { Endpoint } from 'payload'

import { isAdministrator, type UserDocument } from '@/access'
import { buildActivationEmail, verifyConfig } from '@/email/auth/verify'
import { summarizeError } from '@/email/errors'

const MIN_INTERVAL_MS = 60 * 1000

/**
 * POST /api/users/:id/resend-activation (administrators only)
 *
 * Issues a fresh verification token (invalidating the previous link) and
 * re-sends the invitation email. Uses the same token format and storage as
 * Payload's built-in verification so activation still goes through
 * `payload.verifyEmail`.
 */
export const resendActivationEndpoint: Endpoint = {
  path: '/:id/resend-activation',
  method: 'post',
  handler: async (req) => {
    if (!(await isAdministrator(req))) {
      return Response.json({ message: 'Only administrators can resend activation emails.' }, { status: 403 })
    }

    const id = req.routeParams?.id as string | undefined
    if (!id) return Response.json({ message: 'Missing user id.' }, { status: 400 })

    const user = (await req.payload.db.findOne({
      collection: 'users',
      where: { id: { equals: id } },
      req,
    })) as (UserDocument & { _verified?: boolean; activationSentAt?: string | null }) | null

    if (!user) return Response.json({ message: 'User not found.' }, { status: 404 })
    if (user._verified) {
      return Response.json({ message: 'This account is already activated.' }, { status: 409 })
    }
    if (user.activationSentAt && Date.now() - new Date(user.activationSentAt).getTime() < MIN_INTERVAL_MS) {
      return Response.json({ message: 'Please wait a minute before sending another email.' }, { status: 429 })
    }

    const token = crypto.randomBytes(20).toString('hex')
    const previous = { token: (user as { _verificationToken?: string | null })._verificationToken, sentAt: user.activationSentAt }

    await req.payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { ...user, _verificationToken: token, activationSentAt: new Date().toISOString() },
      req,
      returning: false,
    })

    try {
      await req.payload.sendEmail({
        to: user.email ?? undefined,
        subject: verifyConfig.generateEmailSubject({ req, token, user }),
        html: await buildActivationEmail({ req, token, user }),
      })
    } catch (error) {
      // Restore the previous link so a failed send doesn't invalidate it.
      await req.payload.db.updateOne({
        collection: 'users',
        id: user.id,
        data: { ...user, _verificationToken: previous.token ?? null, activationSentAt: previous.sentAt ?? null },
        req,
        returning: false,
      })
      return Response.json(
        { message: `The activation email could not be sent. ${summarizeError(error)}` },
        { status: 502 },
      )
    }

    return Response.json({ message: 'Activation email sent.' })
  },
}
