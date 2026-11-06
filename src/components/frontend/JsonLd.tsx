import React from 'react'

import { serializeJsonLd } from '@/lib/seo/jsonld'

export const JsonLd: React.FC<{ data: Record<string, unknown> | null }> = ({ data }) =>
  data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} /> : null
