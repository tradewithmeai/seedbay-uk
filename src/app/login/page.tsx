'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { requestSignInLink } from '@/lib/database'
import { useAuth } from '@/context/AuthContext'

// verify.php sends people back here with ?error=... when a link cannot be used.
const LINK_ERRORS: Record<string, string> = {
  invalid: 'That sign-in link was not valid. Request a fresh one below.',
  expired: 'That link has already been used or has expired. Request a fresh one below.',
  server: 'Something went wrong signing you in. Try again in a moment.',
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const linkError = LINK_ERRORS[searchParams.get('error') ?? '']

  useEffect(() => {
    if (user) router.push('/post/')
  }, [user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await requestSignInLink(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the link. Try again.')
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600">
            We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-4xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to post a listing</h1>
        <p className="text-gray-600 mb-6">
          Enter your email and we&apos;ll send you a magic link — no password needed.
        </p>

        {linkError && !error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 mb-4 text-sm">
            {linkError}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Browsing is always free and open — sign in only needed to post.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
