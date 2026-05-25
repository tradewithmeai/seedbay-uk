import Link from 'next/link'
import { Seed } from '@/types/database'

const CATEGORY_COLORS: Record<string, string> = {
  'Vegetable': 'bg-green-100 text-green-700',
  'Flower': 'bg-pink-100 text-pink-700',
  'Herb': 'bg-emerald-100 text-emerald-700',
  'Fruit': 'bg-orange-100 text-orange-700',
  'Tree / Shrub': 'bg-amber-100 text-amber-700',
  'Other': 'bg-gray-100 text-gray-600',
}

interface SeedCardProps {
  seed: Seed
}

export default function SeedCard({ seed }: SeedCardProps) {
  const formattedDate = new Date(seed.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const categoryColor = CATEGORY_COLORS[seed.category] ?? 'bg-gray-100 text-gray-600'

  return (
    <Link href={`/view?id=${seed.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-grow min-w-0 mr-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {seed.title}
            </h3>
            {seed.variety && (
              <p className="text-sm text-gray-400 italic">{seed.variety}</p>
            )}
          </div>
          <span className={`flex-shrink-0 text-sm font-bold px-2 py-1 rounded ${
            seed.is_free ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
          }`}>
            {seed.is_free ? 'Free' : seed.price ? `£${seed.price}` : 'POA'}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${categoryColor}`}>
            {seed.category}
          </span>
          {seed.quantity && (
            <span className="text-xs text-gray-400">{seed.quantity}</span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {seed.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>📍 {seed.location || 'Nationwide'}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
