import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

export const RichText: React.FC<{ data?: SerializedEditorState | null; className?: string }> = ({ data, className }) =>
  data ? <LexicalRichText className={['prose', className].filter(Boolean).join(' ')} data={data} /> : null
