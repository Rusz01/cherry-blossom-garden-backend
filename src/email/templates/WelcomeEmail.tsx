import { Details, EmailLayout, Eyebrow, LinkFallback, Notice, Paragraph, PrimaryButton, Title } from './components'

export type WelcomeEmailProps = {
  recipientName: string
  recipientEmail: string
  roleName: string
  loginURL: string
  logoURL: string
  websiteURL: string
  supportEmail?: string
}

export function WelcomeEmail(props: WelcomeEmailProps) {
  const { recipientName, recipientEmail, roleName, loginURL, logoURL, websiteURL, supportEmail } = props
  return (
    <EmailLayout
      preview={`Welcome to Arthanova Studio, ${recipientName}. Your workspace is ready.`}
      logoURL={logoURL}
      websiteURL={websiteURL}
      supportEmail={supportEmail}
    >
      <Eyebrow>Account ready</Eyebrow>
      <Title>Welcome to Arthanova Studio.</Title>
      <Paragraph>Hi {recipientName},</Paragraph>
      <Paragraph>
        Your account is active. You can now sign in to the Arthanova Studio CMS to manage pages,
        media and settings available to your role.
      </Paragraph>
      <Details
        items={[
          { label: 'Account email', value: recipientEmail },
          { label: 'Role', value: roleName },
        ]}
      />
      <PrimaryButton href={loginURL}>Sign in to the CMS →</PrimaryButton>
      <Notice title="Need a hand?">
        {supportEmail
          ? `Reply to this email or write to ${supportEmail} and our team will help.`
          : 'Reply to this email and our team will help.'}
      </Notice>
      <LinkFallback href={loginURL} />
    </EmailLayout>
  )
}

WelcomeEmail.PreviewProps = {
  recipientName: 'Alex',
  recipientEmail: 'alex@example.com',
  roleName: 'Administrator',
  loginURL: 'http://localhost:3000/admin/login',
  logoURL: 'http://localhost:3000/brand/arthanova-logo-email.png',
  websiteURL: 'https://arthanovastudio.com',
  supportEmail: 'support@example.com',
} satisfies WelcomeEmailProps

export default WelcomeEmail
