import {
  Code,
  Globe,
  Layers,
  MessageCircle,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import React from 'react'

import type { FeatureIconName } from '@/utilities/featureIcons'
import type { ButtonLink, Page } from '@/payload-types'

import { CMSLink } from '../CMSLink'
import { Media } from '../Media'
import { RichText } from '../RichText'

type Block = NonNullable<Page['layout']>[number]
type BlockOf<T extends Block['blockType']> = Extract<Block, { blockType: T }>

const ICONS: Record<FeatureIconName, LucideIcon> = {
  sparkles: Sparkles,
  rocket: Rocket,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  code: Code,
  layers: Layers,
  zap: Zap,
  target: Target,
  users: Users,
  globe: Globe,
  settings: Settings,
  'message-circle': MessageCircle,
}

const Eyebrow = ({ text }: { text?: string | null }) => (text ? <p className="eyebrow">{text}</p> : null)

const Actions = ({ actions }: { actions?: { link: ButtonLink; id?: string | null }[] | null }) =>
  actions?.length ? (
    <div className="actions">
      {actions.map((action, i) => (
        <CMSLink key={action.id ?? i} link={action.link} />
      ))}
    </div>
  ) : null

const Hero = ({ block }: { block: BlockOf<'hero'> }) => (
  <section className={`block hero hero--${block.layout ?? 'split'}`}>
    <div className="hero__text">
      <Eyebrow text={block.eyebrow} />
      <h1 className="display">{block.heading}</h1>
      {block.subheading && <p className="lead">{block.subheading}</p>}
      <Actions actions={block.actions} />
    </div>
    {block.media && (
      <div className="hero__media">
        <Media resource={block.media} size="feature" priority sizes="(min-width: 960px) 50vw, 100vw" />
      </div>
    )}
  </section>
)

const RichTextSection = ({ block }: { block: BlockOf<'richText'> }) => (
  <section className={`block richtext richtext--${block.width ?? 'narrow'}`}>
    <RichText data={block.content} />
  </section>
)

const ImageSection = ({ block }: { block: BlockOf<'image'> }) => (
  <figure className={`block image image--${block.size ?? 'contained'}`}>
    <Media resource={block.image} size="feature" />
    {block.caption && <figcaption>{block.caption}</figcaption>}
  </figure>
)

const ImageText = ({ block }: { block: BlockOf<'imageText'> }) => (
  <section className={`block image-text image-text--${block.imagePosition ?? 'right'}`}>
    <div className="image-text__copy">
      <Eyebrow text={block.eyebrow} />
      {block.heading && <h2 className="display-sm">{block.heading}</h2>}
      <RichText data={block.content} />
      {block.action && <CMSLink link={block.link} />}
    </div>
    <div className="image-text__media">
      <Media resource={block.image} size="card" sizes="(min-width: 960px) 50vw, 100vw" />
    </div>
  </section>
)

const CallToAction = ({ block }: { block: BlockOf<'callToAction'> }) => (
  <section className={`block cta cta--${block.style ?? 'dark'}`}>
    <h2 className="display-sm">{block.heading}</h2>
    {block.text && <p className="lead">{block.text}</p>}
    <Actions actions={block.actions} />
  </section>
)

const FeatureGrid = ({ block }: { block: BlockOf<'featureGrid'> }) => (
  <section className="block features">
    <header className="section-header">
      <Eyebrow text={block.eyebrow} />
      {block.heading && <h2 className="display-sm">{block.heading}</h2>}
      {block.intro && <p className="lead">{block.intro}</p>}
    </header>
    <div className={`grid grid--${block.columns ?? '3'}`}>
      {block.features?.map((feature, i) => {
        const Icon = feature.icon ? ICONS[feature.icon as FeatureIconName] : null
        return (
          <article key={feature.id ?? i} className="card">
            {Icon && (
              <span className="card__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
            )}
            <h3>{feature.title}</h3>
            {feature.description && <p>{feature.description}</p>}
          </article>
        )
      })}
    </div>
  </section>
)

const FAQ = ({ block }: { block: BlockOf<'faq'> }) => (
  <section className="block faq">
    {block.heading && <h2 className="display-sm">{block.heading}</h2>}
    <div className="faq__list">
      {block.items?.map((item, i) => (
        <details key={item.id ?? i} className="faq__item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
)

const Testimonials = ({ block }: { block: BlockOf<'testimonials'> }) => (
  <section className="block testimonials">
    {block.heading && <h2 className="display-sm">{block.heading}</h2>}
    <div className="grid grid--3">
      {block.items?.map((item, i) => (
        <figure key={item.id ?? i} className="card testimonial">
          <blockquote>“{item.quote}”</blockquote>
          <figcaption>
            {item.avatar && <Media className="testimonial__avatar" resource={item.avatar} size="thumbnail" sizes="48px" />}
            <span>
              <strong>{item.author}</strong>
              {item.role && <span className="muted">{item.role}</span>}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
)

const Gallery = ({ block }: { block: BlockOf<'gallery'> }) => (
  <section className="block gallery">
    {block.heading && <h2 className="display-sm">{block.heading}</h2>}
    <div className={`grid grid--${block.columns ?? '3'}`}>
      {block.images?.map((image, i) => (
        <div key={typeof image === 'object' ? image.id : `${image}-${i}`} className="gallery__item">
          <Media resource={image} size="card" sizes="(min-width: 960px) 33vw, 100vw" />
        </div>
      ))}
    </div>
  </section>
)

export const RenderBlocks: React.FC<{ blocks?: Page['layout'] }> = ({ blocks }) => {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'hero':
            return <Hero key={key} block={block} />
          case 'richText':
            return <RichTextSection key={key} block={block} />
          case 'image':
            return <ImageSection key={key} block={block} />
          case 'imageText':
            return <ImageText key={key} block={block} />
          case 'callToAction':
            return <CallToAction key={key} block={block} />
          case 'featureGrid':
            return <FeatureGrid key={key} block={block} />
          case 'faq':
            return <FAQ key={key} block={block} />
          case 'testimonials':
            return <Testimonials key={key} block={block} />
          case 'gallery':
            return <Gallery key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
