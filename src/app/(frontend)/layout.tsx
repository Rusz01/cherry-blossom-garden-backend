import type { Metadata, Viewport } from 'next'
import React from 'react'

import { getAppURL } from '@/lib/env'
import { dmSans } from '@/lib/fonts'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(getAppURL()),
  title: { default: 'Arthanova Studio CMS', template: '%s' },
  description: 'Arthanova Studio — Partners in Digital Growth. Content management for Arthanova Studio projects.',
  applicationName: 'Arthanova Studio CMS',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e1e1e',
  width: 'device-width',
  initialScale: 1,
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  )
}
