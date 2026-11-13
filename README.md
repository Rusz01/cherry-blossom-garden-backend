<div align="center">
  <a href="https://github.com/Rusz01/cherry-blossom-garden-backend">
    <img src="./public/Cherry-Blossom-Garden-Logo.png" alt="Cherry Blossom Garden" width="160" />
  </a>

# Cherry Blossom Garden
### Website & Content Management System

**A modern hospitality website with a custom content-management experience.**  
Built with Next.js, Payload CMS and PostgreSQL.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.1-111111?logo=nextdotjs)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.93.0-111111)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.12.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[Website](#application-routes) · [Quick start](#quick-start-recommended) · [CMS guide](#content-management) · [Environment](#environment-variables) · [Deployment](#production-and-deployment)
</div>

---

## Overview

This repository contains the **Cherry Blossom Garden website and its Payload CMS backend in one Next.js application**. It provides a branded hospitality frontend, a structured content editor, role-based permissions, media management, previews and supporting infrastructure.

The CMS is built on an Arthanova Studio starter project. Some internal identifiers, admin branding, email templates and example configuration values still reference **Arthanova Studio**; see [Current implementation notes](#current-implementation-notes).

### At a glance

| Area | Implementation |
| --- | --- |
| Website | Next.js 16 App Router + React 19 + TypeScript |
| CMS | Payload CMS 3.93.0, mounted at `/admin` |
| Database | PostgreSQL via `@payloadcms/db-postgres` |
| Editable experiences | Homepage global + three Explore Pages |
| Other content | Pages collection with reusable blocks, media and site globals |
| Editorial workflow | Drafts, autosave, version history and supported previews |
| Access control | Administrator and custom roles with collection/global permissions |
| Email | Resend integration, React Email templates and development outbox |
| Storage | Local filesystem; optional S3-compatible storage (including MinIO) |
| Quality | ESLint, TypeScript, Vitest integration tests and Playwright E2E tests |

## Features

- **Hospitality-focused frontend** — home, about, experiences, Explore floors, menu, gallery, kids play area, reservation/contact and privacy policy.
- **Homepage editor** — update hero copy, imagery, story, floor cards, experiences, cuisine, kids area, gallery and newsletter section without redesigning the components.
- **Explore Pages editor** — control each floor's titles, navigation labels, descriptions, carousel slides, images and decorative text.
- **Original-content fallbacks** — bundled copy and photography are used where editable values are missing; the Explore pages can render even before their CMS records are seeded.
- **Live preview** — Payload's Live Preview API updates the Homepage and Explore preview interfaces while editing; separate authenticated draft preview routes are available.
- **Branded Payload admin** — custom dashboard, navigation, login visuals, responsive styling and custom admin components.
- **Role-based access control** — protected Administrator role, custom roles, user suspension, first-user bootstrap and account activation.
- **Media handling** — upload, image crop/focal point, responsive derivatives, required alt text and optional object storage.
- **SEO controls** — SEO settings, canonical helpers, dynamic `robots.txt`, `sitemap.xml` and structured-data support.
- **Transactional email foundation** — account invitation, verification, password reset and welcome templates, with Email Logs.

> [!NOTE]
> CMS coverage is **not yet universal**. The Homepage and Explore pages are connected to Payload. The menu and specials currently use `src/data/`, and several other pages retain frontend-defined content. The generic `Pages` collection is present, but this repository does not currently provide a general `/[slug]` page renderer. See [Current implementation notes](#current-implementation-notes).

## Tech stack

| Layer | Technology |
| --- | --- |
| Application | Next.js `16.4.1`, React `19.2.6` |
| Language | TypeScript `5.7.3` |
| Content platform | Payload CMS `3.93.0` |
| Database | PostgreSQL (Compose uses PostgreSQL 16) |
| Rich text | Payload Lexical editor |
| Styling | Tailwind CSS 4, CSS modules and SCSS for admin customisation |
| Animation | Motion |
| Frontend typography | Inter, Cormorant Garamond and Allura |
| CMS typography | DM Sans |
| Email | Resend SDK + React Email |
| Media | Sharp; optional AWS S3 / MinIO-compatible storage |
| Testing | Vitest and Playwright |
| Package manager | pnpm `11.12.0` |

## Requirements

For a **local installation using pnpm**, install:

- **Git** and a terminal.
- **Node.js** `^22.23.4` or `>=24.22.1`, as required by `package.json` (Node `22.23.4` is a matching choice).
- **pnpm `11.12.0`**, preferably managed through Corepack.
- **PostgreSQL**, either directly or via Docker Desktop (Docker is recommended for the database).
- An available **port 3000** for the application and **5432** for the bundled database.

Resend and S3/MinIO accounts are **optional for initial local development**.

Confirm your tooling:

```bash
node --version
pnpm --version
git --version
docker --version       # only if using Docker
docker compose version # only if using Docker Compose
```

If pnpm is not installed, enable Corepack:

```bash
corepack enable
corepack prepare pnpm@11.12.0 --activate
pnpm --version
```

If `corepack` is unavailable, install Corepack for your Node installation first (`npm install -g corepack`), then repeat the commands above.

---

## Quick start (recommended)

**Recommended development setup:** run Next.js/Payload directly on your computer and PostgreSQL in Docker. These instructions work on macOS, Linux and Windows terminals with the relevant tooling installed.

### 1. Clone the repository

```bash
git clone https://github.com/Rusz01/cherry-blossom-garden-backend.git
cd cherry-blossom-garden-backend
```

### 2. Install dependencies

```bash
corepack enable
pnpm install --frozen-lockfile
```

Use **pnpm**, not npm, for the normal development workflow. Both `pnpm-lock.yaml` and `package-lock.json` exist in the repository; the pnpm lockfile is the intended dependency source for these instructions.

### 3. Create the environment file

```bash
cp .env.example .env
openssl rand -hex 32
```

Open `.env` and replace `PAYLOAD_SECRET` with the value generated by the second command. For the first local run, check or change these values:

```dotenv
# PostgreSQL running in Docker, with Next.js running on your computer
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/arthanova_cms
DATABASE_SSL=disable
PAYLOAD_DB_PUSH=true

# Paste your own output from: openssl rand -hex 32
PAYLOAD_SECRET=YOUR_GENERATED_RANDOM_SECRET

APP_URL=http://localhost:3000
WEBSITE_URL=http://localhost:3000

# Write email messages to local files rather than sending them
EMAIL_DEV_OUTBOX=true
EMAIL_FROM_NAME=Cherry Blossom Garden

# Optional services are off for local development
S3_ENABLED=false
JOBS_AUTORUN=true
```

The database name `arthanova_cms` is intentionally retained here because it is already configured in the supplied `docker-compose.yml`. It is an **internal legacy name**, not the website's brand. You can rename it later by updating the database, Compose configuration and connection string together.

> [!IMPORTANT]
> Do not commit `.env`, real database credentials, API keys or your Payload secret. Keep `APP_URL` consistent with the origin you use to access the CMS; it is also used by preview and email links.

### 4. Start PostgreSQL

```bash
docker compose up -d postgres
```

Verify it is healthy:

```bash
docker compose ps
docker compose logs postgres --tail=30
```

The bundled Compose service creates the `arthanova_cms` database with the development-only `postgres` / `postgres` credentials. Do **not** use these credentials for production.

**Without Docker:** install PostgreSQL locally, create a database named `arthanova_cms`, create a login with access to it, then set `DATABASE_URL` to that login and host. For example, with an existing local PostgreSQL role that can create databases:

```bash
createdb arthanova_cms
```

### 5. Start the application

```bash
pnpm dev
```

Payload connects to PostgreSQL and, in development, can automatically push the required schema when `PAYLOAD_DB_PUSH=true`.

| Destination | Local URL |
| --- | --- |
| Website | http://localhost:3000 |
| Payload admin | http://localhost:3000/admin |
| Payload REST API | http://localhost:3000/api |
| GraphQL endpoint | http://localhost:3000/api/graphql |
| Explore floor | http://localhost:3000/explore/ground-floor |

### 6. Create the first Administrator

Visit **http://localhost:3000/admin**. On a fresh database, create the first user with your name, email and a strong password. The application's bootstrap logic assigns the protected **Administrator** role automatically.

You can now sign in, manage media and edit content. With `EMAIL_DEV_OUTBOX=true`, any emails generated by local account workflows are written to `.dev-outbox/` rather than sent.

### 7. Publish the Homepage content

Open **Admin → Globals → Homepage** (the precise navigation grouping may vary with admin configuration). Review the populated field defaults, make a small change and publish. Visit `/` to see the published content, or use the editor's Live Preview while making changes.

The frontend also includes hardcoded fallback content, so a fresh website can display before the Homepage global is published.

### 8. Seed the three Explore Pages (recommended)

Leave `pnpm dev` running. In another terminal, from the repository root, run:

```bash
pnpm exec tsx scripts/seed-explore-pages.ts
```

The script adds and publishes the three floor records **only if they do not already exist**:

| CMS floor identifier | Public route |
| --- | --- |
| `ground-floor` | `/explore/ground-floor` |
| `first-floor` | `/explore/dining-entertainment` |
| `rooftop` | `/explore/rooftop-bbq-events` |

Manage them under **Admin → Collections → Explore Pages**. The seeder keeps existing records unchanged; it does not overwrite editorial work.

**Local setup is complete.** You should now have a working website, CMS login, database and editable Homepage/Explore content.

---

## Alternative: run the application with Docker Compose

The repository's **`docker-compose.yml` development stack** runs the app using the Node image, plus PostgreSQL. This is different from its standalone production `Dockerfile`.

1. Clone the repository and create `.env` as described above.
2. Set `DATABASE_URL=postgres://postgres:postgres@postgres:5432/arthanova_cms` in `.env`. The hostname is **`postgres`**, because the app now runs **inside** the Compose network.
3. Set `PAYLOAD_SECRET`, `APP_URL=http://localhost:3000` and `EMAIL_DEV_OUTBOX=true`.
4. Start the services:

```bash
docker compose up -d
docker compose logs -f payload
```

5. Visit `http://localhost:3000/admin` and create the first Administrator.
6. Once the app has initialised its schema, seed Explore content from the app container:

```bash
docker compose exec payload pnpm exec tsx scripts/seed-explore-pages.ts
```

Stop the development stack with `docker compose down`. To start optional MinIO as well, use `docker compose --profile minio up -d`. Its console is exposed on `http://localhost:9001` with the **development-only** credentials from `docker-compose.yml`; a bucket must still be created and S3 variables configured before Payload can use it.

> [!CAUTION]
> `docker compose down -v` deletes named volumes, including the development PostgreSQL data. Do not run it if you need to keep the data.

## Application routes

| Route | Purpose | Content source |
| --- | --- | --- |
| `/` | Homepage | Payload `homepage` global with local defaults |
| `/about` | About Cherry Blossom Garden | Frontend components |
| `/experiences` | Experiences and events | Frontend components |
| `/explore/[slug]` | Three floor showcases | Payload `explore-pages` with local defaults |
| `/menu` | Food and drinks | `src/data/menu.ts` and `src/data/specials.ts` |
| `/gallery` | Photography gallery | Frontend gallery data/components |
| `/kids-play` | Children's play area | Frontend components |
| `/reservation` | Reservation and contact page | Frontend components |
| `/privacy-policy` | Privacy policy | Frontend page |
| `/admin` | Payload CMS | Payload |
| `/api/*` | Payload REST API | Payload |
| `/api/graphql` | GraphQL | Payload |
| `/robots.txt` | Robots directives | SEO global and route handler |
| `/sitemap.xml` | Sitemap | SEO global and route handler |

The presence of a website form or interface does **not** by itself establish a working external booking, payment, newsletter or marketing integration. Verify such workflows before enabling production traffic.

## Content management

### Collections

| Collection | Slug | Use |
| --- | --- | --- |
| Explore Pages | `explore-pages` | Editable content for three floor experiences |
| Pages | `pages` | Reusable block-based page data; generic frontend routing remains to be implemented |
| Media | `media` | Images, PDFs and supported videos |
| Users | `users` | CMS accounts, role assignment and account status |
| Roles | `roles` | Custom access-control policies |
| Email Logs | `email-logs` | Send attempt statuses and operational history |

### Globals

| Global | Slug | Use |
| --- | --- | --- |
| Homepage | `homepage` | Home page sections and images |
| Site settings | `site-settings` | Site name, logos, contact details, social links |
| Navigation | `navigation` | Header and footer link configuration |
| SEO settings | `seo-settings` | Indexing, canonical defaults, social metadata |

**Homepage sections:** Hero, Our Story, Three Levels, Experiences, Signature Cuisine, Kids Play Area, Gallery and Garden Journal.

**Explore fields:** floor ID, public slug, page title, navigation labels, SEO description, carousel slides (images, copy, CTA, layout tone) and decorative labels. The floor ID is unique and cannot be changed after creation.

**Reusable `pages` blocks:** Hero, Rich Text, Image, Image and Text, Call to Action, Feature Grid, FAQ, Testimonials and Gallery. The block schema is implemented, but adding entries to this collection does not automatically create a public page route in the current frontend.

### Drafts and previews

1. Sign in at `/admin` and open **Homepage** or **Explore Pages**.
2. Edit text and/or choose an uploaded media file. Existing local images are available as fallbacks.
3. Use **Live Preview** to inspect changes on mobile, tablet or desktop widths.
4. Use **Preview** for an authenticated draft page view where supported.
5. **Publish** to show the CMS version publicly. Unpublished content should not be treated as publicly available.

Relevant implementation files:

```text
src/globals/Homepage.ts
src/collections/ExplorePages.ts
src/lib/homepage/defaults.ts
src/lib/explore/defaults.ts
src/lib/explore/get-pages.ts
src/components/frontend/homePage/HomeContentProvider.tsx
src/components/frontend/explore/ExploreContent.tsx
src/app/(frontend)/next/preview/route.ts
src/app/(frontend)/next/explore-preview/route.ts
src/app/(frontend)/next/explore-live/page.tsx
```

The generic `Pages` collection also supports drafts, version history, autosave and scheduled publishing at the CMS level, but its older preview URL implementation is not wired to a general-purpose page-rendering route in this repository.

### Roles and access

- The **Administrator** system role is created automatically when Payload initialises.
- The first account receives Administrator privileges.
- Administrators can manage users, roles and Email Logs.
- Custom roles specify per-collection read/create/update/delete permissions and per-global read/update permissions.
- The server protects the last active Administrator against accidental removal or suspension.
- Suspended users cannot authenticate; role and field permissions are enforced on server-side operations.
- New invited users must complete the activation flow before signing in.

When adding a collection or global, use the helpers under `src/access/` and register the configuration in `src/payload.config.ts` so it appears in the Roles permission editor.

## Database and migrations

This project uses `@payloadcms/db-postgres`. It supports two different schema workflows:

| Environment | Recommended workflow |
| --- | --- |
| Disposable local development | `PAYLOAD_DB_PUSH=true` and `pnpm dev` |
| Staging and production | Versioned migrations with `PAYLOAD_DB_PUSH=false` |

Available commands:

```bash
pnpm migrate:status
pnpm migrate
pnpm migrate:create
pnpm generate:types
pnpm generate:importmap
```

> [!IMPORTANT]
> **Migration gap at the currently reviewed revision:** the committed initial migration (`src/migrations/20261106_205953_initial.ts`) predates the newer `homepage` global and `explore-pages` collection; it does **not** include their database schema. Local development can create those tables through schema push, but **do not assume the existing migration alone is sufficient for production**. Before deploying, generate, review and commit a follow-up migration using a **separate migration-managed database** (`PAYLOAD_DB_PUSH=false`), then apply all migrations to production. Never point a production migration at a database that was already changed unpredictably by development push.

A safe migration development process is: create a fresh *non-production* database, run the committed initial migration with push disabled, generate a new migration for the new models, review it, then apply and test it. Back up an existing database before changing its schema.

## Environment variables

Start from [`.env.example`](./.env.example). Every secret and connection string is read server-side.

| Variable | Purpose | Local example / default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:postgres@127.0.0.1:5432/arthanova_cms` |
| `PAYLOAD_SECRET` | Payload signing/encryption secret | Generate with `openssl rand -hex 32` |
| `APP_URL` | Application base URL for CMS, previews and emails | `http://localhost:3000` |
| `WEBSITE_URL` | Public website link used by admin/email features | Override the template's Arthanova URL |
| `DATABASE_SSL` | SSL mode: `disable`, `require`, `verify-full` | `disable` locally |
| `DATABASE_SSL_CA` | CA certificate if needed | Empty locally |
| `DATABASE_POOL_MAX` | Maximum database connections | `10` |
| `DATABASE_POOL_IDLE_TIMEOUT_MS` | Pool idle timeout | `30000` |
| `DATABASE_POOL_CONNECTION_TIMEOUT_MS` | Connection timeout | `10000` |
| `PAYLOAD_DB_PUSH` | Auto-sync schema in development | `true` locally, `false` for migration-managed environments |
| `RESEND_API_KEY` | Resend API credential | Leave empty for local outbox mode |
| `EMAIL_FROM_NAME` | Display sender | `Cherry Blossom Garden` (set explicitly) |
| `EMAIL_FROM_ADDRESS` | Verified sender address | Required for real sending |
| `EMAIL_REPLY_TO` | Reply-to address | Optional |
| `EMAIL_SUPPORT_ADDRESS` | Support address shown in emails | Optional |
| `EMAIL_DEV_OUTBOX` | Capture messages under `.dev-outbox/` in development | `true` |
| `EMAIL_OVERRIDE_RECIPIENT` | Redirect outbound email to a test address | Optional staging safeguard |
| `JOBS_AUTORUN` | Run Payload jobs in this Node process | `true` |
| `JOBS_AUTORUN_CRON` | Job polling cron expression | `* * * * *` |
| `CRON_SECRET` | Protect external scheduled-job endpoint | Set if triggering jobs externally |
| `S3_ENABLED` | Enable S3-compatible media storage | `false` |
| `S3_BUCKET` | Object-storage bucket | Required when S3 is enabled |
| `S3_ENDPOINT` | S3-compatible endpoint (such as MinIO) | Optional for AWS S3 |
| `S3_REGION` | Storage region | `us-east-1` |
| `S3_ACCESS_KEY_ID` | Storage access key | Required when S3 is enabled |
| `S3_SECRET_ACCESS_KEY` | Storage secret | Required when S3 is enabled |
| `S3_FORCE_PATH_STYLE` | Path-style URLs, typically for MinIO | `true` |
| `S3_PREFIX` | Optional object prefix | Empty |
| `S3_SIGNED_DOWNLOADS` | Redirect downloads to signed URLs | `false` |
| `S3_SIGNED_URL_EXPIRES_IN` | Signed URL lifetime, seconds | `3600` |
| `TEST_DATABASE_URL` | **Disposable** database for integration tests | Must end in `_test` |

The runtime also accepts `NEXT_PUBLIC_SERVER_URL` as a fallback when `APP_URL` is unset. Prefer setting `APP_URL` explicitly.

### Email with Resend

For actual outbound emails:

1. Verify a sending domain in [Resend](https://resend.com/).
2. Create a Resend API key and set `RESEND_API_KEY`.
3. Set `EMAIL_FROM_ADDRESS` to an address on the verified domain.
4. Set `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO` and the correct public `APP_URL`.
5. Turn `EMAIL_DEV_OUTBOX=false` for actual sending, then test invitation and password-reset flows.

The custom adapter lives in `src/email/adapter.ts`. It uses the Resend SDK, logs message attempts in Payload and supports a local capture mode. **A provider-accepted email is not proof of final inbox delivery.**

Preview email templates without sending anything:

```bash
pnpm email:preview
```

Rendered HTML and text output is stored under `.email-previews/`.

### Optional media storage: S3 / MinIO

For the first local run, leave `S3_ENABLED=false`. Local uploads are stored in the application's `media` directory; keep that directory persistent in deployment environments.

For S3-compatible storage, create the bucket first and configure:

```dotenv
S3_ENABLED=true
S3_BUCKET=cherry-blossom-media
S3_ENDPOINT=https://s3.example.com
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=YOUR_ACCESS_KEY
S3_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
S3_FORCE_PATH_STYLE=true
```

For AWS S3, omit the custom endpoint and configure the relevant region. Ensure the storage credentials have the required permissions. Keep credentials server-side and use a durable bucket for production uploads.

## Developer commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm devsafe` | Clear `.next` and start development server (Unix-like shells) |
| `pnpm build` | Build production application |
| `pnpm start` | Run an existing production build |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run ESLint |
| `pnpm generate:types` | Regenerate Payload-generated TypeScript types |
| `pnpm generate:importmap` | Rebuild Payload admin import map |
| `pnpm generate:nav-icons` | Rebuild admin sidebar icon styles |
| `pnpm migrate` | Apply pending database migrations |
| `pnpm migrate:status` | Show migration status |
| `pnpm migrate:create` | Generate a migration for schema changes |
| `pnpm email:preview` | Render sample email HTML/text to disk |
| `pnpm test:int` | Run integration tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test` | Run integration and E2E suites |
| `pnpm check` | Regenerate types/import map, typecheck, lint and run integration tests |

## Testing

### Integration tests (Vitest)

**Warning:** integration tests **drop and recreate the `public` schema** of `TEST_DATABASE_URL` on every run. Use a disposable database whose name ends in `_test`. Never point this variable at production or any database you need to retain.

When using the bundled PostgreSQL container:

```bash
docker compose exec postgres createdb -U postgres arthanova_cms_test
```

Check `.env` includes:

```dotenv
TEST_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/arthanova_cms_test
```

Then run:

```bash
pnpm test:int
```

### Browser tests (Playwright)

Install the required browser, then run tests against your **development** database:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright starts or reuses a development server at `http://localhost:3000`. You can set `E2E_BASE_URL` to an existing server URL instead. E2E tests create and remove a test admin user, so do not run them against a production database.

```bash
pnpm typecheck
pnpm lint
```

## Production and deployment

For a **long-running Node deployment** (VPS/Dokploy, for example):

1. Provision a secure PostgreSQL database and persistent storage or S3/MinIO bucket.
2. Configure all production environment variables, especially `DATABASE_URL`, `PAYLOAD_SECRET`, `APP_URL` and an appropriate `DATABASE_SSL` mode.
3. Generate and commit any missing database migrations, including the Homepage/Explore schema described above.
4. Back up the database; run `pnpm install --frozen-lockfile`, then `pnpm migrate` against the production database.
5. Build and launch the service:

```bash
pnpm build
pnpm start
```

6. Configure HTTPS, DNS, health monitoring, backups and persistent media storage. Set `APP_URL` to the final HTTPS origin.
7. Configure verified Resend credentials if user invitations and password-reset emails will be used.
8. Configure scheduled jobs for the hosting model; for a persistent process `JOBS_AUTORUN=true` can run the Payload job queue. Serverless setups require a suitable external job trigger and `CRON_SECRET`.
9. Review **SEO settings → Allow search engines to index this site** when the public site is ready; indexing defaults to off.
10. Test login, content publishing, uploads, the public frontend, preview and account-email workflows after deployment.

### Dockerfile caveat

The **included production `Dockerfile` is not ready to run unchanged**: it expects Next.js `output: 'standalone'`, but that setting is absent from `next.config.ts`. It also prioritises `package-lock.json` over `pnpm-lock.yaml`, which can select npm unexpectedly. Before deploying through that Dockerfile, align its dependency-install steps with pnpm and add/test the required standalone output configuration. The development `docker-compose.yml` flow described above does **not** depend on this Dockerfile.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `pnpm: command not found` | Enable Corepack and activate pnpm `11.12.0`. |
| Unsupported Node version | Match the `engines.node` requirement in `package.json`. |
| Database connection refused | Confirm Postgres is running, credentials match and port `5432` is not blocked. |
| Hostname `postgres` not found | Use `127.0.0.1` when Next.js runs on your computer; use `postgres` **inside Docker Compose**. |
| Payload says `PAYLOAD_SECRET` is missing | Generate a secret and replace the placeholder in `.env`. |
| Fresh database missing Homepage/Explore tables | In **local development**, enable `PAYLOAD_DB_PUSH=true`; for production, create/apply the missing migration. |
| Existing migrations conflict with schema | Do not mix schema push and migrations against the same database without a carefully planned migration/baseline strategy. |
| `/admin` shows missing custom components | Try `pnpm generate:importmap`, then restart the dev server. |
| Changes do not appear on the public website | Check whether the content has been **published** and whether you are viewing draft/live preview. |
| Explore pages visible but not editable in admin | Run `pnpm exec tsx scripts/seed-explore-pages.ts` once the local schema is ready. |
| Email is not being sent | In development use `EMAIL_DEV_OUTBOX=true`; for real delivery configure Resend and a verified sender domain. |
| Media disappears after redeploy | Persist `media/` or use configured S3/MinIO storage. |
| `pnpm test:int` fails on database reset | Create a dedicated `_test` database and check `TEST_DATABASE_URL`. |
| Docker build cannot find `server.js` | Fix the production Dockerfile/standalone output mismatch described above. |
| Generic Pages preview returns an error | A catch-all Pages frontend route is not implemented; the existing preview handler is homepage-specific. |

## Project structure

```text
.
├── public/                       # Logos, brand files, bundled photos and icons
├── scripts/
│   ├── seed-explore-pages.ts     # Creates the three editable floor records
│   ├── render-emails.tsx         # Renders preview emails locally
│   └── generate-nav-icons.mjs
├── src/
│   ├── access/                  # Permissions and role checks
│   ├── app/
│   │   ├── (frontend)/          # Website routes and preview endpoints
│   │   ├── (payload)/           # Payload admin, REST API and GraphQL
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── blocks/                  # Reusable CMS content block schemas
│   ├── collections/             # ExplorePages, Pages, Media, Users, Roles, EmailLogs
│   ├── components/
│   │   ├── admin/               # Dashboard, branding and editor customisations
│   │   └── frontend/            # Website sections and UI components
│   ├── data/                    # Local menu and specials content
│   ├── email/                   # Resend adapter and React Email templates
│   ├── fields/                  # Common Payload fields
│   ├── globals/                 # Homepage, Navigation, SiteSettings, SEOSettings
│   ├── hooks/                   # Administrator role bootstrap
│   ├── lib/                     # CMS access, defaults, env, SEO and helpers
│   ├── migrations/              # PostgreSQL migrations
│   ├── plugins/                 # Payload SEO plugin configuration
│   ├── storage/                 # Optional S3/MinIO adapter
│   ├── styles/admin/            # Custom admin styles
│   └── payload.config.ts        # Payload application configuration
├── tests/
│   ├── int/                     # Vitest integration tests
│   ├── e2e/                     # Playwright browser tests
│   └── helpers/
├── .env.example                 # Environment variable reference
├── docker-compose.yml          # Local Payload + PostgreSQL (+ optional MinIO)
├── Dockerfile                   # Production image template; see caveats above
├── next.config.ts
├── package.json
└── pnpm-lock.yaml
```

## Current implementation notes

This section documents the code **as reviewed**, not a future-state roadmap:

- **Template branding remains.** The package name is `arthanova-studio-backend`; admin metadata, logos, email templates, default website URL and some globals still reference Arthanova Studio. Review and rebrand these before public production use.
- **CMS-backed frontend is selective.** Homepage and Explore Pages have explicit CMS connections and fallbacks. Menu/specials, gallery and other routes should not be described as fully CMS-driven yet.
- **Generic Pages route is incomplete.** The reusable `pages` schema exists, but a generic route for those pages is not in the current repository; some generated sitemap links may therefore need review.
- **Migration work remains.** The initial migration does not include the newer Homepage and Explore models. Add a versioned migration before using migration-managed deployment.
- **Production Docker work remains.** `next.config.ts` does not enable `standalone` output, and the Dockerfile prioritises npm when both lockfiles exist.
- **Integration verification is environment-dependent.** This README is based on source inspection; successful startup, build, database migration and test results must be confirmed in your environment.

## Development workflow

For normal feature work:

```bash
git pull origin main
pnpm install --frozen-lockfile
pnpm dev
```

After changing Payload collections, globals or admin components, regenerate the relevant assets:

```bash
pnpm generate:types
pnpm generate:importmap
pnpm typecheck
pnpm lint
```

Keep secrets out of Git, use feature branches and review database schema changes before merging. When preparing a release, test public and admin routes, permissions, previews, uploads and email flows.

## Maintainer

**Arthanova Studio** — design, technology and digital experiences.  
Project repository: [Rusz01/cherry-blossom-garden-backend](https://github.com/Rusz01/cherry-blossom-garden-backend)

---

<div align="center">
  <strong>Cherry Blossom Garden</strong><br />
  <sub>Where Every Moment Blooms.</sub><br /><br />
  <sub>Developed with care by Arthanova Studio.</sub>
</div>
