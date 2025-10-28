-- Create seeds table
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

-- Enable Row Level Security
ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view seeds" ON seeds FOR SELECT USING (true);
CREATE POLICY "Anyone can insert seeds" ON seeds FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seeds_created_at ON seeds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seeds_seed_type ON seeds(seed_type);
CREATE INDEX IF NOT EXISTS idx_seeds_location ON seeds(location);
