import type { Field, GlobalConfig } from 'payload'

import { buildGlobalAccess } from '@/access'
import { linkField } from '@/fields/link'

const navItems = (name: string, label: string, maxRows: number): Field => ({
  name,
  label,
  type: 'array',
  maxRows,
  labels: { singular: 'Link', plural: 'Links' },
  admin: {
    description: 'Drag to reorder. Hidden links are kept but not displayed.',
    components: { RowLabel: '/components/admin/RowLabel#LinkRowLabel' },
  },
  fields: [
    linkField(),
    { name: 'visible', type: 'checkbox', defaultValue: true, label: 'Visible' },
  ],
})

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: buildGlobalAccess('navigation', { publicRead: true }),
  admin: { group: 'Settings', description: 'Header and footer menus.' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            navItems('headerLinks', 'Header links', 8),
            {
              name: 'headerCta',
              label: 'Header button',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  ...linkField({ name: 'link', required: false }),
                  admin: { condition: (_, sibling) => Boolean(sibling?.enabled) },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            navItems('footerLinks', 'Footer links', 16),
            { name: 'footerNote', type: 'text', maxLength: 200, admin: { description: 'Short line shown in the footer.' } },
          ],
        },
      ],
    },
  ],
}
