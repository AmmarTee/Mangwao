import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Supabase client configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for database tables
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'customer' | 'rider' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label?: string;
  address_line: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

export interface RiderProfile {
  id: string;
  user_id: string;
  tier: 'basic' | 'premium' | 'gold';
  deposit_amount: number;
  deposit_status: 'pending' | 'paid' | 'refunded';
  cnic_number?: string;
  cnic_photo_url?: string;
  selfie_url?: string;
  bike_papers_url?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_online: boolean;
  rating_avg: number;
  total_deliveries: number;
  strike_count: number;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  rider_id?: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_contact_name: string;
  pickup_contact_phone: string;
  drop_address: string;
  drop_lat: number;
  drop_lng: number;
  drop_contact_name: string;
  drop_contact_phone: string;
  item_description: string;
  is_sealed: boolean;
  pickup_photo_url?: string;
  drop_photo_url?: string;
  pickup_otp?: string;
  drop_otp?: string;
  pickup_otp_verified_at?: string;
  drop_otp_verified_at?: string;
  distance_km?: number;
  base_fee?: number;
  distance_fee?: number;
  total_fee?: number;
  payment_method: 'cod' | 'transfer';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_screenshot_url?: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  order_id: string;
  rater_id: string;
  rated_id: string;
  rater_type: 'customer' | 'rider';
  rating: number;
  feedback?: string;
  safety_flag: boolean;
  created_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  reporter_id: string;
  issue_type: 'missing_item' | 'wrong_item' | 'damaged' | 'late' | 'other';
  description: string;
  evidence_photo_urls?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RiderLocation {
  id: string;
  rider_id: string;
  order_id?: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  created_at: string;
}

export interface PricingConfig {
  id: string;
  base_fee: number;
  per_km_fee: number;
  surge_multiplier: number;
  is_surge_active: boolean;
  effective_from: string;
  created_at: string;
}

export interface RestrictedItem {
  id: string;
  item_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}
