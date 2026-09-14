import Link from 'next/link'
import SeedCard from './SeedCard'
import type { Seed } from '@/types/database'

// Static grid for the pre-rendered landing pages. The home page keeps using the
// interactive client-side SeedList; these pages need their listings in the HTML.
export default function SeedGrid({ seeds, emptyMessage }: { seeds: Seed[]; emptyMessage: string }) {
  if (seeds.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
        <p className="text-3xl mb-3">🌱</p>
        <p className="text-gray-600 mb-5">{emptyMessage}</p>
        <Link
          href="/post/"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          Post the first listing
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seeds.map((seed) => (
        <SeedCard key={seed.id} seed={seed} />
      ))}
    </div>
  )
}
