import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

import { getS3Config } from '@/lib/env'

/**
 * Optional S3-compatible storage (AWS S3, MinIO, Cloudflare R2, …).
 *
 * Disabled unless S3_ENABLED=true and bucket/credentials are present, so local
 * development keeps using the filesystem (`/media`). When enabled:
 *  - files are proxied through Payload (`/api/media/file/...`) so collection
 *    access control still applies and the bucket can remain private;
 *  - with S3_SIGNED_DOWNLOADS=true, downloads redirect to short-lived
 *    pre-signed URLs instead of being streamed through the server.
 * Credentials stay server-side; nothing is exposed to the browser.
 */
export const storagePlugins = (): Plugin[] => {
  const config = getS3Config()
  if (!config.enabled) return []

  return [
    s3Storage({
      enabled: true,
      bucket: config.bucket,
      acl: 'private',
      collections: {
        media: {
          prefix: config.prefix,
          ...(config.signedDownloads ? { signedDownloads: { expiresIn: config.signedURLExpiresIn } } : {}),
        },
      },
      config: {
        region: config.region,
        endpoint: config.endpoint,
        forcePathStyle: config.forcePathStyle,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      },
    }),
  ]
}
