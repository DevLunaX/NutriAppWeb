/**
 * Model for CITAS table
 * Scheduled appointments
 */
export type EstadoCita = 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada';

export interface Cita {
  id: number;
  paciente_id: number;
  fecha: string;
  hora: string;
  doctor_area?: string;
  motivo?: string;
  estado: EstadoCita;
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface CitaCreate {
  paciente_id: number;
  fecha: string;
  hora: string;
  doctor_area?: string;
  motivo?: string;
  estado?: EstadoCita;
}

export interface CitaUpdate {
  fecha?: string;
  hora?: string;
  doctor_area?: string;
  motivo?: string;
  estado?: EstadoCita;
}
