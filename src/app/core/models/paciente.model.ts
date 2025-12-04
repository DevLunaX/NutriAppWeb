/**
 * Model for PACIENTES table
 * Patient basic information
 */
export interface Paciente {
  id: number;
  nombre: string;
  numero_control: string;
  sexo?: 'M' | 'F';
  edad?: number;
  carrera?: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  activo: boolean;
}

export interface PacienteCreate {
  nombre: string;
  numero_control: string;
  sexo?: 'M' | 'F';
  edad?: number;
  carrera?: string;
}

export interface PacienteUpdate {
  nombre?: string;
  numero_control?: string;
  sexo?: 'M' | 'F';
  edad?: number;
  carrera?: string;
  activo?: boolean;
}
