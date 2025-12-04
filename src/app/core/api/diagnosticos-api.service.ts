import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Diagnostico, DiagnosticoCreate, DiagnosticoUpdate } from '../models/diagnostico.model';

/**
 * REST API service for Diagnosticos table
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class DiagnosticosApiService extends BaseApiService {
  private readonly endpoint = 'diagnosticos';

  /**
   * GET /api/diagnosticos/paciente/:pacienteId
   * Retrieves diagnosis for a patient
   */
  async getByPacienteId(pacienteId: number): Promise<ApiResponse<Diagnostico | null>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_diagnostico', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Diagnostico | null);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/diagnosticos
   * Creates a new diagnosis
   */
  async create(diagnostico: DiagnosticoCreate): Promise<ApiResponse<Diagnostico>> {
    if (!diagnostico.paciente_id) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...diagnostico,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Diagnostico);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/diagnosticos/:id
   * Updates an existing diagnosis
   */
  async update(id: number, updates: DiagnosticoUpdate): Promise<ApiResponse<Diagnostico>> {
    if (!id) {
      return this.badRequest('Diagnosis ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .update({
          ...updates,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Diagnóstico');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Diagnostico);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * Create or update diagnosis for a patient
   * If diagnosis exists, update it; otherwise create new
   */
  async upsertByPacienteId(pacienteId: number, diagnosticoData: DiagnosticoUpdate): Promise<ApiResponse<Diagnostico>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      // Check if diagnosis exists
      const existing = await this.getByPacienteId(pacienteId);
      
      if (existing.status === 200 && existing.data) {
        // Update existing
        return this.update(existing.data.id, diagnosticoData);
      } else {
        // Create new
        return this.create({
          paciente_id: pacienteId,
          ...diagnosticoData,
        });
      }
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
