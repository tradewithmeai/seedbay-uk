'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSeedById } from '@/lib/database'
import { seedSlug } from '@/lib/slug'
import SeedDetail from '@/components/SeedDetail'
import type { Seed } from '@/types/database'

/*
 * Legacy / live route: /view/?id=<uuid>
 *
 * Listings have pre-rendered pages at /view/<slug>/, but those only exist after
 * the next build, so this route renders the listing live from the API instead of
 * forwarding to a page that may not be there yet. It serves two jobs:
 *
 *   - old links and backlinks from when this was the only listing URL
 *   - the moment just after someone posts, before the nightly build runs
 *
 * Marked noindex in view/layout.tsx, with a canonical pointing at the slug page,
 * so Google only ever holds the pre-rendered one.
 */

const Skeleton = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
)

function LiveSeedDetail() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  const [seed, setSeed] = useState<Seed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false
    getSeedById(id)
      .then((found) => {
        if (!cancelled) setSeed(found)
      })
      .catch(() => {
        if (!cancelled) setSeed(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <Skeleton />

  if (!seed) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">This listing may have expired or been removed.</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse All Listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <link rel="canonical" href={`https://seedbay.co.uk/view/${seedSlug(seed)}/`} />
      <SeedDetail seed={seed} />
    </>
  )
}

export default function LegacyViewPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LiveSeedDetail />
    </Suspense>
  )
}
