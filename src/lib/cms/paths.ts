/** Shared, framework-agnostic helpers for page URLs (safe for client and server). */

export const HOME_SLUG = 'home'

export const pagePath = (slug: string | null | undefined): string =>
  !slug || slug === HOME_SLUG ? '/' : `/${slug}`

/**
 * Only allow same-origin relative paths for preview redirects
 * (prevents open redirects such as `//evil.example`).
 */
export const isSafeRelativePath = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')

export const previewPath = (slug: string | null | undefined): string =>
  `/next/preview?path=${encodeURIComponent(pagePath(slug))}`
