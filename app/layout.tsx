import type { Metadata, Viewport } from 'next';
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
  preload: true,
});

const SITE_NAME = 'LiveShopMarket';
const SITE_DESCRIPTION =
  'Discover and join live shopping streams from your favorite creators across YouTube, Instagram, TikTok, and more.';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liveshopmarket.com';

export const viewport: Viewport = {
  themeColor: '#1A1A2E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Discover Live Shopping Streams`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'live shopping',
    'live stream shopping',
    'creator livestreams',
    'shop live',
    'YouTube live shopping',
    'Instagram live shopping',
    'TikTok live shopping',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} — Discover Live Shopping Streams`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Discover Live Shopping Streams`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Discover Live Shopping Streams`,
    description: SITE_DESCRIPTION,
    images: ['/images/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
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
