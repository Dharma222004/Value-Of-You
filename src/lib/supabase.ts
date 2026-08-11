import { createClient, SupabaseClient, Session, User } from "@supabase/supabase-js";

// Read environment variables with safe build-time fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

const isMissingConfig =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (isMissingConfig && typeof window !== "undefined") {
  console.error(
    "[Supabase] ❌ MISSING CREDENTIALS: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not set. " +
    "Data will NOT be persisted to Supabase. Check your .env.local file."
  );
}

/**
 * Reusable Supabase client instance.
 * Safe for client-side and server-side usage without secret keys.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Tests whether the Supabase connection is functional.
 * Attempts a simple read from `profiles` table.
 * Returns { ok: true } on success, { ok: false, reason } on failure.
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  if (isMissingConfig) {
    return { ok: false, reason: "Missing Supabase URL or API key in environment variables." };
  }
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      console.error("[Supabase] Connection test failed:", error.message, "Code:", error.code);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    console.error("[Supabase] Connection test exception:", err);
    return { ok: false, reason: err?.message || "Unknown connection error" };
  }
}

/**
 * Helper to fetch current authenticated user session.
 */
export async function getSupabaseSession(): Promise<{
  session: Session | null;
  user: User | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("[Supabase Session Error]:", error.message);
      return { session: null, user: null, error };
    }
    return {
      session: data.session,
      user: data.session?.user || null,
      error: null,
    };
  } catch (err: any) {
    console.error("[Supabase Exception]:", err);
    return { session: null, user: null, error: err };
  }
}

/**
 * Helper to get the current authenticated user directly.
 */
export async function getSupabaseUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  } catch (err) {
    return null;
  }
}
