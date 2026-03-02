import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type ApiResponse } from '@/lib/api-client';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CategoriesQueryParams {
  featured?: boolean;
}

export interface CategoryStats {
  liveSessionCount: number;
  scheduledSessionCount: number;
  totalSessionCount: number;
  creatorCount: number;
}

export type CategoryWithStats = Record<string, unknown> & {
  stats: CategoryStats;
};

// ─── Query keys ─────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: CategoriesQueryParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetch all categories (optionally filtered to featured only).
 *
 * Categories rarely change, so we use a longer staleTime (5 min).
 *
 * @example
 * const { data } = useCategories({ featured: true });
 */
export function useCategories(
  params: CategoriesQueryParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<Record<string, unknown>[]> & { count: number }>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<Record<string, unknown>[]> & { count: number }
      >('/categories', {
        params: params.featured ? { featured: 'true' } : undefined,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — categories change infrequently
    ...options,
  });
}

/**
 * Fetch a single category by slug, including aggregated stats.
 *
 * @example
 * const { data } = useCategory("tech-gadgets");
 */
export function useCategory(
  slug: string,
  options?: Omit<UseQueryOptions<ApiResponse<CategoryWithStats>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<CategoryWithStats>>(`/categories/${slug}`);
      return data;
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes — stats can shift with live sessions
    ...options,
  });
}
