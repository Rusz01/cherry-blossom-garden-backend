import config from '@payload-config'
import { headers as getHeaders, draftMode } from 'next/headers'
import { getPayload, type Payload } from 'payload'
import { cache } from 'react'

import type { Navigation, Page, SeoSetting, SiteSetting } from '@/payload-types'

export const getPayloadClient = (): Promise<Payload> => getPayload({ config })

/**
 * Resolves the viewer for preview. Draft content is only returned when draft
 * mode is enabled AND the request carries a valid CMS session whose role can
 * read pages. Access control is always enforced (overrideAccess: false).
 */
export const getPreviewContext = cache(async () => {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return { draft: false as const, user: null }

  const payload = await getPayloadClient()
  const { user, permissions } = await payload.auth({ headers: await getHeaders() })
  const canRead = Boolean(user && permissions?.collections?.pages?.read)
  return { draft: canRead, user: canRead ? user : null }
})

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const payload = await getPayloadClient()
  const { draft, user } = await getPreviewContext()

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft,
    user: user ?? undefined,
    overrideAccess: false,
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
})

export const getSiteGlobals = cache(async () => {
  const payload = await getPayloadClient()
  const [site, navigation, seo] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: false }) as Promise<SiteSetting>,
    payload.findGlobal({ slug: 'navigation', depth: 1, overrideAccess: false }) as Promise<Navigation>,
    payload.findGlobal({ slug: 'seo-settings', depth: 1, overrideAccess: false }) as Promise<SeoSetting>,
  ])
  return { site, navigation, seo }
})
