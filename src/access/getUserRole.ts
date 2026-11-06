import type { PayloadRequest } from 'payload'

import type { ID, RelationshipValue, RoleDocument, UserDocument } from './types'

/**
 * Per-request role cache. Access functions run many times per request (once
 * per collection, global and field), so we only fetch the role once.
 */
const roleCache = new WeakMap<object, Promise<RoleDocument | null>>()

export const getRelationshipID = (value: RelationshipValue | RoleDocument): ID | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const { id } = value
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return null
}

const isPopulatedRole = (value: unknown): value is RoleDocument =>
  Boolean(value && typeof value === 'object' && 'id' in value && 'slug' in value)

const resolveRole = async (req: PayloadRequest): Promise<RoleDocument | null> => {
  const user = req.user as UserDocument | null | undefined

  if (!user || (user as { collection?: string }).collection !== 'users') return null

  // Suspended accounts lose every permission immediately, even if they still
  // hold a valid session token.
  if (user.status === 'suspended') return null

  if (isPopulatedRole(user.role)) return user.role

  const roleID = getRelationshipID(user.role)
  if (roleID === null) return null

  try {
    const role = await req.payload.findByID({
      collection: 'roles',
      id: roleID,
      depth: 0,
      overrideAccess: true,
      req,
    })
    return role as unknown as RoleDocument
  } catch {
    return null
  }
}

/** Returns the authenticated user's role (or `null` if anonymous/suspended/unassigned). */
export const getUserRole = (req: PayloadRequest): Promise<RoleDocument | null> => {
  const cached = roleCache.get(req)
  if (cached) return cached

  const promise = resolveRole(req)
  roleCache.set(req, promise)
  return promise
}
