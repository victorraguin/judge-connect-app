import { supabase } from './supabase';
import { Database } from '@/types/database';

type Question = Database['public']['Tables']['questions']['Row'];
type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export class QuestionsService {
  static async createQuestion(questionData: {
    title: string;
    content: string;
    category: string;
    image_url?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('questions')
        .insert({
          ...questionData,
          user_id: user.id,
          status: 'waiting_for_judge',
          timeout_at: new Date(Date.now() + 8 * 60 * 1000).toISOString(), // 8 minutes from now
        })
        .select()
        .single();

      if (error) throw error;

      // Notify all available judges
      await this.notifyAvailableJudges(data.id, questionData.title, questionData.category);

      return { data, error: null };
    } catch (error) {
      console.error('Create question error:', error);
      return { data: null, error };
    }
  }

  static async assignQuestionToJudge(questionId: string, judgeId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          assigned_judge_id: judgeId,
          assigned_at: new Date().toISOString(),
          status: 'assigned',
        })
        .eq('id', questionId)
        .eq('status', 'waiting_for_judge') // Only assign if still waiting
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Assign question error:', error);
      return { data: null, error };
    }
  }

  static async getMyQuestions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          assigned_judge:profiles!questions_assigned_judge_id_fkey(full_name, avatar_url),
          conversation:conversations(id, status)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get my questions error:', error);
      return { data: null, error };
    }
  }

  static async getAvailableQuestions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user is a judge
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['judge', 'admin'].includes(profile.role)) {
        throw new Error('User is not a judge');
      }

      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          user:profiles!questions_user_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'waiting_for_judge')
        .lt('timeout_at', new Date().toISOString()) // Not timed out yet
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get available questions error:', error);
      return { data: null, error };
    }
  }

  static async acceptQuestion(questionId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, assign the question
      const { data: question, error: assignError } = await this.assignQuestionToJudge(questionId, user.id);
      if (assignError || !question) {
        throw new Error('Failed to assign question or question already taken');
      }

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          question_id: questionId,
          user_id: question.user_id,
          judge_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (convError) throw convError;

      // Send system message
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: 'Judge has joined the conversation. How can I help you?',
          message_type: 'system',
        });

      // Update question status
      await supabase
        .from('questions')
        .update({ status: 'in_progress' })
        .eq('id', questionId);

      return { data: conversation, error: null };
    } catch (error) {
      console.error('Accept question error:', error);
      return { data: null, error };
    }
  }

  private static async notifyAvailableJudges(questionId: string, title: string, category: string) {
    try {
      // Get all available judges
      const { data: judges } = await supabase
        .from('judge_info')
        .select('user_id, profiles!inner(id, full_name)')
        .eq('is_available', true)
        .eq('profiles.is_online', true);

      if (!judges || judges.length === 0) return;

      // Create notifications for all available judges
      const notifications = judges.map(judge => ({
        user_id: judge.user_id,
        title: 'New Question Available',
        content: `New ${category} question: "${title}"`,
        type: 'new_question',
        data: { question_id: questionId, category, title },
      }));

      await supabase
        .from('notifications')
        .insert(notifications);

    } catch (error) {
      console.error('Notify judges error:', error);
    }
  }

  static async completeQuestion(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Complete question error:', error);
      return { data: null, error };
    }
  }
}