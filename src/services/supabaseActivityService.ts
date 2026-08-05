import { supabase } from "@/lib/supabase";

/**
 * Logs a user event into the `activity_logs` table in Supabase.
 */
export async function logSupabaseActivity(
  eventType: string,
  metadata?: Record<string, any>,
  pagePath?: string
): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return;
    }

    const page = pagePath || (typeof window !== "undefined" ? window.location.pathname : null);

    const record = {
      user_id: userId,
      event_type: eventType,
      metadata: { ...(metadata || {}), page },
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("activity_logs").insert([record]);

    if (error) {
      console.warn(`[DB_DEBUG] logSupabaseActivity | table: activity_logs | status: ❌ FAILED`, { error, userId, eventType });
    } else {
      console.log(`[DB_DEBUG] logSupabaseActivity | table: activity_logs | status: ✅ SUCCESS`, { userId, eventType });
    }
  } catch (err: any) {
    console.error(`[DB_DEBUG] logSupabaseActivity | table: activity_logs | status: ❌ EXCEPTION`, { error: err });
  }
}
