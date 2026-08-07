-- ================================================================
-- ADD ADMIN ROLE SUPPORT + HARDEN RLS
-- ================================================================
-- Adds a `role` column to profiles so the application can distinguish
-- admins from regular users. Without this, the admin analytics endpoint
-- had no way to authorize callers.
--
-- Apply this in the Supabase SQL editor (or via the migration pipeline).
-- ================================================================

-- 1. Role column (defaults everyone to USER)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'USER'
    CHECK (role IN ('USER', 'ADMIN'));

-- 2. IMPORTANT: prevent users from escalating their own role.
--    The existing "Users can update own profile" policy lets a user UPDATE
--    their own row, which would let them set role = 'ADMIN'. Replace it with
--    a policy that blocks role changes from the client. Only the service_role
--    (server-side, bypasses RLS) or a DB admin may grant ADMIN.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (no role change)" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- role must equal whatever it currently is in the table
        AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    );

-- 3. Grant a specific user admin (run manually, replace the email):
-- UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'you@example.com';

-- 4. Optional: mirror the role into the JWT via a custom access token hook
--    (Supabase Auth Hooks) so middleware can read app_metadata.role without a
--    DB round-trip. See Supabase docs: "Custom Access Token Hook".
