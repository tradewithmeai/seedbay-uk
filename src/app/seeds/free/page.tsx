import type { Metadata } from 'next'
import Link from 'next/link'
import SeedGrid from '@/components/SeedGrid'
import { CATEGORIES, CATEGORY_COPY } from '@/lib/categories'
import { categorySlug } from '@/lib/slug'
import { getFreeSeeds } from '@/lib/seeds-static'

export const metadata: Metadata = {
  title: 'Free Seeds UK — Given Away by Gardeners',
  description:
    'Seeds being given away for free by UK gardeners — vegetable, flower and herb seed, surplus packets and home-saved seed. Collect locally or cover the postage.',
  alternates: { canonical: '/seeds/free/' },
  openGraph: {
    title: 'Free Seeds UK — Given Away by Gardeners | SeedBay',
    description: 'Seeds being given away for free by UK gardeners. Collect locally or cover the postage.',
    url: 'https://seedbay.co.uk/seeds/free/',
    images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
  },
}

export default async function FreeSeedsPage() {
  const seeds = await getFreeSeeds()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/seeds/" className="hover:text-primary-600">Seeds</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Free seeds</span>
      </nav>

      <div className="mb-8">
        <p className="text-3xl mb-2">🎁</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Seeds in the UK</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Every listing on this page is being given away for nothing.
        </p>
        <p className="text-gray-600 max-w-3xl mt-3">
          Gardeners end most seasons with more seed than they can sow — surplus packets, home-saved seed from a
          good plant, half a tray of something that turned out well. Rather than bin it, they list it here. Most
          ask only that you collect locally or cover a stamp. Contact the grower directly; SeedBay never takes a cut.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {seeds.length} free listing{seeds.length === 1 ? '' : 's'} available now
      </h2>
      <SeedGrid
        seeds={seeds}
        emptyMessage="Nothing is being given away right now — but listings change daily, and posting your own spare seed is free."
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Browse by seed type</h2>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/seeds/${categorySlug(category)}/`}
                className="inline-block bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {CATEGORY_COPY[category].emoji} {CATEGORY_COPY[category].heading}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
