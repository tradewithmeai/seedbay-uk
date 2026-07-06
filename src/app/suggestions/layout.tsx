import type { Metadata } from 'next'

// suggestions/page.tsx is a client component, so it can't export metadata itself.
// This server-component layout supplies the canonical tag (and title) for the route,
// which is in the sitemap and needs a user-selected canonical for Google.
export const metadata: Metadata = {
  title: 'Suggestions — SeedBay',
  description: 'Suggest features and improvements for SeedBay, the UK community seed exchange.',
  alternates: { canonical: '/suggestions' },
}

export default function SuggestionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
