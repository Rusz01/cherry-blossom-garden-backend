import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/cms/payload'

export async function GET(request: NextRequest) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new NextResponse('Authentication required', { status: 401 })
  try {
    await payload.findGlobal({
      slug: 'reservation-page', user, depth: 0, overrideAccess: false,
    })
  } catch {
    return new NextResponse('Preview access denied', { status: 403 })
  }
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL('/reservation', request.url))
}
