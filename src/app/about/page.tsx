import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About SeedBay — UK Community Seed Exchange',
  description: 'SeedBay.co.uk connects UK gardeners to buy, swap and give away seeds. No fees, no middleman — post a listing in minutes and deal directly.',
  openGraph: {
    title: 'About SeedBay — UK Community Seed Exchange',
    description: 'SeedBay.co.uk connects UK gardeners to buy, swap and give away seeds. No fees, no middleman — post a listing in minutes and deal directly.',
    url: 'https://seedbay.co.uk/about/',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About <span className="text-primary-600">SeedBay.co.uk</span>
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-xl leading-relaxed">
            SeedBay.co.uk is a free UK seed exchange board — connecting gardeners who want to
            buy, swap, or give away seeds without any fees or middleman.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p>
            We keep it simple. Post seeds you have, find seeds you want, and deal directly
            with each other. No payment processing, no escrow, no commission — just genuine
            connections between people who love growing things.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-3xl mr-4">🌱</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Browse Listings</h3>
                <p>
                  Anyone can browse — no account needed. Filter by category, location,
                  or search for a specific variety.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">📝</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Post a Listing</h3>
                <p>
                  Sign in with your email (magic link — no password) and post your seeds
                  in under a minute. Free or for sale, any category, any quantity.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">🤝</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Connect Directly</h3>
                <p>
                  Contact sellers via email, WhatsApp, or whatever method they prefer.
                  Arrange payment and delivery between yourselves.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Community Site</h2>
          <p>
            SeedBay is new and shaped by the people who use it. There&apos;s no corporate agenda — just
            a simple tool for UK gardeners to connect. If something isn&apos;t working, if you&apos;d like a
            feature, or if you just want to say what you enjoy about it, your feedback goes directly
            to the person who built it.
          </p>

          <div className="bg-primary-50 rounded-lg border border-primary-100 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-1">Have a suggestion?</h3>
            <p className="text-gray-600 text-sm mb-3">
              We welcome both positive feedback and constructive criticism. What&apos;s working well?
              What would you change? Every message is read.
            </p>
            <a
              href="/suggestions"
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-colors inline-block text-sm"
            >
              Share your thoughts
            </a>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Get Started</h2>
          <p>
            Browse what&apos;s available or post your first listing today — it takes under a minute.
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Browse Seeds
            </a>
            <a
              href="/post"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Post a Listing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
