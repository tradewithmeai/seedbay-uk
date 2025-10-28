import Link from 'next/link';
import { Seed } from '@/types/database';

interface SeedCardProps {
  seed: Seed;
}

export default function SeedCard({ seed }: SeedCardProps) {
  const formattedDate = new Date(seed.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link href={`/view?id=${seed.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {seed.title}
          </h3>
          {seed.price && (
            <span className="text-primary-600 font-bold text-lg ml-2 flex-shrink-0">
              £{seed.price}
            </span>
          )}
        </div>

        {seed.seed_type && (
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded mb-3 w-fit">
            {seed.seed_type}
          </span>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {seed.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center">
            📍 {seed.location || 'Location not specified'}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
