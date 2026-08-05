import { supabase } from "@/lib/supabase";
import { ActivityLog } from "@/types/database";

export class ActivityService {
  /**
   * Log user activity event into activity_logs table
   */
  static async logActivity(
    userId: string,
    eventType: string,
    metadata: Record<string, any> = {}
  ): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([
        {
          user_id: userId,
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as ActivityLog;
  }

  /**
   * Get user activity history filtered by auth.uid()
   */
  static async getUserActivities(userId: string, limit: number = 20): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as ActivityLog[];
  }

  /**
   * Delete activity log
   */
  static async deleteActivity(activityId: string): Promise<boolean> {
    const { error } = await supabase.from("activity_logs").delete().eq("id", activityId);
    if (error) throw error;
    return true;
  }
}
