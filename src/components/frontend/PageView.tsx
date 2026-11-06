import React from 'react'

import { getAppURL } from '@/lib/env'
import { pagePath } from '@/lib/cms/paths'
import { faqSchema, organizationSchema, webPageSchema } from '@/lib/seo/jsonld'
import type { FAQBlock, Navigation, Page, SeoSetting, SiteSetting } from '@/payload-types'

import { RenderBlocks } from './blocks'
import { JsonLd } from './JsonLd'
import { LivePreviewListener } from './LivePreviewListener'
import { PreviewBanner } from './PreviewBanner'
import { RichText } from './RichText'
import { SiteFooter, SiteHeader } from './SiteChrome'

type Props = {
  page: Page
  site: SiteSetting
  navigation: Navigation
  seo: SeoSetting
  draft: boolean
}

export const PageView: React.FC<Props> = ({ page, site, navigation, seo, draft }) => {
  const faqBlocks = (page.layout ?? []).filter((block): block is FAQBlock & { blockType: 'faq' } => block.blockType === 'faq')
  const startsWithHero = page.layout?.[0]?.blockType === 'hero'

  return (
    <>
      {draft && (
        <>
          <PreviewBanner path={pagePath(page.slug)} />
          <LivePreviewListener serverURL={getAppURL()} />
        </>
      )}
      <SiteHeader site={site} navigation={navigation} />
      <main className="page">
        {!startsWithHero && (
          <header className="page__header">
            <h1 className="display">{page.title}</h1>
            {page.excerpt && <p className="lead">{page.excerpt}</p>}
          </header>
        )}
        {page.content && (
          <section className="block richtext richtext--narrow">
            <RichText data={page.content} />
          </section>
        )}
        <RenderBlocks blocks={page.layout} />
      </main>
      <SiteFooter site={site} navigation={navigation} />
      <JsonLd data={webPageSchema(page, site, seo)} />
      <JsonLd data={faqSchema(faqBlocks)} />
      {page.slug === 'home' && <JsonLd data={organizationSchema(site, seo)} />}
    </>
  )
}
