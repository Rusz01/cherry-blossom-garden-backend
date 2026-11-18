import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/cms/payload'
import { DEFAULT_PRIVACY_POLICY, normalizePrivacyPolicy } from './defaults'

export const getPrivacyPolicyContent = cache(async () => {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  let canPreview = false

  if (isEnabled) {
    const { user } = await payload.auth({ headers: await headers() })
    if (user) {
      try {
        await payload.findGlobal({
          slug: 'privacy-policy-page', user, overrideAccess: false, depth: 0,
        })
        canPreview = true
      } catch {
        // A session with no Privacy Policy read permission cannot see drafts.
      }
    }
  }

  const doc = await payload.findGlobal({
    slug: 'privacy-policy-page', draft: canPreview,
    depth: 0, overrideAccess: true,
  })

  // Never expose an unpublished draft to the public. Use the original
  // policy as the safe, pre-publication fallback instead.
  if (!canPreview && doc._status !== 'published') return DEFAULT_PRIVACY_POLICY
  return normalizePrivacyPolicy(doc)
})
