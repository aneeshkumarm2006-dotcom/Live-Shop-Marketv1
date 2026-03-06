import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    "Reset your LiveShopMarket password. Enter your email address and we'll send you a link to create a new password.",
  robots: { index: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
