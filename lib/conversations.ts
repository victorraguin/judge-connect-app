import { supabase } from './supabase';
import { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export class ConversationsService {
  static async getConversation(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          question:questions(*),
          user:profiles!conversations_user_id_fkey(id, full_name, avatar_url),
          judge:profiles!conversations_judge_id_fkey(id, full_name, avatar_url, judge_info(*))
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get conversation error:', error);
      return { data: null, error };
    }
  }

  static async getMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get messages error:', error);
      return { data: null, error };
    }
  }

  static async sendMessage(conversationId: string, content: string, messageType: 'text' | 'image' = 'text', imageUrl?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          image_url: imageUrl,
        })
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { data, error: null };
    } catch (error) {
      console.error('Send message error:', error);
      return { data: null, error };
    }
  }

  static async endConversation(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('End conversation error:', error);
      return { data: null, error };
    }
  }

  static async getMyConversations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          question:questions(title, category),
          user:profiles!conversations_user_id_fkey(id, full_name, avatar_url),
          judge:profiles!conversations_judge_id_fkey(id, full_name, avatar_url),
          last_message:messages(content, created_at)
        `)
        .or(`user_id.eq.${user.id},judge_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get my conversations error:', error);
      return { data: null, error };
    }
  }

  static subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles(id, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            callback(data);
          }
        }
      )
      .subscribe();
  }

  static subscribeToConversationUpdates(conversationId: string, callback: (conversation: any) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }
}