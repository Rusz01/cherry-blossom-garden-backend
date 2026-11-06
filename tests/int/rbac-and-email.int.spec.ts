import type { Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { ADMIN_ROLE_SLUG } from '@/access'
import { findPendingActivation } from '@/lib/auth/activation'

import { PASSWORD, getTestPayload, login, rest } from './helpers'

/* The Resend SDK is mocked: no network request is ever made. */
const resendSend = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendSend }
  },
}))

let payload: Payload
let adminToken: string
let adminID: number | string
let editorRoleID: number | string
let editorID: number | string
let editorToken: string

const ADMIN_EMAIL = 'founder@example.test'
const EDITOR_EMAIL = 'editor@example.test'

const sentEmails = () =>
  resendSend.mock.calls.map(([message, options]) => ({
    to: message.to as string[],
    subject: message.subject as string,
    html: message.html as string,
    text: message.text as string,
    tags: message.tags as { name: string; value: string }[],
    idempotencyKey: options?.idempotencyKey as string | undefined,
  }))

const categoryOf = (email: ReturnType<typeof sentEmails>[number]) => email.tags.find((t) => t.name === 'category')?.value

beforeAll(async () => {
  payload = await getTestPayload()
})

afterAll(async () => {
  await payload?.destroy?.()
})

beforeEach(() => {
  resendSend.mockReset()
  resendSend.mockResolvedValue({ data: { id: `msg_${Math.random().toString(36).slice(2)}` }, error: null })
})

describe('bootstrap', () => {
  it('seeds the protected Administrator role on init', async () => {
    const roles = await payload.find({ collection: 'roles', where: { slug: { equals: ADMIN_ROLE_SLUG } } })
    expect(roles.totalDocs).toBe(1)
    expect(roles.docs[0].isSystem).toBe(true)
  })

  it('first-register creates an active Administrator, ignores a spoofed role and sends one welcome email', async () => {
    const { status, json } = await rest('POST', '/users/first-register', {
      body: { name: 'Founding Admin', email: ADMIN_EMAIL, password: PASSWORD, confirmPassword: PASSWORD, status: 'suspended' },
    })
    expect(status).toBe(200)
    const user = await payload.findByID({ collection: 'users', id: json.user.id, depth: 1, showHiddenFields: true })
    expect((user.role as { slug: string }).slug).toBe(ADMIN_ROLE_SLUG)
    expect(user.status).toBe('active')
    expect(user._verified).toBe(true)

    const emails = sentEmails()
    expect(emails).toHaveLength(1) // welcome only — no redundant verification email
    expect(categoryOf(emails[0])).toBe('welcome')
    expect(emails[0].idempotencyKey).toBe(`welcome/${user.id}`)

    adminID = user.id
    ;({ token: adminToken } = await login(payload, ADMIN_EMAIL))
  })

  it('rejects a second first-register attempt', async () => {
    const { status } = await rest('POST', '/users/first-register', {
      body: { name: 'Intruder', email: 'intruder@example.test', password: PASSWORD, confirmPassword: PASSWORD },
    })
    expect(status).toBe(403)
  })

  it('does not allow anonymous user creation', async () => {
    const { status } = await rest('POST', '/users', { body: { name: 'Anon', email: 'anon@example.test', password: PASSWORD } })
    expect(status).toBe(403)
  })
})

describe('roles', () => {
  it('protects the Administrator role from edits and deletion', async () => {
    const admin = await payload.find({ collection: 'roles', where: { slug: { equals: ADMIN_ROLE_SLUG } } })
    const id = admin.docs[0].id
    expect((await rest('PATCH', `/roles/${id}`, { token: adminToken, body: { description: 'hacked' } })).status).toBe(403)
    expect((await rest('DELETE', `/roles/${id}`, { token: adminToken })).status).toBe(403)
  })

  it('rejects reserved slugs and duplicate permission entries', async () => {
    expect((await rest('POST', '/roles', { token: adminToken, body: { name: 'Admin' } })).status).toBe(400)
    expect((await rest('POST', '/roles', { token: adminToken, body: { name: 'Super Admin' } })).status).toBe(400)
    const duplicate = await rest('POST', '/roles', {
      token: adminToken,
      body: {
        name: 'Dupes',
        collectionPermissions: [
          { collection: 'pages', read: true },
          { collection: 'pages', update: true },
        ],
      },
    })
    expect(duplicate.status).toBe(400)
  })

  it('lets an Administrator create a custom role with a generated slug', async () => {
    const { status, json } = await rest('POST', '/roles', {
      token: adminToken,
      body: {
        name: 'Content Editor',
        slug: 'administrator', // ignored: slug is generated from the name
        isSystem: true, // ignored: field is not writable
        collectionPermissions: [
          { collection: 'pages', read: true, create: true, update: true, delete: false },
          { collection: 'media', read: true, create: true, update: true, delete: false },
        ],
        globalPermissions: [{ global: 'navigation', read: true, update: true }],
      },
    })
    expect(status).toBe(201)
    expect(json.doc.slug).toBe('content-editor')
    expect(json.doc.isSystem).toBe(false)
    editorRoleID = json.doc.id
  })
})

