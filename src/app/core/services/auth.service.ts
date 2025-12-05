import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Nutritionist, NutritionistCreate } from '../models/nutritionist.model';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);
  currentNutritionist = signal<Nutritionist | null>(null);
  isLoading = signal<boolean>(true);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();

      if (session?.user) {
        this.currentUser.set(session.user);
        await this.loadNutritionistProfile(session.user.id);
      }

      this.supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          this.currentUser.set(session.user);
          await this.loadNutritionistProfile(session.user.id);
        } else {
          this.currentUser.set(null);
          this.currentNutritionist.set(null);
        }
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadNutritionistProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('nutritionists')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      this.currentNutritionist.set(data as Nutritionist);
    }
  }

  async register(
    email: string,
    password: string,
    nutritionistData: NutritionistCreate
  ): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (authData.user) {
        const { error: profileError } = await this.supabase.from('nutritionists').insert({
          ...nutritionistData,
          id: authData.user.id,
          email: authData.user.email,
        });

        if (profileError) {
          return { success: false, message: profileError.message };
        }

        return {
          success: true,
          message: 'Registration successful. Please check your email for verification.',
          user: authData.user,
        };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        return {
          success: true,
          message: 'Login successful',
          user: data.user,
        };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.currentNutritionist.set(null);
    await this.router.navigate(['/']);
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async updateProfile(updates: Partial<Nutritionist>): Promise<AuthResponse> {
    const user = this.currentUser();
    if (!user) {
      return { success: false, message: 'No authenticated user' };
    }

    try {
      const { error } = await this.supabase
        .from('nutritionists')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, message: error.message };
      }

      await this.loadNutritionistProfile(user.id);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    return session;
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
