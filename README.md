# SeedBay.uk 🌱

A minimal social marketplace for seed exchange across the UK, built with Next.js and Supabase.

## Features

- **Browse Seeds**: View all seed listings with filtering by title, type, and location
- **Post Listings**: Share your seeds with the community
- **View Details**: See complete information about each seed listing
- **Direct Contact**: Connect with sellers via email
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom green theme
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Krystal Hosting (via GitHub)

## Prerequisites

- Node.js 18+ and npm
- A Supabase account with an existing project
- Git and GitHub account
- GitHub CLI (for repo creation)

## Setup Instructions

### 1. Install Dependencies

```bash
cd seedbay
npm install
```

### 2. Supabase Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL to create the `seeds` table:

```sql
-- Create seeds table
CREATE TABLE seeds (
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
CREATE POLICY "Enable read access for all users" ON seeds
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON seeds
  FOR INSERT WITH CHECK (true);
```

4. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy the **Project URL** and **anon/public key**

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
seedbay/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/              # About page
│   │   ├── post/               # Post new listing page
│   │   ├── view/[id]/          # Individual seed detail page
│   │   ├── layout.tsx          # Root layout with header/footer
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── SeedCard.tsx
│   │   ├── SeedForm.tsx
│   │   └── SeedList.tsx
│   ├── lib/                    # Utilities and helpers
│   │   ├── database.ts         # Database functions
│   │   └── supabase.ts         # Supabase client
│   └── types/                  # TypeScript types
│       └── database.ts         # Database types
├── .env.local.example          # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Database Schema

### `seeds` Table

| Column       | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| title       | TEXT      | Seed listing title (required)  |
| description | TEXT      | Detailed description (required)|
| seed_type   | TEXT      | Type of seed (optional)        |
| price       | TEXT      | Price in GBP (optional)        |
| location    | TEXT      | UK location (optional)         |
| contact     | TEXT      | Contact email (optional)       |
| created_at  | TIMESTAMP | Creation timestamp             |

## Deployment to Krystal Hosting

### Option 1: Via GitHub (Recommended)

1. **Create GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create seedbay-uk --public --source=. --remote=origin
   git push -u origin main
   ```

2. **Configure Krystal**:
   - Log into your Krystal control panel
   - Set up a new application/site
   - Connect your GitHub repository
   - Add environment variables in Krystal settings:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Enable auto-deploy from the `main` branch

3. **Custom Domain**:
   - Point `seedbay.uk` DNS to Krystal
   - Configure SSL certificate in Krystal

### Option 2: Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to Krystal**:
   - Upload the `.next`, `public`, and necessary config files
   - Set environment variables in Krystal control panel
   - Configure the Node.js runtime

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- [ ] User authentication
- [ ] Payment integration
- [ ] Image uploads for seed listings
- [ ] Advanced search and filtering
- [ ] User profiles and reviews
- [ ] Messaging system
- [ ] Mobile app

## Contributing

This is a minimal MVP. Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

---

Built for the UK gardening community 🇬🇧🌱
