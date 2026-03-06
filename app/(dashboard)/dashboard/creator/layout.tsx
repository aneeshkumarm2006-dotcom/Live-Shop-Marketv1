import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Dashboard',
  description:
    'Manage your live shopping sessions, track followers, and view analytics on LiveShopMarket.',
  robots: { index: false },
};

export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
