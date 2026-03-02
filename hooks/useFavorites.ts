import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type PaginatedApiResponse, type ApiResponse } from '@/lib/api-client';
import { creatorKeys } from './useCreators';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FavoritesQueryParams {
  page?: number;
  limit?: number;
}

export interface FavoriteCheckResponse {
  isFavorited: boolean;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (params: FavoritesQueryParams) => [...favoriteKeys.lists(), params] as const,
  checks: () => [...favoriteKeys.all, 'check'] as const,
  check: (creatorId: string) => [...favoriteKeys.checks(), creatorId] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetch the current user's favorited creators with latest session info.
 *
 * @example
 * const { data } = useFavorites({ page: 1, limit: 10 });
 */
export function useFavorites(
  params: FavoritesQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedApiResponse<Record<string, unknown>>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: favoriteKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<Record<string, unknown>>>(
        '/favorites',
        { params }
      );
      return data;
    },
    ...options,
  });
}

/**
 * Check if a specific creator is favorited by the current user.
 *
 * @example
 * const { data } = useIsFavorited("661f...");
 * // data?.data.isFavorited === true
 */
export function useIsFavorited(
  creatorId: string,
  options?: Omit<UseQueryOptions<ApiResponse<FavoriteCheckResponse>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: favoriteKeys.check(creatorId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<FavoriteCheckResponse>>(
        `/favorites/check/${creatorId}`
      );
      return data;
    },
    enabled: !!creatorId,
    ...options,
  });
}

/**
 * Toggle favorite status for a creator.
 *
 * - If not favorited → POST /api/favorites (add)
 * - If already favorited → DELETE /api/favorites/[creatorId] (remove)
 *
 * Performs optimistic updates on the check query for instant UI feedback.
 * Invalidates favorite lists and related creator caches on settlement.
 *
 * @example
 * const toggle = useToggleFavorite("661f...");
 * toggle.mutate(); // toggles based on current state
 */
export function useToggleFavorite(creatorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Read current state from the cache
      const cached = queryClient.getQueryData<ApiResponse<FavoriteCheckResponse>>(
        favoriteKeys.check(creatorId)
      );
      const isFavorited = cached?.data?.isFavorited ?? false;

      if (isFavorited) {
        await apiClient.delete(`/favorites/${creatorId}`);
        return { isFavorited: false };
      } else {
        await apiClient.post('/favorites', { creatorId });
        return { isFavorited: true };
      }
    },

    // Optimistic update — immediately flip the UI state
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: favoriteKeys.check(creatorId),
      });

      const previous = queryClient.getQueryData<ApiResponse<FavoriteCheckResponse>>(
        favoriteKeys.check(creatorId)
      );

      queryClient.setQueryData<ApiResponse<FavoriteCheckResponse>>(
        favoriteKeys.check(creatorId),
        (old) =>
          old
            ? {
                ...old,
                data: { isFavorited: !old.data.isFavorited },
              }
            : undefined
      );

      return { previous };
    },

    // Rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(favoriteKeys.check(creatorId), context.previous);
      }
    },

    // Always refetch after success or error to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(creatorId),
      });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      // Creator followerCount may have changed
      queryClient.invalidateQueries({ queryKey: creatorKeys.detail(creatorId) });
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() });
    },
  });
}
