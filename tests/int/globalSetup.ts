import { createRequire } from 'module'

import 'dotenv/config'

/**
 * Resets the integration-test database before the suite runs.
 * Refuses to touch any database whose name does not end in `_test`.
 */
export default async function setup() {
  const url = process.env.TEST_DATABASE_URL
  if (!url) {
    throw new Error(
      'TEST_DATABASE_URL is not set. Point it at a disposable database whose name ends with "_test", e.g. postgres://localhost:5432/arthanova_cms_test',
    )
  }
  const dbName = new URL(url).pathname.replace(/^\//, '')
  if (!dbName.endsWith('_test')) {
    throw new Error(`Refusing to reset "${dbName}": the test database name must end with "_test".`)
  }

  // `pg` ships with @payloadcms/db-postgres; resolve it from there.
  const require = createRequire(import.meta.url)
  type PgClient = { connect(): Promise<void>; query(sql: string): Promise<unknown>; end(): Promise<void> }
  const pg = createRequire(require.resolve('@payloadcms/db-postgres'))('pg') as {
    Client: new (options: { connectionString: string }) => PgClient
  }
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
  await client.end()
}
