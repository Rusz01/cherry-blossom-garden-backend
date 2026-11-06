/**
 * Server-side environment configuration.
 *
 * Everything here reads `process.env` and must never be imported into a client
 * component. Values are read lazily (inside functions) so that `next build`
 * and type generation work without production credentials being present.
 */

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '')

const readString = (key: string): string | undefined => {
  const value = process.env[key]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const readInt = (key: string, fallback: number): number => {
  const raw = readString(key)
  if (!raw) return fallback
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const readBool = (key: string, fallback: boolean): boolean => {
  const raw = readString(key)?.toLowerCase()
  if (!raw) return fallback
  return ['1', 'true', 'yes', 'on'].includes(raw)
}

export const isProduction = (): boolean => process.env.NODE_ENV === 'production'

/** Public base URL of this CMS (used for links in emails, previews and SEO). */
export const getAppURL = (): string =>
  trimTrailingSlash(
    readString('APP_URL') ?? readString('NEXT_PUBLIC_SERVER_URL') ?? 'http://localhost:3000',
  )

/** URL of the official public website (used for "Visit website" links). */
export const getWebsiteURL = (): string =>
  trimTrailingSlash(readString('WEBSITE_URL') ?? 'https://arthanovastudio.com')

export const getPayloadSecret = (): string => {
  const secret = readString('PAYLOAD_SECRET')
  if (!secret) {
    throw new Error(
      'PAYLOAD_SECRET is not set. Generate one with `openssl rand -hex 32` and add it to .env.',
    )
  }
  if (isProduction() && secret.length < 32) {
    const message = 'PAYLOAD_SECRET must be at least 32 characters in production. Generate one with `openssl rand -hex 32`.'
    // Don't break `next build`; refuse to run a production server with a weak secret.
    if (process.env.NEXT_PHASE === 'phase-production-build') console.warn(`[env] ${message}`)
    else throw new Error(message)
  }
  return secret
}

/* -------------------------------------------------------------------------- */
/* Database                                                                   */
/* -------------------------------------------------------------------------- */

export type DatabaseSSLMode = 'disable' | 'require' | 'verify-full'

export type DatabaseConfig = {
  connectionString: string
  ssl: false | { rejectUnauthorized: boolean; ca?: string }
  max: number
  idleTimeoutMillis: number
  connectionTimeoutMillis: number
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const connectionString = readString('DATABASE_URL') ?? ''

  if (connectionString && !/^postgres(ql)?:\/\//i.test(connectionString)) {
    // Fail loudly and early: the adapter would otherwise produce a cryptic error.
    throw new Error(
      'DATABASE_URL must be a PostgreSQL connection string (postgres://user:password@host:5432/database).',
    )
  }

  const mode = (readString('DATABASE_SSL')?.toLowerCase() ?? 'disable') as DatabaseSSLMode
  const caRaw = readString('DATABASE_SSL_CA')
  // Allow the CA certificate to be supplied as base64 so it fits in a single env var.
  const ca = caRaw
    ? caRaw.includes('BEGIN CERTIFICATE')
      ? caRaw.replace(/\\n/g, '\n')
      : Buffer.from(caRaw, 'base64').toString('utf8')
    : undefined

  let ssl: DatabaseConfig['ssl'] = false
  if (mode === 'require') ssl = { rejectUnauthorized: false, ...(ca ? { ca } : {}) }
  if (mode === 'verify-full') ssl = { rejectUnauthorized: true, ...(ca ? { ca } : {}) }

  return {
    connectionString,
    ssl,
    max: readInt('DATABASE_POOL_MAX', 10),
    idleTimeoutMillis: readInt('DATABASE_POOL_IDLE_TIMEOUT_MS', 30_000),
    connectionTimeoutMillis: readInt('DATABASE_POOL_CONNECTION_TIMEOUT_MS', 10_000),
  }
}

/* -------------------------------------------------------------------------- */
/* Email                                                                      */
/* -------------------------------------------------------------------------- */

export type EmailEnvConfig = {
  /** True when Resend credentials and a sender address are present. */
  enabled: boolean
  apiKey?: string
  fromName: string
  fromAddress: string
  replyTo?: string
  supportEmail?: string
  /** Development-only: write emails to `.dev-outbox/` instead of sending them. */
  devOutbox: boolean
  /** Redirect every outgoing email to this address (staging/testing). */
  overrideRecipient?: string
}

export const getEmailConfig = (): EmailEnvConfig => {
  const apiKey = readString('RESEND_API_KEY')
  const fromAddress = readString('EMAIL_FROM_ADDRESS')
  const replyTo = readString('EMAIL_REPLY_TO')

  return {
    enabled: Boolean(apiKey && fromAddress),
    apiKey,
    fromName: readString('EMAIL_FROM_NAME') ?? 'Arthanova Studio',
    fromAddress: fromAddress ?? 'no-reply@localhost',
    replyTo,
    supportEmail: readString('EMAIL_SUPPORT_ADDRESS') ?? replyTo ?? fromAddress,
    devOutbox: !isProduction() && readBool('EMAIL_DEV_OUTBOX', false),
    overrideRecipient: readString('EMAIL_OVERRIDE_RECIPIENT'),
  }
}

/* -------------------------------------------------------------------------- */
/* S3 / MinIO storage (optional)                                              */
/* -------------------------------------------------------------------------- */

export type S3EnvConfig = {
  enabled: boolean
  bucket: string
  endpoint?: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  forcePathStyle: boolean
  prefix?: string
  signedDownloads: boolean
  signedURLExpiresIn: number
}

export const getS3Config = (): S3EnvConfig => {
  const bucket = readString('S3_BUCKET') ?? ''
  const accessKeyId = readString('S3_ACCESS_KEY_ID') ?? ''
  const secretAccessKey = readString('S3_SECRET_ACCESS_KEY') ?? ''

  return {
    enabled: readBool('S3_ENABLED', false) && Boolean(bucket && accessKeyId && secretAccessKey),
    bucket,
    endpoint: readString('S3_ENDPOINT'),
    region: readString('S3_REGION') ?? 'us-east-1',
    accessKeyId,
    secretAccessKey,
    forcePathStyle: readBool('S3_FORCE_PATH_STYLE', true),
    prefix: readString('S3_PREFIX'),
    signedDownloads: readBool('S3_SIGNED_DOWNLOADS', false),
    signedURLExpiresIn: readInt('S3_SIGNED_URL_EXPIRES_IN', 3600),
  }
}

/* -------------------------------------------------------------------------- */
/* Jobs / scheduled publishing                                                */
/* -------------------------------------------------------------------------- */

export const getJobsConfig = () => ({
  /** Run the job queue in-process on a cron (suitable for a long-running Node server). */
  autoRun: readBool('JOBS_AUTORUN', true),
  cron: readString('JOBS_AUTORUN_CRON') ?? '* * * * *',
  /** Bearer secret for triggering `/api/payload-jobs/run` from an external scheduler. */
  cronSecret: readString('CRON_SECRET'),
})
