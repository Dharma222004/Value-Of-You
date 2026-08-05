-- ====================================================================
-- HUMAN CAPITAL PLATFORM — ENTERPRISE ARCHITECTURE MIGRATION
-- ====================================================================
-- This migration is ADDITIVE and IDEMPOTENT.
-- It creates enterprise-grade tables alongside existing schema.
-- Run this in the Supabase SQL Editor.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- TABLE 1: modules (Module Metadata Registry)
-- ====================================================================
-- Replaces hardcoded module definitions in TypeScript.
-- Contains display order, weights, unlock dependencies.

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    weight NUMERIC DEFAULT 1.0,
    unlock_after TEXT,  -- key of prerequisite module (NULL = always unlocked)
    is_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed module metadata
INSERT INTO public.modules (key, title, description, display_order, weight, unlock_after, is_required, is_active)
VALUES
    ('master_profile', 'Personal & Career Profile', 'Your professional identity, career history, and personal details', 1, 1.0, NULL, TRUE, TRUE),
    ('financial', 'Financial Health Intelligence', 'Income, assets, liabilities, investments, and financial wellness', 2, 1.0, 'master_profile', TRUE, TRUE),
    ('skills', 'Professional Capital Engine', 'Skills inventory, certifications, education, and professional growth', 3, 1.0, 'financial', TRUE, TRUE),
    ('health', 'Health & Lifestyle Capital', 'Physical health, mental wellness, lifestyle habits, and energy', 4, 1.0, 'skills', TRUE, TRUE),
    ('assessments', 'Human Values Assessment', 'Core values, ethics, leadership style, and behavioral patterns', 5, 1.0, 'health', TRUE, TRUE),
    ('ai_engine', 'AI Scoring Engine', 'Machine learning evaluation pipeline and scoring', 6, 1.0, 'assessments', FALSE, TRUE),
    ('executive_report', 'Executive Report', 'Comprehensive human capital dossier and recommendations', 7, 1.0, 'ai_engine', FALSE, TRUE)
ON CONFLICT (key) DO NOTHING;

-- ====================================================================
-- TABLE 2: module_progress (Single Source of Truth for Completion)
-- ====================================================================
-- Every page reads from this table to determine completion status.
-- Sidebar, Overview, Dashboard, AI Engine, Executive Report — all consume this.

CREATE TABLE IF NOT EXISTS public.module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed'
    completion_percentage NUMERIC DEFAULT 0,
    score NUMERIC DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_module_progress UNIQUE (user_id, module_key)
);

-- ====================================================================
-- TABLE 3: dashboard_summary (Pre-Computed Dashboard Aggregate)
-- ====================================================================
-- One row per user. Updated by triggers whenever module_progress changes.
-- Overview page reads this directly — no recalculation needed.

CREATE TABLE IF NOT EXISTS public.dashboard_summary (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    completed_modules INTEGER DEFAULT 0,
    total_modules INTEGER DEFAULT 5,
    overall_progress NUMERIC DEFAULT 0,
    overall_score NUMERIC DEFAULT 0,
    human_capital_score NUMERIC DEFAULT 0,
    financial_score NUMERIC DEFAULT 0,
    skills_score NUMERIC DEFAULT 0,
    health_score NUMERIC DEFAULT 0,
    values_score NUMERIC DEFAULT 0,
    ai_ready BOOLEAN DEFAULT FALSE,
    executive_ready BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 4: executive_reports (Generated Report Tracking)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.executive_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',  -- 'pending', 'generating', 'completed', 'failed'
    summary TEXT,
    pdf_url TEXT,
    generated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 5: ai_pipeline (AI Workflow Status)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.ai_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    embedding_status TEXT DEFAULT 'pending',
    evaluation_status TEXT DEFAULT 'pending',
    report_status TEXT DEFAULT 'pending',
    last_run TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_ai_pipeline UNIQUE (user_id)
);

