import type { Field, GroupField } from 'payload'

type LinkOptions = {
  name?: string
  label?: string
  /** Show a visual style selector (for buttons). */
  appearance?: boolean
  required?: boolean
}

const validateURL = (value: unknown): true | string => {
  if (!value) return true
  const str = String(value)
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(str)) return true
  return 'Use an absolute URL (https://…), a relative path (/about), mailto:, tel: or #anchor.'
}

/** Reusable internal/external link. Internal links reference Pages so they survive slug changes. */
export const linkField = ({ name = 'link', label, appearance = false, required = true }: LinkOptions = {}): GroupField => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal page', value: 'internal' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'newTab',
          label: 'Open in new tab',
          type: 'checkbox',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required,
          maxLength: 80,
          admin: { width: '50%' },
        },
        {
          name: 'reference',
          label: 'Page',
          type: 'relationship',
          relationTo: 'pages',
          required,
          maxDepth: 1,
          admin: { width: '50%', condition: (_, sibling) => sibling?.type === 'internal' },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required,
          validate: validateURL,
          admin: { width: '50%', condition: (_, sibling) => sibling?.type === 'custom' },
        },
      ],
    },
  ]

  if (appearance) {
    fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Text link', value: 'link' },
      ],
    })
  }

  return {
    name,
    label,
    type: 'group',
    interfaceName: appearance ? 'ButtonLink' : 'CMSLink',
    admin: { hideGutter: true },
    fields,
  }
}
