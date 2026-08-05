import { createClient, SupabaseClient, Session, User } from "@supabase/supabase-js";

// Read environment variables with safe build-time fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  if (typeof window !== "undefined") {
    console.warn(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables."
    );
  }
}

/**
 * Reusable Supabase client instance built with @supabase/supabase-js
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
 * Helper function to fetch current authenticated user session
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
 * Helper function to get the current authenticated user directly
 */
export async function getSupabaseUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  } catch (err) {
    return null;
  }
}

