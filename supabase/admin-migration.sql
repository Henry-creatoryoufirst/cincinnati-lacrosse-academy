-- ============================================================================
-- Admin Role Migration
-- Cincinnati Lacrosse Academy
--
-- This migration adds admin role support to the application:
--   1. Adds a 'role' column to profiles
--   2. Creates an is_admin() helper function
--   3. Adds RLS policies on events for admin CRUD operations
--   4. Updates the SELECT policy on events so admins see all rows
--   5. Adds RLS policy on profiles so admins can view all profiles
-- ============================================================================

-- ============================================================================
-- 1. Add 'role' column to profiles table
-- ============================================================================

-- Only add the column if it does not already exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profiles'
          AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles
            ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
    END IF;
END
$$;

-- Apply a CHECK constraint so the value is always 'user' or 'admin'.
-- Drop first if it already exists to make the migration re-runnable.
ALTER TABLE profiles
    DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
    ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('user', 'admin'));

-- ============================================================================
-- 2. Create is_admin() helper function
--    Returns TRUE when the currently authenticated user has role = 'admin'.
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM profiles
        WHERE user_id = auth.uid()
          AND role = 'admin'
    );
$$;

-- ============================================================================
-- 3. RLS policies on the events table for admin operations
-- ============================================================================

-- ----- SELECT -----
-- Drop the existing restrictive SELECT policy and replace it with one that
-- lets regular users see only active events while admins see everything.
DROP POLICY IF EXISTS "Anyone can view active events" ON events;

CREATE POLICY "Anyone can view active events, admins can view all"
    ON events
    FOR SELECT
    USING (
        is_active = true
        OR is_admin()
    );

-- ----- INSERT -----
DROP POLICY IF EXISTS "Only admins can insert events" ON events;

CREATE POLICY "Only admins can insert events"
    ON events
    FOR INSERT
    WITH CHECK (
        is_admin()
    );

-- ----- UPDATE -----
DROP POLICY IF EXISTS "Only admins can update events" ON events;

CREATE POLICY "Only admins can update events"
    ON events
    FOR UPDATE
    USING  ( is_admin() )
    WITH CHECK ( is_admin() );

-- ----- DELETE -----
DROP POLICY IF EXISTS "Only admins can delete events" ON events;

CREATE POLICY "Only admins can delete events"
    ON events
    FOR DELETE
    USING (
        is_admin()
    );

-- ============================================================================
-- 4. RLS policy on profiles so admins can view all profiles
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (
        is_admin()
    );

-- ============================================================================
-- 5. How to promote a user to admin
-- ============================================================================

-- To grant admin privileges to a user, run the following query in the
-- Supabase SQL editor (or via psql), replacing the UUID with the target
-- user's id from auth.users:
--
--   UPDATE profiles SET role = 'admin' WHERE user_id = '<user-uuid-here>';
--
-- Example:
--   UPDATE profiles SET role = 'admin' WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
--
-- To revoke admin privileges:
--   UPDATE profiles SET role = 'user' WHERE user_id = '<user-uuid-here>';
