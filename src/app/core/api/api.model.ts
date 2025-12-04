/**
 * API Response models for REST API layer
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  statusText: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
