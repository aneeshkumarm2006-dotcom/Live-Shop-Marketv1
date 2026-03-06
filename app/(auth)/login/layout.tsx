import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In',
  description:
    'Sign in to your LiveShopMarket account to track your favorite creators and never miss a live shopping stream.',
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
