import { Details, EmailLayout, Eyebrow, LinkFallback, Notice, Paragraph, PrimaryButton, Title } from './components'

export type AccountInvitationEmailProps = {
  recipientName: string
  recipientEmail: string
  roleName: string
  createdByName?: string
  activationURL: string
  expiresIn: string
  logoURL: string
  websiteURL: string
  supportEmail?: string
}

/** Sent when an administrator creates an account. Contains a one-time activation link — never a password. */
export function AccountInvitationEmail(props: AccountInvitationEmailProps) {
  const { recipientName, recipientEmail, roleName, createdByName, activationURL, expiresIn } = props
  return (
    <EmailLayout
      preview="You’ve been invited to the Arthanova Studio CMS. Activate your account to get started."
      logoURL={props.logoURL}
      websiteURL={props.websiteURL}
      supportEmail={props.supportEmail}
    >
      <Eyebrow>You’re invited</Eyebrow>
      <Title>Your Arthanova Studio account is waiting.</Title>
      <Paragraph>Hi {recipientName},</Paragraph>
      <Paragraph>
        {createdByName
          ? `${createdByName} has created an Arthanova Studio CMS account for you.`
          : 'An Arthanova Studio administrator has created a CMS account for you.'}{' '}
        Activate it to confirm your email address and choose your own password.
      </Paragraph>
      <Details
        items={[
          { label: 'Account email', value: recipientEmail },
          { label: 'Assigned role', value: roleName },
          ...(createdByName ? [{ label: 'Invited by', value: createdByName }] : []),
        ]}
      />
      <PrimaryButton href={activationURL}>Activate account →</PrimaryButton>
      <Notice title="Security note.">
        This link can be used once and expires in {expiresIn}. We will never email you a password.
        If you weren’t expecting this invitation, you can ignore this email.
      </Notice>
      <LinkFallback href={activationURL} />
    </EmailLayout>
  )
}

AccountInvitationEmail.PreviewProps = {
  recipientName: 'Sam',
  recipientEmail: 'sam@example.com',
  roleName: 'Content Editor',
  createdByName: 'Alex Morgan',
  activationURL: 'http://localhost:3000/account/activate/preview-token',
  expiresIn: '7 days',
  logoURL: 'http://localhost:3000/brand/arthanova-logo-email.png',
  websiteURL: 'https://arthanovastudio.com',
  supportEmail: 'support@example.com',
} satisfies AccountInvitationEmailProps

export default AccountInvitationEmail
