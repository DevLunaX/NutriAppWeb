import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { MealPlan, MealPlanCreate, MealPlanUpdate } from '../models/meal-plan.model';

/**
 * REST API service for Meal Plans
 * Provides HTTP-like endpoints: GET, POST, PUT, DELETE
 * No authentication required - open access
 */
@Injectable({
  providedIn: 'root',
})
export class MealPlansApiService extends BaseApiService {
  private readonly endpoint = 'meal_plans';

  /**
   * GET /api/meal-plans
   * Retrieves all meal plans
   */
  async getAll(): Promise<ApiResponse<MealPlan[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as MealPlan[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/meal-plans/:id
   * Retrieves a specific meal plan by ID
   */
  async getById(id: string): Promise<ApiResponse<MealPlan>> {
    if (!id) {
      return this.badRequest('Meal plan ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Meal plan');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as MealPlan);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/meal-plans
   * Retrieves all meal plans for a specific patient
   */
  async getByPatientId(patientId: string): Promise<ApiResponse<MealPlan[]>> {
    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as MealPlan[]);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/patients/:patientId/meal-plans/active
   * Retrieves the active meal plan for a specific patient
   */
  async getActiveByPatientId(patientId: string): Promise<ApiResponse<MealPlan>> {
    if (!patientId) {
      return this.badRequest('Patient ID is required');
    }

    try {
      const { data, error } = await this.supabase
        .from(this.endpoint)
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Active meal plan');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as MealPlan);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/meal-plans
   * Creates a new meal plan
   */
  async create(mealPlan: MealPlanCreate): Promise<ApiResponse<MealPlan>> {
    if (!mealPlan.patient_id) {
      return this.badRequest('Patient ID is required');
    }

    if (!mealPlan.name) {
      return this.badRequest('Meal plan name is required');
    }

    try {
      // If the new plan is active, deactivate other plans for the same patient
      if (mealPlan.is_active) {
        await this.supabase
          .from(this.endpoint)
          .update({ is_active: false })
          .eq('patient_id', mealPlan.patient_id);
      }

      const { data, error } = await this.supabase
        .from(this.endpoint)
        .insert({
          ...mealPlan,
        })
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.created(data as MealPlan);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/meal-plans/:id
   * Updates an existing meal plan
   */
  async update(id: string, updates: MealPlanUpdate): Promise<ApiResponse<MealPlan>> {
    if (!id) {
      return this.badRequest('Meal plan ID is required');
    }

    try {
      // If setting as active, deactivate other plans for the same patient
      if (updates.is_active) {
        const { data: currentPlan } = await this.supabase
          .from(this.endpoint)
          .select('patient_id')
          .eq('id', id)
          .single();

        if (currentPlan) {
          await this.supabase
            .from(this.endpoint)
            .update({ is_active: false })
            .eq('patient_id', currentPlan.patient_id)
            .neq('id', id);
        }
      }

      const { data, error } = await this.supabase
        .from(this.endpoint)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Meal plan');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as MealPlan);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * DELETE /api/meal-plans/:id
   * Deletes a meal plan
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    if (!id) {
      return this.badRequest('Meal plan ID is required');
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

  /**
   * PATCH /api/meal-plans/:id/activate
   * Sets a meal plan as active (deactivates others for the same patient)
   */
  async activate(id: string): Promise<ApiResponse<MealPlan>> {
    return this.update(id, { is_active: true });
  }
}
