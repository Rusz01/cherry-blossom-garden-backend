/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React from 'react'

import type { Navigation, SiteSetting } from '@/payload-types'

import { CMSLink } from './CMSLink'

export const SiteHeader: React.FC<{ site: SiteSetting; navigation: Navigation }> = ({ site, navigation }) => {
  const links = (navigation.headerLinks ?? []).filter((item) => item.visible !== false)
  return (
    <header className="site-header">
      <Link href="/" className="site-header__brand" aria-label={`${site.siteName} home`}>
        <img src="/brand/arthanova-logo.png" alt={site.siteName} width={160} height={39} />
      </Link>
      {links.length > 0 && (
        <nav aria-label="Main" className="site-header__nav">
          {links.map((item, i) => (
            <CMSLink key={item.id ?? i} link={item.link} />
          ))}
        </nav>
      )}
      {navigation.headerCta?.enabled && navigation.headerCta.link && (
        <CMSLink className="btn btn--primary btn--small" link={navigation.headerCta.link} />
      )}
    </header>
  )
}

export const SiteFooter: React.FC<{ site: SiteSetting; navigation: Navigation }> = ({ site, navigation }) => {
  const links = (navigation.footerLinks ?? []).filter((item) => item.visible !== false)
  return (
    <footer className="site-footer">
      <div>
        <img src="/brand/arthanova-logo-white.png" alt={site.siteName} width={150} height={35} />
        {(navigation.footerNote || site.tagline) && <p>{navigation.footerNote || site.tagline}</p>}
      </div>
      {links.length > 0 && (
        <nav aria-label="Footer" className="site-footer__nav">
          {links.map((item, i) => (
            <CMSLink key={item.id ?? i} link={item.link} />
          ))}
        </nav>
      )}
      <div className="site-footer__contact">
        {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
        {site.contactPhone && <a href={`tel:${site.contactPhone.replace(/\s+/g, '')}`}>{site.contactPhone}</a>}
        {site.address && <span>{site.address}</span>}
      </div>
      <p className="site-footer__copy">© {new Date().getFullYear()} {site.siteName}</p>
    </footer>
  )
}
