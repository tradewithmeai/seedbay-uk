'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSeed } from '@/lib/database'
import { SeedInsert } from '@/types/database'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Vegetable', 'Flower', 'Herb', 'Fruit', 'Tree / Shrub', 'Other']
const CONTACT_METHODS = ['Email', 'WhatsApp', 'Signal', 'Other']
const EXPIRY_OPTIONS = [
  { label: '30 days', value: '30' },
  { label: '60 days', value: '60' },
  { label: '90 days', value: '90' },
  { label: 'No expiry', value: 'never' },
]

const CONTACT_PLACEHOLDER: Record<string, string> = {
  Email: 'you@example.com',
  WhatsApp: 'Your WhatsApp number (inc. country code)',
  Signal: 'Your Signal number',
  Other: 'How should people contact you?',
}

export default function SeedForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFree, setIsFree] = useState(true)
  const [expiry, setExpiry] = useState('30')

  const [formData, setFormData] = useState({
    title: '',
    variety: '',
    category: 'Vegetable',
    quantity: '',
    description: '',
    price: '',
    contact_method: 'Email',
    contact_value: '',
    location: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const expires_at =
        expiry !== 'never'
          ? new Date(Date.now() + Number(expiry) * 86_400_000).toISOString()
          : null

      const seed: SeedInsert = {
        user_id: session?.user.id ?? null,
        title: formData.title,
        variety: formData.variety || null,
        category: formData.category,
        quantity: formData.quantity || null,
        description: formData.description,
        is_free: isFree,
        price: isFree ? null : formData.price || null,
        contact_method: formData.contact_method,
        contact_value: formData.contact_value,
        location: formData.location || null,
        expires_at,
      }

      const created = await createSeed(seed)
      router.push(`/view?id=${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Roma Tomato Seeds"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-1">
            Variety
          </label>
          <input
            id="variety"
            name="variety"
            type="text"
            value={formData.variety}
            onChange={handleChange}
            placeholder="e.g. San Marzano, Brandywine"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 20 seeds, 1 packet, handful"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your seeds — growing conditions, when harvested, any tips..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Pricing</p>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => setIsFree(true)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors border ${
              isFree
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            Free 🎁
          </button>
          <button
            type="button"
            onClick={() => setIsFree(false)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors border ${
              !isFree
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            For Sale £
          </button>
        </div>
        {!isFree && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">£</span>
            <input
              id="price"
              name="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 2.50"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact_method" className="block text-sm font-medium text-gray-700 mb-1">
            Contact via <span className="text-red-500">*</span>
          </label>
          <select
            id="contact_method"
            name="contact_method"
            required
            value={formData.contact_method}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {CONTACT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact_value" className="block text-sm font-medium text-gray-700 mb-1">
            Contact details <span className="text-red-500">*</span>
          </label>
          <input
            id="contact_value"
            name="contact_value"
            type="text"
            required
            value={formData.contact_value}
            onChange={handleChange}
            placeholder={CONTACT_PLACEHOLDER[formData.contact_method]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Bristol, Yorkshire, West Midlands"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
            Listing expires after
          </label>
          <select
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {EXPIRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Posting...' : 'Post Listing'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
