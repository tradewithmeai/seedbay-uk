export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary-700 mb-2">SeedBay.uk</h3>
            <p className="text-gray-600 text-sm">
              A community marketplace for seed exchange across the UK.
              Share, discover, and trade seeds locally.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600">
                  Browse Seeds
                </a>
              </li>
              <li>
                <a href="/post" className="text-gray-600 hover:text-primary-600">
                  Post Listing
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary-600">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
            <p className="text-gray-600 text-sm">
              Connect with fellow gardeners and seed enthusiasts.
              Build a sustainable, sharing community.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SeedBay.uk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
