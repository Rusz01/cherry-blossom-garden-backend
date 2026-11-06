import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { buildCollectionAccess } from '@/access'
import { pageBlocks } from '@/blocks'
import { slugField } from '@/fields/slug'
import { getAppURL } from '@/lib/env'
import { previewPath } from '@/lib/cms/paths'

const setPublishedAt: CollectionBeforeChangeHook = ({ data }) => {
  if (data?._status === 'published' && !data.publishedAt) {
    return { ...data, publishedAt: new Date().toISOString() }
  }
  return data
}

const setDefaultAuthor: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && !data?.author && req.user?.collection === 'users') {
    return { ...data, author: req.user.id }
  }
  return data
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: buildCollectionAccess('pages', { drafts: true }),
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    description: 'Website pages built from flexible content blocks. Drafts stay private until published.',
    // "Preview" button: opens the draft in a new tab (requires an authorised session).
    preview: (doc) => `${getAppURL()}${previewPath(doc?.slug as string)}`,
    livePreview: {
      url: ({ data }) => `${getAppURL()}${previewPath(data?.slug as string)}`,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    maxPerDoc: 50,
    drafts: {
      autosave: { interval: 2000 },
      schedulePublish: true,
    },
  },
  hooks: {
    beforeChange: [setDefaultAuthor, setPublishedAt],
  },
  // The leading `tabs` field lets the SEO plugin append its "SEO" tab while
  // the slug/date/author fields below stay in the sidebar.
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true, maxLength: 160 },
            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 300,
              admin: { description: 'Short summary used in listings and as a fallback meta description.' },
            },
            { name: 'featuredImage', type: 'upload', relationTo: 'media' },
            {
              name: 'content',
              label: 'Body',
              type: 'richText',
              admin: { description: 'Optional introduction rendered before the content blocks.' },
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'layout',
              label: 'Content blocks',
              type: 'blocks',
              blocks: pageBlocks,
              admin: { initCollapsed: true },
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set automatically on first publish.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
  ],
}