-- ====================================================================
-- TABLE 6: skills_inventory (Normalized Skills Data)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.skills_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT,
    experience_years NUMERIC DEFAULT 0,
    proficiency TEXT DEFAULT 'beginner',  -- 'beginner', 'intermediate', 'advanced', 'expert'
    score NUMERIC DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 7: health_metrics (Normalized Health Data)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.health_metrics (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    sleep_hours NUMERIC DEFAULT 0,
    exercise_days_per_week NUMERIC DEFAULT 0,
    nutrition_score NUMERIC DEFAULT 0,
    stress_level NUMERIC DEFAULT 0,
    mental_health_score NUMERIC DEFAULT 0,
    energy_level NUMERIC DEFAULT 0,
    bmi NUMERIC DEFAULT 0,
    overall_score NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 8: human_value_dimensions (Normalized Values Breakdown)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.human_value_dimensions (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    integrity NUMERIC DEFAULT 0,
    leadership NUMERIC DEFAULT 0,
    communication NUMERIC DEFAULT 0,
    decision_making NUMERIC DEFAULT 0,
    adaptability NUMERIC DEFAULT 0,
    innovation NUMERIC DEFAULT 0,
    discipline NUMERIC DEFAULT 0,
    empathy NUMERIC DEFAULT 0,
    ethics NUMERIC DEFAULT 0,
    learning NUMERIC DEFAULT 0,
    overall_score NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_key ON public.module_progress(module_key);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_module ON public.module_progress(user_id, module_key);
CREATE INDEX IF NOT EXISTS idx_module_progress_status ON public.module_progress(status);
CREATE INDEX IF NOT EXISTS idx_modules_key ON public.modules(key);
CREATE INDEX IF NOT EXISTS idx_modules_display_order ON public.modules(display_order);
CREATE INDEX IF NOT EXISTS idx_executive_reports_user_id ON public.executive_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_executive_reports_status ON public.executive_reports(status);
CREATE INDEX IF NOT EXISTS idx_ai_pipeline_user_id ON public.ai_pipeline(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_inventory_user_id ON public.skills_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_inventory_category ON public.skills_inventory(category);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_human_value_dimensions_user_id ON public.human_value_dimensions(user_id);

-- ====================================================================
-- DATABASE VIEWS
-- ====================================================================

-- View 1: user_dashboard_view
-- Single query to power the Overview page
CREATE OR REPLACE VIEW public.user_dashboard_view AS
SELECT
    p.id AS user_id,
    p.full_name,
    p.email,
    p.avatar_url,
    p.human_value_score,
    COALESCE(ds.completed_modules, 0) AS completed_modules,
    COALESCE(ds.total_modules, 5) AS total_modules,
    COALESCE(ds.overall_progress, 0) AS overall_progress,
    COALESCE(ds.overall_score, 0) AS overall_score,
    COALESCE(ds.human_capital_score, 0) AS human_capital_score,
    COALESCE(ds.financial_score, 0) AS financial_score,
    COALESCE(ds.skills_score, 0) AS skills_score,
    COALESCE(ds.health_score, 0) AS health_score,
    COALESCE(ds.values_score, 0) AS values_score,
    COALESCE(ds.ai_ready, FALSE) AS ai_ready,
    COALESCE(ds.executive_ready, FALSE) AS executive_ready,
    ds.updated_at AS summary_updated_at
FROM public.profiles p
LEFT JOIN public.dashboard_summary ds ON ds.user_id = p.id;

-- View 2: module_progress_view
-- Enriched module progress with metadata
CREATE OR REPLACE VIEW public.module_progress_view AS
SELECT
    mp.user_id,
    mp.module_key,
    m.title AS module_title,
    m.display_order,
    m.weight,
    m.unlock_after,
    m.is_required,
    mp.status,
    mp.completion_percentage,
    mp.score,
    mp.started_at,
    mp.completed_at,
    mp.updated_at
FROM public.module_progress mp
JOIN public.modules m ON m.key = mp.module_key
ORDER BY m.display_order;

-- View 3: assessment_summary_view
-- Per-user aggregate of assessment results
CREATE OR REPLACE VIEW public.assessment_summary_view AS
SELECT
    ar.user_id,
    COUNT(*) AS total_attempts,
    MAX(ar.overall_score) AS best_overall_score,
    AVG(ar.overall_score) AS avg_overall_score,
    MAX(ar.personality_score) AS best_personality,
    MAX(ar.leadership_score) AS best_leadership,
    MAX(ar.communication_score) AS best_communication,
    MAX(ar.emotional_score) AS best_emotional,
    MAX(ar.innovation_score) AS best_innovation,
    MAX(ar.generated_at) AS latest_attempt_at
FROM public.assessment_results ar
GROUP BY ar.user_id;

-- View 4: executive_summary_view
-- Report readiness status
CREATE OR REPLACE VIEW public.executive_summary_view AS
SELECT
    ds.user_id,
    ds.completed_modules,
    ds.overall_score,
    ds.ai_ready,
    ds.executive_ready,
    ap.embedding_status,
    ap.evaluation_status,
    ap.report_status,
    ap.last_run AS ai_last_run,
    er.status AS report_status_detail,
    er.pdf_url,
    er.generated_at AS report_generated_at
FROM public.dashboard_summary ds
LEFT JOIN public.ai_pipeline ap ON ap.user_id = ds.user_id
LEFT JOIN public.executive_reports er ON er.user_id = ds.user_id;

-- ====================================================================
-- RPC FUNCTIONS
-- ====================================================================

-- Function 1: refresh_dashboard_summary
-- Recalculates dashboard_summary from module_progress for a given user.
CREATE OR REPLACE FUNCTION public.refresh_dashboard_summary(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_completed INTEGER;
    v_total INTEGER := 5;
    v_progress NUMERIC;
    v_score NUMERIC;
    v_financial NUMERIC;
    v_skills NUMERIC;
    v_health NUMERIC;
    v_values NUMERIC;
    v_ai_ready BOOLEAN;
    v_exec_ready BOOLEAN;
BEGIN
    -- Count completed required modules
    SELECT COUNT(*) INTO v_completed
    FROM public.module_progress
    WHERE user_id = p_user_id
      AND module_key IN ('master_profile', 'financial', 'skills', 'health', 'assessments')
      AND status = 'completed';

    v_progress := ROUND((v_completed::NUMERIC / v_total) * 100, 1);

    -- Get individual module scores
    SELECT COALESCE(score, 0) INTO v_financial
    FROM public.module_progress
    WHERE user_id = p_user_id AND module_key = 'financial';

    SELECT COALESCE(score, 0) INTO v_skills
    FROM public.module_progress
    WHERE user_id = p_user_id AND module_key = 'skills';

    SELECT COALESCE(score, 0) INTO v_health
    FROM public.module_progress
    WHERE user_id = p_user_id AND module_key = 'health';

    SELECT COALESCE(score, 0) INTO v_values
    FROM public.module_progress
    WHERE user_id = p_user_id AND module_key = 'assessments';

    -- Calculate weighted average score
    SELECT COALESCE(
        CASE WHEN COUNT(*) > 0
             THEN ROUND(SUM(score) / COUNT(*), 1)
             ELSE 0
        END, 0)
    INTO v_score
    FROM public.module_progress
    WHERE user_id = p_user_id
      AND module_key IN ('master_profile', 'financial', 'skills', 'health', 'assessments')
      AND status = 'completed'
      AND score > 0;

    -- If modules completed but no explicit scores, assign default
    IF v_completed > 0 AND v_score = 0 THEN
        v_score := 65;
    END IF;

    v_ai_ready := v_completed >= 5;
    v_exec_ready := v_completed >= 5;

    -- Upsert dashboard_summary
    INSERT INTO public.dashboard_summary (
        user_id, completed_modules, total_modules, overall_progress,
        overall_score, human_capital_score, financial_score, skills_score,
        health_score, values_score, ai_ready, executive_ready, updated_at
    )
    VALUES (
        p_user_id, v_completed, v_total, v_progress,
        v_score, v_score, COALESCE(v_financial, 0), COALESCE(v_skills, 0),
        COALESCE(v_health, 0), COALESCE(v_values, 0), v_ai_ready, v_exec_ready, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        completed_modules = EXCLUDED.completed_modules,
        overall_progress = EXCLUDED.overall_progress,
        overall_score = EXCLUDED.overall_score,
        human_capital_score = EXCLUDED.human_capital_score,
        financial_score = EXCLUDED.financial_score,
        skills_score = EXCLUDED.skills_score,
        health_score = EXCLUDED.health_score,
        values_score = EXCLUDED.values_score,
        ai_ready = EXCLUDED.ai_ready,
        executive_ready = EXCLUDED.executive_ready,
        updated_at = NOW();

    -- Also update profiles.human_value_score
    UPDATE public.profiles
    SET human_value_score = v_score,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: mark_module_completed
-- Marks a module as completed, refreshes summary, unlocks next module.
CREATE OR REPLACE FUNCTION public.mark_module_completed(
    p_user_id UUID,
    p_module_key TEXT,
    p_score NUMERIC DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
    v_next_key TEXT;
BEGIN
    -- Upsert module_progress
    INSERT INTO public.module_progress (user_id, module_key, status, completion_percentage, score, completed_at, updated_at)
    VALUES (p_user_id, p_module_key, 'completed', 100, p_score, NOW(), NOW())
    ON CONFLICT (user_id, module_key) DO UPDATE SET
        status = 'completed',
        completion_percentage = 100,
        score = CASE WHEN p_score > 0 THEN p_score ELSE module_progress.score END,
        completed_at = COALESCE(module_progress.completed_at, NOW()),
        updated_at = NOW();

    -- Find the next module in the unlock chain
    SELECT m2.key INTO v_next_key
    FROM public.modules m2
    WHERE m2.unlock_after = p_module_key
      AND m2.is_active = TRUE
    LIMIT 1;

    -- Unlock next module (set to in_progress if not already started)
    IF v_next_key IS NOT NULL THEN
        INSERT INTO public.module_progress (user_id, module_key, status, started_at, updated_at)
        VALUES (p_user_id, v_next_key, 'in_progress', NOW(), NOW())
        ON CONFLICT (user_id, module_key) DO UPDATE SET
            status = CASE
                WHEN module_progress.status = 'not_started' THEN 'in_progress'
                ELSE module_progress.status
            END,
            started_at = COALESCE(module_progress.started_at, NOW()),
            updated_at = NOW();
    END IF;

    -- Refresh dashboard summary
    PERFORM public.refresh_dashboard_summary(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: calculate_user_progress
-- Returns progress summary as JSON
CREATE OR REPLACE FUNCTION public.calculate_user_progress(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'user_id', p_user_id,
        'completed_modules', COALESCE(ds.completed_modules, 0),
        'total_modules', COALESCE(ds.total_modules, 5),
        'overall_progress', COALESCE(ds.overall_progress, 0),
        'overall_score', COALESCE(ds.overall_score, 0),
        'ai_ready', COALESCE(ds.ai_ready, FALSE),
        'executive_ready', COALESCE(ds.executive_ready, FALSE)
    ) INTO v_result
    FROM public.dashboard_summary ds
    WHERE ds.user_id = p_user_id;

    IF v_result IS NULL THEN
        v_result := json_build_object(
            'user_id', p_user_id,
            'completed_modules', 0,
            'total_modules', 5,
            'overall_progress', 0,
            'overall_score', 0,
            'ai_ready', FALSE,
            'executive_ready', FALSE
        );
    END IF;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: get_user_dashboard
-- Returns full dashboard payload as JSON
CREATE OR REPLACE FUNCTION public.get_user_dashboard(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'user_id', udv.user_id,
        'full_name', udv.full_name,
        'email', udv.email,
        'avatar_url', udv.avatar_url,
        'completed_modules', udv.completed_modules,
        'total_modules', udv.total_modules,
        'overall_progress', udv.overall_progress,
        'overall_score', udv.overall_score,
        'human_capital_score', udv.human_capital_score,
        'financial_score', udv.financial_score,
        'skills_score', udv.skills_score,
        'health_score', udv.health_score,
        'values_score', udv.values_score,
        'ai_ready', udv.ai_ready,
        'executive_ready', udv.executive_ready,
        'modules', (
            SELECT json_agg(json_build_object(
                'module_key', mpv.module_key,
                'title', mpv.module_title,
                'display_order', mpv.display_order,
                'status', mpv.status,
                'score', mpv.score,
                'completion_percentage', mpv.completion_percentage,
                'completed_at', mpv.completed_at
            ) ORDER BY mpv.display_order)
            FROM public.module_progress_view mpv
            WHERE mpv.user_id = p_user_id
        )
    ) INTO v_result
    FROM public.user_dashboard_view udv
    WHERE udv.user_id = p_user_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- DATABASE TRIGGERS
-- ====================================================================

-- Trigger 1: Auto-refresh dashboard_summary when module_progress changes
CREATE OR REPLACE FUNCTION public.handle_module_progress_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.refresh_dashboard_summary(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_module_progress_change ON public.module_progress;
CREATE TRIGGER on_module_progress_change
    AFTER INSERT OR UPDATE ON public.module_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_module_progress_change();

-- Trigger 2: Bridge module_data completion to module_progress
-- When module_data.is_completed changes to TRUE, sync to module_progress
CREATE OR REPLACE FUNCTION public.handle_module_data_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
        INSERT INTO public.module_progress (user_id, module_key, status, completion_percentage, score, completed_at, updated_at)
        VALUES (NEW.user_id, NEW.module_key, 'completed', 100, COALESCE(NEW.score, 0), NOW(), NOW())
        ON CONFLICT (user_id, module_key) DO UPDATE SET
            status = 'completed',
            completion_percentage = 100,
            score = CASE WHEN COALESCE(NEW.score, 0) > 0 THEN NEW.score ELSE module_progress.score END,
            completed_at = COALESCE(module_progress.completed_at, NOW()),
            updated_at = NOW();
    ELSIF NEW.is_completed = FALSE AND OLD.is_completed = TRUE THEN
        -- Module was un-completed (edit mode)
        UPDATE public.module_progress
        SET status = 'in_progress', completion_percentage = 50, updated_at = NOW()
        WHERE user_id = NEW.user_id AND module_key = NEW.module_key;
    ELSIF NEW.is_completed = FALSE AND (NEW.data IS NOT NULL AND NEW.data::TEXT != '{}') THEN
        -- Data was saved but not completed — mark as in_progress
        INSERT INTO public.module_progress (user_id, module_key, status, completion_percentage, started_at, updated_at)
        VALUES (NEW.user_id, NEW.module_key, 'in_progress', 50, NOW(), NOW())
        ON CONFLICT (user_id, module_key) DO UPDATE SET
            status = CASE
                WHEN module_progress.status = 'completed' THEN 'completed'
                ELSE 'in_progress'
            END,
            started_at = COALESCE(module_progress.started_at, NOW()),
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_module_data_completed ON public.module_data;
CREATE TRIGGER on_module_data_completed
    AFTER INSERT OR UPDATE ON public.module_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_module_data_completed();

-- Trigger 3: Auto updated_at for all new tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_module_progress_updated_at ON public.module_progress;
CREATE TRIGGER set_module_progress_updated_at
    BEFORE UPDATE ON public.module_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_dashboard_summary_updated_at ON public.dashboard_summary;
CREATE TRIGGER set_dashboard_summary_updated_at
    BEFORE UPDATE ON public.dashboard_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_executive_reports_updated_at ON public.executive_reports;
CREATE TRIGGER set_executive_reports_updated_at
    BEFORE UPDATE ON public.executive_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_ai_pipeline_updated_at ON public.ai_pipeline;
CREATE TRIGGER set_ai_pipeline_updated_at
    BEFORE UPDATE ON public.ai_pipeline
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_skills_inventory_updated_at ON public.skills_inventory;
CREATE TRIGGER set_skills_inventory_updated_at
    BEFORE UPDATE ON public.skills_inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_health_metrics_updated_at ON public.health_metrics;
CREATE TRIGGER set_health_metrics_updated_at
    BEFORE UPDATE ON public.health_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_human_value_dimensions_updated_at ON public.human_value_dimensions;
CREATE TRIGGER set_human_value_dimensions_updated_at
    BEFORE UPDATE ON public.human_value_dimensions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- MODULES (Public read-only for authenticated users)
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view modules" ON public.modules;
CREATE POLICY "Anyone can view modules" ON public.modules
    FOR SELECT USING (TRUE);

-- MODULE_PROGRESS
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
CREATE POLICY "Users can view own module progress" ON public.module_progress
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
CREATE POLICY "Users can insert own module progress" ON public.module_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
CREATE POLICY "Users can update own module progress" ON public.module_progress
    FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own module progress" ON public.module_progress;
CREATE POLICY "Users can delete own module progress" ON public.module_progress
    FOR DELETE USING (auth.uid() = user_id);

-- DASHBOARD_SUMMARY
ALTER TABLE public.dashboard_summary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can view own dashboard summary" ON public.dashboard_summary
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can insert own dashboard summary" ON public.dashboard_summary
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own dashboard summary" ON public.dashboard_summary;
CREATE POLICY "Users can update own dashboard summary" ON public.dashboard_summary
    FOR UPDATE USING (auth.uid() = user_id);

-- EXECUTIVE_REPORTS
ALTER TABLE public.executive_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own executive reports" ON public.executive_reports;
CREATE POLICY "Users can view own executive reports" ON public.executive_reports
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own executive reports" ON public.executive_reports;
CREATE POLICY "Users can insert own executive reports" ON public.executive_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own executive reports" ON public.executive_reports;
CREATE POLICY "Users can update own executive reports" ON public.executive_reports
    FOR UPDATE USING (auth.uid() = user_id);

-- AI_PIPELINE
ALTER TABLE public.ai_pipeline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own AI pipeline" ON public.ai_pipeline;
CREATE POLICY "Users can view own AI pipeline" ON public.ai_pipeline
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own AI pipeline" ON public.ai_pipeline;
CREATE POLICY "Users can insert own AI pipeline" ON public.ai_pipeline
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own AI pipeline" ON public.ai_pipeline;
CREATE POLICY "Users can update own AI pipeline" ON public.ai_pipeline
    FOR UPDATE USING (auth.uid() = user_id);

-- SKILLS_INVENTORY
ALTER TABLE public.skills_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own skills" ON public.skills_inventory;
CREATE POLICY "Users can view own skills" ON public.skills_inventory
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own skills" ON public.skills_inventory;
CREATE POLICY "Users can insert own skills" ON public.skills_inventory
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own skills" ON public.skills_inventory;
CREATE POLICY "Users can update own skills" ON public.skills_inventory
    FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own skills" ON public.skills_inventory;
CREATE POLICY "Users can delete own skills" ON public.skills_inventory
    FOR DELETE USING (auth.uid() = user_id);

-- HEALTH_METRICS
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own health metrics" ON public.health_metrics;
CREATE POLICY "Users can view own health metrics" ON public.health_metrics
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own health metrics" ON public.health_metrics;
CREATE POLICY "Users can insert own health metrics" ON public.health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own health metrics" ON public.health_metrics;
CREATE POLICY "Users can update own health metrics" ON public.health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

-- HUMAN_VALUE_DIMENSIONS
ALTER TABLE public.human_value_dimensions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own value dimensions" ON public.human_value_dimensions;
CREATE POLICY "Users can view own value dimensions" ON public.human_value_dimensions
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own value dimensions" ON public.human_value_dimensions;
CREATE POLICY "Users can insert own value dimensions" ON public.human_value_dimensions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own value dimensions" ON public.human_value_dimensions;
CREATE POLICY "Users can update own value dimensions" ON public.human_value_dimensions
    FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- DATA MIGRATION: Backfill module_progress from existing module_data
-- ====================================================================
-- This migrates any existing module_data rows into the new module_progress table.
-- Safe to run multiple times (uses ON CONFLICT).

INSERT INTO public.module_progress (user_id, module_key, status, completion_percentage, score, started_at, completed_at, updated_at)
SELECT
    md.user_id,
    md.module_key,
    CASE
        WHEN md.is_completed = TRUE THEN 'completed'
        WHEN md.data IS NOT NULL AND md.data::TEXT != '{}' THEN 'in_progress'
        ELSE 'not_started'
    END AS status,
    CASE WHEN md.is_completed = TRUE THEN 100 ELSE 50 END AS completion_percentage,
    COALESCE(md.score, 0) AS score,
    md.created_at AS started_at,
    CASE WHEN md.is_completed = TRUE THEN md.updated_at ELSE NULL END AS completed_at,
    md.updated_at
FROM public.module_data md
ON CONFLICT (user_id, module_key) DO UPDATE SET
    status = EXCLUDED.status,
    completion_percentage = EXCLUDED.completion_percentage,
    score = CASE WHEN EXCLUDED.score > 0 THEN EXCLUDED.score ELSE module_progress.score END,
    completed_at = COALESCE(module_progress.completed_at, EXCLUDED.completed_at),
    updated_at = NOW();

-- Backfill dashboard_summary for all users with module_progress data
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    FOR v_user_id IN
        SELECT DISTINCT user_id FROM public.module_progress
    LOOP
        PERFORM public.refresh_dashboard_summary(v_user_id);
    END LOOP;
END;
$$;

-- ====================================================================
-- ENTERPRISE MIGRATION COMPLETE
-- ====================================================================
