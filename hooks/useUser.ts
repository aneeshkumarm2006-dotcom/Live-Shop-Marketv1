import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type ApiResponse } from '@/lib/api-client';
import type { NotificationPreferences } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Payload for PATCH /api/users/me */
export interface UpdateUserPayload {
  name?: string;
  image?: string | null;
  notificationPreferences?: Partial<NotificationPreferences>;
}

/** Query params for GET /api/users/me/dashboard */
export interface DashboardQueryParams {
  favoritesLimit?: number;
  sessionsLimit?: number;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  dashboard: (params: DashboardQueryParams) => [...userKeys.all, 'dashboard', params] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user's profile.
 * Includes creatorProfile when the user is a creator.
 *
 * @example
 * const { data } = useUser();
 * // data?.data.name, data?.data.creatorProfile
 */
export function useUser(
  options?: Omit<UseQueryOptions<ApiResponse<Record<string, unknown>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/users/me');
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Update the current user's profile fields.
 * Invalidates the user and dashboard caches on success.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const { data } = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
        '/users/me',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Fetch the role-specific dashboard data for the current user.
 *
 * **Buyer:** favorited creators + upcoming sessions from favorites.
 * **Creator:** live/scheduled/past sessions + follower stats.
 *
 * @example
 * const { data } = useDashboard({ favoritesLimit: 5, sessionsLimit: 10 });
 */
export function useDashboard(
  params: DashboardQueryParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Record<string, unknown>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.dashboard(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(
        '/users/me/dashboard',
        { params }
      );
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds — dashboard data changes frequently
    ...options,
  });
}
