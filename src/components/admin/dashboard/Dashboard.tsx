import { ArrowUpRight, Plus } from 'lucide-react'
import Link from 'next/link'
import type { AdminViewServerProps, PayloadRequest, SanitizedPermissions } from 'payload'
import React, { Suspense } from 'react'

import { getUserRole, roleIsAdministrator, type UserDocument } from '@/access'
import { getWebsiteURL } from '@/lib/env'

import { Today } from './Today'

/* -------------------------------------------------------------------------- */
/* Permissions                                                                */
/* -------------------------------------------------------------------------- */

type Flag = boolean | { permission?: boolean } | undefined

const allowed = (flag: Flag): boolean =>
  flag === true || (typeof flag === 'object' && flag?.permission === true)

const canCollection = (
  p: SanitizedPermissions,
  slug: string,
  action: 'create' | 'read' | 'update' | 'delete',
) => allowed((p.collections?.[slug] as Record<string, Flag> | undefined)?.[action])

const canGlobal = (p: SanitizedPermissions, slug: string, action: 'read' | 'update') =>
  allowed((p.globals?.[slug] as Record<string, Flag> | undefined)?.[action])

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

const relative = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' })

/** "just now", "12 minutes ago", "yesterday", then a short date. */
const timeAgo = (value?: string | null): string => {
  if (!value) return '—'
  const then = new Date(value).getTime()
  const seconds = Math.round((then - Date.now()) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 45) return 'just now'
  if (abs < 3600) return relative.format(Math.round(seconds / 60), 'minute')
  if (abs < 86400) return relative.format(Math.round(seconds / 3600), 'hour')
  if (abs < 86400 * 7) return relative.format(Math.round(seconds / 86400), 'day')
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const exact = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : undefined

/** ISO timestamp `days` ago (kept out of component bodies; render must stay pure). */
const daysAgoISO = (days: number) => new Date(Date.now() - days * 86400 * 1000).toISOString()

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n.toLocaleString('en-GB')} ${n === 1 ? one : many}`

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

type SectionProps = { req: PayloadRequest; permissions: SanitizedPermissions; adminRoute: string }
type Tone = 'positive' | 'caution' | 'negative' | 'neutral'

const SectionHead: React.FC<{ id: string; title: string; href?: string; linkLabel?: string }> = ({
  id,
  title,
  href,
  linkLabel,
}) => (
  <div className="arth-section-head">
    <h2 id={id} className="arth-section-head__title">
      {title}
    </h2>
    {href && (
      <Link className="arth-section-head__link" href={href}>
        {linkLabel}
      </Link>
    )}
  </div>
)

const Notice: React.FC<{ children: React.ReactNode; tone?: 'error' }> = ({ children, tone }) => (
  <p
    className={`arth-notice${tone ? ` arth-notice--${tone}` : ''}`}
    role={tone === 'error' ? 'alert' : undefined}
  >
    {children}
  </p>
)

const Placeholder: React.FC<{ rows: number; label: string }> = ({ rows, label }) => (
  <div className="arth-placeholder" aria-busy="true" aria-label={label}>
    {Array.from({ length: rows }, (_, i) => (
      <span key={i} />
    ))}
  </div>
)

const Status: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`arth-status arth-status--${tone}`}>{children}</span>
)

/* -------------------------------------------------------------------------- */
/* Overview strip                                                             */
/* -------------------------------------------------------------------------- */

async function Overview({ req, permissions, adminRoute }: SectionProps) {
  const { payload } = req
  const scope = { req, overrideAccess: false } as const
  const cells: { label: string; value: number; note: string; href: string }[] = []

  try {
    if (canCollection(permissions, 'pages', 'read')) {
      const [all, published] = await Promise.all([
        payload.count({ collection: 'pages', ...scope }),
        payload.count({
          collection: 'pages',
          where: { _status: { equals: 'published' } },
          ...scope,
        }),
      ])
      const drafts = all.totalDocs - published.totalDocs
      cells.push({
        label: 'Pages',
        value: all.totalDocs,
        note: `${published.totalDocs.toLocaleString('en-GB')} published · ${plural(drafts, 'draft')}`,
        href: `${adminRoute}/collections/pages`,
      })
    }
    if (canCollection(permissions, 'media', 'read')) {
      const media = await payload.count({ collection: 'media', ...scope })
      cells.push({
        label: 'Media',
        value: media.totalDocs,
        note: 'Files in the library',
        href: `${adminRoute}/collections/media`,
      })
    }
    if (roleIsAdministrator(await getUserRole(req))) {
      const since = daysAgoISO(7)
      const [users, suspended, sent, failed] = await Promise.all([
        payload.count({ collection: 'users', ...scope }),
        payload.count({
          collection: 'users',
          where: { status: { equals: 'suspended' } },
          ...scope,
        }),
        payload.count({
          collection: 'email-logs',
          where: { attemptedAt: { greater_than: since } },
          ...scope,
        }),
        payload.count({
          collection: 'email-logs',
          where: {
            and: [
              { attemptedAt: { greater_than: since } },
              { status: { in: ['failed', 'not-configured'] } },
            ],
          },
          ...scope,
        }),
      ])
      cells.push({
        label: 'Team',
        value: users.totalDocs,
        note: suspended.totalDocs ? `${suspended.totalDocs} suspended` : 'All accounts active',
        href: `${adminRoute}/collections/users`,
      })
      cells.push({
        label: 'Emails · 7 days',
        value: sent.totalDocs,
        note: failed.totalDocs ? `${failed.totalDocs} not sent` : 'No failed attempts',
        href: `${adminRoute}/collections/email-logs`,
      })
    }
  } catch {
    return <Notice tone="error">The overview couldn’t be loaded. Refresh to try again.</Notice>
  }

  if (cells.length === 0) return null

  return (
    <div className="arth-overview" role="list" aria-label="Overview">
      {cells.map((cell) => (
        <Link key={cell.label} href={cell.href} className="arth-overview__cell" role="listitem">
          <span className="arth-overview__label">{cell.label}</span>
          <span className="arth-overview__value">{cell.value.toLocaleString('en-GB')}</span>
          <span className="arth-overview__note">{cell.note}</span>
        </Link>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Recently edited pages                                                      */
/* -------------------------------------------------------------------------- */

type PageRow = {
  id: string | number
  title?: string | null
  slug?: string | null
  _status?: string | null
  publishedAt?: string | null
  updatedAt: string
}

async function RecentPages({ req, permissions, adminRoute }: SectionProps) {
  let docs: PageRow[]
  try {
    const result = await req.payload.find({
      collection: 'pages',
      req,
      overrideAccess: false,
      draft: true,
      sort: '-updatedAt',
      limit: 8,
      depth: 0,
      select: { title: true, slug: true, _status: true, publishedAt: true, updatedAt: true },
    })
    docs = result.docs as PageRow[]
  } catch {
    return <Notice tone="error">Recent pages couldn’t be loaded. Refresh to try again.</Notice>
  }

  if (docs.length === 0) {
    return (
      <Notice>
        No pages yet.{' '}
        {canCollection(permissions, 'pages', 'create') && (
          <Link href={`${adminRoute}/collections/pages/create`}>Create the first page</Link>
        )}
      </Notice>
    )
  }

  return (
    <table className="arth-ledger">
      <thead>
        <tr>
          <th scope="col">Page</th>
          <th scope="col">Status</th>
          <th scope="col" className="arth-ledger__num">
            Edited
          </th>
        </tr>
      </thead>
      <tbody>
        {docs.map((doc) => (
          <tr key={doc.id}>
            <td>
              <Link
                className="arth-ledger__title"
                href={`${adminRoute}/collections/pages/${doc.id}`}
              >
                {doc.title || 'Untitled'}
              </Link>
              <span className="arth-ledger__sub">
                /{doc.slug === 'home' ? '' : (doc.slug ?? '')}
              </span>
            </td>
            <td>
              {doc._status === 'published' ? (
                <Status tone="positive">Published</Status>
              ) : doc.publishedAt ? (
                <Status tone="caution">Unpublished changes</Status>
              ) : (
                <Status tone="neutral">Draft</Status>
              )}
            </td>
            <td className="arth-ledger__num">
              <time dateTime={doc.updatedAt} title={exact(doc.updatedAt)}>
                {timeAgo(doc.updatedAt)}
              </time>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* -------------------------------------------------------------------------- */
/* Email activity (administrators)                                           */
/* -------------------------------------------------------------------------- */

const EMAIL_STATUS: Record<string, { tone: Tone; label: string }> = {
  submitted: { tone: 'positive', label: 'Submitted' },
  failed: { tone: 'negative', label: 'Failed' },
  'not-configured': { tone: 'caution', label: 'Not sent' },
  captured: { tone: 'neutral', label: 'Dev outbox' },
}

async function EmailActivity({ req, adminRoute }: SectionProps) {
  if (!roleIsAdministrator(await getUserRole(req))) return null

  let docs: {
    id: string | number
    subject?: string | null
    status?: string | null
    attemptedAt?: string | null
  }[]
  try {
    const result = await req.payload.find({
      collection: 'email-logs',
      req,
      overrideAccess: false,
      sort: '-attemptedAt',
      limit: 5,
      depth: 0,
    })
    docs = result.docs
  } catch {
    return <Notice tone="error">Email activity couldn’t be loaded.</Notice>
  }

  return (
    <section className="arth-aside-section" aria-labelledby="arth-email">
      <SectionHead
        id="arth-email"
        title="Email activity"
        href={`${adminRoute}/collections/email-logs`}
        linkLabel="Logs"
      />
      {docs.length === 0 ? (
        <Notice>Invitations, password resets and welcome emails will appear here.</Notice>
      ) : (
        <ul className="arth-feed">
          {docs.map((doc) => {
            const s = EMAIL_STATUS[doc.status ?? ''] ?? {
              tone: 'neutral' as const,
              label: doc.status ?? '',
            }
            return (
              <li key={doc.id} className="arth-feed__item">
                <span className="arth-feed__title">{doc.subject || 'No subject'}</span>
                <span className="arth-feed__meta">
                  <Status tone={s.tone}>{s.label}</Status>
                  <span aria-hidden="true">·</span>
                  <time dateTime={doc.attemptedAt ?? undefined} title={exact(doc.attemptedAt)}>
                    {timeAgo(doc.attemptedAt)}
                  </time>
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <p className="arth-footnote">
        “Submitted” means Resend accepted the email. It doesn’t confirm delivery.
      </p>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

type Shortcut = { label: string; href: string; show: boolean }

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req, permissions } = initPageResult
  const adminRoute = req.payload.config.routes.admin
  const user = req.user as unknown as UserDocument | null
  const role = await getUserRole(req)
  const isAdmin = roleIsAdministrator(role)
  const firstName = user?.name?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || 'there'
  const canReadPages = canCollection(permissions, 'pages', 'read')
  const canCreatePages = canCollection(permissions, 'pages', 'create')

  const groups = [
    {
      title: 'Content',
      items: [
        { label: 'All pages', href: `${adminRoute}/collections/pages`, show: canReadPages },
        {
          label: 'Media library',
          href: `${adminRoute}/collections/media`,
          show: canCollection(permissions, 'media', 'read'),
        },
        {
          label: 'Upload media',
          href: `${adminRoute}/collections/media/create`,
          show: canCollection(permissions, 'media', 'create'),
        },
      ],
    },
    {
      title: 'Website',
      items: [
        {
          label: 'Site settings',
          href: `${adminRoute}/globals/site-settings`,
          show: canGlobal(permissions, 'site-settings', 'update'),
        },
        {
          label: 'Navigation',
          href: `${adminRoute}/globals/navigation`,
          show: canGlobal(permissions, 'navigation', 'update'),
        },
        {
          label: 'SEO settings',
          href: `${adminRoute}/globals/seo-settings`,
          show: canGlobal(permissions, 'seo-settings', 'update'),
        },
      ],
    },
    {
      title: 'Team',
      items: [
        { label: 'Invite a user', href: `${adminRoute}/collections/users/create`, show: isAdmin },
        { label: 'Roles and permissions', href: `${adminRoute}/collections/roles`, show: isAdmin },
        { label: 'Your account', href: `${adminRoute}/account`, show: true },
      ],
    },
  ]
    .map((group) => ({ ...group, items: group.items.filter((item: Shortcut) => item.show) }))
    .filter((group) => group.items.length > 0)

  const sectionProps: SectionProps = { req, permissions, adminRoute }

  return (
    <div className="arth-dash">
      <div className="arth-dash__inner">
        <header className="arth-dash__head">
          <div className="arth-dash__heading">
            <p className="arth-dash__date">
              <Today />
            </p>
            <h1 className="arth-dash__title">Welcome back, {firstName}</h1>
            <p className="arth-dash__meta">
              {role?.name ?? 'No role assigned'}
              <span aria-hidden="true"> · </span>
              {user?.email}
            </p>
          </div>
          <div className="arth-dash__actions">
            <a
              className="arth-btn arth-btn--secondary"
              href={getWebsiteURL()}
              target="_blank"
              rel="noopener noreferrer"
            >
              View website
              <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </a>
            {canCreatePages && (
              <Link
                className="arth-btn arth-btn--primary"
                href={`${adminRoute}/collections/pages/create`}
              >
                <Plus size={14} strokeWidth={2} aria-hidden="true" />
                New page
              </Link>
            )}
          </div>
        </header>

        <Suspense fallback={<Placeholder rows={1} label="Loading overview" />}>
          <Overview {...sectionProps} />
        </Suspense>

        <div className="arth-dash__body">
          <div className="arth-dash__main">
            {canReadPages ? (
              <section aria-labelledby="arth-recent">
                <SectionHead
                  id="arth-recent"
                  title="Recently edited"
                  href={`${adminRoute}/collections/pages`}
                  linkLabel="All pages"
                />
                <Suspense fallback={<Placeholder rows={5} label="Loading pages" />}>
                  <RecentPages {...sectionProps} />
                </Suspense>
              </section>
            ) : (
              <Notice>
                Your role doesn’t include access to pages. Ask an administrator if you need it.
              </Notice>
            )}
          </div>

          <aside className="arth-dash__aside" aria-label="Shortcuts and activity">
            <section className="arth-aside-section" aria-labelledby="arth-shortcuts">
              <SectionHead id="arth-shortcuts" title="Shortcuts" />
              <div className="arth-shortcuts-grid">
                {groups.map((group) => (
                  <div key={group.title} className="arth-shortcuts">
                    <p className="arth-shortcuts__title">{group.title}</p>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <Suspense fallback={<Placeholder rows={4} label="Loading email activity" />}>
              <EmailActivity {...sectionProps} />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
