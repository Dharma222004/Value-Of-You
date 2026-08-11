-- ====================================================================
-- HUMAN VALUE SCORE PLATFORM — UNIFIED ALL-IN-ONE SCHEMA V2
-- ====================================================================
-- PURPOSE: Complete, idempotent schema for ALL platform tables.
-- SAFE TO RUN: All statements use IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
-- HOW TO RUN: Paste into Supabase SQL Editor → Click Run.
-- ====================================================================

-- ====================================================================
-- STEP 1: Core Extensions
-- ====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- STEP 2: Profiles table columns
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email',
    human_value_score NUMERIC DEFAULT 0,
    assessment_completed BOOLEAN DEFAULT FALSE,
    phone TEXT,
    language TEXT DEFAULT 'English',
    theme TEXT DEFAULT 'dark',
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark',
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS human_value_score NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ====================================================================
-- STEP 3: module_data table (Primary store for all 5 module form states)
-- Keys: 'master_profile' | 'financial' | 'skills' | 'health' | 'assessments'
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.module_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE,
    score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module_data UNIQUE (user_id, module_key)
);

CREATE INDEX IF NOT EXISTS idx_module_data_user_id ON public.module_data(user_id);
CREATE INDEX IF NOT EXISTS idx_module_data_module_key ON public.module_data(module_key);
CREATE INDEX IF NOT EXISTS idx_module_data_user_module ON public.module_data(user_id, module_key);

ALTER TABLE public.module_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own module data" ON public.module_data;
CREATE POLICY "Users can view own module data" ON public.module_data FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own module data" ON public.module_data;
CREATE POLICY "Users can insert own module data" ON public.module_data FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own module data" ON public.module_data;
CREATE POLICY "Users can update own module data" ON public.module_data FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own module data" ON public.module_data;
CREATE POLICY "Users can delete own module data" ON public.module_data FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 4: module_progress table (Sequential workflow gating)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'completed'
    completion_percentage NUMERIC DEFAULT 0,
    score NUMERIC DEFAULT 0,
    unlocked BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module_progress UNIQUE (user_id, module_key)
);

CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_key ON public.module_progress(user_id, module_key);

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
CREATE POLICY "Users can view own module progress" ON public.module_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
CREATE POLICY "Users can insert own module progress" ON public.module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
CREATE POLICY "Users can update own module progress" ON public.module_progress FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own module progress" ON public.module_progress;
CREATE POLICY "Users can delete own module progress" ON public.module_progress FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 5: financial_profiles table (Structured financial telemetry)
-- ====================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_financial_profile UNIQUE (user_id)
);

ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can view own financial profile" ON public.financial_profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can insert own financial profile" ON public.financial_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own financial profile" ON public.financial_profiles;
CREATE POLICY "Users can update own financial profile" ON public.financial_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 6: human_values_tests table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.human_values_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC DEFAULT 0,
    category_scores JSONB DEFAULT '{}'::jsonb,
    level TEXT DEFAULT 'beginner',
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.human_values_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own human values tests" ON public.human_values_tests;
CREATE POLICY "Users can view own human values tests" ON public.human_values_tests FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own human values tests" ON public.human_values_tests;
CREATE POLICY "Users can insert own human values tests" ON public.human_values_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- STEP 7: assessments table & results
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Human Capital Assessment',
    assessment_type TEXT DEFAULT 'comprehensive',
    status TEXT DEFAULT 'completed',
    score NUMERIC DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own assessments" ON public.assessments;
CREATE POLICY "Users can update own assessments" ON public.assessments FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 8: ai_module_evaluations table (Per-module AI outputs)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.ai_module_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    agent_id INTEGER NOT NULL DEFAULT 1,
    model_used TEXT,
    provider TEXT,
    score NUMERIC DEFAULT 0,
    evaluation_json JSONB DEFAULT '{}'::jsonb,
    raw_output TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module_eval UNIQUE (user_id, module_key)
);

