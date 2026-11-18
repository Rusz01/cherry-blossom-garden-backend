import type { Metadata } from 'next'
import PrivacyPolicyView from '@/components/frontend/privacy/PrivacyPolicyView'
import { getAppURL } from '@/lib/env'
import { getPrivacyPolicyContent } from '@/lib/privacy-policy/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPolicyContent()
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/privacy-policy' },
  }
}

export default async function PrivacyPolicyPage() {
  const initialData = await getPrivacyPolicyContent()
  return <PrivacyPolicyView initialData={initialData} serverURL={getAppURL()} />
}
