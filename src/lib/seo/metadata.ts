import type { Metadata } from 'next'

import { getAppURL } from '@/lib/env'
import { pagePath } from '@/lib/cms/paths'
import type { Media, Page, SeoSetting, SiteSetting } from '@/payload-types'

const mediaURL = (media: unknown, origin: string): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  const doc = media as Media
  const url = doc.sizes?.og?.url || doc.url
  if (!url) return undefined
  return url.startsWith('http') ? url : `${origin}${url}`
}

export const getSiteOrigin = (seo?: SeoSetting | null): string => seo?.canonicalBaseURL || getAppURL()

/** Builds Next.js metadata for a CMS page, falling back to global SEO defaults. */
export const buildPageMetadata = ({
  page,
  site,
  seo,
}: {
  page: Page
  site: SiteSetting
  seo: SeoSetting
}): Metadata => {
  const origin = getSiteOrigin(seo)
  const meta = page.meta ?? {}
  const rawTitle = meta.title || page.title || seo.defaultTitle || site.siteName
  const template = seo.titleTemplate || `%s | ${site.siteName}`
  const title = page.slug === 'home' && !meta.title ? (seo.defaultTitle || site.siteName) : template.replace('%s', rawTitle)
  const description = meta.description || page.excerpt || seo.defaultDescription || site.description || undefined
  const canonical = meta.canonicalURL || `${origin}${pagePath(page.slug)}`
  const image = mediaURL(meta.image, origin) || mediaURL(page.featuredImage, origin) || mediaURL(seo.defaultImage, origin)
  const indexable = Boolean(seo.allowIndexing) && !meta.noIndex

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: indexable, follow: Boolean(seo.allowIndexing) && !meta.noFollow },
    openGraph: {
      type: 'website',
      siteName: site.siteName,
      title,
      description,
      url: canonical,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(seo.twitterHandle ? { site: seo.twitterHandle } : {}),
      ...(image ? { images: [image] } : {}),
    },
  }
}
