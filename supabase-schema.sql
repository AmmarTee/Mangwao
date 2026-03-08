-- Mangwao Database Schema SQL
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('customer', 'rider', 'admin');
CREATE TYPE rider_tier AS ENUM ('basic', 'premium', 'gold');
CREATE TYPE deposit_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payment_method AS ENUM ('cod', 'transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE rater_type AS ENUM ('customer', 'rider');
CREATE TYPE issue_type AS ENUM ('missing_item', 'wrong_item', 'damaged', 'late', 'other');
CREATE TYPE dispute_status AS ENUM ('open', 'investigating', 'resolved', 'closed');

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  address_line TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rider profiles table
CREATE TABLE rider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier rider_tier NOT NULL DEFAULT 'basic',
  deposit_amount DECIMAL(10, 2) NOT NULL,
  deposit_status deposit_status DEFAULT 'pending',
  cnic_number TEXT,
  cnic_photo_url TEXT,
  selfie_url TEXT,
  bike_papers_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  strike_count INTEGER DEFAULT 0,
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8) NOT NULL,
  pickup_lng DECIMAL(11, 8) NOT NULL,
  pickup_contact_name TEXT NOT NULL,
  pickup_contact_phone TEXT NOT NULL,
  drop_address TEXT NOT NULL,
  drop_lat DECIMAL(10, 8) NOT NULL,
  drop_lng DECIMAL(11, 8) NOT NULL,
  drop_contact_name TEXT NOT NULL,
  drop_contact_phone TEXT NOT NULL,
  item_description TEXT NOT NULL,
  is_sealed BOOLEAN DEFAULT FALSE,
  pickup_photo_url TEXT,
  drop_photo_url TEXT,
  pickup_otp TEXT,
  drop_otp TEXT,
  pickup_otp_verified_at TIMESTAMP WITH TIME ZONE,
  drop_otp_verified_at TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL(6, 2),
  base_fee DECIMAL(10, 2),
  distance_fee DECIMAL(10, 2),
  total_fee DECIMAL(10, 2),
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_screenshot_url TEXT,
  status order_status DEFAULT 'pending',
  accepted_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rater_type rater_type NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  safety_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes table
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_type issue_type NOT NULL,
  description TEXT NOT NULL,
  evidence_photo_urls TEXT[],
  status dispute_status DEFAULT 'open',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rider locations table (for live tracking)
CREATE TABLE rider_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2),
  speed DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing config table
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_fee DECIMAL(10, 2) NOT NULL,
  per_km_fee DECIMAL(10, 2) NOT NULL,
  surge_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  is_surge_active BOOLEAN DEFAULT FALSE,
  effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restricted items table
CREATE TABLE restricted_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_rider_profiles_user ON rider_profiles(user_id);
CREATE INDEX idx_rider_locations_rider ON rider_locations(rider_id);
CREATE INDEX idx_rider_locations_order ON rider_locations(order_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_ratings_order ON ratings(order_id);
CREATE INDEX idx_disputes_order ON disputes(order_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for addresses
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for rider_profiles
CREATE POLICY "Riders can view their own profile" ON rider_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Riders can insert their own profile" ON rider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Riders can update their own availability" ON rider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Riders can view their assigned orders" ON orders
  FOR SELECT USING (
    auth.uid() = rider_id 
    OR EXISTS (
      SELECT 1 FROM rider_profiles 
      WHERE rider_profiles.user_id = auth.uid() 
      AND rider_profiles.is_online = TRUE
      AND orders.status = 'pending'
    )
  );

CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Riders can update their assigned orders" ON orders
  FOR UPDATE USING (auth.uid() = rider_id);

-- RLS Policies for ratings
CREATE POLICY "Users can view ratings where they are involved" ON ratings
  FOR SELECT USING (auth.uid() = rater_id OR auth.uid() = rated_id);

CREATE POLICY "Users can insert ratings for completed orders" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = rater_id 
    AND EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.status = 'delivered'
      AND (orders.customer_id = auth.uid() OR orders.rider_id = auth.uid())
    )
  );

-- RLS Policies for disputes
CREATE POLICY "Users can view their own disputes" ON disputes
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create disputes for their orders" ON disputes
  FOR INSERT WITH CHECK (
    auth.uid() = reporter_id 
    AND EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND (orders.customer_id = auth.uid() OR orders.rider_id = auth.uid())
    )
  );

-- RLS Policies for rider_locations
CREATE POLICY "Riders can insert their own locations" ON rider_locations
  FOR INSERT WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Users can view locations for their orders" ON rider_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND (orders.customer_id = auth.uid() OR orders.rider_id = auth.uid())
    )
  );

-- Insert default pricing config
INSERT INTO pricing_config (base_fee, per_km_fee) 
VALUES (50.00, 15.00);

-- Insert restricted items
INSERT INTO restricted_items (item_name, description) VALUES
  ('Alcohol', 'All alcoholic beverages prohibited'),
  ('Cigarettes', 'All tobacco products prohibited'),
  ('Narcotics', 'All illegal substances prohibited'),
  ('Weapons', 'Any type of weapon prohibited');

-- Function to generate OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rider_profiles_updated_at BEFORE UPDATE ON rider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
