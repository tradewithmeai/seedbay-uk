# Supabase Setup Guide for SeedBay.uk

## Overview

This guide will help you set up the Supabase database for SeedBay.uk using one of your existing Supabase projects.

## Step-by-Step Instructions

### 1. Choose Your Supabase Project

1. Log in to [Supabase](https://app.supabase.com/)
2. Select one of your existing projects to use for SeedBay.uk

### 2. Create the Seeds Table

1. In your Supabase project, navigate to the **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Create the seeds table
CREATE TABLE IF NOT EXISTS seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  seed_type TEXT,
  price TEXT,
  location TEXT,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments to document the schema
COMMENT ON TABLE seeds IS 'Seed listings posted by users';
COMMENT ON COLUMN seeds.id IS 'Unique identifier for each seed listing';
COMMENT ON COLUMN seeds.title IS 'Title/name of the seed listing';
COMMENT ON COLUMN seeds.description IS 'Detailed description of the seeds';
COMMENT ON COLUMN seeds.seed_type IS 'Category/type of seed (e.g., Vegetable, Flower, Herb)';
COMMENT ON COLUMN seeds.price IS 'Price in GBP or "Free"';
COMMENT ON COLUMN seeds.location IS 'UK location of the seller';
COMMENT ON COLUMN seeds.contact IS 'Contact email address';
COMMENT ON COLUMN seeds.created_at IS 'Timestamp when listing was created';

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_seeds_created_at ON seeds(created_at DESC);

-- Create indexes for search functionality
CREATE INDEX IF NOT EXISTS idx_seeds_title ON seeds USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_seeds_seed_type ON seeds(seed_type);
CREATE INDEX IF NOT EXISTS idx_seeds_location ON seeds(location);
```

4. Click **Run** to execute the query

### 3. Set Up Row Level Security (RLS)

Run this SQL to enable public access for reading and creating listings:

```sql
-- Enable Row Level Security
ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to view all seed listings
CREATE POLICY "Anyone can view seeds"
  ON seeds
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to create new seed listings
CREATE POLICY "Anyone can insert seeds"
  ON seeds
  FOR INSERT
  WITH CHECK (true);

-- Optional: Policy to allow users to update their own listings (for future use)
-- Uncomment when authentication is implemented
-- CREATE POLICY "Users can update own seeds"
--   ON seeds
--   FOR UPDATE
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Optional: Policy to allow users to delete their own listings (for future use)
-- Uncomment when authentication is implemented
-- CREATE POLICY "Users can delete own seeds"
--   ON seeds
--   FOR DELETE
--   USING (auth.uid() = user_id);
```

### 4. Get Your API Credentials

1. Navigate to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string starting with `eyJ...`)
3. Add these to your `.env.local` file in the project root

### 5. Test the Connection

Once you've added the credentials to `.env.local`, you can test the connection by running:

```bash
npm run dev
```

Then visit `http://localhost:3000` and try creating a test listing.

## Optional: Add Sample Data

If you want to test with sample data, run this SQL:

```sql
INSERT INTO seeds (title, description, seed_type, price, location, contact) VALUES
  (
    'Heritage Tomato Seeds - Brandywine',
    'Beautiful heirloom tomato variety with large, pink fruits. Excellent flavor and perfect for slicing. These seeds were saved from my garden last season. Produces indeterminate vines that need support.',
    'Vegetable',
    'Free',
    'Brighton, East Sussex',
    'gardener@example.com'
  ),
  (
    'Purple Sprouting Broccoli',
    'Cold-hardy variety that produces delicious purple florets in early spring. Easy to grow and very productive. Packet of approximately 50 seeds.',
    'Vegetable',
    '2.50',
    'Bristol',
    'seeds@example.com'
  ),
  (
    'Wildflower Mix - Meadow Blend',
    'Native UK wildflower seed mix containing cornflower, poppy, oxeye daisy, and more. Perfect for creating a wildlife-friendly garden area. Covers approximately 5 square meters.',
    'Flower',
    '5.00',
    'Manchester',
    'wildflowers@example.com'
  ),
  (
    'Sweet Basil Seeds',
    'Classic Italian basil for cooking. Fast-growing and aromatic. Great for pesto, salads, and Mediterranean dishes. Approximately 100 seeds per packet.',
    'Herb',
    '1.50',
    'London',
    'herbs@example.com'
  );
```

## Troubleshooting

### Issue: "relation 'seeds' does not exist"
- Make sure you ran the CREATE TABLE query successfully
- Check that you're connected to the correct Supabase project

### Issue: "permission denied for table seeds"
- Ensure Row Level Security policies were created
- Verify that the policies allow public SELECT and INSERT

### Issue: "Invalid API key"
- Double-check your `.env.local` file
- Make sure you copied the **anon public** key, not the service role key
- Restart your dev server after changing environment variables

### Issue: No data appearing in the app
- Check the browser console for errors
- Verify the Supabase URL and key are correct
- Test the connection directly in Supabase dashboard

## Security Notes

For this MVP:
- ✅ Public read access is enabled (anyone can view listings)
- ✅ Public insert access is enabled (anyone can post listings)
- ❌ No authentication is required
- ❌ No update/delete functionality

**For production**, consider:
- Implementing user authentication
- Adding user_id column to track listing owners
- Restricting updates/deletes to listing owners only
- Adding content moderation
- Implementing rate limiting

## Next Steps

After setup is complete:
1. Test creating a listing via the `/post` page
2. Verify listings appear on the home page
3. Test the filter functionality
4. Check that individual listing pages work
5. Commit your changes and deploy to Krystal

---

Need help? Check the main README or [Supabase documentation](https://supabase.com/docs).
