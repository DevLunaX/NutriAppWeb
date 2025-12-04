import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ApiResponse } from './api.model';
import { Nutritionist, NutritionistCreate, NutritionistUpdate } from '../models/nutritionist.model';
import { User, Session } from '@supabase/supabase-js';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nutritionist: NutritionistCreate;
}

export interface AuthData {
  user: User;
  session: Session;
}

/**
 * REST API service for Authentication
 * Provides HTTP-like endpoints for auth operations
 */
@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  /**
   * POST /api/auth/login
   * Authenticates a user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthData>> {
    if (!credentials.email) {
      return this.badRequest('Email is required');
    }

    if (!credentials.password) {
      return this.badRequest('Password is required');
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return this.error('AUTH_ERROR', error.message, 401);
      }

      if (data.user && data.session) {
        return this.success({ user: data.user, session: data.session });
      }

      return this.error('AUTH_FAILED', 'Login failed', 401);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/auth/register
   * Registers a new user and creates nutritionist profile
   */
  async register(request: RegisterRequest): Promise<ApiResponse<User>> {
    if (!request.email) {
      return this.badRequest('Email is required');
    }

    if (!request.password) {
      return this.badRequest('Password is required');
    }

    if (!request.nutritionist.full_name) {
      return this.badRequest('Full name is required');
    }

    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: request.email,
        password: request.password,
      });

      if (authError) {
        return this.error('AUTH_ERROR', authError.message, 400);
      }

      if (authData.user) {
        const { error: profileError } = await this.supabase.from('nutritionists').insert({
          ...request.nutritionist,
          id: authData.user.id,
          email: authData.user.email,
        });

        if (profileError) {
          return this.error('PROFILE_ERROR', profileError.message, 500);
        }

        return this.created(authData.user);
      }

      return this.error('REGISTRATION_FAILED', 'Registration failed', 400);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logs out the current user
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return this.error('LOGOUT_ERROR', error.message, 500);
      }

      return this.noContent();
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Sends a password reset email
   */
  async resetPassword(email: string): Promise<ApiResponse<null>> {
    if (!email) {
      return this.badRequest('Email is required');
    }

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return this.error('RESET_ERROR', error.message, 400);
      }

      return this.success(null);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/auth/session
   * Gets the current session
   */
  async getSession(): Promise<ApiResponse<Session>> {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();

      if (error) {
        return this.error('SESSION_ERROR', error.message, 500);
      }

      if (!session) {
        return this.unauthorized();
      }

      return this.success(session);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * GET /api/auth/profile
   * Gets the current user's nutritionist profile
   */
  async getProfile(): Promise<ApiResponse<Nutritionist>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    try {
      const { data, error } = await this.supabase
        .from('nutritionists')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return this.notFound('Nutritionist profile');
        }
        return this.handleSupabaseError(error);
      }

      return this.success(data as Nutritionist);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Updates the current user's nutritionist profile
   */
  async updateProfile(updates: NutritionistUpdate): Promise<ApiResponse<Nutritionist>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return this.unauthorized();
    }

    try {
      const { data, error } = await this.supabase
        .from('nutritionists')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return this.handleSupabaseError(error);
      }

      return this.success(data as Nutritionist);
    } catch (error) {
      return this.handleSupabaseError(error);
    }
  }
}
