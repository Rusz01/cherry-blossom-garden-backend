/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { ServerProps } from 'payload'
import React from 'react'

import { DashboardLink } from './DashboardLink'

/** Top of the sidebar: the wordmark, then Dashboard as the first navigation item. */
export const NavBrand: React.FC<ServerProps> = ({ payload }) => {
  const adminRoute = payload?.config.routes.admin ?? '/admin'
  return (
    <div className="arth-nav-brand">
      <Link href={adminRoute} className="arth-nav-brand__logo" aria-label="Arthanova Studio — dashboard">
        <img className="arth-logo__img--light" src="/brand/arthanova-logo.png" alt="Arthanova Studio" width={132} height={32} />
        <img className="arth-logo__img--dark" src="/brand/arthanova-logo-white.png" alt="" aria-hidden="true" width={132} height={31} />
      </Link>
      <DashboardLink href={adminRoute} />
    </div>
  )
}
