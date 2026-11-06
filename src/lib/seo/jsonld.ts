import { pagePath } from '@/lib/cms/paths'
import type { FAQBlock, Page, SeoSetting, SiteSetting } from '@/payload-types'

import { getSiteOrigin } from './metadata'

type JsonLd = Record<string, unknown>

/**
 * schema.org builders. They only use data editors entered in the CMS — no
 * ratings, reviews or business facts are ever invented.
 */
export const webPageSchema = (page: Page, site: SiteSetting, seo: SeoSetting): JsonLd => {
  const origin = getSiteOrigin(seo)
  return {
    '@context': 'https://schema.org',
    '@type': page.meta?.schemaType || 'WebPage',
    name: page.meta?.title || page.title,
    ...(page.meta?.description || page.excerpt ? { description: page.meta?.description || page.excerpt } : {}),
    url: `${origin}${pagePath(page.slug)}`,
    ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
    dateModified: page.updatedAt,
    isPartOf: { '@type': 'WebSite', name: site.siteName, url: origin },
  }
}

export const faqSchema = (blocks: FAQBlock[]): JsonLd | null => {
  const items = blocks
    .filter((block) => block.includeSchema !== false)
    .flatMap((block) => block.items ?? [])
    .filter((item) => item.question?.trim() && item.answer?.trim())
  if (items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export const organizationSchema = (site: SiteSetting, seo: SeoSetting): JsonLd | null => {
  if (!seo.organization?.enabled) return null
  const origin = getSiteOrigin(seo)
  const logo = site.logo && typeof site.logo === 'object' ? site.logo.url : undefined
  const sameAs = (site.socialLinks ?? []).map((link) => link.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': seo.organization.type || 'Organization',
    name: site.siteName,
    ...(seo.organization.legalName ? { legalName: seo.organization.legalName } : {}),
    url: origin,
    ...(logo ? { logo: logo.startsWith('http') ? logo : `${origin}${logo}` } : {}),
    ...(site.description ? { description: site.description } : {}),
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
    ...(site.contactPhone ? { telephone: site.contactPhone } : {}),
    ...(site.address ? { address: site.address } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** Serialises JSON-LD safely for a <script> tag (prevents `</script>` injection). */
export const serializeJsonLd = (data: JsonLd): string =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
