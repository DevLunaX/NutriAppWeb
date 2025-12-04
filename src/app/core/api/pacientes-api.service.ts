import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Paciente, PacienteCreate, PacienteUpdate } from '../models/paciente.model';

/**
 * REST API service for Pacientes table
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 */
@Injectable({
  providedIn: 'root',
})
export class PacientesApiService extends BaseApiService {
  private readonly endpoint = 'pacientes';

  /**
   * GET /api/pacientes
   * Retrieves all patients
   */
  async getAll(): Promise<ApiResponse<Paciente[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('activo', true)
        .order('fecha_registro', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Paciente[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/pacientes/:id
   * Retrieves a specific patient by ID
   */
  async getById(id: number): Promise<ApiResponse<Paciente>> {
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
          return this.notFound('Paciente');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Paciente);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/pacientes
   * Creates a new patient
   */
  async create(paciente: PacienteCreate): Promise<ApiResponse<Paciente>> {
    if (!paciente.nombre) {
      return this.badRequest('El nombre del paciente es requerido');
    }

    if (!paciente.numero_control) {
      return this.badRequest('El número de control es requerido');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...paciente,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as Paciente);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/pacientes/:id
   * Updates an existing patient
   */
  async update(id: number, updates: PacienteUpdate): Promise<ApiResponse<Paciente>> {
    if (!id) {
      return this.badRequest('Patient ID is required');
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
          return this.notFound('Paciente');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Paciente);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/pacientes/:id
   * Soft deletes a patient (sets activo = false)
   */
  async delete(id: number): Promise<ApiResponse<null>> {
    if (!id) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { error } = await this.supabase
        .from(this.endpoint)
        .update({ activo: false })
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
   * GET /api/pacientes/search?q=query
   * Searches patients by name or control number
   */
  async search(query: string): Promise<ApiResponse<Paciente[]>> {
    if (!query || query.trim().length === 0) {
      return this.badRequest('Search query is required');
    }

    const sanitizedQuery = query
      .replace(/[%_\\]/g, '\\$&')
      .trim();

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('activo', true)
        .or(`nombre.ilike.%${sanitizedQuery}%,numero_control.ilike.%${sanitizedQuery}%`)
        .order('nombre', { ascending: true });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Paciente[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
