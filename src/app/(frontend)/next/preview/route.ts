import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { isSafeRelativePath } from '@/lib/cms/paths'

/**
 * Enables Next.js draft mode for authorised CMS users, then redirects to the
 * page. Authorisation uses the Payload session cookie (same origin as the
 * admin), so no shared preview secret is needed or exposed in URLs.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')

  if (!isSafeRelativePath(path)) {
    return new Response('Invalid preview path.', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user, permissions } = await payload.auth({ headers: request.headers })

  if (!user) {
    return redirect(`/admin/login?redirect=${encodeURIComponent(`/next/preview?path=${encodeURIComponent(path)}`)}`)
  }
  if (!permissions?.collections?.pages?.read) {
    return new Response('You do not have permission to preview pages.', { status: 403 })
  }

  ;(await draftMode()).enable()
  return redirect(path)
}
