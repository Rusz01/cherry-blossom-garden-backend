import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { isSafeRelativePath } from '@/lib/cms/paths'

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path')
  ;(await draftMode()).disable()
  return redirect(isSafeRelativePath(path) ? path : '/')
}
