import { supabase } from './supabase';
import { Database } from '@/types/database';

type JudgeInfo = Database['public']['Tables']['judge_info']['Row'];
type JudgeInfoInsert = Database['public']['Tables']['judge_info']['Insert'];

export class JudgesService {
  static async getAvailableJudges() {
    try {
      const { data, error } = await supabase
        .from('judge_info')
        .select(`
          *,
          profiles!inner(
            id,
            full_name,
            avatar_url,
            is_online,
            last_seen
          )
        `)
        .eq('is_available', true)
        .eq('profiles.role', 'judge')
        .order('total_points', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get available judges error:', error);
      return { data: null, error };
    }
  }

  static async getJudgeProfile(judgeId: string) {
    try {
      const { data, error } = await supabase
        .from('judge_info')
        .select(`
          *,
          profiles!inner(
            id,
            full_name,
            avatar_url,
            email,
            is_online,
            last_seen,
            created_at
          )
        `)
        .eq('user_id', judgeId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Get judge profile error:', error);
      return { data: null, error };
    }
  }

  static async updateJudgeAvailability(isAvailable: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('judge_info')
        .update({ is_available: isAvailable })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Update judge availability error:', error);
      return { data: null, error };
    }
  }

  static async updateJudgeProfile(updates: {
    bio?: string;
    specialties?: string[];
    languages?: string[];
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('judge_info')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Update judge profile error:', error);
      return { data: null, error };
    }
  }

  static async getJudgeStats(judgeId: string) {
    try {
      // Get basic judge info
      const { data: judgeInfo } = await this.getJudgeProfile(judgeId);
      if (!judgeInfo) throw new Error('Judge not found');

      // Get recent ratings
      const { data: recentRatings } = await supabase
        .from('ratings')
        .select(`
          rating,
          feedback,
          created_at,
          conversation:conversations!inner(
            question:questions(title, category)
          )
        `)
        .eq('judge_id', judgeId)
        .eq('is_accepted', true)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get rewards history
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .eq('judge_id', judgeId)
        .order('created_at', { ascending: false })
        .limit(20);

      return {
        data: {
          judgeInfo,
          recentRatings: recentRatings || [],
          rewards: rewards || [],
        },
        error: null
      };
    } catch (error) {
      console.error('Get judge stats error:', error);
      return { data: null, error };
    }
  }

  static async createJudgeProfile(userId: string, judgeData: {
    judge_level: 'L1' | 'L2' | 'L3';
    specialties?: string[];
    languages?: string[];
    bio?: string;
  }) {
    try {
      // First, update user role to judge
      await supabase
        .from('profiles')
        .update({ role: 'judge' })
        .eq('id', userId);

      // Create judge info
      const { data, error } = await supabase
        .from('judge_info')
        .insert({
          user_id: userId,
          ...judgeData,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Create judge profile error:', error);
      return { data: null, error };
    }
  }

  static async searchJudges(query: string, filters?: {
    level?: 'L1' | 'L2' | 'L3';
    specialty?: string;
    language?: string;
    onlineOnly?: boolean;
  }) {
    try {
      let queryBuilder = supabase
        .from('judge_info')
        .select(`
          *,
          profiles!inner(
            id,
            full_name,
            avatar_url,
            is_online,
            last_seen
          )
        `)
        .eq('profiles.role', 'judge');

      // Apply filters
      if (filters?.level) {
        queryBuilder = queryBuilder.eq('judge_level', filters.level);
      }

      if (filters?.specialty) {
        queryBuilder = queryBuilder.contains('specialties', [filters.specialty]);
      }

      if (filters?.language) {
        queryBuilder = queryBuilder.contains('languages', [filters.language]);
      }

      if (filters?.onlineOnly) {
        queryBuilder = queryBuilder.eq('profiles.is_online', true);
      }

      // Apply text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `profiles.full_name.ilike.%${query}%,bio.ilike.%${query}%,specialties.cs.{${query}}`
        );
      }

      const { data, error } = await queryBuilder
        .order('total_points', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Search judges error:', error);
      return { data: null, error };
    }
  }
}