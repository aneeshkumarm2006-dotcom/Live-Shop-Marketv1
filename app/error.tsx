'use client';

import Button from '@/components/ui/Button';

/**
 * Homepage error boundary — catches runtime errors (DB failures, etc.)
 * and shows a friendly fallback instead of crashing the page.
 */
export default function HomeError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-section-heading font-bold text-deep-navy">Something went wrong</h2>
      <p className="max-w-md text-body text-charcoal/70">
        We couldn&apos;t load the homepage right now. Please try again in a moment.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
