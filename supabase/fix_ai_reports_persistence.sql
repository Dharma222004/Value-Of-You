-- ====================================================================
-- FIX: AI REPORTS PERSISTENCE — UNIQUE CONSTRAINT MIGRATION
-- ====================================================================
-- Root Cause: INSERT was used instead of UPSERT because no unique
-- constraint existed on user_id. This caused duplicate rows and
-- silent insert failures.
--
-- This migration adds a unique constraint on user_id so that
-- UPSERT (ON CONFLICT) works correctly: one user = one report.
--
-- SAFE TO RUN MULTIPLE TIMES (IDEMPOTENT).
-- ====================================================================

-- Step 1: Remove duplicate rows (keep only the latest per user)
-- This is necessary before adding the unique constraint.
DELETE FROM public.ai_reports
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM public.ai_reports
    ORDER BY user_id, created_at DESC
);

-- Step 2: Add unique constraint on user_id
-- One user = one report. Regenerate overwrites, never duplicates.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uq_ai_reports_user_id'
    ) THEN
        ALTER TABLE public.ai_reports
            ADD CONSTRAINT uq_ai_reports_user_id UNIQUE (user_id);
    END IF;
END $$;

-- Step 3: Ensure DELETE policy exists (needed for cleanup/admin)
DROP POLICY IF EXISTS "Users can delete own ai_reports" ON public.ai_reports;
CREATE POLICY "Users can delete own ai_reports" ON public.ai_reports
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- VERIFICATION: Run these queries to confirm the fix
-- ====================================================================
-- SELECT conname FROM pg_constraint WHERE conrelid = 'public.ai_reports'::regclass;
-- Expected: uq_ai_reports_user_id
--
-- SELECT user_id, COUNT(*) FROM public.ai_reports GROUP BY user_id HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)
-- ====================================================================
