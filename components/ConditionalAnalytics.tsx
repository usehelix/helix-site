'use client'

import { usePathname } from 'next/navigation'
import { Analytics } from '@vercel/analytics/react'

/*
  Vercel Analytics is loaded site-wide — EXCEPT under /kids-lab.
  Helix Kids Lab is a COPPA-safe children's area (ages 8–12): it must collect
  no personal information and run no tracking of any kind. Suppressing analytics
  here keeps that guarantee at the framework level, not just in the page markup.
*/
export function ConditionalAnalytics() {
  const pathname = usePathname()
  if (pathname?.startsWith('/kids-lab')) return null
  return <Analytics />
}