describe('administrator-created accounts', () => {
  it('sends an invitation (not a password) and records it in Email Logs', async () => {
    const { status, json } = await rest('POST', '/users', {
      token: adminToken,
      body: { name: 'Eddie Editor', email: EDITOR_EMAIL, password: PASSWORD, role: editorRoleID },
    })
    expect(status).toBe(201)
    editorID = json.doc.id

    const emails = sentEmails()
    expect(emails).toHaveLength(1)
    expect(categoryOf(emails[0])).toBe('account-invitation')
    expect(emails[0].html).toContain('/account/activate/')
    expect(emails[0].html).toContain('Content Editor')
    expect(emails[0].html).toContain('Founding Admin')
    expect(emails[0].html).not.toContain(PASSWORD)
    expect(emails[0].text).not.toContain(PASSWORD)
    expect(emails[0].text.length).toBeGreaterThan(50)

    const logs = await payload.find({ collection: 'email-logs', where: { relatedUserId: { equals: String(editorID) } } })
    expect(logs.docs[0]?.status).toBe('submitted')
    expect(logs.docs[0]?.category).toBe('account-invitation')
    expect(JSON.stringify(logs.docs[0])).not.toMatch(/[a-f0-9]{40}/) // no token stored
  })

  it('blocks sign-in until the account is activated', async () => {
    await expect(login(payload, EDITOR_EMAIL)).rejects.toThrow()
  })

  it('activates via the emailed token and issues a password-setup token', async () => {
    const user = await payload.findByID({ collection: 'users', id: editorID, showHiddenFields: true })
    const token = (user as { _verificationToken?: string })._verificationToken as string
    const pending = await findPendingActivation(payload, token)
    expect(pending.status).toBe('ready')

    await payload.verifyEmail({ collection: 'users', token })
    const resetToken = await payload.forgotPassword({ collection: 'users', data: { email: EDITOR_EMAIL }, disableEmail: true })
    expect(resetToken).toBeTruthy()
    expect((await findPendingActivation(payload, token)).status).toBe('invalid') // single use

    await payload.resetPassword({ collection: 'users', data: { token: resetToken as string, password: PASSWORD }, overrideAccess: true })
    ;({ token: editorToken } = await login(payload, EDITOR_EMAIL))
  })

  it('does not create the user when the invitation email fails (no half-provisioned accounts)', async () => {
    resendSend.mockResolvedValueOnce({ data: null, error: { name: 'application_error', message: 'Provider down' } })
    const { status } = await rest('POST', '/users', {
      token: adminToken,
      body: { name: 'Ghost', email: 'ghost@example.test', password: PASSWORD, role: editorRoleID },
    })
    expect(status).toBeGreaterThanOrEqual(400)
    const ghost = await payload.find({ collection: 'users', where: { email: { equals: 'ghost@example.test' } } })
    expect(ghost.totalDocs).toBe(0)
    const failed = await payload.find({ collection: 'email-logs', where: { status: { equals: 'failed' } } })
    expect(failed.totalDocs).toBeGreaterThan(0)
    expect(failed.docs[0].error).toContain('Provider down')
  })
})

