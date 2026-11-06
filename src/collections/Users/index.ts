import type { Access, CollectionConfig } from 'payload'

import { administratorsOnly, administratorsOnlyField, getUserRole, isAdministrator } from '@/access'
import { forgotPasswordConfig } from '@/email/auth/forgotPassword'
import { verifyConfig } from '@/email/auth/verify'

import {
  assignBootstrapRole,
  blockSuspendedLogin,
  preventUnsafeDeletion,
  prepareCreateOperation,
  protectAdministrators,
  welcomeBootstrapUser,
} from './hooks'
import { resendActivationEndpoint } from './resendActivation'

/** Administrators manage everyone; other users can only see and edit themselves. */
const selfOrAdministrator: Access = async ({ req }) => {
  if (!req.user) return false
  if (await isAdministrator(req)) return true
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  auth: {
    verify: verifyConfig,
    forgotPassword: forgotPasswordConfig,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
    useSessions: true,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    useAsTitle: 'name',
    group: 'Administration',
    defaultColumns: ['name', 'email', 'role', 'status', 'updatedAt'],
    listSearchableFields: ['name', 'email'],
    description: 'Team members who can sign in to the CMS. Only Administrators can invite users or change roles.',
  },
  access: {
    // Panel access requires an active account with a role.
    admin: async ({ req }) => Boolean(await getUserRole(req)),
    create: administratorsOnly,
    read: selfOrAdministrator,
    update: selfOrAdministrator,
    delete: administratorsOnly,
    unlock: administratorsOnly,
  },
  endpoints: [resendActivationEndpoint],
  hooks: {
    beforeOperation: [prepareCreateOperation],
    beforeValidate: [assignBootstrapRole],
    beforeChange: [protectAdministrators],
    beforeDelete: [preventUnsafeDeletion],
    beforeLogin: [blockSuspendedLogin],
    afterChange: [welcomeBootstrapUser],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: { placeholder: 'Full name' },
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
      index: true,
      // Field-level access: only Administrators may set or change roles. For
      // anyone else the value is stripped from the request before validation,
      // so self-promotion through the API is impossible.
      access: { create: administratorsOnlyField, update: administratorsOnlyField },
      admin: {
        position: 'sidebar',
        description: 'Determines what this user can access. Only Administrators can change it.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      access: { create: administratorsOnlyField, update: administratorsOnlyField },
      admin: {
        position: 'sidebar',
        description: 'Suspended users cannot sign in and lose all permissions immediately.',
      },
    },
    {
      name: 'activationSentAt',
      type: 'date',
      access: { create: () => false, update: () => false, read: administratorsOnlyField },
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.activationSentAt) && data?._verified === false,
        description: 'When the most recent activation email was issued. Links expire after 7 days.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'activationActions',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/users/ResendActivation#ResendActivation' },
      },
    },
  ],
  timestamps: true,
}
