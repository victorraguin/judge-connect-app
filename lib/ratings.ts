import { supabase } from './supabase';
import { Database } from '@/types/database';

type Rating = Database['public']['Tables']['ratings']['Row'];
type RatingInsert = Database['public']['Tables']['ratings']['Insert'];

export class RatingsService {
  static async submitRating(conversationId: string, rating: number, isAccepted: boolean, feedback?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get conversation details
      const { data: conversation } = await supabase
        .from('conversations')
        .select('judge_id, question_id')
        .eq('id', conversationId)
        .single();

      if (!conversation) throw new Error('Conversation not found');

      // Create rating
      const { data: ratingData, error } = await supabase
        .from('ratings')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          judge_id: conversation.judge_id,
          rating,
          is_accepted: isAccepted,
          feedback,
        })
        .select()
        .single();

      if (error) throw error;

      // If accepted, award points to judge and update their stats
      if (isAccepted) {
        await this.awardPointsToJudge(conversation.judge_id, conversationId, rating);
        await this.updateJudgeStats(conversation.judge_id);
      }

      // Update question status
      await supabase
        .from('questions')
        .update({ 
          status: isAccepted ? 'completed' : 'disputed',
          completed_at: new Date().toISOString()
        })
        .eq('id', conversation.question_id);

      // If not accepted, create dispute
      if (!isAccepted) {
        await this.createDispute(conversationId, user.id, conversation.judge_id, feedback || '');
      }

      return { data: ratingData, error: null };
    } catch (error) {
      console.error('Submit rating error:', error);
      return { data: null, error };
    }
  }

  private static async awardPointsToJudge(judgeId: string, conversationId: string, rating: number) {
    try {
      // Calculate points based on rating (1-5 stars = 10-50 points)
      const points = rating * 10;

      // Create reward record
      await supabase
        .from('rewards')
        .insert({
          judge_id: judgeId,
          points_earned: points,
          reason: `Question answered successfully (${rating}/5 stars)`,
          conversation_id: conversationId,
        });

      // Update judge's total points
      const { data: judgeInfo } = await supabase
        .from('judge_info')
        .select('total_points')
        .eq('user_id', judgeId)
        .single();

      if (judgeInfo) {
        await supabase
          .from('judge_info')
          .update({
            total_points: (judgeInfo.total_points || 0) + points,
          })
          .eq('user_id', judgeId);
      }
    } catch (error) {
      console.error('Award points error:', error);
    }
  }

  private static async updateJudgeStats(judgeId: string) {
    try {
      // Get all ratings for this judge
      const { data: ratings } = await supabase
        .from('ratings')
        .select('rating, created_at, conversation_id, conversations!inner(started_at)')
        .eq('judge_id', judgeId)
        .eq('is_accepted', true);

      if (!ratings || ratings.length === 0) return;

      // Calculate average rating
      const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

      // Calculate average response time (from conversation start to first rating)
      const responseTimes = ratings
        .filter(r => r.conversations?.started_at)
        .map(r => {
          const startTime = new Date(r.conversations.started_at).getTime();
          const endTime = new Date(r.created_at).getTime();
          return endTime - startTime;
        });

      const averageResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;

      // Convert to PostgreSQL interval format (milliseconds to interval)
      const intervalSeconds = Math.floor(averageResponseTime / 1000);
      const hours = Math.floor(intervalSeconds / 3600);
      const minutes = Math.floor((intervalSeconds % 3600) / 60);
      const seconds = intervalSeconds % 60;
      const intervalString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Update judge stats
      await supabase
        .from('judge_info')
        .update({
          average_rating: Number(averageRating.toFixed(2)),
          total_questions_answered: ratings.length,
          average_response_time: intervalString,
        })
        .eq('user_id', judgeId);

    } catch (error) {
      console.error('Update judge stats error:', error);
    }
  }

  private static async createDispute(conversationId: string, userId: string, judgeId: string, userJustification: string) {
    try {
      await supabase
        .from('disputes')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          judge_id: judgeId,
          user_justification: userJustification,
          status: 'pending',
        });

      // Update conversation status
      await supabase
        .from('conversations')
        .update({ status: 'disputed' })
        .eq('id', conversationId);

      // Notify admins about the dispute
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');

      if (admins && admins.length > 0) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          title: 'New Dispute',
          content: 'A user has disputed a judge\'s ruling. Review required.',
          type: 'dispute',
          data: { conversation_id: conversationId },
        }));

        await supabase
          .from('notifications')
          .insert(notifications);
      }
    } catch (error) {
      console.error('Create dispute error:', error);
    }
  }

  static async getRating(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          user:profiles!ratings_user_id_fkey(full_name),
          judge:profiles!ratings_judge_id_fkey(full_name)
        `)
        .eq('conversation_id', conversationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      return { data, error: null };
    } catch (error) {
      console.error('Get rating error:', error);
      return { data: null, error };
    }
  }
}