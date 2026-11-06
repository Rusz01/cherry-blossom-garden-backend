import type { CollectionConfig } from 'payload'

import { buildCollectionAccess } from '@/access'

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024 // keep in sync with `upload.limits.fileSize` in payload.config.ts

// SVG is deliberately excluded: SVGs can carry scripts and would be served from
// the CMS origin (stored XSS risk).
export const ALLOWED_MEDIA_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/webm',
]

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  access: buildCollectionAccess('media', { publicRead: true }),
  admin: {
    group: 'Media',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    listSearchableFields: ['filename', 'alt', 'caption'],
    description: `Images, documents and video. Max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB per file.`,
  },
  upload: {
    mimeTypes: ALLOWED_MEDIA_MIME_TYPES,
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumbnail',
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'card', width: 768, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'feature', width: 1280, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'og', width: 1200, height: 630, position: 'centre', formatOptions: { format: 'jpeg', options: { quality: 85 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternative text',
      type: 'text',
      required: true,
      maxLength: 250,
      admin: {
        description:
          'Describe what the image shows for screen-reader users and search engines (e.g. “Team reviewing a website prototype”).',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Optional visible caption.' },
    },
    {
      name: 'credit',
      type: 'text',
      maxLength: 200,
      admin: { description: 'Photographer or source, if attribution is required.' },
    },
  ],
}
