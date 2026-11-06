import Link from 'next/link'
import React from 'react'

import { pagePath } from '@/lib/cms/paths'
import type { ButtonLink, CMSLink as CMSLinkType } from '@/payload-types'

type Props = {
  link?: (CMSLinkType | ButtonLink) | null
  className?: string
  children?: React.ReactNode
}

export const resolveHref = (link?: CMSLinkType | ButtonLink | null): string | null => {
  if (!link) return null
  if (link.type === 'internal') {
    const ref = link.reference
    return ref && typeof ref === 'object' ? pagePath(ref.slug) : null
  }
  return link.url || null
}

export const CMSLink: React.FC<Props> = ({ link, className, children }) => {
  const href = resolveHref(link)
  if (!href || !link) return null
  const appearance = 'appearance' in link ? link.appearance : undefined
  const classes = [className, appearance && appearance !== 'link' ? `btn btn--${appearance}` : appearance === 'link' ? 'text-link' : '']
    .filter(Boolean)
    .join(' ')
  const external = /^https?:\/\//.test(href)
  const newTab = link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  if (external || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a className={classes} href={href} {...newTab}>
        {children ?? link.label}
      </a>
    )
  }
  return (
    <Link className={classes} href={href} {...newTab}>
      {children ?? link.label}
    </Link>
  )
}
