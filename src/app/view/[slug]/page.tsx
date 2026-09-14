import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SeedDetail from '@/components/SeedDetail'
import { getBuildSeeds } from '@/lib/seeds-static'
import { seedSlug } from '@/lib/slug'
import type { Seed } from '@/types/database'

// Every listing gets its own crawlable URL, baked at build time. Before this,
// listings only existed behind /view?id=<uuid> and were fetched client-side, so
// none of them were indexable — the whole site was three URLs to Google.
export const dynamicParams = false

export async function generateStaticParams() {
  const seeds = await getBuildSeeds()
  return seeds.map((seed) => ({ slug: seedSlug(seed) }))
}

async function findSeed(slug: string): Promise<Seed | undefined> {
  const seeds = await getBuildSeeds()
  return seeds.find((seed) => seedSlug(seed) === slug)
}

function metaDescription(seed: Seed) {
  const price = seed.is_free ? 'Free' : seed.price ? `£${seed.price}` : 'Price on application'
  const where = seed.location ? ` in ${seed.location}` : ' in the UK'
  const body = seed.description.replace(/\s+/g, ' ').trim()
  const prefix = `${price}${where}. `
  return (prefix + body).slice(0, 155).trim()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const seed = await findSeed(slug)
  if (!seed) return {}

  const variety = seed.variety ? ` (${seed.variety})` : ''
  const where = seed.location ? ` — ${seed.location}` : ''
  const title = `${seed.title}${variety} seeds${where}`
  const description = metaDescription(seed)

  return {
    title,
    description,
    alternates: { canonical: `/view/${slug}/` },
    // Overrides the segment-wide noindex set for the legacy /view route.
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://seedbay.co.uk/view/${slug}/`,
      type: 'article',
      images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
    },
  }
}

export default async function SeedDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const seed = await findSeed(slug)
  if (!seed) notFound()

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: seed.variety ? `${seed.title} (${seed.variety})` : seed.title,
    description: seed.description,
    category: seed.category,
    url: `https://seedbay.co.uk/view/${slug}/`,
    offers: {
      '@type': 'Offer',
      price: seed.is_free ? '0' : seed.price ? seed.price.replace(/[^0-9.]/g, '') || '0' : '0',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      areaServed: seed.location || 'United Kingdom',
      url: `https://seedbay.co.uk/view/${slug}/`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SeedBay', item: 'https://seedbay.co.uk/' },
      { '@type': 'ListItem', position: 2, name: 'Seeds', item: 'https://seedbay.co.uk/seeds/' },
      { '@type': 'ListItem', position: 3, name: seed.title, item: `https://seedbay.co.uk/view/${slug}/` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SeedDetail seed={seed} />
    </>
  )
}
