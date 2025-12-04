import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
} from '../models/consultation.model';

/**
 * REST API service for Consultations
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class ConsultationsApiService extends BaseApiService {
  private readonly endpoint = 'consultations';

  /**
   * GET /api/consultations
   * Retrieves all consultations for the authenticated nutritionist
   */
  async getAll(): Promise<ApiResponse<Consultation[]>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('nutritionist_id', userId)
        .order('consultation_date', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Consultation[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/consultations/:id
   * Retrieves a specific consultation by ID
   */
  async getById(id: string): Promise<ApiResponse<Consultation>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    if (!id) {
      return this.badRequest('Consultation ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('id', id)
        .eq('nutritionist_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Consultation');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Consultation);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/consultations
   * Retrieves all consultations for a specific patient
   */
  async getByPatientId(patientId: string): Promise<ApiResponse<Consultation[]>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .eq('nutritionist_id', userId)
        .order('consultation_date', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Consultation[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/consultations
   * Creates a new consultation
   */
  async create(consultation: ConsultationCreate): Promise<ApiResponse<Consultation>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    if (!consultation.patient_id) {
      return this.badRequest('Patient ID is required');
    }

    if (!consultation.consultation_date) {
      return this.badRequest('Consultation date is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...consultation,
          nutritionist_id: userId,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Consultation);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/consultations/:id
   * Updates an existing consultation
   */
  async update(id: string, updates: ConsultationUpdate): Promise<ApiResponse<Consultation>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    if (!id) {
      return this.badRequest('Consultation ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('nutritionist_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Consultation');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Consultation);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/consultations/:id
   * Deletes a consultation
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    if (!id) {
      return this.badRequest('Consultation ID is required');
    }

    try {
      const { error } = await this.supabase
        .from(this.endpoint)
        .delete()
        .eq('id', id)
        .eq('nutritionist_id', userId);

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.noContent();
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/consultations/upcoming?days=7
   * Retrieves upcoming consultations within the specified number of days
   */
  async getUpcoming(days: number = 7): Promise<ApiResponse<Consultation[]>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('nutritionist_id', userId)
        .gte('consultation_date', today.toISOString())
        .lte('consultation_date', futureDate.toISOString())
        .order('consultation_date', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Consultation[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
