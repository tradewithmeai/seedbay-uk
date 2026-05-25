'use client'

import { useState, useEffect } from 'react'
import SeedCard from './SeedCard'
import { searchSeeds } from '@/lib/database'
import { Seed } from '@/types/database'

const CATEGORIES = ['All', 'Vegetable', 'Flower', 'Herb', 'Fruit', 'Tree / Shrub', 'Other']

type Filters = {
  title: string
  category: string
  location: string
  is_free: boolean
}

export default function SeedList() {
  const [seeds, setSeeds] = useState<Seed[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    title: '',
    category: '',
    location: '',
    is_free: false,
  })

  useEffect(() => {
    runSearch(filters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(f: Filters) {
    setLoading(true)
    const data = await searchSeeds({
      title: f.title || undefined,
      category: f.category || undefined,
      location: f.location || undefined,
      is_free: f.is_free || undefined,
    })
    setSeeds(data)
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    runSearch(filters)
  }

  function handleClear() {
    const cleared: Filters = { title: '', category: '', location: '', is_free: false }
    setFilters(cleared)
    runSearch(cleared)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Title or variety..."
              value={filters.title}
              onChange={(e) => setFilters((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category === '' ? 'All' : filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value === 'All' ? '' : e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Bristol..."
              value={filters.location}
              onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.is_free}
                onChange={(e) => setFilters((p) => ({ ...p, is_free: e.target.checked }))}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Free only</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      ) : seeds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="text-6xl mb-4 block">🌱</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters or be the first to post a listing!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{seeds.length}</span> listing{seeds.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seeds.map((seed) => (
              <SeedCard key={seed.id} seed={seed} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
