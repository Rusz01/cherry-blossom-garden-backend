import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { ServerProps } from 'payload'
import React from 'react'

import { getRelationshipID, type RoleDocument, type UserDocument } from '@/access'
import { getWebsiteURL } from '@/lib/env'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A'

/** Foot of the sidebar: who is signed in, their role, and a route out to the website. */
export const NavAccount: React.FC<ServerProps> = async ({ payload, user }) => {
  if (!payload || !user) return null

  const account = user as unknown as UserDocument
  const adminRoute = payload.config.routes.admin
  const name = account.name?.trim() || account.email || 'Account'

  let roleName = 'No role'
  const roleID = getRelationshipID(account.role ?? null)
  if (roleID !== null) {
    try {
      // Reads only the signed-in user's own role.
      const role = (await payload.findByID({ collection: 'roles', id: roleID, depth: 0, overrideAccess: true })) as unknown as RoleDocument
      roleName = role.name ?? roleName
    } catch {
      roleName = 'Unknown role'
    }
  }

  return (
    <div className="arth-nav-account">
      <a className="arth-nav-account__site" href={getWebsiteURL()} target="_blank" rel="noopener noreferrer">
        <span>View website</span>
        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
      </a>
      <Link href={`${adminRoute}/account`} className="arth-nav-account__row" title="Account settings">
        <span className="arth-avatar" aria-hidden="true">
          {initials(name)}
        </span>
        <span className="arth-nav-account__meta">
          <span className="arth-nav-account__name">{name}</span>
          <span className="arth-nav-account__role">{roleName}</span>
        </span>
      </Link>
    </div>
  )
}
