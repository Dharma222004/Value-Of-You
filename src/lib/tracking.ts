import { logSupabaseActivity } from "@/services/supabaseActivityService";

/**
 * Reusable universal trackEvent helper function
 * Logs events to Supabase activity_logs table
 */
export async function trackEvent(event: string, metadata?: Record<string, any>): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const page = window.location.pathname;
    await logSupabaseActivity(event, metadata, page);
  } catch (err) {
    // Fail silently in telemetry
  }
}
