-- ====================================================================
-- HUMAN VALUE SCORE PLATFORM — COMPLETE PRODUCTION DATABASE MIGRATION
-- ====================================================================
-- This migration is ADDITIVE and IDEMPOTENT.
-- It creates tables that are missing alongside the existing migration.sql tables.
-- Run this in the Supabase SQL Editor after backing up your database.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- EXISTING TABLES (from migration.sql) — Ensure they exist
-- ====================================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'google',
    human_value_score NUMERIC DEFAULT 0,
    assessment_completed BOOLEAN DEFAULT FALSE,
    theme TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'STARTED',
    progress INTEGER DEFAULT 0,
    module_count INTEGER DEFAULT 5,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ASSESSMENT QUESTIONS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    weight NUMERIC DEFAULT 1.0,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENT ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    answer JSONB NOT NULL,
    score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENT RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    overall_score NUMERIC DEFAULT 0,
    personality_score NUMERIC DEFAULT 0,
    leadership_score NUMERIC DEFAULT 0,
    communication_score NUMERIC DEFAULT 0,
    emotional_score NUMERIC DEFAULT 0,
    innovation_score NUMERIC DEFAULT 0,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    summary TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    career_matches JSONB DEFAULT '[]'::jsonb,
    confidence_score NUMERIC DEFAULT 0.95,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- NEW TABLES — Module Data, Financial Profiles, Test History, etc.
-- ====================================================================

-- MODULE DATA TABLE (Replaces localStorage for all 5 modules)
-- Stores the full JSON state of each module per user
CREATE TABLE IF NOT EXISTS public.module_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL, -- 'master_profile', 'financial', 'skills', 'health', 'assessments'
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module_data UNIQUE (user_id, module_key)
);

-- FINANCIAL PROFILES TABLE (Structured financial data)
CREATE TABLE IF NOT EXISTS public.financial_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    income NUMERIC DEFAULT 0,
    expenses NUMERIC DEFAULT 0,
    savings NUMERIC DEFAULT 0,
    investments NUMERIC DEFAULT 0,
    liabilities NUMERIC DEFAULT 0,
    net_worth NUMERIC DEFAULT 0,
    savings_rate NUMERIC DEFAULT 0,
    debt_to_income_ratio NUMERIC DEFAULT 0,
    emergency_fund_months NUMERIC DEFAULT 0,
    has_health_insurance BOOLEAN DEFAULT FALSE,
    has_life_insurance BOOLEAN DEFAULT FALSE,
    financial_score NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_financial_profile UNIQUE (user_id)
);

-- HUMAN VALUES TESTS TABLE (Test history & results)
CREATE TABLE IF NOT EXISTS public.human_values_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC DEFAULT 0,
    category_scores JSONB DEFAULT '{}'::jsonb,
    level TEXT DEFAULT 'beginner',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINANCIAL TESTS TABLE
CREATE TABLE IF NOT EXISTS public.financial_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEARNING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module TEXT NOT NULL,
    lesson TEXT,
    completion_percentage NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_learning_module UNIQUE (user_id, module)
);

-- AI RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================

-- Existing table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessment_answers_assessment_id ON public.assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON public.assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_ai_evaluations_user_id ON public.ai_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- New table indexes
CREATE INDEX IF NOT EXISTS idx_module_data_user_id ON public.module_data(user_id);
CREATE INDEX IF NOT EXISTS idx_module_data_module_key ON public.module_data(module_key);
CREATE INDEX IF NOT EXISTS idx_module_data_user_module ON public.module_data(user_id, module_key);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_user_id ON public.financial_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_human_values_tests_user_id ON public.human_values_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_human_values_tests_completed_at ON public.human_values_tests(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_tests_user_id ON public.financial_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON public.learning_progress(user_id, module);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON public.ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_generated_at ON public.ai_recommendations(generated_at DESC);

-- ====================================================================
-- AUTOMATIC TRIGGERS & FUNCTIONS
-- ====================================================================

-- 1. Automatic Timestamp Updated_At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_module_data_updated_at ON public.module_data;
CREATE TRIGGER set_module_data_updated_at
    BEFORE UPDATE ON public.module_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_financial_profiles_updated_at ON public.financial_profiles;
CREATE TRIGGER set_financial_profiles_updated_at
    BEFORE UPDATE ON public.financial_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_learning_progress_updated_at ON public.learning_progress;
CREATE TRIGGER set_learning_progress_updated_at
    BEFORE UPDATE ON public.learning_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. Automatic Auth.Users -> Public.Profiles Auto-Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        provider,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        LOWER(NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — ALL TABLES
-- ====================================================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- ASSESSMENTS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own assessments" ON public.assessments;
CREATE POLICY "Users can update own assessments" ON public.assessments FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own assessments" ON public.assessments;
CREATE POLICY "Users can delete own assessments" ON public.assessments FOR DELETE USING (auth.uid() = user_id);

-- ASSESSMENT QUESTIONS (Public Read)
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view active questions" ON public.assessment_questions;
CREATE POLICY "Everyone can view active questions" ON public.assessment_questions FOR SELECT USING (is_active = true);

-- ASSESSMENT ANSWERS
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own assessment answers" ON public.assessment_answers;
CREATE POLICY "Users can view own assessment answers" ON public.assessment_answers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can insert own assessment answers" ON public.assessment_answers;
CREATE POLICY "Users can insert own assessment answers" ON public.assessment_answers FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can delete own assessment answers" ON public.assessment_answers;
CREATE POLICY "Users can delete own assessment answers" ON public.assessment_answers FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid())
);

