import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'SeedBay.co.uk - Community Seed Exchange',
  description: 'Buy, sell or give away seeds across the UK. Connect directly with fellow gardeners — no middleman.',
  keywords: ['seeds', 'gardening', 'uk', 'seed exchange', 'community', 'seedbay'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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
