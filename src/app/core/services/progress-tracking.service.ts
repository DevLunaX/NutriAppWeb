import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import {
  ProgressTracking,
  ProgressTrackingCreate,
  ProgressTrackingUpdate,
} from '../models/progress-tracking.model';

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressTrackingService {
  private readonly tableName = 'progress_tracking';

  constructor(
    private supabase: SupabaseService,
    private authService: AuthService
  ) {}

  async getAll(): Promise<ServiceResponse<ProgressTracking[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .order('tracking_date', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as ProgressTracking[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getByPatientId(patientId: string): Promise<ServiceResponse<ProgressTracking[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('patient_id', patientId)
        .eq('nutritionist_id', nutritionistId)
        .order('tracking_date', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as ProgressTracking[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<ProgressTracking>> {
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

      return { success: true, data: data as ProgressTracking };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async create(progress: ProgressTrackingCreate): Promise<ServiceResponse<ProgressTracking>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...progress,
          nutritionist_id: nutritionistId,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as ProgressTracking };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async update(
    id: string,
    updates: ProgressTrackingUpdate
  ): Promise<ServiceResponse<ProgressTracking>> {
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

      return { success: true, data: data as ProgressTracking };
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

  async getLatestByPatientId(patientId: string): Promise<ServiceResponse<ProgressTracking>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('patient_id', patientId)
        .eq('nutritionist_id', nutritionistId)
        .order('tracking_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as ProgressTracking };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getProgressRange(
    patientId: string,
    startDate: string,
    endDate: string
  ): Promise<ServiceResponse<ProgressTracking[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('patient_id', patientId)
        .eq('nutritionist_id', nutritionistId)
        .gte('tracking_date', startDate)
        .lte('tracking_date', endDate)
        .order('tracking_date', { ascending: true });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as ProgressTracking[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}
