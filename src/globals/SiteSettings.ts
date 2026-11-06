import type { GlobalConfig } from 'payload'

import { buildGlobalAccess } from '@/access'

const SOCIAL_PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube', 'TikTok', 'GitHub', 'Behance', 'Dribbble', 'Other']

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: buildGlobalAccess('site-settings', { publicRead: true }),
  admin: {
    group: 'Settings',
    description: 'Brand, contact and social details used across the website.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', type: 'text', required: true, defaultValue: 'Arthanova Studio', admin: { width: '50%' } },
                { name: 'tagline', type: 'text', maxLength: 120, admin: { width: '50%' } },
              ],
            },
            { name: 'description', label: 'Website description', type: 'textarea', maxLength: 400 },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'For light backgrounds.' } },
                { name: 'logoInverse', label: 'Logo (inverse)', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'For dark backgrounds.' } },
              ],
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Square PNG, at least 512×512. Falls back to /favicon.png.' },
            },
          ],
        },
        {
          label: 'Contact',
          description: 'Only enter details you want published. Empty fields are hidden on the website.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'contactEmail', type: 'email', admin: { width: '50%' } },
                { name: 'contactPhone', type: 'text', maxLength: 40, admin: { width: '50%' } },
              ],
            },
            { name: 'address', label: 'Business address', type: 'textarea', maxLength: 300 },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: SOCIAL_PLATFORMS.map((p) => ({ label: p, value: p.toLowerCase() })),
                      admin: { width: '35%' },
                    },
                    {
                      name: 'url',
                      label: 'URL',
                      type: 'text',
                      required: true,
                      validate: (v: unknown) => (!v || /^https:\/\//.test(String(v)) ? true : 'Use an https:// URL.'),
                      admin: { width: '65%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
