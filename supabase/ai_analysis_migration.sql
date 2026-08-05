-- ====================================================================
-- AI ANALYSIS REPORTS — DEDICATED TABLE MIGRATION
-- ====================================================================
-- Run this in the Supabase SQL Editor.
-- This migration is ADDITIVE and IDEMPOTENT (safe to run multiple times).
-- ====================================================================

-- 1. Create ai_analysis_reports table
CREATE TABLE IF NOT EXISTS public.ai_analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    report_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    executive_summary TEXT,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    scores_json JSONB DEFAULT '{}'::jsonb,
    model_name TEXT NOT NULL DEFAULT 'unknown',
    analysis_version TEXT NOT NULL DEFAULT 'v1.0.0',
    data_hash TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add comment for documentation
COMMENT ON TABLE public.ai_analysis_reports IS 'Stores versioned AI-generated Human Values analysis reports. Never overwrite — maintains full history.';
COMMENT ON COLUMN public.ai_analysis_reports.report_json IS 'Complete 26-section AI analysis report as structured JSON';
COMMENT ON COLUMN public.ai_analysis_reports.scores_json IS '11 scored dimensions (0-100) with explanations';
COMMENT ON COLUMN public.ai_analysis_reports.data_hash IS 'SHA-256 hash of the user profile data used for smart regeneration';
COMMENT ON COLUMN public.ai_analysis_reports.model_name IS 'The Groq model name used to generate this report';

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ai_analysis_reports_user_id
    ON public.ai_analysis_reports(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_reports_data_hash
    ON public.ai_analysis_reports(data_hash);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_reports_created_at
    ON public.ai_analysis_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_reports_user_latest
    ON public.ai_analysis_reports(user_id, created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.ai_analysis_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — Users can only access their own reports
DROP POLICY IF EXISTS "Users can view own AI analysis reports" ON public.ai_analysis_reports;
CREATE POLICY "Users can view own AI analysis reports" ON public.ai_analysis_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI analysis reports" ON public.ai_analysis_reports;
CREATE POLICY "Users can insert own AI analysis reports" ON public.ai_analysis_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: No UPDATE or DELETE policies — reports are immutable history.
-- Only service_role (server-side) can modify existing records.

-- 6. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_ai_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_ai_analysis_reports_updated_at ON public.ai_analysis_reports;
CREATE TRIGGER set_ai_analysis_reports_updated_at
    BEFORE UPDATE ON public.ai_analysis_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ai_analysis_updated_at();

-- ====================================================================
-- MIGRATION COMPLETE
-- ====================================================================
