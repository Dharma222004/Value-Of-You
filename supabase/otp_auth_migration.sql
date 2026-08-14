-- ============================================================
-- Auth Migration: Add values_completed to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add values_completed column if it doesn't already exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS values_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Ensure assessment_completed has correct default
ALTER TABLE public.profiles
  ALTER COLUMN assessment_completed SET DEFAULT FALSE;

-- 3. Ensure human_value_score has correct default
ALTER TABLE public.profiles
  ALTER COLUMN human_value_score SET DEFAULT 0.0;

-- 4. Row Level Security — ensure all required policies exist
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  -- INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  -- UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- 5. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SUPABASE DASHBOARD SETTINGS (do these manually):
-- ============================================================
-- Authentication → Providers → Email:
--   ✅ Enable Email provider: ON
--   ✅ Confirm email: ON  <-- REQUIRED for blocking unverified logins
--   ✅ Secure email change: ON
--
-- Authentication → URL Configuration:
--   Site URL:          https://your-domain.vercel.app
--   Redirect URLs:     https://your-domain.vercel.app/auth/callback
--                      https://your-domain.vercel.app/**
-- ============================================================
