import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | LiveShopMarket',
  description:
    "Get in touch with the LiveShopMarket team. We're here to help with any questions about our live shopping platform.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
