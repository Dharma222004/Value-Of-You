import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/database";

export class NotificationService {
  /**
   * Create a new notification for user
   */
  static async createNotification(
    userId: string,
    title: string,
    message: string
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: userId,
          title,
          message,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }

  /**
   * Get unread or all notifications for user
   */
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Notification[];
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<Notification> {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId);
    if (error) throw error;
    return true;
  }
}
