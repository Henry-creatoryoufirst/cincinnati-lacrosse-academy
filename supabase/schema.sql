-- Cincinnati Lacrosse Academy Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  position TEXT,
  membership_status TEXT DEFAULT 'none' CHECK (membership_status IN ('none', 'active', 'expired', 'cancelled')),
  membership_plan TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('training', 'camp', 'tournament', 'clinic', 'scrimmage')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  max_participants INTEGER NOT NULL DEFAULT 50,
  current_participants INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  member_price DECIMAL(10, 2),
  image_url TEXT,
  skill_levels TEXT[] DEFAULT '{}',
  age_groups TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  participant_name TEXT NOT NULL,
  participant_age INTEGER,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  amount_paid DECIMAL(10, 2),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Memberships table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Events policies (public read, admin write)
CREATE POLICY "Anyone can view active events"
  ON events FOR SELECT
  USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Memberships policies
CREATE POLICY "Users can view their own membership"
  ON memberships FOR SELECT
  USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update event participant count
CREATE OR REPLACE FUNCTION update_event_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE events SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE events SET current_participants = current_participants + 1
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE events SET current_participants = current_participants - 1
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE events SET current_participants = current_participants - 1
    WHERE id = OLD.event_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for booking changes
CREATE TRIGGER on_booking_change
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_event_participants();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample data for events
INSERT INTO events (title, description, event_type, start_date, end_date, location, address, max_participants, price, member_price, skill_levels, age_groups) VALUES
  ('Spring Training Camp', 'Intensive 3-day camp focusing on fundamentals, game IQ, and position-specific training.', 'camp', '2025-03-15 08:00:00', '2025-03-17 17:00:00', 'CLA Training Center', '123 Lacrosse Way, Cincinnati, OH', 50, 299.00, 249.00, ARRAY['intermediate', 'advanced'], ARRAY['12-14', '15-18']),
  ('Youth Skills Clinic', 'Perfect for beginners looking to learn the basics of lacrosse in a fun environment.', 'clinic', '2025-03-22 09:00:00', '2025-03-22 12:00:00', 'Kennedy Heights Park', '6625 Montgomery Rd, Cincinnati, OH', 30, 75.00, 50.00, ARRAY['beginner'], ARRAY['8-11']),
  ('Weekly Training Session', 'Regular training sessions to hone your skills. Available every Saturday.', 'training', '2025-03-08 09:00:00', '2025-03-08 11:00:00', 'CLA Training Center', '123 Lacrosse Way, Cincinnati, OH', 25, 35.00, 0.00, ARRAY['beginner', 'intermediate', 'advanced'], ARRAY['10-18']),
  ('Elite Player Showcase', 'Showcase your skills in front of college coaches. Video highlights included.', 'tournament', '2025-04-05 08:00:00', '2025-04-06 18:00:00', 'University of Cincinnati', '2751 O''Varsity Way, Cincinnati, OH', 100, 175.00, 150.00, ARRAY['advanced', 'elite'], ARRAY['15-18']),
  ('Summer Lacrosse Camp', 'Week-long immersive camp with daily training, scrimmages, and team building activities.', 'camp', '2025-06-16 08:00:00', '2025-06-20 17:00:00', 'Miami University', '501 E High St, Oxford, OH', 80, 599.00, 499.00, ARRAY['intermediate', 'advanced', 'elite'], ARRAY['12-18']);
