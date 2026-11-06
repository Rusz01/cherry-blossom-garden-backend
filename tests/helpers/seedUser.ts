import { getPayload } from 'payload'

import config from '../../src/payload.config.js'
import { seedAdministratorRole } from '../../src/hooks/seedAdministratorRole.js'

export const testUser = {
  name: 'E2E Administrator',
  email: 'e2e-admin@example.test',
  password: 'E2e-Test-Password-42',
}

/**
 * Seeds an activated Administrator for e2e admin tests.
 * Account emails are skipped via request context, so nothing is sent.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  const adminRole = await seedAdministratorRole(payload)

  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } }, overrideAccess: true })

  await payload.create({
    collection: 'users',
    data: { ...testUser, role: Number(adminRole.id), status: 'active', _verified: true },
    overrideAccess: true,
    context: { skipAccountEmails: true },
  })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } }, overrideAccess: true })
}
