import type { Metadata } from 'next'

// The legacy /view/?id=<uuid> route is a client component, so it cannot export
// metadata itself. This marks the whole segment noindex; the pre-rendered
// /view/[slug]/ pages override it back to index in their own generateMetadata.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ViewLayout({ children }: { children: React.ReactNode }) {
  return children
}
