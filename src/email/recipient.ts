import type { PayloadRequest } from 'payload'

import { getRelationshipID, type RoleDocument, type UserDocument } from '@/access'

export const displayName = (user: Partial<UserDocument> | null | undefined): string => {
  const name = user?.name?.trim()
  if (name) return name
  const local = user?.email?.split('@')[0]?.trim()
  return local || 'there'
}

export const resolveRoleName = async (
  req: PayloadRequest,
  user: Partial<UserDocument>,
): Promise<string> => {
  if (user.role && typeof user.role === 'object' && 'name' in user.role) {
    return (user.role as RoleDocument).name || 'Team member'
  }
  const roleID = getRelationshipID(user.role ?? null)
  if (roleID === null) return 'Team member'
  try {
    const role = (await req.payload.findByID({
      collection: 'roles',
      id: roleID,
      depth: 0,
      overrideAccess: true,
      req,
    })) as unknown as RoleDocument
    return role.name?.trim() || 'Team member'
  } catch {
    return 'Team member'
  }
}
