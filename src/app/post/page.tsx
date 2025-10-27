import SeedForm from '@/components/SeedForm';

export const metadata = {
  title: 'Post a Listing - SeedBay.uk',
  description: 'Share your seeds with the community. Post a new listing on SeedBay.uk.',
};

export default function PostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Seed Listing</h1>
        <p className="text-gray-600">
          Share your seeds with the community. Fill in the details below to create your listing.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <SeedForm />
      </div>
    </div>
  );
}
