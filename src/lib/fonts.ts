import { DM_Sans } from 'next/font/google'

/**
 * Brand typeface, matching arthanovastudio.com. `next/font` downloads it at
 * build time and serves it from this app, so no runtime request goes to Google.
 * Used for both headings and text (admin and frontend).
 */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})
