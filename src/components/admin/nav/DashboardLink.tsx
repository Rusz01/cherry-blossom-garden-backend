'use client'

import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const DashboardLink: React.FC<{ href: string }> = ({ href }) => {
  const active = usePathname() === href
  return (
    <Link
      href={href}
      id="nav-dashboard"
      className={`nav__link arth-nav-dashboard${active ? ' arth-nav-dashboard--active' : ''}`}
      aria-current={active ? 'page' : undefined}
      prefetch={false}
    >
      {active && <div className="nav__link-indicator" />}
      <LayoutGrid size={16} strokeWidth={1.75} aria-hidden="true" />
      <span className="nav__link-label">Dashboard</span>
    </Link>
  )
}
