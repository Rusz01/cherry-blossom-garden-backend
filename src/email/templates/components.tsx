import type { CSSProperties, ReactNode } from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email'

/**
 * Email design tokens. These mirror the Arthanova Studio website
 * (ink #1e1e1e, blue #3b82f6, surface #f5f5f5, muted #555555) using
 * inline styles only, which is what Gmail and Outlook reliably support.
 */
export const emailTokens = {
  ink: '#1e1e1e',
  blue: '#3b82f6',
  blueText: '#1d4ed8', // AA-contrast blue for text on white
  surface: '#f5f5f5',
  card: '#ffffff',
  muted: '#555555',
  subtle: '#6b6b6b',
  border: '#e6e6e6',
  tint: '#eef4ff',
  fontSans: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSerif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
}

const t = emailTokens

const styles: Record<string, CSSProperties> = {
  body: { backgroundColor: t.surface, margin: 0, padding: '32px 0', fontFamily: t.fontSans, color: t.ink },
  container: { maxWidth: '560px', margin: '0 auto', padding: '0 16px' },
  logoWrap: { padding: '8px 0 24px', textAlign: 'center' },
  logo: { display: 'inline-block', height: 'auto', border: 0 },
  card: {
    backgroundColor: t.card,
    borderRadius: '24px',
    border: `1px solid ${t.border}`,
    padding: '40px 36px',
  },
  eyebrow: {
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: t.blueText,
    fontWeight: 600,
    margin: '0 0 12px',
  },
  heading: {
    fontFamily: t.fontSerif,
    fontWeight: 400,
    fontSize: '34px',
    lineHeight: '40px',
    color: t.ink,
    margin: '0 0 20px',
  },
  paragraph: { fontSize: '15px', lineHeight: '24px', color: t.muted, margin: '0 0 16px' },
  buttonWrap: { padding: '12px 0 8px' },
  button: {
    backgroundColor: t.ink,
    color: '#ffffff',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
    padding: '14px 28px',
    display: 'inline-block',
  },
  details: {
    backgroundColor: t.surface,
    borderRadius: '16px',
    padding: '18px 20px',
    margin: '20px 0 8px',
  },
  detailLabel: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: t.subtle,
    margin: '0 0 2px',
    fontWeight: 600,
  },
  detailValue: { fontSize: '15px', color: t.ink, margin: '0 0 12px', wordBreak: 'break-word' },
  notice: {
    borderLeft: `3px solid ${t.blue}`,
    backgroundColor: t.tint,
    borderRadius: '0 12px 12px 0',
    padding: '14px 16px',
    margin: '24px 0 0',
  },
  noticeText: { fontSize: '13px', lineHeight: '20px', color: t.ink, margin: 0 },
  fallback: { fontSize: '12px', lineHeight: '18px', color: t.subtle, margin: '20px 0 0' },
  footer: { textAlign: 'center', padding: '24px 8px 0' },
  footerText: { fontSize: '12px', lineHeight: '18px', color: t.subtle, margin: '0 0 6px' },
  footerLink: { color: t.subtle, textDecoration: 'underline' },
  hr: { borderColor: t.border, margin: '28px 0 0' },
}

export type EmailLayoutProps = {
  preview: string
  logoURL: string
  websiteURL: string
  supportEmail?: string
  children: ReactNode
}

export function EmailLayout({ preview, logoURL, websiteURL, supportEmail, children }: EmailLayoutProps) {
  const year = new Date().getFullYear()
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoWrap}>
            <Img src={logoURL} alt="Arthanova Studio" width="180" style={styles.logo} />
          </Section>
          <Section style={styles.card}>{children}</Section>
          <Section style={styles.footer}>
            <Text style={styles.footerText}>Arthanova Studio · Partners in Digital Growth</Text>
            <Text style={styles.footerText}>
              <Link href={websiteURL} style={styles.footerLink}>
                {websiteURL.replace(/^https?:\/\//, '')}
              </Link>
              {supportEmail ? (
                <>
                  {' · '}
                  <Link href={`mailto:${supportEmail}`} style={styles.footerLink}>
                    {supportEmail}
                  </Link>
                </>
              ) : null}
            </Text>
            <Text style={styles.footerText}>
              © {year} Arthanova Studio. You received this email because of activity on your account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <Text style={styles.eyebrow}>{children}</Text>
)

export const Title = ({ children }: { children: ReactNode }) => (
  <Heading as="h1" style={styles.heading}>
    {children}
  </Heading>
)

export const Paragraph = ({ children }: { children: ReactNode }) => (
  <Text style={styles.paragraph}>{children}</Text>
)

export const PrimaryButton = ({ href, children }: { href: string; children: ReactNode }) => (
  <Section style={styles.buttonWrap}>
    <Button href={href} style={styles.button}>
      {children}
    </Button>
  </Section>
)

export const Details = ({ items }: { items: { label: string; value: string }[] }) => (
  <Section style={styles.details}>
    {items.map((item, index) => (
      <div key={item.label}>
        <Text style={styles.detailLabel}>{item.label}</Text>
        <Text style={{ ...styles.detailValue, ...(index === items.length - 1 ? { margin: 0 } : {}) }}>
          {item.value}
        </Text>
      </div>
    ))}
  </Section>
)

export const Notice = ({ title, children }: { title?: string; children: ReactNode }) => (
  <Section style={styles.notice}>
    <Text style={styles.noticeText}>
      {title ? <strong>{title} </strong> : null}
      {children}
    </Text>
  </Section>
)

/** Plain URL fallback for clients that block buttons. */
export const LinkFallback = ({ href }: { href: string }) => (
  <>
    <Hr style={styles.hr} />
    <Text style={styles.fallback}>
      If the button doesn’t work, copy and paste this link into your browser:
      <br />
      <Link href={href} style={{ color: t.blueText, wordBreak: 'break-all' }}>
        {href}
      </Link>
    </Text>
  </>
)
