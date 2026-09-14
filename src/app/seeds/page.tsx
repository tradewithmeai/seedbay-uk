import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES, CATEGORY_COPY } from '@/lib/categories'
import { categorySlug } from '@/lib/slug'
import { getBuildSeeds, getFreeSeeds, getLocationGroups } from '@/lib/seeds-static'

export const metadata: Metadata = {
  title: 'Browse UK Seeds by Type & Location',
  description:
    'Every seed listing on SeedBay, sorted by type and by where in the UK it is. Vegetable, flower, herb, fruit and tree seeds from gardeners near you.',
  alternates: { canonical: '/seeds/' },
  openGraph: {
    title: 'Browse UK Seeds by Type & Location | SeedBay',
    description: 'Every seed listing on SeedBay, sorted by type and by where in the UK it is.',
    url: 'https://seedbay.co.uk/seeds/',
    images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
  },
}

export default async function SeedsHubPage() {
  const [seeds, free, locations] = await Promise.all([getBuildSeeds(), getFreeSeeds(), getLocationGroups()])

  const counts = new Map<string, number>()
  for (const seed of seeds) counts.set(seed.category, (counts.get(seed.category) ?? 0) + 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse UK Seeds by Type &amp; Location</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {seeds.length === 0
            ? 'Listings from gardeners across the UK, sorted by what they are and where they are.'
            : `${seeds.length} live listing${seeds.length === 1 ? '' : 's'} from gardeners across the UK, sorted by what they are and where they are.`}
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Seeds by type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {CATEGORIES.map((category) => {
          const copy = CATEGORY_COPY[category]
          const count = counts.get(category) ?? 0
          return (
            <Link
              key={category}
              href={`/seeds/${categorySlug(category)}/`}
              className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all p-5 block"
            >
              <p className="text-2xl mb-1">{copy.emoji}</p>
              <h3 className="text-lg font-semibold text-gray-900">{copy.heading}</h3>
              <p className="text-sm text-gray-500 mt-1">{copy.lead}</p>
              <p className="text-xs text-primary-600 font-medium mt-3">
                {count} listing{count === 1 ? '' : 's'} →
              </p>
            </Link>
          )
        })}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Free seeds</h2>
      <Link
        href="/seeds/free/"
        className="bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-md transition-all p-5 block mb-12"
      >
        <p className="text-2xl mb-1">🎁</p>
        <h3 className="text-lg font-semibold text-gray-900">Free Seeds in the UK</h3>
        <p className="text-sm text-gray-600 mt-1">
          Listings given away for nothing — {free.length} available right now.
        </p>
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Seeds by location</h2>
      {locations.length === 0 ? (
        <p className="text-gray-600">
          No locations yet.{' '}
          <Link href="/post/" className="text-primary-600 hover:underline">
            Post a listing
          </Link>{' '}
          and yours will appear here.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {locations.map((group) => (
            <li key={group.slug}>
              <Link
                href={`/seeds/in/${group.slug}/`}
                className="inline-block bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Seeds in {group.name}{' '}
                <span className="text-gray-400">({group.seeds.length})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
