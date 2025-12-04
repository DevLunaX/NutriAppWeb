/**
 * API REST Layer for NutriAppWeb
 * 
 * This module provides a REST-like API abstraction over the Supabase services.
 * All API services return standardized ApiResponse objects with HTTP status codes.
 * 
 * Usage Example:
 * ```typescript
 * import { PatientsApiService } from './core/api';
 * 
 * constructor(private patientsApi: PatientsApiService) {}
 * 
 * async loadPatients() {
 *   const response = await this.patientsApi.getAll();
 *   if (response.status === 200) {
 *     this.patients = response.data;
 *   } else {
 *     console.error(response.error?.message);
 *   }
 * }
 * ```
 */

// Models
export * from './api.model';

// Base Service
export * from './base-api.service';

// API Services
export * from './auth-api.service';
export * from './patients-api.service';
export * from './consultations-api.service';
export * from './meal-plans-api.service';
export * from './progress-tracking-api.service';
