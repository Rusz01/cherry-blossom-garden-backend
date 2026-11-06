import type { ReactElement } from 'react'
import { render, toPlainText } from 'react-email'

export type RenderedEmail = { html: string; text: string }

/** Renders a React Email template to HTML plus a plain-text alternative. */
export const renderEmail = async (element: ReactElement): Promise<RenderedEmail> => {
  const html = await render(element)
  return { html, text: toPlainText(html) }
}
