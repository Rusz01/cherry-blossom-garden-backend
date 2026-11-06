/**
 * Renders every email template to `.email-previews/` (HTML + plain text) using
 * sample data. Nothing is sent. Run with: pnpm email:preview
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import React from 'react'

import { renderEmail } from '../src/email/render'
import { AccountInvitationEmail } from '../src/email/templates/AccountInvitationEmail'
import { PasswordResetEmail } from '../src/email/templates/PasswordResetEmail'
import { VerifyEmailEmail } from '../src/email/templates/VerifyEmailEmail'
import { WelcomeEmail } from '../src/email/templates/WelcomeEmail'

const outDir = path.resolve(process.cwd(), '.email-previews')

const previews = {
  welcome: <WelcomeEmail {...WelcomeEmail.PreviewProps} />,
  'account-invitation': <AccountInvitationEmail {...AccountInvitationEmail.PreviewProps} />,
  'verify-email': <VerifyEmailEmail {...VerifyEmailEmail.PreviewProps} />,
  'password-reset': <PasswordResetEmail {...PasswordResetEmail.PreviewProps} />,
}

await mkdir(outDir, { recursive: true })
for (const [name, element] of Object.entries(previews)) {
  const { html, text } = await renderEmail(element)
  await writeFile(path.join(outDir, `${name}.html`), html, 'utf8')
  await writeFile(path.join(outDir, `${name}.txt`), text, 'utf8')
  console.log(`✓ ${name}`)
}
console.log(`\nPreviews written to ${outDir}. Start the dev server so the logo URL resolves.`)
