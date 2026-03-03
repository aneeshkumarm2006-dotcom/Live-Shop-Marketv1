'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';

/**
 * Dashboard Index — redirects to role-specific dashboard.
 *
 * /dashboard → /dashboard/creator  (if creator)
 * /dashboard → /dashboard/buyer    (if buyer or default)
 * /dashboard → /login              (if unauthenticated)
 */
export default function DashboardIndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.replace('/login');
      return;
    }

    const role = (session.user as { role?: string })?.role;
    if (role === 'creator') {
      router.replace('/dashboard/creator');
    } else {
      router.replace('/dashboard/buyer');
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" label="Redirecting to dashboard…" />
    </div>
  );
}
