import SeedList from '@/components/SeedList';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">SeedBay.uk</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and share seeds with fellow gardeners across the UK.
          Browse local listings or post your own seeds for exchange.
        </p>
      </div>

      <SeedList />
    </div>
  );
}
