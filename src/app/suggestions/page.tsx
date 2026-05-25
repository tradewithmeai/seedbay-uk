'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type FeedbackType = 'positive' | 'constructive'

export default function SuggestionsPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('constructive')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('suggestions').insert({
      name: name.trim() || null,
      feedback_type: feedbackType,
      message: message.trim(),
    })

    if (error) {
      setError('Something went wrong — please try again.')
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <div className="text-5xl mb-4">🌻</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h1>
          <p className="text-gray-600">Your feedback helps shape SeedBay. We read every message.</p>
          <a href="/" className="inline-block mt-6 text-primary-600 hover:underline font-medium">
            Back to listings →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Share your thoughts</h1>
        <p className="text-gray-600 mb-6">
          SeedBay is a new community site shaped by the people who use it.
          What&apos;s working well? What would make it better? All views welcome — every message is read.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Type of feedback</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFeedbackType('positive')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                  feedbackType === 'positive'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                👍 What&apos;s working well
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('constructive')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                  feedbackType === 'constructive'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                💡 What could be better
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Your feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name, or leave blank"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Sending...' : 'Send feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}
