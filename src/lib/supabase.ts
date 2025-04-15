
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwrewjcupchmbcenrhnn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cmV3amN1cGNobWJjZW5yaG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDE3OTEsImV4cCI6MjA2MDI3Nzc5MX0.sJHBMadsZFTfC8cgNJgpdeCMFHPA9610dc_pugrF4l4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
};

export type FoodHistory = {
  id: string;
  image_url: string;
  item_name: string;
  status: 'Good' | 'Average' | 'Bad';
  date: string;
  user_id: string;
  varieties?: string;
  quality_reason?: string;
  nutrition_details?: any;
  recipes?: any[];
  storage_advice?: string;
  expiry_duration?: string;
  expiry_warning?: boolean;
  fun_fact?: string;
  artificial_coating?: any;
  recipe_suggestions?: any[];
  health_warnings?: string[];
};
