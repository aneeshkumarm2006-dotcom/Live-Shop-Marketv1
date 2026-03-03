import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type ApiResponse } from '@/lib/api-client';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DashboardStats {
  followerCount: number;
  liveCount: number;
  scheduledCount: number;
  pastCount: number;
}

export interface DashboardCreator {
  _id: string;
  displayName: string;
  bio?: string;
  profileImage?: string;
  socialLinks: Record<string, string | undefined>;
  isVerified: boolean;
  followerCount: number;
  categories: Array<{ _id: string; name: string; slug: string }>;
}

export interface DashboardSession {
  _id: string;
  title: string;
  description?: string;
  externalUrl: string;
  platform: string;
  thumbnailUrl?: string;
  categoryId: { _id: string; name: string; slug: string; gradient?: Record<string, string> } | null;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreatorDashboardData {
  creator: DashboardCreator;
  stats: DashboardStats;
  liveSessions: DashboardSession[];
  scheduledSessions: DashboardSession[];
  pastSessions: DashboardSession[];
  pastPagination: DashboardPagination;
}

export interface CreatorDashboardParams {
  pastPage?: number;
  pastLimit?: number;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const creatorDashboardKeys = {
  all: ['creatorDashboard'] as const,
  data: (params: CreatorDashboardParams) => [...creatorDashboardKeys.all, params] as const,
};

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Fetch creator dashboard data — stats, live/scheduled/past sessions & creator profile.
 *
 * @example
 * const { data, isLoading } = useCreatorDashboard({ pastPage: 1 });
 */
export function useCreatorDashboard(
  params: CreatorDashboardParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<CreatorDashboardData>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creatorDashboardKeys.data(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<CreatorDashboardData>>(
        '/dashboard/creator',
        { params }
      );
      return data;
    },
    staleTime: 30_000, // 30 seconds — dashboard data refreshes frequently
    ...options,
  });
}
