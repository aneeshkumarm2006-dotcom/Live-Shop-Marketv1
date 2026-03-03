import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type ApiResponse } from '@/lib/api-client';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BuyerDashboardCreator {
  _id: string;
  displayName: string;
  bio?: string;
  profileImage?: string;
  isVerified: boolean;
  followerCount: number;
  categories: Array<{ _id: string; name: string; slug: string; gradient?: Record<string, string> }>;
  socialLinks?: Record<string, string | undefined>;
  userId?: { _id: string; name: string; email: string; image?: string };
}

export interface BuyerDashboardFavorite {
  _id: string;
  createdAt: string;
  creatorId: BuyerDashboardCreator;
}

export interface BuyerDashboardSession {
  _id: string;
  title: string;
  description?: string;
  externalUrl: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'other';
  thumbnailUrl?: string;
  categoryId: { _id: string; name: string; slug: string; gradient?: Record<string, string> } | null;
  status: 'scheduled' | 'live' | 'ended';
  scheduledAt?: string;
  startedAt?: string;
  creatorId: {
    _id: string;
    displayName: string;
    profileImage?: string;
    isVerified: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerDashboardUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export interface BuyerDashboardData {
  user: BuyerDashboardUser;
  role: 'buyer';
  favorites: {
    items: BuyerDashboardFavorite[];
    total: number;
    limit: number;
  };
  upcomingSessions: {
    items: BuyerDashboardSession[];
    total: number;
  };
}

export interface BuyerDashboardParams {
  favoritesLimit?: number;
  sessionsLimit?: number;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const buyerDashboardKeys = {
  all: ['buyerDashboard'] as const,
  data: (params: BuyerDashboardParams) => [...buyerDashboardKeys.all, params] as const,
};

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Fetch buyer dashboard data — favorited creators + upcoming sessions from favorites.
 *
 * Uses the same /api/users/me/dashboard endpoint but provides typed access
 * to buyer-specific response fields.
 *
 * @example
 * const { data, isLoading } = useBuyerDashboard({ favoritesLimit: 20 });
 */
export function useBuyerDashboard(
  params: BuyerDashboardParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<BuyerDashboardData>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: buyerDashboardKeys.data(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<BuyerDashboardData>>('/users/me/dashboard', {
        params,
      });
      return data;
    },
    staleTime: 30_000, // 30 seconds
    ...options,
  });
}
