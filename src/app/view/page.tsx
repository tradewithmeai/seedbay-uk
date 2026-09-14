'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getSeedById } from '@/lib/database'
import { seedSlug } from '@/lib/slug'

// Legacy route. Listings used to live at /view?id=<uuid> and were rendered
// client-side; they now have pre-rendered pages at /view/<slug>/. Old links,
// bookmarks and any backlinks still land here, so this forwards them to the
// canonical URL rather than 404ing. Marked noindex in view/layout.tsx — the
// slug page is the one Google should hold.
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

function ViewRedirect() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!id) {
      setFailed(true)
      return
    }

    let cancelled = false
    getSeedById(id)
      .then((seed) => {
        if (cancelled) return
        if (seed) router.replace(`/view/${seedSlug(seed)}/`)
        else setFailed(true)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [id, router])

  if (!failed) return <Skeleton />

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

export default function LegacyViewPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ViewRedirect />
    </Suspense>
  )
}
