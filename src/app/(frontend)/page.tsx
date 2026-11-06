import type { Metadata } from 'next'
import React from 'react'

import { PageView } from '@/components/frontend/PageView'
import { StarterHome } from '@/components/frontend/StarterHome'
import { getPageBySlug, getPreviewContext, getSiteGlobals } from '@/lib/cms/payload'
import { HOME_SLUG } from '@/lib/cms/paths'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

/** Loads the CMS "home" page if one is visible to this viewer; otherwise null. */
const loadHome = async () => {
  try {
    const [page, globals, preview] = await Promise.all([getPageBySlug(HOME_SLUG), getSiteGlobals(), getPreviewContext()])
    return page ? { page, globals, preview } : null
  } catch {
    // e.g. the database is not configured yet — fall back to the starter page.
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await loadHome()
  if (!home) {
    return {
      title: 'Arthanova Studio CMS',
      description: 'The content management system behind Arthanova Studio websites. Partners in Digital Growth.',
      robots: { index: false, follow: false },
    }
  }
  const metadata = buildPageMetadata({ page: home.page, ...home.globals })
  return home.preview.draft ? { ...metadata, robots: { index: false, follow: false } } : metadata
}

export default async function HomePage() {
  const home = await loadHome()
  if (!home) return <StarterHome />
  return <PageView page={home.page} {...home.globals} draft={home.preview.draft} />
}
