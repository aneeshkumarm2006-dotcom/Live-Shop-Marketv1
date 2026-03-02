import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LiveShopMarket — Discover Live Shopping Streams',
  description:
    'Discover and join live shopping streams from your favorite creators across YouTube, Instagram, TikTok, and more.',
  openGraph: {
    title: 'LiveShopMarket — Discover Live Shopping Streams',
    description:
      'Discover and join live shopping streams from your favorite creators across YouTube, Instagram, TikTok, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LiveShopMarket',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <Header />
            <main className="min-h-screen pt-[72px]">{children}</main>
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
