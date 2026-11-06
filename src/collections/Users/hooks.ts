import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeLoginHook,
  type CollectionBeforeOperationHook,
  type CollectionBeforeValidateHook,
  type PayloadRequest,
} from 'payload'

import { getRelationshipID, type ID, type UserDocument } from '@/access'
import { sendWelcomeEmail } from '@/email/accountEmails'
import { findAdministratorRole } from '@/hooks/seedAdministratorRole'

/** `req.context` keys used by the Users collection. */
export const USER_CONTEXT = {
  /** Set while the very first account is being created (admin bootstrap). */
  bootstrap: 'arthanovaBootstrapUser',
  /** Skip account emails (seeding, imports, tests). */
  skipEmails: 'skipAccountEmails',
} as const

const countUsers = async (req: PayloadRequest) =>
  (await req.payload.count({ collection: 'users', overrideAccess: true, req })).totalDocs

/** Counts active administrators, optionally excluding one user. */
const countActiveAdministrators = async (req: PayloadRequest, excludeID?: ID) => {
  const adminRole = await findAdministratorRole(req.payload, req)
  if (!adminRole) return 0
  const result = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
    where: {
      and: [
        { role: { equals: adminRole.id } },
        { status: { not_equals: 'suspended' } },
        ...(excludeID !== undefined ? [{ id: { not_equals: excludeID } }] : []),
      ],
    },
  })
  return result.totalDocs
}

const isAdministratorRoleID = async (req: PayloadRequest, roleID: ID | null) => {
  if (roleID === null) return false
  const adminRole = await findAdministratorRole(req.payload, req)
  return adminRole !== null && String(adminRole.id) === String(roleID)
}

/**
 * Detects the first-user bootstrap and decides whether Payload should send its
 * verification (activation) email for this create operation.
 */
export const prepareCreateOperation: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create') return args

  if ((await countUsers(req)) === 0) {
    req.context[USER_CONTEXT.bootstrap] = true
    // Payload's first-register flow auto-verifies the first user, so a
    // verification email would be redundant (and must not block bootstrap).
    return { ...args, disableVerificationEmail: true }
  }

  if (req.context[USER_CONTEXT.skipEmails] === true) {
    return { ...args, disableVerificationEmail: true }
  }

  return args
}

/** The first user always becomes an active Administrator. */
export const assignBootstrapRole: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || req.context[USER_CONTEXT.bootstrap] !== true) return data

  const adminRole = await findAdministratorRole(req.payload, req)
  if (!adminRole) {
    throw new APIError('The Administrator role has not been initialised. Restart the server and try again.', 500)
  }
  return { ...data, role: adminRole.id, status: 'active' }
}

/**
 * Guards against lock-out and privilege abuse:
 *  - the final active Administrator cannot be demoted or suspended;
 *  - users cannot suspend themselves;
 *  - records when an activation email is issued (for link expiry).
 */
export const protectAdministrators: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation === 'create') {
    if (req.context[USER_CONTEXT.bootstrap] !== true && req.context[USER_CONTEXT.skipEmails] !== true) {
      return { ...data, activationSentAt: new Date().toISOString() }
    }
    return data
  }

  const previous = originalDoc as UserDocument | undefined
  if (!previous) return data

  const roleChanged =
    Object.prototype.hasOwnProperty.call(data, 'role') &&
    String(getRelationshipID(data.role)) !== String(getRelationshipID(previous.role ?? null))
  const beingSuspended = data.status === 'suspended' && previous.status !== 'suspended'

  if (beingSuspended && req.user && String(req.user.id) === String(previous.id)) {
    throw new APIError('You cannot suspend your own account.', 400)
  }

  if ((roleChanged || beingSuspended) && (await isAdministratorRoleID(req, getRelationshipID(previous.role ?? null)))) {
    if ((await countActiveAdministrators(req, previous.id)) === 0) {
      throw new APIError(
        'This is the last active Administrator. Assign the Administrator role to another active user first.',
        400,
      )
    }
  }

  return data
}

export const preventUnsafeDeletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (req.user && String(req.user.id) === String(id)) {
    throw new APIError('You cannot delete your own account.', 400)
  }

  const user = (await req.payload.findByID({
    collection: 'users',
    id,
    depth: 0,
    overrideAccess: true,
    req,
  })) as unknown as UserDocument

  if (
    (await isAdministratorRoleID(req, getRelationshipID(user.role ?? null))) &&
    (await countActiveAdministrators(req, id)) === 0
  ) {
    throw new APIError('The last active Administrator cannot be deleted.', 400)
  }
}

/** Suspended accounts cannot sign in. */
export const blockSuspendedLogin: CollectionBeforeLoginHook = ({ user }) => {
  if ((user as UserDocument).status === 'suspended') {
    throw new APIError('This account has been suspended. Contact an administrator.', 403)
  }
  return user
}

/** Welcome the first Administrator once the bootstrap account exists. */
export const welcomeBootstrapUser: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === 'create' && req.context[USER_CONTEXT.bootstrap] === true && !req.context[USER_CONTEXT.skipEmails]) {
    await sendWelcomeEmail(req, doc as UserDocument)
  }
  return doc
}
