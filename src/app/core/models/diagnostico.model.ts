/**
 * Model for DIAGNOSTICOS table
 * Patient diagnoses
 */
export interface Diagnostico {
  id: number;
  paciente_id: number;
  desnutricion: boolean;
  bajo_peso: boolean;
  peso_sano: boolean;
  sobrepeso: boolean;
  obesidad_1: boolean;
  obesidad_2: boolean;
  obesidad_3: boolean;
  diabetes: boolean;
  hipertension: boolean;
  dislipidemias: boolean;
  nefropatias: boolean;
  otros?: string;
  fecha_diagnostico: string;
  fecha_actualizacion: string;
}

export interface DiagnosticoCreate {
  paciente_id: number;
  desnutricion?: boolean;
  bajo_peso?: boolean;
  peso_sano?: boolean;
  sobrepeso?: boolean;
  obesidad_1?: boolean;
  obesidad_2?: boolean;
  obesidad_3?: boolean;
  diabetes?: boolean;
  hipertension?: boolean;
  dislipidemias?: boolean;
  nefropatias?: boolean;
  otros?: string;
}

export interface DiagnosticoUpdate {
  desnutricion?: boolean;
  bajo_peso?: boolean;
  peso_sano?: boolean;
  sobrepeso?: boolean;
  obesidad_1?: boolean;
  obesidad_2?: boolean;
  obesidad_3?: boolean;
  diabetes?: boolean;
  hipertension?: boolean;
  dislipidemias?: boolean;
  nefropatias?: boolean;
  otros?: string;
}
