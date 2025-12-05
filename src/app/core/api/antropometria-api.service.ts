import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Antropometria, AntropometriaCreate, AntropometriaUpdate } from '../models/antropometria.model';

/**
 * REST API service for Antropometria table
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class AntropometriaApiService extends BaseApiService {
  private readonly endpoint = 'antropometria';

  /**
   * GET /api/antropometria/paciente/:pacienteId
   * Retrieves latest anthropometry for a patient
   */
  async getByPacienteId(pacienteId: number): Promise<ApiResponse<Antropometria | null>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_medicion', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Antropometria | null);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/antropometria/paciente/:pacienteId/historial
   * Retrieves all anthropometry history for a patient
   */
  async getHistorialByPacienteId(pacienteId: number): Promise<ApiResponse<Antropometria[]>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_medicion', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Antropometria[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/antropometria
   * Creates a new anthropometry record
   */
  async create(antropometria: AntropometriaCreate): Promise<ApiResponse<Antropometria>> {
    if (!antropometria.paciente_id) {
      return this.badRequest('Patient ID is required');
    }

    if (!antropometria.peso || antropometria.peso <= 0) {
      return this.badRequest('El peso debe ser mayor a 0');
    }

    if (!antropometria.talla || antropometria.talla <= 0) {
      return this.badRequest('La talla debe ser mayor a 0');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...antropometria,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Antropometria);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/antropometria/:id
   * Updates an existing anthropometry record
   */
  async update(id: number, updates: AntropometriaUpdate): Promise<ApiResponse<Antropometria>> {
    if (!id) {
      return this.badRequest('Anthropometry ID is required');
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
          return this.notFound('Antropometría');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Antropometria);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * Create or update the latest anthropometry for a patient
   */
  async upsertByPacienteId(pacienteId: number, antropometriaData: AntropometriaUpdate): Promise<ApiResponse<Antropometria>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const existing = await this.getByPacienteId(pacienteId);
      
      if (existing.status === 200 && existing.data) {
        return this.update(existing.data.id, antropometriaData);
      } else {
        return this.create({
          paciente_id: pacienteId,
          peso: antropometriaData.peso || 0,
          talla: antropometriaData.talla || 0,
        });
      }
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
