import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { ADMIN_ONLY_COLLECTIONS, isAdministrator, type PermissionOption } from './access'
import { EmailLogs } from './collections/EmailLogs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { createRolesCollection } from './collections/Roles'
import { Users } from './collections/Users'
import { arthanovaEmailAdapter } from './email/adapter'
import { Navigation } from './globals/Navigation'
import { SEOSettings } from './globals/SEOSettings'
import { SiteSettings } from './globals/SiteSettings'
import { seedAdministratorRole } from './hooks/seedAdministratorRole'
import { getAppURL, getDatabaseConfig, getJobsConfig, getPayloadSecret, isProduction } from './lib/env'
import { seo } from './plugins/seo'
import { storagePlugins } from './storage/s3'

import { Homepage } from "./globals/Homepage";
import { ExplorePages } from '@/collections/ExplorePages'


import { MenuCategories } from "@/collections/MenuCategories";
import { DietaryTags } from "@/collections/DietaryTags";
import { MenuItems } from "@/collections/MenuItems";
import { SpecialMenus } from "@/collections/SpecialMenus";
import { MenuSettings } from "@/globals/MenuSettings";

import { Events } from "@/collections/Events";
import { ExperiencesPage } from "@/globals/ExperiencesPage";


import { KidsPlayPage } from "@/globals/KidsPlayPage";





const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const appURL = getAppURL()
const database = getDatabaseConfig()
const jobs = getJobsConfig()

/**
 * Content collections and globals managed by custom roles. Anything added here
 * automatically appears in the Roles permission editor. Users, Roles and
 * Email Logs are intentionally excluded: they are Administrator-only.
 */
const contentCollections: CollectionConfig[] = [
  Pages,
  ExplorePages,
  Media,
  MenuCategories,
  DietaryTags,
  MenuItems,
  SpecialMenus,
  Events,

]


const contentGlobals: GlobalConfig[] = [
  Homepage,
  ExperiencesPage,
  KidsPlayPage,
  SiteSettings,
  Navigation,
  SEOSettings,
  MenuSettings,
]

const labelOf = (entity: CollectionConfig | GlobalConfig, fallback: string): string => {
  const plural = 'labels' in entity && entity.labels && typeof entity.labels.plural === 'string' ? entity.labels.plural : null
  const single = 'label' in entity && typeof entity.label === 'string' ? entity.label : null
  return plural ?? single ?? fallback
}

const collectionOptions: PermissionOption[] = contentCollections
  .filter((collection) => !ADMIN_ONLY_COLLECTIONS.has(collection.slug))
  .map((collection) => ({ label: labelOf(collection, collection.slug), value: collection.slug }))

const globalOptions: PermissionOption[] = contentGlobals.map((global) => ({
  label: labelOf(global, global.slug),
  value: global.slug,
}))

const Roles = createRolesCollection({ collectionOptions, globalOptions })

export default buildConfig({
  serverURL: appURL,
  secret: getPayloadSecret(),
  cors: [appURL],
  csrf: [appURL],

  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Arthanova Studio',
      description: 'Arthanova Studio content management system.',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/favicon.png' },
        { rel: 'apple-touch-icon', type: 'image/png', url: '/apple-touch-icon.png' },
      ],
      openGraph: {
        siteName: 'Arthanova Studio CMS',
        images: [{ url: '/brand/arthanova-mark-512.png', width: 512, height: 512 }],
      },
      robots: 'noindex, nofollow',
    },

    timezones: {
      defaultTimezone: "Asia/Kathmandu",
      supportedTimezones: [
        {
          label: "Nepal Standard Time (NPT, UTC+05:45)",
          value: "Asia/Kathmandu",
        },
      ],
    },


    dateFormat: 'd MMM yyyy, HH:mm',
    components: {
      graphics: {
        Logo: '/components/admin/brand/Logo#Logo',
        Icon: '/components/admin/brand/Icon#Icon',
      },
      beforeLogin: ['/components/admin/auth/BeforeLogin#BeforeLogin'],
      afterLogin: ['/components/admin/auth/AfterLogin#AfterLogin'],
      beforeNavLinks: ['/components/admin/nav/NavBrand#NavBrand'],
      afterNavLinks: ['/components/admin/nav/NavAccount#NavAccount'],
      logout: { Button: '/components/admin/nav/LogoutButton#LogoutButton' },
      providers: ['/components/admin/providers/BrandFonts#BrandFonts'],
      views: {
        dashboard: { Component: '/components/admin/dashboard/Dashboard#Dashboard' },
      },
    },
  },

  collections: [...contentCollections, Users, Roles, EmailLogs],
  globals: contentGlobals,

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: {
      connectionString: database.connectionString,
      ssl: database.ssl,
      max: database.max,
      idleTimeoutMillis: database.idleTimeoutMillis,
      connectionTimeoutMillis: database.connectionTimeoutMillis,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema push is a development convenience only. Production schema
    // changes must go through `pnpm migrate` (see README).
    push: !isProduction() && process.env.PAYLOAD_DB_PUSH !== 'false',
  }),

  email: arthanovaEmailAdapter(),

  sharp,

  upload: {
    limits: { fileSize: 20 * 1024 * 1024 },
  },

  graphQL: {
    disablePlaygroundInProduction: true,
  },

  jobs: {
    // Required for scheduled publishing of pages.
    access: {
      run: async ({ req }) => {
        if (await isAdministrator(req)) return true
        const header = req.headers.get('authorization')
        return Boolean(jobs.cronSecret && header === `Bearer ${jobs.cronSecret}`)
      },
    },
    autoRun: jobs.autoRun ? [{ cron: jobs.cron, queue: 'default', limit: 20 }] : [],
    shouldAutoRun: () => jobs.autoRun,
  },

  plugins: [seo(), ...storagePlugins()],

  onInit: async (payload) => {
    try {
      await seedAdministratorRole(payload)
    } catch (error) {
      payload.logger.error({
        msg: '[rbac] Could not ensure the Administrator role exists. Have migrations been run?',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
