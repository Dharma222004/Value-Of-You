import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";

export type SupabaseProfile = Profile;

// Production-Safe Debug Logger
function dbLog(operation: string, details: Record<string, unknown>) {
  const status = details.error ? "❌ FAILED" : "✅ SUCCESS";
  console.log(`[DB_DEBUG] ${operation} | table: profiles | status: ${status}`, details);
}

/**
 * Automatically synchronizes an authenticated Supabase user into the `profiles` table.
 * Uses an upsert strategy (ON CONFLICT (id) DO UPDATE).
 *
 * Only id, email, full_name, avatar_url, provider, and updated_at are written.
 * human_value_score and assessment_completed are intentionally omitted so
 * existing DB values are preserved on subsequent logins.
 */
export async function syncSupabaseProfile(user: User): Promise<Profile | null> {
  if (!user || !user.id || !user.email) return null;

  const now = new Date().toISOString();
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email.split("@")[0].replace(".", " ");
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined) ||
    null;
  const provider: string = (user.app_metadata?.provider as string | undefined) ?? "email";

  try {
    const profilePayload = {
      id: user.id,
      email: user.email.toLowerCase(),
      full_name: fullName,
      avatar_url: avatarUrl,
      provider,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      dbLog("syncSupabaseProfile", {
        error: error.message,
        userId: user.id,
        errorCode: error.code,
        errorHint: error.hint ?? null,
      });
      // Return a local fallback so the UI is not blocked by a DB failure.
      return {
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        provider,
        human_value_score: 0,
        assessment_completed: false,
        theme: "system",
        created_at: user.created_at || now,
        updated_at: now,
      };
    }

    dbLog("syncSupabaseProfile", { userId: user.id, resultId: (data as Profile).id, error: null });
    return data as Profile;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    dbLog("syncSupabaseProfile", { error: message, userId: user.id });
    return null;
  }
}
