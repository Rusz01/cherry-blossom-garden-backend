import Image from 'next/image'
import React from 'react'

import type { Media as MediaDoc } from '@/payload-types'

type Props = {
  resource?: number | MediaDoc | null
  size?: 'thumbnail' | 'card' | 'feature'
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
}

/** Renders a Media document with next/image (falls back to a native element for video/PDF). */
export const Media: React.FC<Props> = ({ resource, size, className, priority, sizes = '100vw', fill }) => {
  if (!resource || typeof resource !== 'object' || !resource.url) return null

  if (resource.mimeType?.startsWith('video/')) {
    return <video className={className} src={resource.url} controls playsInline preload="metadata" aria-label={resource.alt} />
  }
  if (!resource.mimeType?.startsWith('image/')) {
    return (
      <a className={className} href={resource.url}>
        {resource.alt || resource.filename}
      </a>
    )
  }

  const variant = size ? resource.sizes?.[size] : undefined
  const src = variant?.url || resource.url
  const width = variant?.width || resource.width || 1200
  const height = variant?.height || resource.height || 800

  return fill ? (
    <Image className={className} src={src} alt={resource.alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
  ) : (
    <Image className={className} src={src} alt={resource.alt} width={width} height={height} sizes={sizes} priority={priority} />
  )
}
