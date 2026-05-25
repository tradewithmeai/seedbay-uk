# Supabase Setup Guide for SeedBay.co.uk

## Overview

This guide covers setting up the Supabase database and auth for SeedBay.co.uk.

---

## Step 1 — Choose Your Supabase Project

1. Log in to [Supabase](https://app.supabase.com/)
2. Select an existing project or create a new one

---

## Step 2 — Create the Seeds Table

In the **SQL Editor**, run:

```sql
CREATE TABLE IF NOT EXISTS seeds (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  title           TEXT        NOT NULL,
  variety         TEXT,
  category        TEXT        NOT NULL DEFAULT 'Other',
  quantity        TEXT,
  description     TEXT        NOT NULL,
  is_free         BOOLEAN     NOT NULL DEFAULT TRUE,
  price           TEXT,
  contact_method  TEXT        NOT NULL DEFAULT 'Email',
  contact_value   TEXT        NOT NULL,
  location        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  active          BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_seeds_created_at  ON seeds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seeds_category    ON seeds(category);
CREATE INDEX IF NOT EXISTS idx_seeds_is_free     ON seeds(is_free);
CREATE INDEX IF NOT EXISTS idx_seeds_active      ON seeds(active);
```

---

## Step 3 — Enable Row Level Security

```sql
ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;

-- Anyone can browse active listings
CREATE POLICY "Public read"
  ON seeds FOR SELECT
  USING (active = TRUE);

-- Authenticated users can post listings
CREATE POLICY "Auth users can insert"
  ON seeds FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update/delete their own listings
CREATE POLICY "Users manage own listings"
  ON seeds FOR ALL
  USING (auth.uid() = user_id);
```

---

## Step 4 — Configure Auth (Magic Link)

1. In your Supabase project go to **Authentication → Providers**
2. Ensure **Email** provider is enabled
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to `https://seedbay.co.uk`
5. Add to **Redirect URLs**:
   - `https://seedbay.co.uk/post`
   - `http://localhost:3000/post` (for local dev)

That's it — magic link (passwordless) email auth is on by default.

---

## Step 5 — Get Your API Credentials

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
3. Add to `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. Add the same two values as **GitHub Secrets** in your repo (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 6 — Test Locally

```bash
npm run dev
```

- Browse listings at `http://localhost:3000`
- Sign in at `http://localhost:3000/login` (magic link email)
- Post a listing at `http://localhost:3000/post`

---

## Optional — Sample Data

```sql
INSERT INTO seeds (title, variety, category, quantity, description, is_free, contact_method, contact_value, location)
VALUES
  (
    'Heritage Tomato Seeds', 'Brandywine',
    'Vegetable', '~30 seeds',
    'Saved from my garden last season. Large pink fruits with excellent flavour. Indeterminate — needs support.',
    TRUE, 'Email', 'gardener@example.com', 'Brighton, East Sussex'
  ),
  (
    'Purple Sprouting Broccoli', NULL,
    'Vegetable', '1 packet (~50 seeds)',
    'Cold-hardy variety producing purple florets in early spring. Very productive.',
    FALSE, 'Email', 'seeds@example.com', 'Bristol'
  ),
  (
    'Wildflower Meadow Mix', NULL,
    'Flower', 'Covers ~5m²',
    'Native UK mix: cornflower, poppy, oxeye daisy and more. Great for wildlife.',
    FALSE, 'WhatsApp', '447700900000', 'Manchester'
  );
```

---

## Troubleshooting

| Error | Fix |
|---|---|
| `relation 'seeds' does not exist` | Re-run the CREATE TABLE query |
| `permission denied for table seeds` | Check RLS policies are created |
| `Invalid API key` | Check `.env.local` — use the **anon** key, not service role |
| Magic link not working | Check redirect URLs in Supabase Auth settings |
| Auth state not persisting | Supabase stores session in localStorage — works on static sites |
