-- ====================================================================
-- AI REPORTS — PRODUCTION PERSISTENCE SCHEMA MIGRATION
-- ====================================================================
-- This migration creates the `ai_reports` table for permanent storage
-- and single-generation execution of AI reports.
-- Safe to execute multiple times (IDEMPOTENT).
-- ====================================================================

-- 1. Create public.ai_reports table
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID,
    report_version TEXT NOT NULL DEFAULT 'v4.1.0',
    prompt_version TEXT NOT NULL DEFAULT 'v5.0',
    status TEXT NOT NULL DEFAULT 'COMPLETED', -- PENDING, PROCESSING, COMPLETED, FAILED, REGENERATING
    overall_summary TEXT,
    executive_summary TEXT,
    personality_analysis JSONB DEFAULT '{}'::jsonb,
    human_values JSONB DEFAULT '{}'::jsonb,
    leadership JSONB DEFAULT '{}'::jsonb,
    communication JSONB DEFAULT '{}'::jsonb,
    decision_making JSONB DEFAULT '{}'::jsonb,
    financial_intelligence JSONB DEFAULT '{}'::jsonb,
    learning JSONB DEFAULT '{}'::jsonb,
    growth JSONB DEFAULT '{}'::jsonb,
    career_readiness JSONB DEFAULT '{}'::jsonb,
    emotional_intelligence JSONB DEFAULT '{}'::jsonb,
    strengths JSONB DEFAULT '{}'::jsonb,
    weaknesses JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '{}'::jsonb,
    career_suggestions JSONB DEFAULT '{}'::jsonb,
    financial_suggestions JSONB DEFAULT '{}'::jsonb,
    development_plan JSONB DEFAULT '{}'::jsonb,
    roadmap JSONB DEFAULT '{}'::jsonb,
    modules JSONB DEFAULT '{}'::jsonb,
    report_json JSONB DEFAULT '{}'::jsonb,
    scores_json JSONB DEFAULT '{}'::jsonb,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    confidence_score NUMERIC NOT NULL DEFAULT 94.2,
    ai_model TEXT NOT NULL DEFAULT 'NVIDIA Nemotron + Groq + Gemini',
    model_name TEXT NOT NULL DEFAULT 'NVIDIA Nemotron + Groq + Gemini',
    data_hash TEXT NOT NULL DEFAULT '',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast single-row lookups
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON public.ai_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_status ON public.ai_reports(status);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_status ON public.ai_reports(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_created ON public.ai_reports(user_id, created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can view own ai_reports" ON public.ai_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can insert own ai_reports" ON public.ai_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can update own ai_reports" ON public.ai_reports
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Auto-update updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_ai_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_ai_reports_updated_at ON public.ai_reports;
CREATE TRIGGER set_ai_reports_updated_at
    BEFORE UPDATE ON public.ai_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ai_reports_updated_at();

-- 5. Ensure legacy ai_analysis_reports table compatibility
CREATE TABLE IF NOT EXISTS public.ai_analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    executive_summary TEXT,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    scores_json JSONB DEFAULT '{}'::jsonb,
    model_name TEXT NOT NULL DEFAULT 'unknown',
    analysis_version TEXT NOT NULL DEFAULT 'v4.1.0',
    data_hash TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_analysis_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI analysis reports" ON public.ai_analysis_reports;
CREATE POLICY "Users can view own AI analysis reports" ON public.ai_analysis_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI analysis reports" ON public.ai_analysis_reports;
CREATE POLICY "Users can insert own AI analysis reports" ON public.ai_analysis_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI analysis reports" ON public.ai_analysis_reports;
CREATE POLICY "Users can update own AI analysis reports" ON public.ai_analysis_reports
    FOR UPDATE USING (auth.uid() = user_id);
