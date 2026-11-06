import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionConfig,
} from 'payload'

import {
  ADMIN_ROLE_SLUG,
  RESERVED_ROLE_SLUGS,
  administratorsOnly,
  getUserRole,
  isAdministrator,
  type PermissionOption,
  type RoleDocument,
} from '@/access'
import { slugify } from '@/utilities/slugify'

/** Context flag used only by the server-side seeding routine. */
export const SYSTEM_ROLE_CONTEXT = 'arthanovaSystemRoleSeed'

const isSystemSeed = (context: Record<string, unknown> | undefined): boolean =>
  context?.[SYSTEM_ROLE_CONTEXT] === true

const assertUnique = (values: unknown[], message: string) => {
  const names = values.filter((value): value is string => typeof value === 'string')
  if (new Set(names).size !== names.length) throw new APIError(message, 400)
}

const protectSystemRoles: CollectionBeforeChangeHook = ({ context, data, operation, originalDoc }) => {
  if (isSystemSeed(context)) return data

  const existing = originalDoc as RoleDocument | undefined

  if (operation === 'update' && (existing?.isSystem || existing?.slug === ADMIN_ROLE_SLUG)) {
    throw new APIError('System roles are protected and cannot be modified.', 403)
  }

  // Slugs are always generated from the name on create (any client-supplied
  // slug is ignored) and stay stable afterwards so that code and integrations
  // referencing a role slug do not break when the role is renamed.
  const slug = operation === 'create' ? slugify(String(data?.name ?? '')) : (existing?.slug ?? undefined)

  if (!slug) throw new APIError('A role name is required.', 400)

  if (RESERVED_ROLE_SLUGS.has(slug)) {
    throw new APIError(`"${slug}" is a reserved role identifier. Choose a different name.`, 400)
  }

  assertUnique(
    (data?.collectionPermissions ?? []).map((p: { collection?: string }) => p?.collection),
    'Each collection may only appear once in a role.',
  )
  assertUnique(
    (data?.globalPermissions ?? []).map((p: { global?: string }) => p?.global),
    'Each global may only appear once in a role.',
  )

  return { ...data, slug, isSystem: false }
}

const preventProtectedRoleDeletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const role = (await req.payload.findByID({
    collection: 'roles',
    id,
    depth: 0,
    overrideAccess: true,
    req,
  })) as unknown as RoleDocument

  if (role.isSystem || role.slug === ADMIN_ROLE_SLUG) {
    throw new APIError('System roles cannot be deleted.', 403)
  }

  const assigned = await req.payload.count({
    collection: 'users',
    where: { role: { equals: id } },
    overrideAccess: true,
    req,
  })

  if (assigned.totalDocs > 0) {
    throw new APIError(
      `This role is assigned to ${assigned.totalDocs} user(s). Reassign them before deleting it.`,
      400,
    )
  }
}

type CreateRolesArgs = {
  collectionOptions: PermissionOption[]
  globalOptions: PermissionOption[]
}

const permissionCheckbox = (name: string, label: string) => ({
  name,
  label,
  type: 'checkbox' as const,
  defaultValue: false,
  admin: { width: '25%' },
})

export const createRolesCollection = ({
  collectionOptions,
  globalOptions,
}: CreateRolesArgs): CollectionConfig => ({
  slug: 'roles',
  labels: { singular: 'Role', plural: 'Roles' },
  admin: {
    useAsTitle: 'name',
    group: 'Administration',
    defaultColumns: ['name', 'slug', 'isSystem', 'updatedAt'],
    listSearchableFields: ['name', 'slug', 'description'],
    description:
      'Roles define what each team member can do. Administrator is a protected system role with full access.',
  },
  access: {
    // Administrators see every role; everyone else may only read their own
    // role (needed to render their permissions in the admin UI).
    read: async ({ req }) => {
      if (!req.user) return false
      if (await isAdministrator(req)) return true
      const role = await getUserRole(req)
      return role ? { id: { equals: role.id } } : false
    },
    create: administratorsOnly,
    update: administratorsOnly,
    delete: administratorsOnly,
  },
  hooks: {
    beforeChange: [protectSystemRoles],
    beforeDelete: [preventProtectedRoleDeletion],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true,
          maxLength: 80,
          admin: { width: '60%', placeholder: 'e.g. Content Editor' },
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          index: true,
          maxLength: 80,
          admin: {
            width: '40%',
            readOnly: true,
            description: 'Generated from the name when the role is created.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Explain who should receive this role and why.' },
    },
    {
      name: 'isSystem',
      label: 'System role',
      type: 'checkbox',
      defaultValue: false,
      access: { create: () => false, update: () => false },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'System roles are created automatically and cannot be edited or deleted.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Collection permissions',
          description: 'Grant access per collection. Anything not listed is denied.',
          fields: [
            {
              name: 'collectionPermissions',
              label: 'Collections',
              type: 'array',
              labels: { singular: 'Collection permission', plural: 'Collection permissions' },
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'collection',
                  type: 'select',
                  required: true,
                  options: collectionOptions,
                },
                {
                  type: 'row',
                  fields: [
                    permissionCheckbox('read', 'Read'),
                    permissionCheckbox('create', 'Create'),
                    permissionCheckbox('update', 'Update'),
                    permissionCheckbox('delete', 'Delete'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Global permissions',
          description: 'Grant access to site-wide settings.',
          fields: [
            {
              name: 'globalPermissions',
              label: 'Globals',
              type: 'array',
              labels: { singular: 'Global permission', plural: 'Global permissions' },
              fields: [
                {
                  name: 'global',
                  type: 'select',
                  required: true,
                  options: globalOptions,
                },
                {
                  type: 'row',
                  fields: [
                    permissionCheckbox('read', 'Read'),
                    permissionCheckbox('update', 'Update'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Assigned users',
          fields: [
            {
              name: 'assignedUsers',
              label: 'Users with this role',
              type: 'join',
              collection: 'users',
              on: 'role',
              admin: { allowCreate: false, defaultColumns: ['name', 'email', 'status'] },
            },
          ],
        },
      ],
    },
  ],
})
