import { supabase } from './supabase';
import { Database } from '@/types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];

export class NotificationsService {
  static async getNotifications() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get notifications error:', error);
      return { data: null, error };
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return { data: null, error };
    }
  }

  static async markAllAsRead() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return { error };
    }
  }

  static async getUnreadCount() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { count: 0, error };
    }
  }

  static subscribeToNotifications(callback: (notification: Notification) => void) {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return null;

      return supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            callback(payload.new as Notification);
          }
        )
        .subscribe();
    });
  }

  static async createNotification(userId: string, notification: {
    title: string;
    content: string;
    type: string;
    data?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          ...notification,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Create notification error:', error);
      return { data: null, error };
    }
  }
}