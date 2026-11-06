import { EmailLayout, Eyebrow, LinkFallback, Notice, Paragraph, PrimaryButton, Title } from './components'

export type PasswordResetEmailProps = {
  recipientName: string
  recipientEmail: string
  resetURL: string
  expiresIn: string
  logoURL: string
  websiteURL: string
  supportEmail?: string
}

export function PasswordResetEmail(props: PasswordResetEmailProps) {
  const { recipientName, recipientEmail, resetURL, expiresIn, supportEmail } = props
  return (
    <EmailLayout
      preview="Reset your Arthanova Studio password. This link expires soon."
      logoURL={props.logoURL}
      websiteURL={props.websiteURL}
      supportEmail={supportEmail}
    >
      <Eyebrow>Password reset</Eyebrow>
      <Title>Let’s get you back in.</Title>
      <Paragraph>Hi {recipientName},</Paragraph>
      <Paragraph>
        We received a request to reset the password for <strong>{recipientEmail}</strong>. Use the
        button below to choose a new one. The link expires in {expiresIn}.
      </Paragraph>
      <PrimaryButton href={resetURL}>Choose a new password →</PrimaryButton>
      <Notice title="Didn’t request this?">
        You can safely ignore this email — your password won’t change. If you keep receiving these
        messages, {supportEmail ? `contact ${supportEmail}` : 'contact your administrator'}.
      </Notice>
      <LinkFallback href={resetURL} />
    </EmailLayout>
  )
}

PasswordResetEmail.PreviewProps = {
  recipientName: 'Alex',
  recipientEmail: 'alex@example.com',
  resetURL: 'http://localhost:3000/admin/reset/preview-token',
  expiresIn: '1 hour',
  logoURL: 'http://localhost:3000/brand/arthanova-logo-email.png',
  websiteURL: 'https://arthanovastudio.com',
  supportEmail: 'support@example.com',
} satisfies PasswordResetEmailProps

export default PasswordResetEmail
