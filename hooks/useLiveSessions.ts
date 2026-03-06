import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { type PaginatedApiResponse } from '@/lib/api-client';
import { sessionKeys } from './useSessions';
import type { Platform, SessionStatus } from '@/types';

// ─── Constants ──────────────────────────────────────────────────────────────

/** Default polling interval for live session status (30 seconds). */
export const LIVE_POLL_INTERVAL = 30_000;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LiveSessionSummary {
  _id: string;
  title: string;
  status: SessionStatus;
  platform: Platform;
  externalUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: string;
  startedAt?: string;
  creatorId?: {
    _id: string;
    displayName: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  categoryId?: {
    _id: string;
    name: string;
    slug: string;
    gradient?: string;
  };
}

export interface LiveSessionsOptions {
  /** Enable or disable polling (default: true). */
  enabled?: boolean;
  /** Polling interval in ms (default: 30 000). */
  pollInterval?: number;
  /** Max number of sessions to fetch (default: 20). */
  limit?: number;
  /** Include scheduled sessions alongside live (default: true). */
  includeScheduled?: boolean;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const liveSessionKeys = {
  all: ['live-sessions'] as const,
  live: () => [...liveSessionKeys.all, 'live'] as const,
  liveAndScheduled: () => [...liveSessionKeys.all, 'live-scheduled'] as const,
  latestLive: () => [...liveSessionKeys.all, 'latest-live'] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Poll for currently live (and optionally scheduled) sessions.
 *
 * Uses React Query's `refetchInterval` to poll every 30 s (configurable).
 * On every successful poll the broader `sessions` cache is also
 * invalidated so other views stay in sync.
 *
 * @example
 * const { data, isLoading } = useLiveSessions();
 * const { data } = useLiveSessions({ pollInterval: 15_000, includeScheduled: false });
 */
export function useLiveSessions(options: LiveSessionsOptions = {}) {
  const {
    enabled = true,
    pollInterval = LIVE_POLL_INTERVAL,
    limit = 20,
    includeScheduled = true,
  } = options;

  const queryClient = useQueryClient();

  const statuses: SessionStatus[] = includeScheduled ? ['live', 'scheduled'] : ['live'];
  const queryKey = includeScheduled ? liveSessionKeys.liveAndScheduled() : liveSessionKeys.live();

  return useQuery<LiveSessionSummary[]>({
    queryKey,
    queryFn: async () => {
      // Fetch live sessions (and optionally scheduled) sorted by status then date
      const results: LiveSessionSummary[] = [];

      for (const status of statuses) {
        const { data } = await apiClient.get<PaginatedApiResponse<LiveSessionSummary>>(
          '/sessions',
          {
            params: {
              status,
              limit,
              sortBy: 'scheduledAt',
              sortOrder: 'asc',
            },
          }
        );
        if (data.success) {
          results.push(...data.data);
        }
      }

      return results;
    },
    enabled,
    refetchInterval: pollInterval,
    // Keep polling even when the tab is in the background
    refetchIntervalInBackground: false,
    // Data is always considered stale so every interval triggers a fetch
    staleTime: 0,

    // When we get fresh live data, also invalidate generic session caches
    // so other pages/components see updated statuses
    meta: {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      },
    },
  });
}

/**
 * Poll for the single most-recent live session (for the notification banner).
 *
 * Returns `null` when no session is currently live.
 *
 * @example
 * const { data: liveSession } = useLatestLiveSession();
 */
export function useLatestLiveSession(
  options: Pick<LiveSessionsOptions, 'enabled' | 'pollInterval'> = {}
) {
  const { enabled = true, pollInterval = LIVE_POLL_INTERVAL } = options;

  return useQuery<LiveSessionSummary | null>({
    queryKey: liveSessionKeys.latestLive(),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<LiveSessionSummary>>('/sessions', {
        params: {
          status: 'live',
          limit: 1,
          sortBy: 'startedAt',
          sortOrder: 'desc',
        },
      });

      if (data.success && data.data.length > 0) {
        return data.data[0];
      }
      return null;
    },
    enabled,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });
}
