import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SeedGrid from '@/components/SeedGrid'
import { CATEGORIES, CATEGORY_COPY } from '@/lib/categories'
import { categorySlug } from '@/lib/slug'
import { getBuildSeeds, getSeedsByCategory } from '@/lib/seeds-static'

// Category landing pages. These are the pages meant to rank for the long-tail
// "<type> seeds uk" queries; the home page cannot, because it is one URL trying
// to be all of them at once.
export const dynamicParams = false

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: categorySlug(category) }))
}

function categoryFromSlug(slug: string) {
  return CATEGORIES.find((category) => categorySlug(category) === slug)
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params
  const category = categoryFromSlug(slug)
  if (!category) return {}

  const copy = CATEGORY_COPY[category]
  const title = `${copy.heading} UK — Buy, Swap & Free`
  const description = `${copy.lead}. No fees, no middleman — contact the grower directly on SeedBay.`

  return {
    title,
    description,
    alternates: { canonical: `/seeds/${slug}/` },
    openGraph: {
      title: `${title} | SeedBay`,
      description,
      url: `https://seedbay.co.uk/seeds/${slug}/`,
      images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = categoryFromSlug(slug)
  if (!category) notFound()

  const copy = CATEGORY_COPY[category]
  const [seeds, all] = await Promise.all([getSeedsByCategory(category), getBuildSeeds()])
  const others = CATEGORIES.filter((c) => c !== category)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SeedBay', item: 'https://seedbay.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Seeds', item: 'https://seedbay.co.uk/seeds/' },
      { '@type': 'ListItem', position: 3, name: copy.heading, item: `https://seedbay.co.uk/seeds/${slug}/` },
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
        <span className="text-gray-700">{copy.heading}</span>
      </nav>

      <div className="mb-8">
        <p className="text-3xl mb-2">{copy.emoji}</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{copy.heading} in the UK</h1>
        <p className="text-lg text-gray-600 max-w-3xl">{copy.lead}.</p>
        <p className="text-gray-600 max-w-3xl mt-3">{copy.intro}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {seeds.length} {copy.noun} listing{seeds.length === 1 ? '' : 's'} available now
      </h2>
      <SeedGrid
        seeds={seeds}
        emptyMessage={`No ${copy.noun} listed right now — but ${all.length} other listing${all.length === 1 ? ' is' : 's are'} live on SeedBay.`}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Browse other seed types</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other}>
              <Link
                href={`/seeds/${categorySlug(other)}/`}
                className="inline-block bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {CATEGORY_COPY[other].emoji} {CATEGORY_COPY[other].heading}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/seeds/free/"
              className="inline-block bg-green-50 border border-green-200 hover:border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🎁 Free seeds
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
