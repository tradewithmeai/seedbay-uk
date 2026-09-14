import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SeedGrid from '@/components/SeedGrid'
import { CATEGORIES, CATEGORY_COPY } from '@/lib/categories'
import { categorySlug } from '@/lib/slug'
import { getLocationGroups, type LocationGroup } from '@/lib/seeds-static'

// Location landing pages, one per place a gardener has actually listed from.
// "seeds for sale <town>" is the query that converts; nothing on the site
// answered it before.
export const dynamicParams = false

export async function generateStaticParams() {
  const groups = await getLocationGroups()
  return groups.map((group) => ({ location: group.slug }))
}

async function findGroup(slug: string): Promise<LocationGroup | undefined> {
  const groups = await getLocationGroups()
  return groups.find((group) => group.slug === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location: slug } = await params
  const group = await findGroup(slug)
  if (!group) return {}

  const title = `Seeds in ${group.name} — Buy, Swap & Free`
  const description = `${group.seeds.length} seed listing${
    group.seeds.length === 1 ? '' : 's'
  } from gardeners in and around ${group.name}. Collect locally or arrange postage — contact the grower directly, no fees.`

  return {
    title,
    description,
    alternates: { canonical: `/seeds/in/${slug}/` },
    openGraph: {
      title: `${title} | SeedBay`,
      description,
      url: `https://seedbay.co.uk/seeds/in/${slug}/`,
      images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
    },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location: slug } = await params
  const group = await findGroup(slug)
  if (!group) notFound()

  const all = await getLocationGroups()
  const nearby = all.filter((other) => other.slug !== slug).slice(0, 12)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SeedBay', item: 'https://seedbay.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Seeds', item: 'https://seedbay.co.uk/seeds/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Seeds in ${group.name}`,
        item: `https://seedbay.co.uk/seeds/in/${slug}/`,
      },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/seeds/" className="hover:text-primary-600">Seeds</Link>
        <span className="mx-2">/</span>
        <Link href="/seeds/in/" className="hover:text-primary-600">Locations</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{group.name}</span>
      </nav>

      <div className="mb-8">
        <p className="text-3xl mb-2">📍</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Seeds in {group.name}</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Seed listings from gardeners in and around {group.name} — for sale, for swap, and free to a good home.
        </p>
        <p className="text-gray-600 max-w-3xl mt-3">
          Local listings are worth seeking out: seed that has already grown well nearby is seed suited to your
          soil and your season, and collecting in person saves the postage. Contact the grower directly —
          SeedBay charges nothing and takes no cut.
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {group.seeds.length} listing{group.seeds.length === 1 ? '' : 's'} in {group.name}
      </h2>
      <SeedGrid seeds={group.seeds} emptyMessage={`No listings in ${group.name} right now.`} />

      {nearby.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Seeds in other places</h2>
          <ul className="flex flex-wrap gap-2">
            {nearby.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/seeds/in/${other.slug}/`}
                  className="inline-block bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {other.name} <span className="text-gray-400">({other.seeds.length})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
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
