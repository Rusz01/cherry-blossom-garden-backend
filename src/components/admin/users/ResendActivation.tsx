'use client'

import { Button, toast, useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { MailCheck } from 'lucide-react'
import React, { useState } from 'react'

/**
 * Sidebar action on the user edit view: lets Administrators re-send the
 * activation invitation for accounts that have not been activated yet.
 * Server-side checks in the endpoint are authoritative; this only renders
 * when it is likely to be useful.
 */
export const ResendActivation: React.FC = () => {
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  const verified = useFormFields(([fields]) => fields?._verified?.value)
  const [sending, setSending] = useState(false)

  if (!id || verified !== false || String(user?.id) === String(id)) return null

  const resend = async () => {
    setSending(true)
    try {
      const res = await fetch(`/api/users/${id}/resend-activation`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) toast.success(body.message ?? 'Activation email sent.')
      else toast.error(body.message ?? 'Could not send the activation email.')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="arth-activation">
      <p className="arth-activation__title">Pending activation</p>
      <p className="arth-activation__text">
        This user has not activated their account yet. Sending a new email invalidates the previous link.
      </p>
      <Button buttonStyle="secondary" size="small" onClick={resend} disabled={sending} icon={<MailCheck size={14} />}>
        {sending ? 'Sending…' : 'Resend activation email'}
      </Button>
    </div>
  )
}
