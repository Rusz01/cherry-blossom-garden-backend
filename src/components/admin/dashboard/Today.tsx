'use client'

import React, { useSyncExternalStore } from 'react'

const format = () => new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const subscribe = () => () => {}

/** Today's date in the viewer's own locale and time zone (not the server's). Empty during SSR. */
export const Today: React.FC = () => {
  const label = useSyncExternalStore(subscribe, format, () => '')
  return <span>{label || ' '}</span>
}
