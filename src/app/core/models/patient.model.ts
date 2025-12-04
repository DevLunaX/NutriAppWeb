export interface Patient {
  id: string;
  nutritionist_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  weight_kg?: number;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  full_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  weight_kg?: number;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
}

export interface PatientUpdate {
  full_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  weight_kg?: number;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
}
