export const metadata = {
  title: 'About - SeedBay.uk',
  description: 'Learn about SeedBay.uk, the UK community seed exchange marketplace.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About <span className="text-primary-600">SeedBay.uk</span>
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-xl leading-relaxed">
            Welcome to SeedBay.uk, a community-driven marketplace connecting seed enthusiasts
            and gardeners across the United Kingdom.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p>
            We believe in the power of sharing and community. SeedBay.uk provides a simple,
            accessible platform where gardeners can exchange seeds, share growing knowledge,
            and help preserve biodiversity through local seed networks.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-3xl mr-4">🌱</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Browse Seeds</h3>
                <p>
                  Explore listings from gardeners across the UK. Filter by seed type,
                  location, or search for specific varieties.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">📝</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Post Listings</h3>
                <p>
                  Have seeds to share? Create a listing with details about your seeds,
                  pricing (or offer them free), and your contact information.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4">🤝</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Connect Directly</h3>
                <p>
                  Contact sellers directly via email to arrange collection or delivery.
                  Build connections with local gardening enthusiasts.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Community First</h2>
          <p>
            SeedBay.uk is designed to be simple, accessible, and focused on community.
            We don&apos;t handle payments or complex logistics - just genuine connections
            between people who love growing things.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Get Started</h2>
          <p>
            Ready to join our community? Browse available seeds or post your first listing today.
            Together, we can grow a more sustainable and connected gardening community across the UK.
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="/"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Browse Seeds
            </a>
            <a
              href="/post"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Post Listing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
