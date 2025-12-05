export interface MealPlan {
  id: string;
  patient_id: string;
  nutritionist_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  daily_calories?: number;
  daily_protein_g?: number;
  daily_carbs_g?: number;
  daily_fat_g?: number;
  meals: MealItem[];
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealItem {
  meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'evening_snack';
  time?: string;
  foods: FoodItem[];
  notes?: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface MealPlanCreate {
  patient_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  daily_calories?: number;
  daily_protein_g?: number;
  daily_carbs_g?: number;
  daily_fat_g?: number;
  meals: MealItem[];
  notes?: string;
  is_active?: boolean;
}

export interface MealPlanUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  daily_calories?: number;
  daily_protein_g?: number;
  daily_carbs_g?: number;
  daily_fat_g?: number;
  meals?: MealItem[];
  notes?: string;
  is_active?: boolean;
}
