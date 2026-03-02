import axios from 'axios';

/**
 * Pre-configured Axios instance for all client-side API calls.
 *
 * - Base URL defaults to `/api` so hooks can use relative paths.
 * - Automatically parses JSON responses and extracts the `data` field.
 * - Throws on non-2xx status codes for React Query error handling.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

// ─── Response interceptor ──────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error message from API response
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ─── Shared pagination & API response types ────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
