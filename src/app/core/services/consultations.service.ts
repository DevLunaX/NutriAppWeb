import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
} from '../models/consultation.model';
import { ServiceResponse } from '../models/service-response.model';

@Injectable({
  providedIn: 'root',
})
export class ConsultationsService {
  private readonly tableName = 'consultations';

  constructor(
    private supabase: SupabaseService,
    private authService: AuthService
  ) {}

  async getAll(): Promise<ServiceResponse<Consultation[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .order('consultation_date', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Consultation[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getByPatientId(patientId: string): Promise<ServiceResponse<Consultation[]>> {
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
        .order('consultation_date', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Consultation[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<Consultation>> {
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

      return { success: true, data: data as Consultation };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async create(consultation: ConsultationCreate): Promise<ServiceResponse<Consultation>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...consultation,
          nutritionist_id: nutritionistId,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Consultation };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async update(id: string, updates: ConsultationUpdate): Promise<ServiceResponse<Consultation>> {
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

      return { success: true, data: data as Consultation };
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

  async getUpcoming(days: number = 7): Promise<ServiceResponse<Consultation[]>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .gte('consultation_date', today.toISOString())
        .lte('consultation_date', futureDate.toISOString())
        .order('consultation_date', { ascending: true });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as Consultation[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}
