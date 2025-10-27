import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SeedBay.uk - Community Seed Exchange Marketplace',
  description: 'Discover, share, and trade seeds across the UK. Join our community of gardeners and seed enthusiasts.',
  keywords: ['seeds', 'gardening', 'uk', 'marketplace', 'seed exchange', 'community'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
