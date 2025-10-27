import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-primary-700">SeedBay.uk</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Browse Seeds
            </Link>
            <Link
              href="/post"
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
          </div>
        </div>
      </nav>
    </header>
  );
}
