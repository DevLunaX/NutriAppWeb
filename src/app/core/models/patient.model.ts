export interface Patient {
  id: string;
  nutritionist_id: string;
  full_name: string;
  control_number?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  career?: string;
  // Anthropometry
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  // Diagnosis
  diagnosis?: PatientDiagnosis;
  // Medical records control
  medical_records?: MedicalRecords;
  // Other
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientDiagnosis {
  malnutrition?: boolean;
  underweight?: boolean;
  healthy_weight?: boolean;
  overweight?: boolean;
  obesity_1?: boolean;
  obesity_2?: boolean;
  obesity_3?: boolean;
  diabetes?: boolean;
  hypertension?: boolean;
  dyslipidemia?: boolean;
  nephropathy?: boolean;
  other?: string;
}

export interface MedicalRecords {
  orientations?: string;
  hcn?: string;
  meal_plan_type?: string;
  first_visit?: string;
  follow_up?: string;
}

export interface Anthropometry {
  weight_kg?: number;
  height_cm?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
}

export interface PatientCreate {
  full_name: string;
  control_number?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  career?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  diagnosis?: PatientDiagnosis;
  medical_records?: MedicalRecords;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
}

export interface PatientUpdate {
  full_name?: string;
  control_number?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  career?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  diagnosis?: PatientDiagnosis;
  medical_records?: MedicalRecords;
  medical_conditions?: string;
  allergies?: string;
  dietary_restrictions?: string;
  goals?: string;
  notes?: string;
}