ALTER TABLE public.ai_module_evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own module evals" ON public.ai_module_evaluations;
CREATE POLICY "Users can view own module evals" ON public.ai_module_evaluations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own module evals" ON public.ai_module_evaluations;
CREATE POLICY "Users can insert own module evals" ON public.ai_module_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own module evals" ON public.ai_module_evaluations;
CREATE POLICY "Users can update own module evals" ON public.ai_module_evaluations FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 9: ai_reports table (Final Master Mentor Report)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_version TEXT NOT NULL DEFAULT 'v5.0',
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    executive_summary JSONB DEFAULT '[]'::jsonb,
    overall_summary TEXT,
    scores_json JSONB DEFAULT '{}'::jsonb,
    report_json JSONB DEFAULT '{}'::jsonb,
    mentor_action_plan JSONB DEFAULT '{}'::jsonb,
    risk_vectors JSONB DEFAULT '{}'::jsonb,
    top_strengths JSONB DEFAULT '[]'::jsonb,
    top_weaknesses JSONB DEFAULT '[]'::jsonb,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    confidence_score NUMERIC NOT NULL DEFAULT 0,
    data_hash TEXT DEFAULT '',
    models_used JSONB DEFAULT '[]'::jsonb,
    ai_model TEXT DEFAULT 'Multi-Agent Pipeline',
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_ai_report UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON public.ai_reports(user_id);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can view own ai_reports" ON public.ai_reports FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can insert own ai_reports" ON public.ai_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can update own ai_reports" ON public.ai_reports FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can delete own ai_reports" ON public.ai_reports FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 10: ai_evaluations table (Compatible legacy evaluation store)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    summary TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    career_matches JSONB DEFAULT '[]'::jsonb,
    confidence_score NUMERIC DEFAULT 0.95,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own ai_evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can view own ai_evaluations" ON public.ai_evaluations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own ai_evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can insert own ai_evaluations" ON public.ai_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own ai_evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can update own ai_evaluations" ON public.ai_evaluations FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own ai_evaluations" ON public.ai_evaluations;
CREATE POLICY "Users can delete own ai_evaluations" ON public.ai_evaluations FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 11: dashboard_summary table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.dashboard_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed_modules INTEGER DEFAULT 0,
    total_modules INTEGER DEFAULT 5,
    overall_score NUMERIC DEFAULT 0,
    human_capital_score NUMERIC DEFAULT 0,
    ai_ready BOOLEAN DEFAULT FALSE,
    executive_ready BOOLEAN DEFAULT FALSE,
    last_computed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_dashboard_summary UNIQUE (user_id)
);

ALTER TABLE public.dashboard_summary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can view own dashboard summary" ON public.dashboard_summary FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can insert own dashboard summary" ON public.dashboard_summary FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can update own dashboard summary" ON public.dashboard_summary FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 12: memory table (Fast key-value cache)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    confidence NUMERIC DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_memory_key UNIQUE (user_id, key)
);

ALTER TABLE public.memory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own memory" ON public.memory;
CREATE POLICY "Users can view own memory" ON public.memory FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own memory" ON public.memory;
CREATE POLICY "Users can insert own memory" ON public.memory FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own memory" ON public.memory;
CREATE POLICY "Users can update own memory" ON public.memory FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- STEP 13: learning_progress & ai_recommendations tables
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module TEXT NOT NULL,
    lesson TEXT,
    completion_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_learning_module UNIQUE (user_id, module)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own learning progress" ON public.learning_progress;
CREATE POLICY "Users can view own learning progress" ON public.learning_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own learning progress" ON public.learning_progress;
CREATE POLICY "Users can insert own learning progress" ON public.learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own learning progress" ON public.learning_progress;
CREATE POLICY "Users can update own learning progress" ON public.learning_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own ai recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view own ai recommendations" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own ai recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can insert own ai recommendations" ON public.ai_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- STEP 14: Auto-update updated_at triggers
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_module_data_updated_at ON public.module_data;
CREATE TRIGGER set_module_data_updated_at
    BEFORE UPDATE ON public.module_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_module_progress_updated_at ON public.module_progress;
