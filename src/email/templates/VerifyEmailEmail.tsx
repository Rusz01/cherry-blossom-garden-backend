import { EmailLayout, Eyebrow, LinkFallback, Notice, Paragraph, PrimaryButton, Title } from './components'

export type VerifyEmailEmailProps = {
  recipientName: string
  recipientEmail: string
  verificationURL: string
  expiresIn: string
  logoURL: string
  websiteURL: string
  supportEmail?: string
}

/** Email-address verification for accounts not created by an administrator (e.g. scripted provisioning). */
export function VerifyEmailEmail(props: VerifyEmailEmailProps) {
  const { recipientName, recipientEmail, verificationURL, expiresIn } = props
  return (
    <EmailLayout
      preview="Confirm your email address to activate your Arthanova Studio account."
      logoURL={props.logoURL}
      websiteURL={props.websiteURL}
      supportEmail={props.supportEmail}
    >
      <Eyebrow>Verify your email</Eyebrow>
      <Title>Confirm it’s you.</Title>
      <Paragraph>Hi {recipientName},</Paragraph>
      <Paragraph>
        Please confirm that <strong>{recipientEmail}</strong> belongs to you. Once confirmed, you’ll
        choose a password and your Arthanova Studio account will be ready.
      </Paragraph>
      <PrimaryButton href={verificationURL}>Verify email address →</PrimaryButton>
      <Notice title="Heads up.">
        This link expires in {expiresIn} and can be used once. If you didn’t request an account, no
        action is needed.
      </Notice>
      <LinkFallback href={verificationURL} />
    </EmailLayout>
  )
}

VerifyEmailEmail.PreviewProps = {
  recipientName: 'Jordan',
  recipientEmail: 'jordan@example.com',
  verificationURL: 'http://localhost:3000/account/activate/preview-token',
  expiresIn: '7 days',
  logoURL: 'http://localhost:3000/brand/arthanova-logo-email.png',
  websiteURL: 'https://arthanovastudio.com',
  supportEmail: 'support@example.com',
} satisfies VerifyEmailEmailProps

export default VerifyEmailEmail
