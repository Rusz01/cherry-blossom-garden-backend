import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

import { ADMIN_ROLE_SLUG } from './constants'
import { getUserRole } from './getUserRole'
import type { CollectionAction, GlobalAction, RoleDocument } from './types'

export const roleIsAdministrator = (role: RoleDocument | null | undefined): boolean =>
  role?.slug === ADMIN_ROLE_SLUG

export const isAdministrator = async (req: PayloadRequest): Promise<boolean> =>
  roleIsAdministrator(await getUserRole(req))

export const roleCanAccessCollection = (
  role: RoleDocument | null | undefined,
  collection: string,
  action: CollectionAction,
): boolean => {
  if (!role) return false
  if (roleIsAdministrator(role)) return true
  return (
    role.collectionPermissions?.some(
      (permission) => permission.collection === collection && permission[action] === true,
    ) ?? false
  )
}

export const roleCanAccessGlobal = (
  role: RoleDocument | null | undefined,
  global: string,
  action: GlobalAction,
): boolean => {
  if (!role) return false
  if (roleIsAdministrator(role)) return true
  return (
    role.globalPermissions?.some(
      (permission) => permission.global === global && permission[action] === true,
    ) ?? false
  )
}

export const canAccessCollection = async (
  req: PayloadRequest,
  collection: string,
  action: CollectionAction,
): Promise<boolean> => roleCanAccessCollection(await getUserRole(req), collection, action)

export const canAccessGlobal = async (
  req: PayloadRequest,
  global: string,
  action: GlobalAction,
): Promise<boolean> => roleCanAccessGlobal(await getUserRole(req), global, action)

/* -------------------------------------------------------------------------- */
/* Access function factories                                                  */
/* -------------------------------------------------------------------------- */

export const administratorsOnly: Access = ({ req }) => isAdministrator(req)

export const administratorsOnlyField: FieldAccess = ({ req }) => isAdministrator(req)

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const anyone: Access = () => true

export const hasCollectionPermission =
  (collection: string, action: CollectionAction): Access =>
  ({ req }) =>
    canAccessCollection(req, collection, action)

export const hasGlobalPermission =
  (global: string, action: GlobalAction): Access =>
  ({ req }) =>
    canAccessGlobal(req, global, action)

const publishedOnly: Where = { _status: { equals: 'published' } }

/**
 * Read access for draft-enabled collections: users whose role grants `read`
 * see drafts; everyone else (including anonymous visitors) only receives
 * published documents. This is enforced in the database query, so drafts
 * cannot leak through REST, GraphQL or the Local API with `overrideAccess: false`.
 */
export const publishedOrHasPermission =
  (collection: string): Access =>
  async ({ req }) =>
    (await canAccessCollection(req, collection, 'read')) ? true : publishedOnly

/** Global read access: public when `publicRead` is set, otherwise permission-based. */
export const globalReadAccess =
  (global: string, options: { publicRead?: boolean } = {}): Access =>
  async ({ req }) =>
    options.publicRead ? true : canAccessGlobal(req, global, 'read')

export type CollectionAccessOptions = {
  /** Allow anonymous read access (e.g. public media). */
  publicRead?: boolean
  /** Use draft-aware read access (published documents are public). */
  drafts?: boolean
}

/** Builds create/read/update/delete (+ readVersions) access for a managed collection. */
export const buildCollectionAccess = (
  collection: string,
  options: CollectionAccessOptions = {},
) => {
  const read: Access = options.drafts
    ? publishedOrHasPermission(collection)
    : options.publicRead
      ? anyone
      : hasCollectionPermission(collection, 'read')

  return {
    create: hasCollectionPermission(collection, 'create'),
    read,
    update: hasCollectionPermission(collection, 'update'),
    delete: hasCollectionPermission(collection, 'delete'),
    // Version history (which includes drafts) is never public.
    readVersions: hasCollectionPermission(collection, 'read'),
  }
}

export const buildGlobalAccess = (global: string, options: { publicRead?: boolean } = {}) => ({
  read: globalReadAccess(global, options),
  update: hasGlobalPermission(global, 'update'),
  readVersions: hasGlobalPermission(global, 'read'),
})
