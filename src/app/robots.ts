import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/cms/payload'
import { getSiteOrigin } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const payload = await getPayloadClient()
    const seo = await payload.findGlobal({ slug: 'seo-settings', depth: 0, overrideAccess: false })
    const origin = getSiteOrigin(seo)

    if (!seo.allowIndexing) {
      return { rules: [{ userAgent: '*', disallow: '/' }] }
    }

    const disallow = ['/admin', '/api', '/next', '/account', ...(seo.disallowPaths ?? []).map((item) => item.path)]
    return {
      rules: [{ userAgent: '*', allow: '/', disallow }],
      sitemap: `${origin}/sitemap.xml`,
    }
  } catch {
    // Fail closed: if settings can't be read, don't invite crawlers.
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
}
