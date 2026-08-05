import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/database";

export type SupabaseProfile = Profile;

// Production-Safe Debug Logger (easy to remove later)
function dbLog(operation: string, details: Record<string, any>) {
  const status = details.error ? "❌ FAILED" : "✅ SUCCESS";
  console.log(`[DB_DEBUG] ${operation} | table: profiles | status: ${status}`, details);
}

/**
 * Automatically synchronizes an authenticated Supabase user into the `profiles` table.
 * Uses an upsert strategy (ON CONFLICT (id) DO UPDATE).
 */
export async function syncSupabaseProfile(user: User): Promise<Profile | null> {
  if (!user || !user.id || !user.email) return null;

  const now = new Date().toISOString();
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email.split("@")[0].replace(".", " ");
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const provider = (user.app_metadata?.provider as string) || "google";

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
      dbLog("syncSupabaseProfile", { error, userId: user.id, errorMessage: error.message, errorCode: error.code, errorHint: error.hint });
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

    dbLog("syncSupabaseProfile", { userId: user.id, resultId: (data as any)?.id, error: null });
    return data as Profile;
  } catch (err: any) {
    dbLog("syncSupabaseProfile", { error: err, userId: user.id });
    return null;
  }
}