-- ASSESSMENT RESULTS
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own assessment results" ON public.assessment_results;
CREATE POLICY "Users can view own assessment results" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own assessment results" ON public.assessment_results;
CREATE POLICY "Users can insert own assessment results" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own assessment results" ON public.assessment_results;
CREATE POLICY "Users can delete own assessment results" ON public.assessment_results FOR DELETE USING (auth.uid() = user_id);

-- AI EVALUATIONS
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own AI evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can view own AI evaluations" ON public.ai_evaluations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own AI evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can insert own AI evaluations" ON public.ai_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own AI evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can delete own AI evaluations" ON public.ai_evaluations FOR DELETE USING (auth.uid() = user_id);

-- ACTIVITY LOGS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own activity logs" ON public.activity_logs;
CREATE POLICY "Users can delete own activity logs" ON public.activity_logs FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MODULE DATA
ALTER TABLE public.module_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own module data" ON public.module_data;
CREATE POLICY "Users can view own module data" ON public.module_data FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own module data" ON public.module_data;
CREATE POLICY "Users can insert own module data" ON public.module_data FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own module data" ON public.module_data;
CREATE POLICY "Users can update own module data" ON public.module_data FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own module data" ON public.module_data;
CREATE POLICY "Users can delete own module data" ON public.module_data FOR DELETE USING (auth.uid() = user_id);

-- FINANCIAL PROFILES
ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can view own financial profile" ON public.financial_profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can insert own financial profile" ON public.financial_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can update own financial profile" ON public.financial_profiles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can delete own financial profile" ON public.financial_profiles FOR DELETE USING (auth.uid() = user_id);

-- HUMAN VALUES TESTS
ALTER TABLE public.human_values_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own human values tests" ON public.human_values_tests;
CREATE POLICY "Users can view own human values tests" ON public.human_values_tests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own human values tests" ON public.human_values_tests;
CREATE POLICY "Users can insert own human values tests" ON public.human_values_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own human values tests" ON public.human_values_tests;
CREATE POLICY "Users can delete own human values tests" ON public.human_values_tests FOR DELETE USING (auth.uid() = user_id);

-- FINANCIAL TESTS
ALTER TABLE public.financial_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own financial tests" ON public.financial_tests;
CREATE POLICY "Users can view own financial tests" ON public.financial_tests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own financial tests" ON public.financial_tests;
CREATE POLICY "Users can insert own financial tests" ON public.financial_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own financial tests" ON public.financial_tests;
CREATE POLICY "Users can delete own financial tests" ON public.financial_tests FOR DELETE USING (auth.uid() = user_id);

-- LEARNING PROGRESS
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own learning progress" ON public.learning_progress;
CREATE POLICY "Users can view own learning progress" ON public.learning_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own learning progress" ON public.learning_progress;
CREATE POLICY "Users can insert own learning progress" ON public.learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own learning progress" ON public.learning_progress;
CREATE POLICY "Users can update own learning progress" ON public.learning_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own learning progress" ON public.learning_progress;
CREATE POLICY "Users can delete own learning progress" ON public.learning_progress FOR DELETE USING (auth.uid() = user_id);

-- AI RECOMMENDATIONS
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view own AI recommendations" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can insert own AI recommendations" ON public.ai_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own AI recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can delete own AI recommendations" ON public.ai_recommendations FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- MIGRATION COMPLETE
-- ====================================================================
