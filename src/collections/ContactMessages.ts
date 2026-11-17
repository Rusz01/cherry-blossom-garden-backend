import type { CollectionConfig } from 'payload'
import { administratorsOnly, hasCollectionPermission } from '@/access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: {
    group: 'Guest Relations', useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'emailStatus', 'createdAt'],
    listSearchableFields: ['name', 'email', 'message'],
    description: 'General contact enquiries. Kept separate from table reservations.',
  },
  defaultSort: '-createdAt',
  access: {
    create: administratorsOnly,
    read: hasCollectionPermission('contact-messages', 'read'),
    update: hasCollectionPermission('contact-messages', 'update'),
    delete: administratorsOnly,
  },
  fields: [
    {
      name: 'status', type: 'select', required: true, defaultValue: 'new', index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' }, { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' }, { label: 'Closed', value: 'closed' },
      ],
    },
    { name: 'name', type: 'text', required: true, maxLength: 120, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, maxLength: 3000, admin: { readOnly: true } },
    {
      name: 'emailStatus', type: 'select', defaultValue: 'pending', index: true,
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Submitted to Resend', value: 'submitted' },
        { label: 'Partially submitted', value: 'partial' },
        { label: 'Failed', value: 'failed' },
        { label: 'Captured in development', value: 'captured' },
      ],
    },
    { name: 'internalNotes', type: 'textarea', label: 'Staff notes (never sent to the customer)' },
  ],
}
