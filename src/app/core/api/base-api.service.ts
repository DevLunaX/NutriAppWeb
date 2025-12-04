import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { ApiResponse, ApiError, HttpMethod } from './api.model';

/**
 * Base API service that provides REST-like interface over Supabase
 * All API services extend this class to get common functionality
 */
@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(
    protected supabase: SupabaseService,
    protected authService: AuthService
  ) {}

  /**
   * Creates a standardized API response
   */
  protected createResponse<T>(
    data: T | null,
    error: ApiError | null,
    status: number
  ): ApiResponse<T> {
    return {
      data,
      error,
      status,
      statusText: this.getStatusText(status),
    };
  }

  /**
   * Creates a success response (200 OK)
   */
  protected success<T>(data: T): ApiResponse<T> {
    return this.createResponse(data, null, 200);
  }

  /**
   * Creates a created response (201 Created)
   */
  protected created<T>(data: T): ApiResponse<T> {
    return this.createResponse(data, null, 201);
  }

  /**
   * Creates a no content response (204 No Content)
   */
  protected noContent(): ApiResponse<null> {
    return this.createResponse(null, null, 204);
  }

  /**
   * Creates an error response
   */
  protected error<T>(code: string, message: string, status: number = 500): ApiResponse<T> {
    return this.createResponse<T>(null, { code, message }, status);
  }

  /**
   * Creates an unauthorized response (401)
   */
  protected unauthorized<T>(): ApiResponse<T> {
    return this.error('UNAUTHORIZED', 'User not authenticated', 401);
  }

  /**
   * Creates a not found response (404)
   */
  protected notFound<T>(resource: string): ApiResponse<T> {
    return this.error('NOT_FOUND', `${resource} not found`, 404);
  }

  /**
   * Creates a bad request response (400)
   */
  protected badRequest<T>(message: string): ApiResponse<T> {
    return this.error('BAD_REQUEST', message, 400);
  }

  /**
   * Gets the current authenticated user ID
   */
  protected getCurrentUserId(): string | null {
    return this.authService.currentUser()?.id ?? null;
  }

  /**
   * Checks if user is authenticated
   */
  protected isAuthenticated(): boolean {
    return this.getCurrentUserId() !== null;
  }

  /**
   * Gets HTTP status text for a status code
   */
  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return statusTexts[status] || 'Unknown';
  }

  /**
   * Handles Supabase errors and converts them to API errors with appropriate status codes
   */
  protected handleSupabaseError<T>(error: unknown): ApiResponse<T> {
    if (error && typeof error === 'object' && 'message' in error) {
      const err = error as { message: string; code?: string; details?: string };
      const status = this.mapSupabaseErrorToStatus(err.code);
      return this.error(err.code || 'SUPABASE_ERROR', err.message, status);
    }
    return this.error('UNKNOWN_ERROR', 'An unexpected error occurred', 500);
  }

  /**
   * Maps Supabase error codes to HTTP status codes
   */
  private mapSupabaseErrorToStatus(code?: string): number {
    if (!code) return 500;

    const errorStatusMap: Record<string, number> = {
      // Not found errors
      PGRST116: 404, // Row not found (single result expected)
      // Validation errors
      '22P02': 400, // Invalid input syntax
      '23502': 400, // Not null violation
      '23503': 400, // Foreign key violation
      '23505': 409, // Unique violation (conflict)
      '23514': 422, // Check violation
      // Permission errors
      '42501': 403, // Insufficient privilege
      PGRST301: 403, // Row-level security violation
      // Authentication errors
      invalid_grant: 401,
      invalid_credentials: 401,
    };

    return errorStatusMap[code] || 500;
  }
}
