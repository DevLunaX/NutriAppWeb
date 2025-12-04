import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Patient, PatientCreate, PatientUpdate } from '../models/patient.model';

/**
 * REST API service for Patients
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 * No authentication required - open access to patient data
 */
@Injectable({
  providedIn: 'root',
})
export class PatientsApiService extends BaseApiService {
  private readonly endpoint = 'patients';

  /**
   * GET /api/patients
   * Retrieves all patients
   */
  async getAll(): Promise<ApiResponse<Patient[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Patient[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:id
   * Retrieves a specific patient by ID
   */
  async getById(id: string): Promise<ApiResponse<Patient>> {
    if (!id) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Patient');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Patient);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/patients
   * Creates a new patient
   */
  async create(patient: PatientCreate): Promise<ApiResponse<Patient>> {
    if (!patient.full_name) {
      return this.badRequest('Patient name is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...patient,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Patient);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/patients/:id
   * Updates an existing patient
   */
  async update(id: string, updates: PatientUpdate): Promise<ApiResponse<Patient>> {
    if (!id) {
      return this.badRequest('Patient ID is required');
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
          return this.notFound('Patient');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Patient);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/patients/:id
   * Deletes a patient
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    if (!id) {
      return this.badRequest('Patient ID is required');
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

  /**
   * GET /api/patients/search?q=query
   * Searches patients by name or email
   */
  async search(query: string): Promise<ApiResponse<Patient[]>> {
    if (!query || query.trim().length === 0) {
      return this.badRequest('Search query is required');
    }

    // Sanitize the query by escaping special characters that could affect the filter
    const sanitizedQuery = query
      .replace(/[%_\\]/g, '\\$&') // Escape special SQL LIKE characters
      .trim();

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .or(`full_name.ilike.%${sanitizedQuery}%,email.ilike.%${sanitizedQuery}%`)
        .order('full_name', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Patient[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
