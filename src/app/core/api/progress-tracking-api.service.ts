import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import {
  ProgressTracking,
  ProgressTrackingCreate,
  ProgressTrackingUpdate,
} from '../models/progress-tracking.model';

/**
 * REST API service for Progress Tracking
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 * No authentication required - open access
 */
@Injectable({
  providedIn: 'root',
})
export class ProgressTrackingApiService extends BaseApiService {
  private readonly endpoint = 'progress_tracking';

  /**
   * GET /api/progress-tracking
   * Retrieves all progress entries
   */
  async getAll(): Promise<ApiResponse<ProgressTracking[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .order('tracking_date', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/progress-tracking/:id
   * Retrieves a specific progress entry by ID
   */
  async getById(id: string): Promise<ApiResponse<ProgressTracking>> {
    if (!id) {
      return this.badRequest('Progress tracking ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Progress tracking entry');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/progress-tracking
   * Retrieves all progress entries for a specific patient
   */
  async getByPatientId(patientId: string): Promise<ApiResponse<ProgressTracking[]>> {
    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .order('tracking_date', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/progress-tracking/latest
   * Retrieves the latest progress entry for a specific patient
   */
  async getLatestByPatientId(patientId: string): Promise<ApiResponse<ProgressTracking>> {
    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .order('tracking_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Progress tracking entry');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/progress-tracking/range?start=date&end=date
   * Retrieves progress entries within a date range
   */
  async getByDateRange(
    patientId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ProgressTracking[]>> {
    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    if (!startDate || !endDate) {
      return this.badRequest('Start date and end date are required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .gte('tracking_date', startDate)
        .lte('tracking_date', endDate)
        .order('tracking_date', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/progress-tracking
   * Creates a new progress entry
   */
  async create(progress: ProgressTrackingCreate): Promise<ApiResponse<ProgressTracking>> {
    if (!progress.patient_id) {
      return this.badRequest('Patient ID is required');
    }

    if (!progress.tracking_date) {
      return this.badRequest('Tracking date is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...progress,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as ProgressTracking);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/progress-tracking/:id
   * Updates an existing progress entry
   */
  async update(id: string, updates: ProgressTrackingUpdate): Promise<ApiResponse<ProgressTracking>> {
    if (!id) {
      return this.badRequest('Progress tracking ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Progress tracking entry');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as ProgressTracking);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/progress-tracking/:id
   * Deletes a progress entry
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    if (!id) {
      return this.badRequest('Progress tracking ID is required');
    }

    try {
      const { error } = await this.supabase
        .from(this.endpoint)
        .delete()
        .eq('id', id);

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.noContent();
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
