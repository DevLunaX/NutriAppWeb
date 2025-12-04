import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { Patient, PatientCreate, PatientUpdate } from '../models/patient.model';

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private readonly tableName = 'patients';

  constructor(
    private supabase: SupabaseService,
    private authService: AuthService
  ) {}

  async getAll(): Promise<ServiceResponse<Patient[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Patient[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<Patient>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .eq('nutritionist_id', nutritionistId)
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Patient };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async create(patient: PatientCreate): Promise<ServiceResponse<Patient>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...patient,
          nutritionist_id: nutritionistId,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Patient };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async update(id: string, updates: PatientUpdate): Promise<ServiceResponse<Patient>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('nutritionist_id', nutritionistId)
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Patient };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('nutritionist_id', nutritionistId);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async search(query: string): Promise<ServiceResponse<Patient[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('full_name', { ascending: true });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Patient[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}
