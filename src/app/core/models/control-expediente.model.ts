/**
 * Model for CONTROL_EXPEDIENTES table
 * Medical records control
 */
export interface ControlExpediente {
  id: number;
  paciente_id: number;
  orientaciones?: string;
  hcn?: string;
  plan_alimentacion?: string;
  primera_vez: boolean;
  seguimiento: boolean;
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface ControlExpedienteCreate {
  paciente_id: number;
  orientaciones?: string;
  hcn?: string;
  plan_alimentacion?: string;
  primera_vez?: boolean;
  seguimiento?: boolean;
}

export interface ControlExpedienteUpdate {
  orientaciones?: string;
  hcn?: string;
  plan_alimentacion?: string;
  primera_vez?: boolean;
  seguimiento?: boolean;
}
