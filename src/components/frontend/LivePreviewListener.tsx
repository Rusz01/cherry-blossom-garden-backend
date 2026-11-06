'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Server-side live preview: when an editor saves or autosaves in the admin,
 * Payload posts a message to this iframe and we re-render the route with the
 * latest draft (fetched server-side with the editor's own permissions).
 */
export const LivePreviewListener: React.FC<{ serverURL: string }> = ({ serverURL }) => {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
}
