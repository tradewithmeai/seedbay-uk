import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://seedbay.co.uk'),
  title: {
    default: 'UK Seed Exchange — Buy, Swap & Give Away Seeds | SeedBay',
    template: '%s | SeedBay.co.uk',
  },
  description: 'Browse seeds for sale or free from gardeners across the UK. Post your own listings in minutes — contact sellers directly, no fees, no middleman.',
  keywords: ['seeds for sale UK', 'free seeds UK', 'seed swap UK', 'UK seed exchange', 'buy seeds online UK', 'gardening UK'],
  openGraph: {
    siteName: 'SeedBay.co.uk',
    locale: 'en_GB',
    type: 'website',
    url: 'https://seedbay.co.uk',
    title: 'UK Seed Exchange — Buy, Swap & Give Away Seeds | SeedBay',
    description: 'Browse seeds for sale or free from gardeners across the UK. Contact sellers directly — no fees, no middleman.',
    images: [{ url: 'https://seedbay.co.uk/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://seedbay.co.uk/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SeedBay',
  url: 'https://seedbay.co.uk',
  description: 'UK community seed exchange board — buy, swap and give away seeds directly with fellow gardeners.',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SeedBay',
  url: 'https://seedbay.co.uk',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://seedbay.co.uk/?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="bg-primary-50 border-b border-primary-100 py-1.5 px-4 text-center text-xs text-primary-700">
          SeedBay — nothing to do with the big auction site. Just seeds, gardeners, and no fees. 🌱
        </div>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
