import type { Payload } from 'payload'

import { ADMIN_ROLE_NAME, ADMIN_ROLE_SLUG, type RoleDocument } from '@/access'
import { SYSTEM_ROLE_CONTEXT } from '@/collections/Roles'

/** Slug used by the earlier reference template's system role. */
const LEGACY_ADMIN_ROLE_SLUG = 'admin'

const DESCRIPTION = 'Protected system role with unrestricted access to every collection and global.'

/**
 * Ensures the protected Administrator role exists (idempotent). Runs on init
 * so a fresh database is always ready for the first-user bootstrap.
 */
export const seedAdministratorRole = async (payload: Payload): Promise<RoleDocument> => {
  const existing = await payload.find({
    collection: 'roles',
    where: { slug: { equals: ADMIN_ROLE_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  let role = existing.docs[0] as unknown as RoleDocument | undefined

  // Upgrade path for databases created by the earlier Lumo/Payload template,
  // whose protected system role used the slug "admin". Converting it in place
  // keeps the same ID, so users assigned to it keep Administrator access.
  if (!role) {
    const legacy = await payload.find({
      collection: 'roles',
      where: { and: [{ slug: { equals: LEGACY_ADMIN_ROLE_SLUG } }, { isSystem: { equals: true } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const legacyRole = legacy.docs[0] as unknown as RoleDocument | undefined
    if (legacyRole) {
      role = (await payload.update({
        collection: 'roles',
        id: legacyRole.id,
        data: { name: ADMIN_ROLE_NAME, slug: ADMIN_ROLE_SLUG, isSystem: true, description: DESCRIPTION },
        overrideAccess: true,
        context: { [SYSTEM_ROLE_CONTEXT]: true },
      })) as unknown as RoleDocument
      payload.logger.info('[rbac] Upgraded legacy "admin" system role to the Administrator role.')
      return role
    }
  }

  if (!role) {
    const created = await payload.create({
      collection: 'roles',
      data: {
        name: ADMIN_ROLE_NAME,
        slug: ADMIN_ROLE_SLUG,
        description: DESCRIPTION,
        isSystem: true,
        collectionPermissions: [],
        globalPermissions: [],
      },
      overrideAccess: true,
      context: { [SYSTEM_ROLE_CONTEXT]: true },
    })
    payload.logger.info('[rbac] Administrator system role created.')
    return created as unknown as RoleDocument
  }

  if (role.name !== ADMIN_ROLE_NAME || role.isSystem !== true) {
    const repaired = await payload.update({
      collection: 'roles',
      id: role.id,
      data: { name: ADMIN_ROLE_NAME, isSystem: true },
      overrideAccess: true,
      context: { [SYSTEM_ROLE_CONTEXT]: true },
    })
    payload.logger.info('[rbac] Administrator system role repaired.')
    return repaired as unknown as RoleDocument
  }

  return role
}

export const findAdministratorRole = async (
  payload: Payload,
  req?: Parameters<Payload['find']>[0]['req'],
): Promise<RoleDocument | null> => {
  const result = await payload.find({
    collection: 'roles',
    where: { slug: { equals: ADMIN_ROLE_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  return (result.docs[0] as unknown as RoleDocument | undefined) ?? null
}
