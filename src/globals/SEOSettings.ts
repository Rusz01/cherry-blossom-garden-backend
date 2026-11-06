import type { GlobalConfig } from 'payload'

import { buildGlobalAccess } from '@/access'

export const SEOSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO settings',
  access: buildGlobalAccess('seo-settings', { publicRead: true }),
  admin: {
    group: 'Settings',
    description: 'Site-wide defaults for search engines, social sharing and structured data.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Defaults',
          fields: [
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s | Arthanova Studio',
              admin: { description: 'Use %s where the page title should go.' },
              validate: (v: unknown) => (!v || String(v).includes('%s') ? true : 'The template must contain %s.'),
            },
            {
              name: 'defaultTitle',
              label: 'Default SEO title',
              type: 'text',
              maxLength: 70,
              admin: { description: 'Used when a page has no SEO title. Aim for 50–60 characters.' },
            },
            {
              name: 'defaultDescription',
              label: 'Default meta description',
              type: 'textarea',
              maxLength: 170,
              admin: { description: 'Aim for 120–160 characters.' },
            },
            {
              name: 'defaultImage',
              label: 'Default Open Graph image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '1200×630 recommended.' },
            },
          ],
        },
        {
          label: 'Indexing',
          fields: [
            {
              name: 'canonicalBaseURL',
              label: 'Canonical base URL',
              type: 'text',
              admin: {
                description:
                  'Public origin of the website, e.g. https://www.example.com. Falls back to APP_URL. Used for canonical links and the sitemap.',
              },
              validate: (v: unknown) => (!v || /^https?:\/\/[^/]+$/.test(String(v)) ? true : 'Use an origin without a trailing path, e.g. https://example.com'),
            },
            {
              name: 'allowIndexing',
              label: 'Allow search engines to index this site',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Off by default so staging or unfinished sites are not indexed. Turn on for production.',
              },
            },
            {
              name: 'disallowPaths',
              label: 'Paths to exclude in robots.txt',
              type: 'array',
              fields: [{ name: 'path', type: 'text', required: true, admin: { placeholder: '/private' } }],
            },
          ],
        },
        {
          label: 'Social & structured data',
          fields: [
            { name: 'twitterHandle', label: 'X / Twitter handle', type: 'text', admin: { placeholder: '@handle' } },
            {
              name: 'organization',
              label: 'Organization structured data',
              type: 'group',
              admin: {
                description:
                  'Publishes schema.org Organization JSON-LD using Site settings. Only factual information is used — no ratings or reviews are generated.',
              },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'Organization',
                  options: [
                    { label: 'Organization', value: 'Organization' },
                    { label: 'Local business', value: 'LocalBusiness' },
                    { label: 'Professional service', value: 'ProfessionalService' },
                  ],
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  name: 'legalName',
                  type: 'text',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
