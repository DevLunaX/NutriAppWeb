import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { ControlExpediente, ControlExpedienteCreate, ControlExpedienteUpdate } from '../models/control-expediente.model';

/**
 * REST API service for ControlExpedientes table
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class ControlExpedientesApiService extends BaseApiService {
  private readonly endpoint = 'control_expedientes';

  /**
   * GET /api/control-expedientes/paciente/:pacienteId
   * Retrieves control expediente for a patient
   */
  async getByPacienteId(pacienteId: number): Promise<ApiResponse<ControlExpediente | null>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_registro', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as ControlExpediente | null);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/control-expedientes
   * Creates a new control expediente
   */
  async create(controlExpediente: ControlExpedienteCreate): Promise<ApiResponse<ControlExpediente>> {
    if (!controlExpediente.paciente_id) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...controlExpediente,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as ControlExpediente);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/control-expedientes/:id
   * Updates an existing control expediente
   */
  async update(id: number, updates: ControlExpedienteUpdate): Promise<ApiResponse<ControlExpediente>> {
    if (!id) {
      return this.badRequest('Control expediente ID is required');
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
          return this.notFound('Control de expediente');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as ControlExpediente);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * Create or update control expediente for a patient
   */
  async upsertByPacienteId(pacienteId: number, controlData: ControlExpedienteUpdate): Promise<ApiResponse<ControlExpediente>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const existing = await this.getByPacienteId(pacienteId);
      
      if (existing.status === 200 && existing.data) {
        return this.update(existing.data.id, controlData);
      } else {
        return this.create({
          paciente_id: pacienteId,
          ...controlData,
        });
      }
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
