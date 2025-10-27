'use client';

import { useState, useEffect } from 'react';
import SeedCard from './SeedCard';
import { searchSeeds } from '@/lib/database';
import { Seed } from '@/types/database';

export default function SeedList() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    seed_type: '',
    location: '',
  });

  useEffect(() => {
    loadSeeds();
  }, []);

  async function loadSeeds() {
    setLoading(true);
    const data = await searchSeeds(filters);
    setSeeds(data);
    setLoading(false);
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadSeeds();
  }

  function handleClearFilters() {
    setFilters({ title: '', seed_type: '', location: '' });
    setTimeout(() => loadSeeds(), 0);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Seeds</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Search Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Tomato, Carrot..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="seed_type" className="block text-sm font-medium text-gray-700 mb-1">
              Seed Type
            </label>
            <input
              id="seed_type"
              type="text"
              placeholder="e.g. Vegetable, Flower..."
              value={filters.seed_type}
              onChange={(e) => handleFilterChange('seed_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. London, Manchester..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading seeds...</p>
        </div>
      ) : seeds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="text-6xl mb-4 block">🌱</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No seeds found</h3>
          <p className="text-gray-600">Try adjusting your filters or be the first to post a listing!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{seeds.length}</span> seed{seeds.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seeds.map((seed) => (
              <SeedCard key={seed.id} seed={seed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