CREATE TRIGGER set_module_progress_updated_at
    BEFORE UPDATE ON public.module_progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_ai_reports_updated_at ON public.ai_reports;
CREATE TRIGGER set_ai_reports_updated_at
    BEFORE UPDATE ON public.ai_reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- STEP 15: Auto-init module_progress on profile creation
-- ====================================================================
CREATE OR REPLACE FUNCTION public.init_module_progress_for_user()
RETURNS TRIGGER AS $$
DECLARE
    module_keys TEXT[] := ARRAY['master_profile', 'financial', 'skills', 'health', 'assessments'];
    mk TEXT;
BEGIN
    FOREACH mk IN ARRAY module_keys LOOP
        INSERT INTO public.module_progress (user_id, module_key, status, unlocked)
        VALUES (
            NEW.id,
            mk,
            'not_started',
            mk = 'master_profile'
        )
        ON CONFLICT (user_id, module_key) DO NOTHING;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_init_modules ON public.profiles;
CREATE TRIGGER on_profile_created_init_modules
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.init_module_progress_for_user();

-- ====================================================================
-- STEP 16: Auto-sync from module_data to module_progress
-- When user saves a module, automatically update module_progress
-- ====================================================================
CREATE OR REPLACE FUNCTION public.sync_module_data_to_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.module_progress (
        user_id,
        module_key,
        status,
        completion_percentage,
        score,
        unlocked,
        completed_at,
        updated_at
    )
    VALUES (
        NEW.user_id,
        NEW.module_key,
        CASE WHEN NEW.is_completed THEN 'completed' ELSE 'in_progress' END,
        CASE WHEN NEW.is_completed THEN 100 ELSE 50 END,
        NEW.score,
        TRUE,
        CASE WHEN NEW.is_completed THEN NOW() ELSE NULL END,
        NOW()
    )
    ON CONFLICT (user_id, module_key) DO UPDATE SET
        status = CASE WHEN EXCLUDED.status = 'completed' THEN 'completed' ELSE public.module_progress.status END,
        completion_percentage = CASE WHEN EXCLUDED.status = 'completed' THEN 100 ELSE GREATEST(public.module_progress.completion_percentage, 50) END,
        score = EXCLUDED.score,
        unlocked = TRUE,
        completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN NOW() ELSE public.module_progress.completed_at END,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_module_data_saved_sync_progress ON public.module_data;
CREATE TRIGGER on_module_data_saved_sync_progress
    AFTER INSERT OR UPDATE ON public.module_data
    FOR EACH ROW EXECUTE FUNCTION public.sync_module_data_to_progress();

-- ====================================================================
-- STEP 17: Function to refresh dashboard_summary
-- ====================================================================
CREATE OR REPLACE FUNCTION public.refresh_dashboard_summary(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_completed INTEGER;
    v_total INTEGER := 5;
    v_avg_score NUMERIC;
    v_has_report BOOLEAN;
BEGIN
    SELECT
        COUNT(*) FILTER (WHERE status = 'completed'),
        AVG(score) FILTER (WHERE status = 'completed' AND score > 0)
    INTO v_completed, v_avg_score
    FROM public.module_progress
    WHERE user_id = p_user_id;

    SELECT EXISTS (
        SELECT 1 FROM public.ai_reports WHERE user_id = p_user_id
    ) INTO v_has_report;

    INSERT INTO public.dashboard_summary
        (user_id, completed_modules, total_modules, overall_score, human_capital_score, ai_ready, executive_ready, last_computed_at)
    VALUES
        (p_user_id, COALESCE(v_completed, 0), v_total, COALESCE(v_avg_score, 0), COALESCE(v_avg_score, 0), v_has_report, v_has_report, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        completed_modules = EXCLUDED.completed_modules,
        overall_score = EXCLUDED.overall_score,
        human_capital_score = EXCLUDED.human_capital_score,
        ai_ready = EXCLUDED.ai_ready,
        executive_ready = EXCLUDED.executive_ready,
        last_computed_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- UNIFIED SCHEMA V2 READY
-- ====================================================================
