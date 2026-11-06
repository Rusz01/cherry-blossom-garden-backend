import type { PayloadRequest } from 'payload'

export type CollectionAction = 'create' | 'read' | 'update' | 'delete'
export type GlobalAction = 'read' | 'update'

export type ID = string | number

export type RelationshipValue = ID | { id: ID } | null | undefined

export type CollectionPermission = {
  id?: string | null
  collection?: string | null
} & Partial<Record<CollectionAction, boolean | null>>

export type GlobalPermission = {
  id?: string | null
  global?: string | null
} & Partial<Record<GlobalAction, boolean | null>>

export type RoleDocument = {
  id: ID
  name?: string | null
  slug?: string | null
  description?: string | null
  isSystem?: boolean | null
  collectionPermissions?: CollectionPermission[] | null
  globalPermissions?: GlobalPermission[] | null
}

export type UserStatus = 'active' | 'suspended'

export type UserDocument = {
  id: ID
  email?: string | null
  name?: string | null
  role?: RelationshipValue | RoleDocument
  status?: UserStatus | null
}

export type PermissionOption = {
  label: string
  value: string
}

export type RBACRequest = PayloadRequest
