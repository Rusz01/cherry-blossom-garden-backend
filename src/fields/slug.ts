import type { TextField } from 'payload'

import { slugify } from '@/utilities/slugify'

/**
 * URL slug generated from another field (default: title) when left empty.
 * Editors can override it; the value is always normalised.
 */
export const slugField = (sourceField = 'title'): TextField => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  maxLength: 120,
  admin: {
    position: 'sidebar',
    description: 'URL path segment. Generated from the title when empty. Use “home” for the homepage.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const source = typeof value === 'string' && value.trim() ? value : data?.[sourceField]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
  validate: (value: unknown) => {
    if (!value) return 'A slug is required.'
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value))
      ? true
      : 'Only lowercase letters, numbers and single hyphens are allowed.'
  },
})
