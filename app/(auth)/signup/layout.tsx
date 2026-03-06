import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create a free LiveShopMarket account to discover live shopping streams, follow your favorite creators, and get notified when they go live.',
  openGraph: {
    title: 'Sign Up | LiveShopMarket',
    description:
      'Create a free account to discover live shopping streams and follow your favorite creators.',
    images: [
      { url: '/images/og-default.png', width: 1200, height: 630, alt: 'Join LiveShopMarket' },
    ],
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
