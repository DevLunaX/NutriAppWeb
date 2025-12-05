/**
 * Model for ANTROPOMETRIA table
 * Anthropometric measurements
 */
export interface Antropometria {
  id: number;
  paciente_id: number;
  peso: number;
  talla: number;
  imc: number;
  fecha_medicion: string;
  fecha_actualizacion: string;
}

export interface AntropometriaCreate {
  paciente_id: number;
  peso: number;
  talla: number;
  // IMC is calculated by trigger in database
}

export interface AntropometriaUpdate {
  peso?: number;
  talla?: number;
  // IMC is calculated by trigger in database
}
