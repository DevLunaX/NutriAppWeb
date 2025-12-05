import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Cita, CitaCreate, CitaUpdate } from '../models/cita.model';

/**
 * REST API service for Citas table
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class CitasApiService extends BaseApiService {
  private readonly endpoint = 'citas';

  /**
   * GET /api/citas
   * Retrieves all appointments
   */
  async getAll(): Promise<ApiResponse<Cita[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Cita[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/citas/paciente/:pacienteId
   * Retrieves all appointments for a patient
   */
  async getByPacienteId(pacienteId: number): Promise<ApiResponse<Cita[]>> {
    if (!pacienteId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha', { ascending: false })
        .order('hora', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Cita[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/citas/proximas
   * Retrieves upcoming appointments
   */
  async getProximas(): Promise<ApiResponse<Cita[]>> {
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .gte('fecha', today)
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Cita[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/citas
   * Creates a new appointment
   */
  async create(cita: CitaCreate): Promise<ApiResponse<Cita>> {
    if (!cita.paciente_id) {
      return this.badRequest('Patient ID is required');
    }

    if (!cita.fecha) {
      return this.badRequest('La fecha es requerida');
    }

    if (!cita.hora) {
      return this.badRequest('La hora es requerida');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...cita,
          estado: cita.estado || 'Pendiente',
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Cita);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/citas/:id
   * Updates an existing appointment
   */
  async update(id: number, updates: CitaUpdate): Promise<ApiResponse<Cita>> {
    if (!id) {
      return this.badRequest('Appointment ID is required');
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
          return this.notFound('Cita');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Cita);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/citas/:id
   * Deletes an appointment
   */
  async delete(id: number): Promise<ApiResponse<null>> {
    if (!id) {
      return this.badRequest('Appointment ID is required');
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
