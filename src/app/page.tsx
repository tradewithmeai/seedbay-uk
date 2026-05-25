import type { Metadata } from 'next'
import SeedList from '@/components/SeedList'

export const metadata: Metadata = {
  title: 'UK Seed Exchange — Buy, Swap & Give Away Seeds | SeedBay',
  description: 'Browse seeds for sale or free from gardeners across the UK. Contact sellers directly — no fees, no middleman. Post your own listing in minutes.',
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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
          Browse seeds for sale or free from gardeners across the UK.
          Contact sellers directly — no fees, no middleman.
        </p>
        <h2 className="text-base text-gray-400 max-w-2xl mx-auto">
          Vegetable seeds, flower seeds, herb seeds &amp; more — listed by UK gardeners near you
        </h2>
      </div>

      <SeedList />

      <div className="mt-16 bg-primary-50 rounded-xl border border-primary-100 p-8 text-center">
        <p className="text-2xl mb-2">🌱</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Built by the community, for the community</h2>
        <p className="text-gray-600 mb-5 max-w-lg mx-auto">
          SeedBay is a new site shaped by the people who use it. If you have ideas,
          spotted something that could be better, or just want to say what&apos;s working — we&apos;d love to hear from you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/about" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg font-medium transition-colors text-sm">
            About SeedBay
          </a>
          <a href="/suggestions" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
            Share your thoughts
          </a>
        </div>
      </div>
    </div>
  )
}