describe('privilege escalation via the REST API', () => {
  it('editor cannot promote themselves or change their status', async () => {
    const adminRole = await payload.find({ collection: 'roles', where: { slug: { equals: ADMIN_ROLE_SLUG } } })
    const { status } = await rest('PATCH', `/users/${editorID}`, {
      token: editorToken,
      body: { role: adminRole.docs[0].id, status: 'active', name: 'Eddie E.' },
    })
    expect(status).toBe(200)
    const after = await payload.findByID({ collection: 'users', id: editorID, depth: 0 })
    expect(after.role).toBe(editorRoleID)
    expect(after.name).toBe('Eddie E.') // self-service fields still work
  })

  it('editor cannot read or modify other users, roles or email logs', async () => {
    const users = await rest('GET', '/users', { token: editorToken })
    expect(users.json.docs.map((u: { id: unknown }) => u.id)).toEqual([editorID])
    expect((await rest('PATCH', `/users/${adminID}`, { token: editorToken, body: { name: 'pwned' } })).status).toBe(403)
    expect((await rest('DELETE', `/users/${adminID}`, { token: editorToken })).status).toBe(403)
    expect((await rest('POST', '/users', { token: editorToken, body: { name: 'X', email: 'x@example.test', password: PASSWORD, role: editorRoleID } })).status).toBe(403)
    expect((await rest('POST', '/roles', { token: editorToken, body: { name: 'Mine' } })).status).toBe(403)
    expect((await rest('PATCH', `/roles/${editorRoleID}`, { token: editorToken, body: { globalPermissions: [{ global: 'site-settings', update: true }] } })).status).toBe(403)
    expect((await rest('GET', '/email-logs', { token: editorToken })).status).toBe(403)
    expect((await rest('POST', `/users/${adminID}/resend-activation`, { token: editorToken })).status).toBe(403)
  })

  it('editor can only see their own role', async () => {
    const roles = await rest('GET', '/roles', { token: editorToken })
    expect(roles.json.docs.map((r: { id: unknown }) => r.id)).toEqual([editorRoleID])
  })

  it('global permissions are enforced per global', async () => {
    expect((await rest('POST', '/globals/navigation', { token: editorToken, body: { footerNote: 'ok' } })).status).toBe(200)
    expect((await rest('POST', '/globals/site-settings', { token: editorToken, body: { siteName: 'Nope' } })).status).toBe(403)
    expect((await rest('POST', '/globals/seo-settings', { token: editorToken, body: { allowIndexing: true } })).status).toBe(403)
  })

  it('collection permissions are enforced per action', async () => {
    const created = await rest('POST', '/pages', { token: editorToken, body: { title: 'Editor Page' } })
    expect(created.status).toBe(201)
    expect((await rest('DELETE', `/pages/${created.json.doc.id}`, { token: editorToken })).status).toBe(403)
  })
})

describe('drafts and publishing', () => {
  it('drafts are invisible to anonymous visitors; published pages are visible', async () => {
    const draft = await rest('POST', '/pages?draft=true', { token: editorToken, body: { title: 'Secret Draft', slug: 'secret-draft' } })
    expect(draft.status).toBe(201)

    const anonList = await rest('GET', '/pages?where[slug][equals]=secret-draft')
    expect(anonList.json.docs).toHaveLength(0)
    expect((await rest('GET', `/pages/${draft.json.doc.id}`)).status).toBe(404)
    expect((await rest('GET', `/pages/${draft.json.doc.id}?draft=true`)).status).toBe(404)
    expect((await rest('GET', `/pages/versions?where[parent][equals]=${draft.json.doc.id}`)).status).toBe(403)
    expect((await rest('GET', `/pages/versions?where[parent][equals]=${draft.json.doc.id}`, { token: editorToken })).status).toBe(200)

    const editorView = await rest('GET', `/pages/${draft.json.doc.id}?draft=true`, { token: editorToken })
    expect(editorView.json.title).toBe('Secret Draft')

    await rest('PATCH', `/pages/${draft.json.doc.id}`, { token: editorToken, body: { _status: 'published' } })
    const published = await rest('GET', '/pages?where[slug][equals]=secret-draft')
    expect(published.json.docs).toHaveLength(1)
    expect(published.json.docs[0].publishedAt).toBeTruthy()

    // A newer draft does not leak while the published version stays public.
    await rest('PATCH', `/pages/${draft.json.doc.id}?draft=true`, { token: editorToken, body: { title: 'Unreleased Title' } })
    const publicDraftAttempt = await rest('GET', `/pages/${draft.json.doc.id}?draft=true`)
    expect(publicDraftAttempt.json.title).not.toBe('Unreleased Title')
    const publicView = await rest('GET', `/pages/${draft.json.doc.id}`)
    expect(publicView.json.title).toBe('Secret Draft')
  })
})

