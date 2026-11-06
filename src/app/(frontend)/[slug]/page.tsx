import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

import { PageView } from '@/components/frontend/PageView'
import { getPageBySlug, getPreviewContext, getSiteGlobals } from '@/lib/cms/payload'
import { HOME_SLUG } from '@/lib/cms/paths'
import { buildPageMetadata } from '@/lib/seo/metadata'

type Args = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  const { site, seo } = await getSiteGlobals()
  const { draft } = await getPreviewContext()
  const metadata = buildPageMetadata({ page, site, seo })
  // Never let drafts be indexed, even if a preview URL leaks.
  return draft ? { ...metadata, robots: { index: false, follow: false } } : metadata
}

export default async function SlugPage({ params }: Args) {
  const { slug } = await params
  if (slug === HOME_SLUG) redirect('/')

  const [page, globals, preview] = await Promise.all([getPageBySlug(slug), getSiteGlobals(), getPreviewContext()])
  if (!page) notFound()

  return <PageView page={page} {...globals} draft={preview.draft} />
}
