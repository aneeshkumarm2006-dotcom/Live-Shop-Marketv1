'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * React Query Provider — wraps the app with a QueryClient.
 *
 * Configuration:
 *  - staleTime 60s: data considered fresh for 1 minute
 *  - gcTime 5min: unused data kept in cache for 5 minutes
 *  - 1 retry on failure (exponential back-off)
 *  - refetchOnWindowFocus enabled for freshness
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
