/* eslint-disable @next/next/no-img-element */
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { findPendingActivation } from '@/lib/auth/activation'

import { activateAccount } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Activate your account · Arthanova Studio',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

type Args = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function ActivatePage({ params, searchParams }: Args) {
  const { token } = await params
  const { error } = await searchParams

  // "complete" is a static status screen shown when activation succeeded but
  // the password-setup step must be continued via "Forgot password".
  if (token === 'complete') {
    return (
      <AuthShell title="Your email is verified" eyebrow="Almost there">
        <p className="starter__text">
          We couldn’t open the password setup screen automatically. Use “Forgot password” on the sign-in page to choose
          your password.
        </p>
        <Link className="btn btn--primary" href="/admin/forgot">
          Set my password
        </Link>
      </AuthShell>
    )
  }

  const payload = await getPayload({ config })
  const pending = await findPendingActivation(payload, token)

  if (pending.status === 'invalid' || error === 'invalid') {
    return (
      <AuthShell title="This link is no longer valid" eyebrow="Account activation">
        <p className="starter__text">
          The activation link is invalid or has already been used. If your account is active, sign in or reset your
          password. Otherwise, ask an administrator to send a new invitation.
        </p>
        <Link className="btn btn--primary" href="/admin/login">
          Go to sign in
        </Link>
      </AuthShell>
    )
  }

  if (pending.status === 'expired' || error === 'expired') {
    return (
      <AuthShell title="This invitation has expired" eyebrow="Account activation">
        <p className="starter__text">For your security, activation links expire after 7 days. Ask your administrator to resend the invitation.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Activate your account" eyebrow="Welcome to Arthanova Studio">
      <p className="starter__text">
        Confirm your email address <strong>{pending.user.email}</strong> and choose a password to finish setting up your
        account.
      </p>
      <form action={activateAccount}>
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="btn btn--primary">
          Activate and set password
        </button>
      </form>
    </AuthShell>
  )
}

function AuthShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="starter">
      <section className="starter__card starter__card--narrow">
        <img className="starter__logo" src="/brand/arthanova-logo.png" alt="Arthanova Studio" width={220} height={54} />
        <p className="starter__kicker">{eyebrow}</p>
        <h1 className="starter__title">{title}</h1>
        <div className="stack">{children}</div>
      </section>
    </main>
  )
}
