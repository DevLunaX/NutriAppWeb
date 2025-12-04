export interface Consultation {
  id: string;
  patient_id: string;
  nutritionist_id: string;
  consultation_date: string;
  consultation_type: 'initial' | 'follow_up' | 'emergency';
  weight_kg?: number;
  height_cm?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  blood_pressure?: string;
  notes?: string;
  recommendations?: string;
  next_appointment?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationCreate {
  patient_id: string;
  consultation_date: string;
  consultation_type: 'initial' | 'follow_up' | 'emergency';
  weight_kg?: number;
  height_cm?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  blood_pressure?: string;
  notes?: string;
  recommendations?: string;
  next_appointment?: string;
}

export interface ConsultationUpdate {
  consultation_date?: string;
  consultation_type?: 'initial' | 'follow_up' | 'emergency';
  weight_kg?: number;
  height_cm?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  blood_pressure?: string;
  notes?: string;
  recommendations?: string;
  next_appointment?: string;
}
