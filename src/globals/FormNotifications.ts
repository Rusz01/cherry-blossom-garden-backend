import type { GlobalConfig } from 'payload'
import { administratorsOnly } from '@/access'

/** Intentionally private. Never add to the public page/global response. */
export const FormNotifications: GlobalConfig = {
  slug: 'form-notifications',
  label: 'Form Notification Emails',
  admin: {
    group: 'Administration',
    description:
      'Administrator-only email lists. Add or remove recipients independently for reservation and contact notifications.',
  },
  access: { read: administratorsOnly, update: administratorsOnly },
  fields: [
    {
      name: 'reservationRecipients',
      label: 'Reservation notification recipients',
      type: 'array',
      maxRows: 20,
      admin: { description: 'Add at least one address to receive new reservation requests.' },
      fields: [{ name: 'email', type: 'email', required: true, label: 'Email address' }],
    },
    {
      name: 'contactRecipients',
      label: 'Contact notification recipients',
      type: 'array',
      maxRows: 20,
      admin: { description: 'Add at least one address to receive general enquiries.' },
      fields: [{ name: 'email', type: 'email', required: true, label: 'Email address' }],
    },
  ],
}
