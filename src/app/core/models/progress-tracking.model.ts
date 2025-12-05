export interface ProgressTracking {
  id: string;
  patient_id: string;
  nutritionist_id: string;
  tracking_date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  chest_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  water_intake_ml?: number;
  sleep_hours?: number;
  exercise_minutes?: number;
  mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy_level?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressTrackingCreate {
  patient_id: string;
  tracking_date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  chest_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  water_intake_ml?: number;
  sleep_hours?: number;
  exercise_minutes?: number;
  mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy_level?: number;
  notes?: string;
}

export interface ProgressTrackingUpdate {
  tracking_date?: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  chest_cm?: number;
  arm_cm?: number;
  thigh_cm?: number;
  water_intake_ml?: number;
  sleep_hours?: number;
  exercise_minutes?: number;
  mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy_level?: number;
  notes?: string;
}
