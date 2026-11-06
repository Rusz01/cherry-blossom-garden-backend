'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

/** Labelled sign-out using Payload's native /logout route. */
export const LogoutButton: React.FC = () => {
  const {
    config: {
      admin: { routes },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <Link href={`${adminRoute}${routes.logout}`} className="arth-logout" prefetch={false}>
      Sign out
    </Link>
  )
}
