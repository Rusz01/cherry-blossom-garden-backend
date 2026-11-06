/** Slug of the protected, built-in Administrator role. */
export const ADMIN_ROLE_SLUG = 'administrator'
export const ADMIN_ROLE_NAME = 'Administrator'

/**
 * Slugs that can never be used by custom roles. This blocks look-alike roles
 * such as "admin" or "super-admin" that could confuse people reviewing access.
 */
export const RESERVED_ROLE_SLUGS: ReadonlySet<string> = new Set([
  ADMIN_ROLE_SLUG,
  'admin',
  'administrators',
  'superadmin',
  'super-admin',
  'super-administrator',
  'root',
  'system',
  'owner',
])

/**
 * Collections that are never configurable through custom role permissions.
 * They are always restricted to administrators (with self-service exceptions
 * for a user's own account, handled in the Users collection).
 */
export const ADMIN_ONLY_COLLECTIONS: ReadonlySet<string> = new Set([
  'users',
  'roles',
  'email-logs',
  'payload-jobs',
  'payload-locked-documents',
  'payload-preferences',
  'payload-migrations',
  'payload-kv',
  'payload-folders',
])
