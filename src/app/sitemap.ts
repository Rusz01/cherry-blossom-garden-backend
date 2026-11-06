import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/cms/payload'
import { pagePath } from '@/lib/cms/paths'
import { getSiteOrigin } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

/** Published, indexable pages only (anonymous access → drafts are excluded by access control). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayloadClient()
    const seo = await payload.findGlobal({ slug: 'seo-settings', depth: 0, overrideAccess: false })
    if (!seo.allowIndexing) return []

    const origin = getSiteOrigin(seo)
    const pages = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      limit: 1000,
      depth: 0,
      where: { 'meta.noIndex': { not_equals: true } },
      select: { slug: true, updatedAt: true },
    })

    return pages.docs.map((page) => ({
      url: `${origin}${pagePath(page.slug)}`,
      lastModified: page.updatedAt,
    }))
  } catch {
    return []
  }
}
