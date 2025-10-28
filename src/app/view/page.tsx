'use client';

import { useState, useEffect, Suspense } from 'react';
import { getSeedById } from '@/lib/database';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Seed } from '@/types/database';

function SeedDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [seed, setSeed] = useState<Seed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    async function loadSeed() {
      try {
        const data = await getSeedById(id);
        if (data) {
          setSeed(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading seed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadSeed();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seed) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seed Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the seed you're looking for.</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse All Seeds
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(seed.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium"
      >
        ← Back to all seeds
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{seed.title}</h1>
              {seed.seed_type && (
                <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded">
                  {seed.seed_type}
                </span>
              )}
            </div>
            {seed.price && (
              <div className="text-right ml-6">
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-3xl font-bold text-primary-600">£{seed.price}</p>
              </div>
            )}
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
                <p className="text-gray-700 flex items-center">
                  <span className="mr-2">📍</span>
                  {seed.location || 'Location not specified'}
                </p>
              </div>

              {seed.contact && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact Seller</h3>
                  <a
                    href={`mailto:${seed.contact}`}
                    className="text-primary-600 hover:text-primary-700 underline flex items-center"
                  >
                    <span className="mr-2">✉️</span>
                    {seed.contact}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Posted on {formattedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {seed.contact && (
              <a
                href={`mailto:${seed.contact}?subject=Interested in: ${seed.title}`}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Contact Seller
              </a>
            )}
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Browse More Seeds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeedDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SeedDetailContent />
    </Suspense>
  );
}
