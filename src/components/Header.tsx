'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-primary-700">SeedBay.co.uk</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Browse
            </Link>
            <Link
              href={user ? '/post' : '/login'}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Post Listing
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
