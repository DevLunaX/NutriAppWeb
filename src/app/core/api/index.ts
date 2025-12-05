/**
 * API REST Layer for NutriAppWeb
 * 
 * This module provides a REST-like API abstraction over the Supabase services.
 * All API services return standardized ApiResponse objects with HTTP status codes.
 * No authentication required - open access to all data.
 * 
 * Usage Example:
 * ```typescript
 * import { PacientesApiService } from './core/api';
 * 
 * constructor(private pacientesApi: PacientesApiService) {}
 * 
 * async loadPacientes() {
 *   const response = await this.pacientesApi.getAll();
 *   if (response.status === 200) {
 *     this.pacientes = response.data;
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

// New API Services (matching new database schema)
export * from './pacientes-api.service';
export * from './diagnosticos-api.service';
export * from './control-expedientes-api.service';
export * from './antropometria-api.service';
export * from './citas-api.service';

// Legacy API Services (kept for backward compatibility)
export * from './patients-api.service';
export * from './consultations-api.service';
export * from './meal-plans-api.service';
export * from './progress-tracking-api.service';
