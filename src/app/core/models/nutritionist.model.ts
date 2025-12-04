export interface Nutritionist {
  id: string;
  email: string;
  full_name: string;
  license_number?: string;
  specialization?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionistCreate {
  email: string;
  full_name: string;
  license_number?: string;
  specialization?: string;
  phone?: string;
}

export interface NutritionistUpdate {
  full_name?: string;
  license_number?: string;
  specialization?: string;
  phone?: string;
}
