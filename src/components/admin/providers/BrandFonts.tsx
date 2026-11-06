'use client'

import React from 'react'

import { dmSans } from '@/lib/fonts'

/**
 * Exposes the self-hosted DM Sans (next/font) to the whole admin — including
 * portals and modals — via root-level CSS variables used by `src/styles/admin`.
 * `dmSans.style.fontFamily` is "'DM Sans', 'DM Sans Fallback'"; the fallback is
 * a metric-matched local font that prevents layout shift while DM Sans loads.
 */
export const BrandFonts: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <style>{`:root{--arth-font-sans:${dmSans.style.fontFamily};}`}</style>
    {children}
  </>
)
