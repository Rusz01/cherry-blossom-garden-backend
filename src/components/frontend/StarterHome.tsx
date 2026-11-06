/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { getWebsiteURL } from '@/lib/env'

/** Shown at "/" until a page with the slug "home" is published. */
export const StarterHome: React.FC = () => {
  const website = getWebsiteURL()
  return (
    <main className="starter">
      <section className="starter__card">
        <img className="starter__logo" src="/brand/arthanova-logo.png" alt="Arthanova Studio" width={260} height={64} />
        <h1 className="starter__title">Arthanova Studio CMS</h1>
        <p className="starter__text">
          The editorial workspace for pages, media and site settings. Publish a page with the slug <code>home</code>{' '}
          to replace this screen.
        </p>
        <div className="actions">
          <Link className="btn btn--primary" href="/admin">
            Open the CMS <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <a className="btn btn--secondary" href={website} target="_blank" rel="noopener noreferrer">
            Visit arthanovastudio.com
          </a>
        </div>
        <dl className="starter__facts">
          <div>
            <dt>Content</dt>
            <dd>Drafts, version history and live preview</dd>
          </div>
          <div>
            <dt>Media</dt>
            <dd>Optimised images with required alt text</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>Role-based permissions for every editor</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
