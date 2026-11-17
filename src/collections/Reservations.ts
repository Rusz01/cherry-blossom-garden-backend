import type { CollectionConfig } from 'payload'
import { administratorsOnly, hasCollectionPermission } from '@/access'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  labels: { singular: 'Reservation', plural: 'Reservations' },
  admin: {
    group: 'Guest Relations', useAsTitle: 'name',
    defaultColumns: ['date', 'time', 'name', 'guests', 'experience', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description: 'Table requests only. A request is not a confirmed booking until the team confirms it.',
  },
  defaultSort: '-createdAt',
  access: {
    create: administratorsOnly,
    read: hasCollectionPermission('reservations', 'read'),
    update: hasCollectionPermission('reservations', 'update'),
    delete: administratorsOnly,
  },
  fields: [
    {
      name: 'status', type: 'select', required: true, defaultValue: 'pending', index: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Declined', value: 'declined' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'name', type: 'text', required: true, maxLength: 120, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
    { name: 'phone', type: 'text', required: true, maxLength: 35, admin: { readOnly: true } },
    { name: 'date', type: 'text', required: true, index: true, admin: { readOnly: true, description: 'YYYY-MM-DD in Nepal' } },
    { name: 'time', type: 'text', required: true, admin: { readOnly: true, description: '24-hour Nepal time' } },
    { name: 'guests', type: 'number', required: true, admin: { readOnly: true } },
    { name: 'experience', type: 'select', required: true, admin: { readOnly: true }, options: [
      { label: 'Café', value: 'cafe' }, { label: 'Restaurant', value: 'restaurant' },
      { label: 'Garden Balcony', value: 'garden-balcony' },
      { label: 'Private Dining', value: 'private-dining' },
      { label: 'Rooftop', value: 'rooftop' },
    ] },
    { name: 'occasion', type: 'text', maxLength: 100, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', maxLength: 1000, admin: { readOnly: true } },
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
