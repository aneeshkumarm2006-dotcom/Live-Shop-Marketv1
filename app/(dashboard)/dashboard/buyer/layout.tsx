import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buyer Dashboard',
  description:
    'Track your favorite creators and upcoming live shopping sessions on LiveShopMarket.',
  robots: { index: false },
};

export default function BuyerDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
