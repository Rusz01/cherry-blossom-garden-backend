'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

const fallback = (index: number | undefined, noun: string) => `${noun} ${String((index ?? 0) + 1).padStart(2, '0')}`

export const TitleRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{data?.title || fallback(rowNumber, 'Feature')}</span>
}

export const QuestionRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ question?: string }>()
  return <span>{data?.question || fallback(rowNumber, 'Question')}</span>
}

export const AuthorRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ author?: string }>()
  return <span>{data?.author || fallback(rowNumber, 'Testimonial')}</span>
}

export const LinkRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ link?: { label?: string } }>()
  return <span>{data?.link?.label || fallback(rowNumber, 'Link')}</span>
}
