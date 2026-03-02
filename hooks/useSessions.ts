import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import apiClient, { type PaginatedApiResponse, type ApiResponse } from '@/lib/api-client';
import type { SessionStatus, Platform } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Query params accepted by GET /api/sessions */
export interface SessionsQueryParams {
  status?: SessionStatus;
  categoryId?: string;
  creatorId?: string;
  platform?: Platform;
  page?: number;
  limit?: number;
  sortBy?: 'scheduledAt' | 'createdAt' | 'startedAt';
  sortOrder?: 'asc' | 'desc';
}

/** Payload for POST /api/sessions */
export interface CreateSessionPayload {
  title: string;
  description?: string;
  externalUrl: string;
  platform: Platform;
  thumbnailUrl?: string;
  categoryId: string;
  status?: SessionStatus;
  scheduledAt?: string;
}

/** Payload for PATCH /api/sessions/[id] */
export interface UpdateSessionPayload {
  title?: string;
  description?: string;
  externalUrl?: string;
  platform?: Platform;
  thumbnailUrl?: string;
  categoryId?: string;
  scheduledAt?: string;
}

/** Payload for PATCH /api/sessions/[id]/status */
export interface UpdateSessionStatusPayload {
  status: SessionStatus;
}

// ─── Query keys ─────────────────────────────────────────────────────────────

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (params: SessionsQueryParams) => [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of sessions with optional filters.
 *
 * @example
 * const { data, isLoading } = useSessions({ status: "live", categoryId: "abc" });
 */
export function useSessions(
  params: SessionsQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedApiResponse<Record<string, unknown>>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedApiResponse<Record<string, unknown>>>(
        '/sessions',
        { params }
      );
      return data;
    },
    ...options,
  });
}

/**
 * Fetch a single session by ID.
 *
 * @example
 * const { data } = useSession("661f...");
 */
export function useSession(
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<Record<string, unknown>>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/sessions/${id}`);
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new live session.
 * Invalidates the sessions list cache on success.
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSessionPayload) => {
      const { data } = await apiClient.post<ApiResponse<Record<string, unknown>>>(
        '/sessions',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

/**
 * Update an existing session (fields only — not status).
 * Invalidates both the detail and list caches on success.
 */
export function useUpdateSession(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSessionPayload) => {
      const { data } = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
        `/sessions/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

/**
 * Delete a session.
 * Removes the detail cache entry and invalidates lists.
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<ApiResponse<null>>(`/sessions/${id}`);
      return data;
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: sessionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

/**
 * Update session status (go live / end).
 * Invalidates session detail and list caches.
 */
export function useUpdateSessionStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSessionStatusPayload) => {
      const { data } = await apiClient.patch<ApiResponse<Record<string, unknown>>>(
        `/sessions/${id}/status`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}