describe('administrator safeguards', () => {
  it('the last Administrator cannot be demoted, suspended or deleted', async () => {
    expect((await rest('PATCH', `/users/${adminID}`, { token: adminToken, body: { role: editorRoleID } })).status).toBe(400)
    expect((await rest('PATCH', `/users/${adminID}`, { token: adminToken, body: { status: 'suspended' } })).status).toBe(400)
    const promoted = await payload.find({ collection: 'roles', where: { slug: { equals: ADMIN_ROLE_SLUG } } })
    expect(promoted.totalDocs).toBe(1)
    // Self-deletion is blocked even when other admins exist.
    expect((await rest('DELETE', `/users/${adminID}`, { token: adminToken })).status).toBe(400)
  })

  it('suspended users cannot sign in and lose access immediately', async () => {
    const { status } = await rest('PATCH', `/users/${editorID}`, { token: adminToken, body: { status: 'suspended' } })
    expect(status).toBe(200)
    expect((await rest('GET', '/pages', { token: editorToken })).json.docs.every((p: { _status: string }) => p._status === 'published')).toBe(true)
    expect((await rest('POST', '/pages', { token: editorToken, body: { title: 'After suspension' } })).status).toBe(403)
    await expect(login(payload, EDITOR_EMAIL)).rejects.toThrow()
    await rest('PATCH', `/users/${editorID}`, { token: adminToken, body: { status: 'active' } })
  })

  it('roles assigned to users cannot be deleted', async () => {
    expect((await rest('DELETE', `/roles/${editorRoleID}`, { token: adminToken })).status).toBe(400)
  })
})

describe('password reset', () => {
  it('sends a branded reset email through Payload’s native flow without logging the token', async () => {
    const { status } = await rest('POST', '/users/forgot-password', { body: { email: ADMIN_EMAIL } })
    expect(status).toBe(200)
    const [email] = sentEmails()
    expect(categoryOf(email)).toBe('password-reset')
    expect(email.subject).toBe('Reset your Arthanova Studio password')
    const token = /\/admin\/reset\/([a-f0-9]{40})/.exec(email.html)?.[1]
    expect(token).toBeTruthy()
    expect(email.html).toContain('1 hour')
    expect(email.idempotencyKey).not.toContain(token as string)

    const logs = await payload.find({ collection: 'email-logs', where: { category: { equals: 'password-reset' } } })
    expect(JSON.stringify(logs.docs)).not.toContain(token as string)
  })

  it('reports delivery failure instead of pretending the email was sent', async () => {
    resendSend.mockResolvedValueOnce({ data: null, error: { name: 'rate_limit_exceeded', message: 'Too many requests' } })
    // Wait out Payload's per-user minimum request interval from the previous test.
    await new Promise((resolve) => setTimeout(resolve, 15_500))
    const { status } = await rest('POST', '/users/forgot-password', { body: { email: ADMIN_EMAIL } })
    expect(status).toBeGreaterThanOrEqual(400)
  })

  it('does not reveal whether an email address exists', async () => {
    const { status } = await rest('POST', '/users/forgot-password', { body: { email: 'nobody@example.test' } })
    expect(status).toBe(200)
    expect(sentEmails()).toHaveLength(0)
  })
})

describe('scheduled publishing', () => {
  it('publishes a draft when its scheduled job runs, as the scheduling user', async () => {
    const draft = await rest('POST', '/pages?draft=true', { token: editorToken, body: { title: 'Scheduled Launch', slug: 'scheduled-launch' } })
    expect(draft.status).toBe(201)
    expect((await rest('GET', '/pages?where[slug][equals]=scheduled-launch')).json.docs).toHaveLength(0)

    await payload.jobs.queue({
      task: 'schedulePublish',
      input: {
        type: 'publish',
        doc: { relationTo: 'pages', value: String(draft.json.doc.id) },
        user: { relationTo: 'users', value: editorID },
      },
      waitUntil: new Date(Date.now() - 1000),
    } as never)
    await payload.jobs.run()

    const live = await rest('GET', '/pages?where[slug][equals]=scheduled-launch')
    expect(live.json.docs).toHaveLength(1)
    expect(live.json.docs[0]._status).toBe('published')
  })
})

describe('legacy database upgrade', () => {
  it('converts the old template’s "admin" system role in place so existing admins keep access', async () => {
    const { seedAdministratorRole } = await import('@/hooks/seedAdministratorRole')
    const current = (await payload.find({ collection: 'roles', where: { slug: { equals: ADMIN_ROLE_SLUG } } })).docs[0]
    // Simulate a database created by the earlier template.
    await payload.db.updateOne({ collection: 'roles', id: current.id, data: { ...current, slug: 'admin' }, returning: false })

    const upgraded = await seedAdministratorRole(payload)
    expect(upgraded.id).toBe(current.id)
    expect(upgraded.slug).toBe(ADMIN_ROLE_SLUG)
    expect((await rest('GET', '/email-logs', { token: adminToken })).status).toBe(200)
  })
})
