import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { MealPlan, MealPlanCreate, MealPlanUpdate } from '../models/meal-plan.model';
import { ServiceResponse } from '../models/service-response.model';

@Injectable({
  providedIn: 'root',
})
export class MealPlansService {
  private readonly tableName = 'meal_plans';

  constructor(
    private supabase: SupabaseService,
    private authService: AuthService
  ) {}

  async getAll(): Promise<ServiceResponse<MealPlan[]>> {
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

      return { success: true, data: data as MealPlan[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getByPatientId(patientId: string): Promise<ServiceResponse<MealPlan[]>> {
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
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as MealPlan[] };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getActivePlanByPatientId(patientId: string): Promise<ServiceResponse<MealPlan>> {
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
        .eq('is_active', true)
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as MealPlan };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getById(id: string): Promise<ServiceResponse<MealPlan>> {
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

      return { success: true, data: data as MealPlan };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async create(mealPlan: MealPlanCreate): Promise<ServiceResponse<MealPlan>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // If the new plan is active, deactivate other plans for the same patient
      if (mealPlan.is_active) {
        await this.supabase
          .from(this.tableName)
          .update({ is_active: false })
          .eq('patient_id', mealPlan.patient_id)
          .eq('nutritionist_id', nutritionistId);
      }

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert({
          ...mealPlan,
          nutritionist_id: nutritionistId,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, data: data as MealPlan };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async update(id: string, updates: MealPlanUpdate): Promise<ServiceResponse<MealPlan>> {
    const nutritionistId = this.authService.currentUser()?.id;
    if (!nutritionistId) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // If setting as active, get the patient_id first and deactivate other plans
      if (updates.is_active) {
        const { data: currentPlan } = await this.supabase
          .from(this.tableName)
          .select('patient_id')
          .eq('id', id)
          .single();

        if (currentPlan) {
          await this.supabase
            .from(this.tableName)
            .update({ is_active: false })
            .eq('patient_id', currentPlan.patient_id)
            .eq('nutritionist_id', nutritionistId)
            .neq('id', id);
        }
      }

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

      return { success: true, data: data as MealPlan };
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

  async setActive(id: string): Promise<ServiceResponse<MealPlan>> {
    return this.update(id, { is_active: true });
  }
}
