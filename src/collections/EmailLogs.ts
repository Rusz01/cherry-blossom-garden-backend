import type { CollectionConfig } from 'payload'

import { administratorsOnly } from '@/access'
import { EMAIL_CATEGORIES, EMAIL_LOG_STATUSES } from '@/email/constants'

/**
 * Operational record of email attempts. Written only by the server-side email
 * adapter (Local API with overrideAccess). Never stores message bodies,
 * tokens, passwords or API keys.
 *
 * "Submitted" means Resend accepted the request — it is not a delivery
 * confirmation. Final delivery status would require verified Resend webhooks,
 * which are intentionally not implemented here.
 */
export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  labels: { singular: 'Email log', plural: 'Email logs' },
  admin: {
    group: 'Administration',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'category', 'recipient', 'status', 'attemptedAt'],
    listSearchableFields: ['recipient', 'subject', 'providerMessageId'],
    description:
      'Every email the CMS attempted to send. “Submitted” means Resend accepted it — not that it reached the inbox.',
  },
  access: {
    read: administratorsOnly,
    create: () => false,
    update: () => false,
    delete: administratorsOnly,
  },
  defaultSort: '-attemptedAt',
  timestamps: true,
  fields: [
    { name: 'subject', type: 'text', admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [...EMAIL_CATEGORIES],
          index: true,
          admin: { readOnly: true, width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          options: [...EMAIL_LOG_STATUSES],
          index: true,
          admin: { readOnly: true, width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'recipient', type: 'text', index: true, admin: { readOnly: true, width: '50%' } },
        {
          name: 'relatedUserId',
          label: 'Related user ID',
          type: 'text',
          index: true,
          admin: { readOnly: true, width: '50%' },
        },
      ],
    },
    {
      name: 'attemptedAt',
      type: 'date',
      index: true,
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'providerMessageId',
      label: 'Provider message ID',
      type: 'text',
      admin: { readOnly: true, description: 'Resend email ID (look it up in the Resend dashboard).' },
    },
    {
      name: 'error',
      type: 'textarea',
      admin: { readOnly: true, condition: (data) => Boolean(data?.error) },
    },
  ],
}
