import Link from 'next/link'
import type { Seed } from '@/types/database'
import { CATEGORY_COLORS } from '@/lib/categories'
import { categorySlug, locationSlug } from '@/lib/slug'

function ContactDisplay({ method, value, title }: { method: string; value: string; title: string }) {
  if (method === 'Email') {
    return (
      <a
        href={`mailto:${value}?subject=Interested in: ${encodeURIComponent(title)}`}
        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        ✉️ Email seller
      </a>
    )
  }
  if (method === 'WhatsApp') {
    const cleaned = value.replace(/\D/g, '')
    return (
      <a
        href={`https://wa.me/${cleaned}?text=${encodeURIComponent(`Hi, I'm interested in your listing: ${title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        💬 WhatsApp seller
      </a>
    )
  }
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">Contact via {method}:</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Pure render — no hooks, no state. Kept server-renderable on purpose so the
// listing body is in the HTML Google receives, not fetched after hydration.
export default function SeedDetail({ seed }: { seed: Seed }) {
  const categoryColor = CATEGORY_COLORS[seed.category] ?? 'bg-gray-100 text-gray-600'
  const locSlug = seed.location ? locationSlug(seed.location) : ''

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium">
        ← Back to listings
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{seed.title}</h1>
              {seed.variety && <p className="text-gray-500 italic mb-2">{seed.variety}</p>}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/seeds/${categorySlug(seed.category)}/`}
                  className={`text-sm font-medium px-3 py-1 rounded hover:underline ${categoryColor}`}
                >
                  {seed.category}
                </Link>
                {seed.quantity && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">{seed.quantity}</span>
                )}
              </div>
            </div>
            <div className="ml-6 flex-shrink-0">
              <span
                className={`text-xl font-bold px-4 py-2 rounded-lg ${
                  seed.is_free ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                }`}
              >
                {seed.is_free ? 'Free 🎁' : seed.price ? `£${seed.price}` : 'POA'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{seed.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-700 flex items-center gap-2">
                  <span>📍</span>
                  {locSlug ? (
                    <Link href={`/seeds/in/${locSlug}/`} className="text-primary-700 hover:underline">
                      {seed.location}
                    </Link>
                  ) : (
                    'Nationwide / not specified'
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact seller</h3>
                <ContactDisplay method={seed.contact_method} value={seed.contact_value} title={seed.title} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-400">Posted {formatDate(seed.created_at)}</p>
              {seed.expires_at && (
                <p className="text-sm text-gray-400">Expires {formatDate(seed.expires_at)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Browse More Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
