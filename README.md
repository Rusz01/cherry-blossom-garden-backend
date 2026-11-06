# Arthanova Studio CMS

> **Partners in Digital Growth.** A branded, reusable content management system for Arthanova Studio projects. It is built on Payload CMS 3, Next.js 16 and PostgreSQL.

Payload and Next.js run as one application. It contains the admin panel at `/admin`, the REST and GraphQL APIs at `/api`, and a small frontend that renders published pages, drafts and live previews.

---

## Contents

1. [Overview](#overview)
2. [Technology](#technology)
3. [Features](#features)
4. [Requirements](#requirements)
5. [Local setup](#local-setup)
6. [PostgreSQL](#postgresql)
7. [Email with Resend](#email-with-resend)
8. [Users, roles and permissions](#users-roles-and-permissions)
9. [Admin customisation](#admin-customisation)
10. [Drafts, publishing and preview](#drafts-publishing-and-preview)
11. [Environment variables](#environment-variables)
12. [Commands](#commands)
13. [Testing](#testing)
14. [Production](#production)
15. [Troubleshooting](#troubleshooting)
16. [Project structure](#project-structure)

---

## Overview

This CMS is a foundation that future Arthanova Studio projects can reuse. It is not a copy of the marketing website. Content is modelled as generic **Pages** built from **content blocks**, and site-wide **globals** hold settings, navigation and SEO defaults. Everything is protected by **role-based access control**, which is enforced at the API and database-query level.

## Technology

| Area           | Choice                                                                   |
| -------------- | ------------------------------------------------------------------------ |
| CMS            | Payload 3.93 (`payload`, `@payloadcms/next`, `@payloadcms/ui`)           |
| Framework      | Next.js 16 (App Router, Turbopack), React 19                             |
| Database       | PostgreSQL via `@payloadcms/db-postgres` (Drizzle), with migrations      |
| Rich text      | Lexical (`@payloadcms/richtext-lexical`)                                 |
| Email          | Resend SDK + a custom Payload `EmailAdapter`, templates in React Email   |
| SEO            | `@payloadcms/plugin-seo` plus custom canonical, robots and JSON-LD fields |
| Live preview   | `@payloadcms/live-preview-react` (server-side refresh)                   |
| Media storage  | Local filesystem by default; optional S3/MinIO (`@payloadcms/storage-s3`) |
| Icons and fonts | Lucide; DM Sans via `next/font` (self-hosted)                            |
| Tests          | Vitest (integration, against a real PostgreSQL), Playwright (e2e)       |

## Features

- **Branded admin**: login and auth screens, sidebar, dashboard and restyled Payload UI, with light and dark themes.
- **Dashboard**: live statistics, permission-aware quick actions, recently updated pages and email activity. Loading, empty and error states are included.
- **RBAC**: a protected Administrator role and custom roles with per-collection CRUD and per-global read/update permissions.
- **Account lifecycle**: first-admin bootstrap, invitation emails, token-based activation and password setup, suspension, and last-admin protection.
- **Emails**: welcome, invitation, verification and password reset, with an HTML and a plain-text version of each, logging and idempotency.
- **Email Logs**: an operational record of every attempt. It never stores bodies, tokens or keys.
- **Content**: Pages with drafts, autosave, version history and restore, scheduled publish and unpublish, preview and live preview.
- **Nine reusable blocks**: Hero, Rich text, Image, Image and text, Call to action, Feature grid, FAQ, Testimonials and Gallery.
- **Media**: MIME allow-list, 20 MB limit, required alt text, WebP optimisation, responsive sizes, focal point and crop.
- **Globals**: Site settings, Navigation and SEO settings.
- **SEO and AEO**: metadata helpers, canonical URLs, robots rules, Open Graph and Twitter tags, `sitemap.xml`, `robots.txt`, and WebPage, FAQPage and Organization JSON-LD.

## Requirements

- Node.js `^22.23.4` or `>=24.22.1` (see `engines` in `package.json`)
- pnpm 11 (`corepack enable`)
- PostgreSQL 14 or later (16 recommended)
- Optional: a Resend account, and MinIO or S3 for persistent media in production

## Local setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env          # then edit DATABASE_URL, PAYLOAD_SECRET, APP_URL
openssl rand -hex 32          # use the output as PAYLOAD_SECRET

# 3. Create a database (pick one)
createdb arthanova_cms                       # local PostgreSQL
docker compose up -d postgres                # or the bundled container

# 4. Start the app
pnpm dev
```

Open <http://localhost:3000/admin>. On an empty database, Payload shows **Create first user**. That account automatically becomes the active, verified **Administrator**. Any role or status submitted on that form is ignored by the server.

> **No Resend key yet?** Set `EMAIL_DEV_OUTBOX=true`. Emails are then written to `./.dev-outbox/` as HTML and text and are never sent. This lets you click invitation and reset links locally.

## PostgreSQL

The adapter is configured in `src/payload.config.ts`, and its connection options come from `src/lib/env.ts`.

| Variable                              | Purpose                                             |
| ------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`                        | `postgres://user:password@host:5432/database`       |
| `DATABASE_SSL`                        | `disable` (local), `require`, or `verify-full`      |
| `DATABASE_SSL_CA`                     | CA certificate (PEM or base64) for `verify-full`    |
| `DATABASE_POOL_MAX`                   | Pool size (default 10)                              |
| `DATABASE_POOL_*_MS`                  | Idle and connection timeouts                        |

- **Development**: Payload *pushes* schema changes automatically (`PAYLOAD_DB_PUSH=true`). Push is never used when `NODE_ENV=production`.
- **Production**: apply versioned migrations from `src/migrations`.

```bash
pnpm migrate:create my-change   # after changing collections/fields
pnpm migrate                    # apply pending migrations
pnpm migrate:status
```

The initial migration (`src/migrations/20261106_205953_initial.ts`) creates the full schema.

> If you used push mode against a database, don't run migrations against that same database later. Use a fresh database for migration-managed environments.

**Dokploy / VPS**: create a PostgreSQL service, then set `DATABASE_URL` to its internal hostname. Use `DATABASE_SSL=verify-full` with `DATABASE_SSL_CA` when connecting over a public network. Run `pnpm migrate` before (or as part of) each deploy.

The database is only ever accessed on the server, through Payload's Local API or REST/GraphQL with access control. No client component talks to it.

## Email with Resend

### Setup

1. Create an API key at <https://resend.com/api-keys> (a sending-only key is enough). Set `RESEND_API_KEY`.
2. **Verify a sending domain** under *Domains*. Add the DNS records Resend shows (SPF/MX, DKIM, and ideally DMARC), then wait for *Verified*. A subdomain such as `mail.arthanovastudio.com` is recommended.
3. Set `EMAIL_FROM_ADDRESS` to an address on that domain (for example `no-reply@mail.arthanovastudio.com`). Set `EMAIL_FROM_NAME=Arthanova Studio` and `EMAIL_REPLY_TO`.
4. Set `APP_URL` to the **public** URL. Links in emails and the logo image use it.

Until the domain is verified, Resend only delivers to your own account address.

### Architecture

```
template (React Email) ─▶ renderEmail() ─▶ payload.sendEmail()
                                              │
Payload auth emails (reset / verify) ─────────┤
                                              ▼
                               arthanovaEmailAdapter (src/email/adapter.ts)
                               • Resend SDK (tags, idempotency keys)
                               • writes Email Logs (no bodies/tokens)
                               • dev outbox / "not configured" handling
```

Every email, including Payload's built-in forgot-password and verification emails, goes through one Payload `EmailAdapter`. The official `@payloadcms/email-resend` adapter isn't used because it drops Resend **tags** and **idempotency keys**. The adapter uses the Resend SDK directly instead.

### Emails

| Email | Trigger | Failure behaviour |
| --- | --- | --- |
| **Welcome** | First-admin bootstrap; account activation | Non-critical. The failure is logged and the account stays valid. |
| **Account invitation** | An Administrator creates a user | Critical. The user is **not created** if delivery fails, so no half-provisioned accounts exist. |
| **Email verification** | A user created without an admin context (for example by a script) | Critical (same as invitation) |
| **Password reset** | Payload forgot-password | Critical. The API returns an error and no false "sent" message is shown. |

- Plain-text versions are generated for every email.
- Passwords are never emailed.
- Reset links expire after **1 hour**, and Payload rate-limits reset requests.
- Activation links expire after **7 days** and can be used once.
- Tokens are never logged.
- **Previews:** `pnpm email:preview` writes every template to `.email-previews/` and sends nothing.

### Email Logs

Administrators can see *Administration → Email logs*: category, recipient, subject, related user ID, timestamp, status, Resend message ID and a sanitised error.

> **"Submitted" means Resend accepted the email, not that it was delivered.** Delivery and bounce tracking would need verified Resend webhooks, which aren't implemented.

## Users, roles and permissions

### Model

- **Administrator** is a protected system role (`slug: administrator`). It is seeded on every start, can't be edited or deleted, and has access to everything.
- **Custom roles** have a name, description and an auto-generated, immutable slug. They grant permissions per collection (read, create, update, delete) and per global (read, update). Each role also shows its assigned users.
- **Users** have a name, email, role, status (active or suspended) and timestamps. Anyone with CMS access can edit their own name, email and password.

### Account lifecycle

1. **Bootstrap.** The first user to register becomes the Administrator and is auto-verified. A welcome email is sent.
2. **Invite.** An Administrator creates a user. The password typed into the form is never shared. The user receives an invitation with a single-use activation link.
3. **Activate.** `/account/activate/:token` verifies the email (via Payload's `verifyEmail`). It then issues a standard Payload reset token and redirects to Payload's own *set password* screen.
4. **Resend.** On an unactivated user, Administrators can click **Resend activation email**. This invalidates the old link.

### Protections (enforced on the server; covered by tests)

- Only Administrators can create or delete users, assign roles, change status, or manage roles and Email Logs.
- Field-level access strips `role` and `status` from non-admin requests, so a user can't promote themselves through the API.
- The last active Administrator can't be demoted, suspended or deleted. No one can suspend or delete their own account.
- Reserved role slugs are rejected (`admin`, `super-admin`, `root`, …). Duplicate permission entries are rejected.
- A role that is assigned to users can't be deleted.
- Suspended users can't sign in and lose every permission immediately, even with a live session.
- Drafts and version history are never readable by anonymous visitors.

### Adding a new collection or global to RBAC

Create the config with `buildCollectionAccess('slug')` or `buildGlobalAccess('slug')` from `@/access`. Add it to `contentCollections` or `contentGlobals` in `src/payload.config.ts`. It then appears automatically in the role editor.

## Admin customisation

Brand values come from arthanovastudio.com's production CSS: ink `#1e1e1e`, blue `#3b82f6`, gray `#f5f5f5`, muted `#555`, and DM Sans (the typeface of the website's headings and text). The admin applies them with restraint:

- **Two-tone structure.** Brand gray is used for chrome (the sidebar and auth canvas). White "paper" is used for work. The current page in the sidebar sits on paper, so it visibly connects to the content it opens.
- **Hairlines over cards.** Sections are separated by rules, not floating boxes. Shadows appear only on things that float: menus, modals and toasts.
- **One shape scale.** 4px for marks such as checkboxes and tags, 6px for controls, 8px for containers. No pill shapes in the admin.
- **Functional colour.** Blue marks focus, links and the current location. Status uses one small dot (green published, amber unpublished changes, red failed), and the text stays neutral.
- **One typeface.** DM Sans throughout, exposed as `--font-heading` for headings. Page titles are 26px semibold with slight negative tracking (22px on mobile). Text uses a 12/13/14/16 scale with tabular figures for numbers and dates. Email templates keep their own serif heading stack.
- **Dashboard as a workspace.** It has a heading row with the primary action, one ruled strip of figures with context, a ledger of recently edited pages, and a quiet aside with shortcuts and email activity.

| Location | What it does |
| --- | --- |
| `src/styles/admin/_tokens.scss` | Design tokens (colour, type, spacing, radius, shadow, motion) for light and dark |
| `src/styles/admin/_payload.scss` | Maps tokens onto Payload's own CSS variables |
| `src/styles/admin/_components.scss` | Buttons, inputs, tables, tabs, popups, modals, toasts, uploads |
| `src/styles/admin/_nav.scss` / `_nav-icons.scss` | Sidebar. Icons are generated by `pnpm generate:nav-icons`. |
| `src/styles/admin/_auth.scss` | Login, forgot/reset, create-first-user |
| `src/styles/admin/_dashboard.scss` | Dashboard |
| `src/components/admin/*` | Logo, Icon, BeforeLogin/AfterLogin, NavBrand, NavAccount, LogoutButton, Dashboard, ResendActivation, RowLabels, BrandFonts |

Payload's own navigation is kept and restyled, so permissions, grouping, collapsible groups, saved preferences and the mobile drawer all keep working. Focus rings are visible, and `prefers-reduced-motion` is respected.

Brand assets live in `public/brand/` and were copied unmodified from the official files. `public/favicon.png` and `public/apple-touch-icon.png` are resized copies of the brand mark.

## Drafts, publishing and preview

- **Drafts and autosave**: Pages autosave every 2 seconds while you edit. Up to 50 versions are kept per document. Versions can be compared and restored.
- **Publish and unpublish**: use the Publish button. `publishedAt` is set on the first publish.
- **Scheduled publishing**: use the arrow next to Publish and choose *Schedule*. This needs the job queue. With `JOBS_AUTORUN=true` (the default), it runs in-process every minute. On serverless hosts, set `JOBS_AUTORUN=false` and have a cron call `POST /api/payload-jobs/run` with `Authorization: Bearer $CRON_SECRET`.
- **Preview**: the eye-and-arrow button opens `/next/preview?path=/slug`. That route checks the Payload session cookie and the user's `pages.read` permission, enables Next.js draft mode and redirects. No shared secret appears in URLs. A banner offers *Exit preview*.
- **Live preview**: use the *Live Preview* toggle in the editor. The iframe re-renders on every save or autosave using `RefreshRouteOnSave`. Drafts are fetched on the server with the editor's own permissions.
- Draft pages are marked `noindex`. Anonymous requests never receive drafts, including requests with `?draft=true`.

**Homepage**: publish a page with the slug `home` to replace the starter screen at `/`.

## Environment variables

See [`.env.example`](./.env.example) for every variable with comments. Summary:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | **Yes** | Must be `postgres://…` |
| `PAYLOAD_SECRET` | **Yes** | At least 32 characters in production (`openssl rand -hex 32`) |
| `APP_URL` | **Yes** (prod) | Public URL; defaults to `http://localhost:3000` |
| `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` | To send email | Without them, nothing is sent and critical flows return an error |
| `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`, `EMAIL_SUPPORT_ADDRESS` | Optional | Default name: "Arthanova Studio" |
| `EMAIL_DEV_OUTBOX`, `EMAIL_OVERRIDE_RECIPIENT` | Optional | Dev outbox; staging redirect |
| `WEBSITE_URL` | Optional | Defaults to `https://arthanovastudio.com` |
| `DATABASE_SSL*`, `DATABASE_POOL_*`, `PAYLOAD_DB_PUSH` | Optional | See [PostgreSQL](#postgresql) |
| `JOBS_AUTORUN`, `JOBS_AUTORUN_CRON`, `CRON_SECRET` | Optional | Scheduled publishing |
| `S3_*` | Optional | See [Production](#production) |
| `TEST_DATABASE_URL` | Tests | A disposable database whose name ends in `_test` |

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the admin component import map |
| `pnpm generate:nav-icons` | Regenerate sidebar icon CSS |
| `pnpm migrate`, `migrate:create`, `migrate:status` | Database migrations |
| `pnpm email:preview` | Render all email templates to `.email-previews/` |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint |
| `pnpm check` | Types, import map, typecheck, lint and integration tests |

## Testing

```bash
createdb arthanova_cms_test
TEST_DATABASE_URL=postgres://localhost:5432/arthanova_cms_test pnpm test:int
pnpm test:e2e   # starts/reuses `pnpm dev` on :3000; DATABASE_URL must point at a dev database
# or test a server that is already running elsewhere (no dev server is started):
E2E_BASE_URL=http://localhost:3001 pnpm test:e2e
```

- **Integration tests** (`tests/int`) wipe and recreate the `public` schema of `TEST_DATABASE_URL` on every run. They refuse to run unless the database name ends in `_test`. The Resend SDK is **mocked**, so no email can be sent. The tests drive the real REST API and cover:
  - bootstrap
  - role protections
  - invitation and activation
  - privilege-escalation attempts
  - global and collection permissions
  - draft isolation
  - last-admin safeguards and suspension
  - the password-reset flow and failures
  - template rendering
  - the "not configured" adapter path
- **E2E tests** (`tests/e2e`) seed an Administrator (emails suppressed) and check the login, dashboard, sidebar, users and frontend.

## Production

- Set `NODE_ENV=production`, a strong `PAYLOAD_SECRET`, a public `APP_URL` and `DATABASE_SSL`. Run `pnpm migrate` and then `pnpm build && pnpm start`.
- **Media persistence**: local uploads go to `./media`. That folder is lost on redeploy unless it is mounted as a persistent volume. For durable storage, enable S3 or MinIO:
  ```env
  S3_ENABLED=true
  S3_BUCKET=arthanova-media
  S3_ENDPOINT=https://minio.yourdomain.com   # omit for AWS S3
  S3_REGION=us-east-1
  S3_ACCESS_KEY_ID=…
  S3_SECRET_ACCESS_KEY=…
  S3_FORCE_PATH_STYLE=true                    # MinIO
  ```
  The bucket can stay **private**. Files are proxied through `/api/media/file/*` so access control still applies. Set `S3_SIGNED_DOWNLOADS=true` to redirect to short-lived pre-signed URLs instead. Credentials stay on the server.
- **Docker**: the included `Dockerfile` expects `output: 'standalone'` in `next.config.ts`. It also prefers `package-lock.json` when that file exists. This project uses pnpm, so remove the stale `package-lock.json` (or adjust the Dockerfile) before using it.
- **Search indexing** is **off** by default (`SEO settings → Indexing`). Turn it on for the live site.
- **Scheduled publishing** needs either a long-running server (`JOBS_AUTORUN=true`) or an external cron (see above).

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `DATABASE_URL must be a PostgreSQL connection string` | `.env` still holds a MongoDB or placeholder URL. Use `postgres://…`. |
| `PAYLOAD_SECRET must be at least 32 characters in production` | Generate a new secret with `openssl rand -hex 32`. Changing it signs out every user. |
| "Email delivery is not configured" when inviting a user or resetting a password | Set `RESEND_API_KEY` and `EMAIL_FROM_ADDRESS`, or use `EMAIL_DEV_OUTBOX=true` locally. |
| Resend error *domain not verified* | Finish domain verification in Resend, or send only to your own account address while testing. |
| Logo missing in emails | `APP_URL` must be publicly reachable. `localhost` images don't load in real inboxes. |
| An invited user can't log in | They must activate first. Use **Resend activation email** on their user record. |
| A scheduled publish didn't happen | The job queue isn't running. Check `JOBS_AUTORUN` or your cron. |
| Admin shows a missing-component error | Run `pnpm generate:importmap`. |
| The dev server pushes schema to a migrated database | Set `PAYLOAD_DB_PUSH=false`, or use separate databases. |
| Sidebar hidden on first visit | Click the menu button. Payload remembers the open or closed state for each user. |

## Project structure

```
src/
├─ access/              RBAC helpers (getUserRole, permissions, constants)
├─ app/
│  ├─ (frontend)/       starter page, [slug] renderer, preview routes, account activation
│  ├─ (payload)/        Payload admin + API routes, custom.scss
│  ├─ robots.ts, sitemap.ts
├─ blocks/              reusable content blocks
├─ collections/         Pages, Media, Users/, Roles, EmailLogs
├─ components/
│  ├─ admin/            branded admin components and dashboard
│  └─ frontend/         block renderers, CMSLink, Media, LivePreviewListener…
├─ email/               adapter, templates, auth email config, helpers
├─ fields/              link and slug fields
├─ globals/             SiteSettings, Navigation, SEOSettings
├─ hooks/               seedAdministratorRole
├─ lib/                 env, fonts, cms data access, seo, auth/activation
├─ migrations/          PostgreSQL migrations
├─ plugins/             SEO plugin configuration
├─ storage/             optional S3/MinIO plugin
└─ styles/admin/        admin design system (SCSS)
scripts/                email previews, nav icon generator
tests/                  int (Vitest) and e2e (Playwright)
```
