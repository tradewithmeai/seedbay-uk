import type { Metadata } from 'next'
import SeedList from '@/components/SeedList'

export const metadata: Metadata = {
  title: 'UK Seed Exchange — Buy, Swap & Give Away Seeds | SeedBay',
  description: 'Browse seeds for sale or free from gardeners across the UK. Post your own listings in minutes — contact sellers directly, no fees, no middleman.',
  openGraph: {
    title: 'UK Seed Exchange — Buy, Swap & Give Away Seeds | SeedBay',
    description: 'Browse seeds for sale or free from gardeners across the UK. Contact sellers directly — no fees, no middleman.',
    url: 'https://seedbay.co.uk',
  },
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UK Seed Exchange — <span className="text-primary-600">Buy, Swap & Give Away Seeds</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse seeds for sale or free from gardeners across the UK.
          Contact sellers directly — no fees, no middleman.
        </p>
      </div>

      <SeedList />
    </div>
  )
}
