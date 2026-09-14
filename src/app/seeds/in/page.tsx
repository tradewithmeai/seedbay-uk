import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocationGroups } from '@/lib/seeds-static'

export const metadata: Metadata = {
  title: 'Seeds by Location — Find Seeds Near You in the UK',
  description:
    'Every UK town, city and county with seed listings on SeedBay. Find gardeners near you giving away, swapping or selling seed — collect locally and skip the postage.',
  alternates: { canonical: '/seeds/in/' },
  openGraph: {
    title: 'Seeds by Location — Find Seeds Near You in the UK | SeedBay',
    description: 'Every UK town, city and county with seed listings on SeedBay.',
    url: 'https://seedbay.co.uk/seeds/in/',
    images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
  },
}

export default async function LocationsIndexPage() {
  const groups = await getLocationGroups()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/seeds/" className="hover:text-primary-600">Seeds</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Locations</span>
      </nav>

      <div className="mb-8">
        <p className="text-3xl mb-2">🗺️</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Seeds Near You</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Every place in the UK with a live seed listing on SeedBay.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-gray-600">
          No locations yet.{' '}
          <Link href="/post/" className="text-primary-600 hover:underline">
            Post a listing
          </Link>{' '}
          and yours will be the first.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {groups.map((group) => (
            <li key={group.slug}>
              <Link
                href={`/seeds/in/${group.slug}/`}
                className="block bg-white border border-gray-200 hover:border-primary-300 hover:shadow-sm rounded-lg px-4 py-3 transition-all"
              >
                <span className="font-medium text-gray-900">{group.name}</span>
                <span className="block text-xs text-gray-400 mt-0.5">
                  {group.seeds.length} listing{group.seeds.length === 1 ? '' : 's'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
