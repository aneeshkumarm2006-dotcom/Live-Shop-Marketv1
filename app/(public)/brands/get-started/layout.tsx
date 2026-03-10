import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started — Brands | LiveShopMarket',
  description:
    'Apply to join LiveShopMarket as a brand partner. Fill out the form and start selling to thousands of live shopping enthusiasts.',
  openGraph: {
    title: 'Brands — Get Started | LiveShopMarket',
    description:
      'Join our live shopping marketplace. We handle marketing and promotion so you can focus on presenting your products.',
  },
};

export default function BrandsGetStartedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
