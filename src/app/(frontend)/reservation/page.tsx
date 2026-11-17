import type { Metadata } from 'next'
import { draftMode, headers } from 'next/headers'
import { cache, Suspense } from 'react'
import Navbar from '@/components/frontend/navbar'
import ReservationContact from '@/components/frontend/reservation/reservationContact'
import { getPayloadClient } from '@/lib/cms/payload'
import { getAppURL } from '@/lib/env'
import { normalizeReservationContent } from '@/lib/reservation/config'

export const dynamic = 'force-dynamic'

const getContent = cache(async () => {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  let canPreview = false
  if (isEnabled) {
    const { user } = await payload.auth({ headers: await headers() })
    if (user) {
      try {
        await payload.findGlobal({ slug: 'reservation-page', user, overrideAccess: false, depth: 0 })
        canPreview = true
      } catch { canPreview = false }
    }
  }
  const page = await payload.findGlobal({
    slug: 'reservation-page', draft: canPreview, depth: 0, overrideAccess: true,
  })
  return normalizeReservationContent(canPreview || page._status === 'published' ? page : null)
})

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent()
  return { title: page.seoTitle, description: page.seoDescription }
}

export default async function ReservationPage() {
  const page = await getContent()
  return (
    <div className="min-h-screen bg-midnight font-inter text-ivory">
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[650px]" />}>
          <ReservationContact initialData={page} serverURL={getAppURL()} />
        </Suspense>
      </main>
    </div>
  )
}
