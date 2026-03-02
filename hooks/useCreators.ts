import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type PaginatedApiResponse, type ApiResponse } from '@/lib/api-client';
import type { SocialLinks } from '@/types';
import { sessionKeys } from './useSessions';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Query params accepted by GET /api/creators */
export interface CreatorsQueryParams {
  categoryId?: string;
  search?: string;
  sort?: 'followers' | 'recent';
  page?: number;
  limit?: number;
}

/** Payload for PATCH /api/creators/[id] */
export interface UpdateCreatorPayload {
  displayName?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: Partial<SocialLinks>;
  categories?: string[];
}

/** Query params for GET /api/creators/[id]/sessions */
export interface CreatorSessionsQueryParams {
  status?: 'scheduled' | 'live' | 'ended';
  page?: number;
  limit?: number;
  sortBy?: 'scheduledAt' | 'createdAt' | 'startedAt';
  sortOrder?: 'asc' | 'desc';
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const creatorKeys = {
  all: ['creators'] as const,
  lists: () => [...creatorKeys.all, 'list'] as const,
  list: (params: CreatorsQueryParams) => [...creatorKeys.lists(), params] as const,
  details: () => [...creatorKeys.all, 'detail'] as const,
  detail: (id: string) => [...creatorKeys.details(), id] as const,
  sessions: (id: string, params: CreatorSessionsQueryParams) =>
    [...creatorKeys.detail(id), 'sessions', params] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of creators with optional filters.
 *
 * @example
 * const { data } = useCreators({ search: "beauty", sort: "followers" });
 */
export function useCreators(
  params: CreatorsQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedApiResponse<Record<string, unknown>>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: creatorKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<Record<string, unknown>>>(
        '/creators',
        { params }
      );
      return data;
    },
    ...options,
  });
}

/**
 * Fetch a single creator profile by ID (includes active sessions & stats).
 *
 * @example
 * const { data } = useCreator("661f...");
 */
export function useCreator(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Record<string, unknown>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creatorKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/creators/${id}`);
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch sessions for a specific creator.
 *
 * @example
 * const { data } = useCreatorSessions("661f...", { status: "live" });
 */
export function useCreatorSessions(
  creatorId: string,
  params: CreatorSessionsQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedApiResponse<Record<string, unknown>>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: creatorKeys.sessions(creatorId, params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<Record<string, unknown>>>(
        `/creators/${creatorId}/sessions`,
        { params }
      );
      return data;
    },
    enabled: !!creatorId,
    ...options,
  });
}

/**
 * Update a creator profile.
 * Invalidates both the creator detail and list caches on success.
 */
export function useUpdateCreator(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCreatorPayload) => {
      const { data } = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
        `/creators/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creatorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: creatorKeys.lists() });
      // Creator updates may affect session display data
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}
